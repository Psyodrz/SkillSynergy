require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Pool } = require('pg');
const cors = require('cors');
const OpenAI = require('openai');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://skillsynergy.online',
    'https://www.skillsynergy.online',
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', endpoints: ['/api/smart-match', '/api/match/teachers', '/api/create-order'], timestamp: new Date().toISOString() });
});

/**
 * POST /api/create-order
 * Create a Razorpay order
 * Protected Route
 */
app.post('/api/create-order', authMiddleware, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    // Amount is in smallest currency unit (paise for INR)
    // Example: 500 INR = 50000 paise
    
    const options = {
      amount: amount * 100, 
      currency,
      receipt,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/verify-payment
 * Verify Razorpay payment signature
 * Protected Route
 */
app.post('/api/verify-payment', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment successful - Update user subscription in database
      const userId = req.user.id;
      
      // Update profile with subscription details
      // Assuming 'pro' plan for now
      const updateQuery = `
        UPDATE profiles 
        SET subscription_status = 'active', 
            subscription_plan = 'pro',
            subscription_updated_at = NOW()
        WHERE id = $1
      `;
      
      await pool.query(updateQuery, [userId]);

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/match/teachers
 * AI-Assisted Teacher Matching
 * Protected Route
 */
app.post('/api/match/teachers', authMiddleware, async (req, res) => {
  try {
    const { skillIds, limit = 10 } = req.body;
    const userId = req.user.id; // Get from auth token

    console.log('Teacher Match request:', { userId, skillIds, limit });

    let queryEmbedding = null;
    let skillEmbeddings = [];

    // 1. Get skill embeddings
    if (skillIds && skillIds.length > 0) {
      // Fetch embeddings for the requested skills
      const skillsQuery = `
        SELECT id, embedding
        FROM skills
        WHERE id = ANY($1::uuid[]) AND embedding IS NOT NULL
      `;
      
      const skillsResult = await pool.query(skillsQuery, [skillIds]);
      
      if (skillsResult.rows.length === 0) {
        return res.status(400).json({ 
          error: 'No valid skill embeddings found for provided skillIds' 
        });
      }

      skillEmbeddings = skillsResult.rows.map(row => JSON.parse(row.embedding));
    } else {
      // Get user's learning skills if no skillIds provided
      const userSkillsQuery = `
        SELECT s.embedding
        FROM user_skills us
        JOIN skills s ON us.skill_id = s.id
        WHERE us.user_id = $1 AND s.embedding IS NOT NULL
        LIMIT 5
      `;
      
      const userSkillsResult = await pool.query(userSkillsQuery, [userId]);
      
      if (userSkillsResult.rows.length === 0) {
        return res.status(400).json({ 
          error: 'User has no skills with embeddings. Please add skills first.' 
        });
      }

      skillEmbeddings = userSkillsResult.rows.map(row => JSON.parse(row.embedding));
    }

    // 2. Calculate average embedding as query vector
    if (skillEmbeddings.length > 0) {
      const dimension = skillEmbeddings[0].length;
      const avgEmbedding = new Array(dimension).fill(0);
      
      for (const emb of skillEmbeddings) {
        for (let i = 0; i < dimension; i++) {
          avgEmbedding[i] += emb[i];
        }
      }
      
      for (let i = 0; i < dimension; i++) {
        avgEmbedding[i] /= skillEmbeddings.length;
      }
      
      queryEmbedding = avgEmbedding;
    }

    if (!queryEmbedding) {
      return res.status(400).json({ error: 'Could not generate query embedding' });
    }

    const vectorStr = JSON.stringify(queryEmbedding);

    // 3. Find matching teachers using vector similarity
    const teachersQuery = `
      WITH teacher_candidates AS (
        SELECT DISTINCT
          p.id,
          p.full_name,
          p.avatar_url,
          p.headline,
          p.bio,
          p.languages,
          p.experience_years,
          p.qualification,
          p.teaching_modes,
          p.interests_embedding,
          CASE 
            WHEN p.interests_embedding IS NOT NULL THEN
              1 - (p.interests_embedding <=> $1::vector)
            ELSE 0.3
          END as similarity
        FROM profiles p
        WHERE p.role IN ('teacher', 'both')
          AND p.onboarding_completed = true
          AND p.id != $3
      ),
      teacher_skills AS (
        SELECT 
          us.user_id,
          jsonb_agg(
            jsonb_build_object(
              'id', s.id,
              'name', s.name,
              'category', s.category,
              'level', COALESCE(us.skill_level, 'intermediate')
            )
            ORDER BY s.name
          ) FILTER (WHERE s.id IS NOT NULL) as skills
        FROM user_skills us
        JOIN skills s ON us.skill_id = s.id
        ${skillIds && skillIds.length > 0 ? 'WHERE s.id = ANY($2::uuid[])' : ''}
        GROUP BY us.user_id
      )
      SELECT 
        tc.id,
        tc.full_name,
        tc.avatar_url,
        tc.headline,
        tc.bio,
        tc.languages,
        tc.experience_years,
        tc.qualification,
        tc.teaching_modes,
        tc.similarity,
        COALESCE(ts.skills, '[]'::jsonb) as matching_skills
      FROM teacher_candidates tc
      LEFT JOIN teacher_skills ts ON tc.id = ts.user_id
      WHERE tc.similarity > 0.2
      ORDER BY tc.similarity DESC
      LIMIT $4
    `;

    const queryParams = [vectorStr];
    if (skillIds && skillIds.length > 0) {
      queryParams.push(skillIds);
    } else {
      queryParams.push(null); // Placeholder if no skillIds
    }
    queryParams.push(userId);
    queryParams.push(limit);

    const teachersResult = await pool.query(teachersQuery, queryParams);

    // Format response
    const teachers = teachersResult.rows.map(row => ({
      id: row.id,
      full_name: row.full_name,
      avatar_url: row.avatar_url,
      headline: row.headline,
      bio: row.bio,
      languages: row.languages || [],
      experience_years: row.experience_years,
      qualification: row.qualification,
      teaching_modes: row.teaching_modes || [],
      similarity: parseFloat((row.similarity * 100).toFixed(1)),
      skills: row.matching_skills || []
    }));

    console.log(`Found ${teachers.length} matching teachers`);

    res.json({ teachers });

  } catch (error) {
    console.error('Teacher Match Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user-skills
 * Add a skill to the user's profile
 * Protected Route
 */
app.post('/api/user-skills', authMiddleware, async (req, res) => {
  try {
    const { skill_id } = req.body;
    const user_id = req.user.id;
    
    if (!skill_id) {
      return res.status(400).json({ success: false, error: 'Missing skill_id' });
    }

    const query = `
      INSERT INTO user_skills (user_id, skill_id, level, created_at)
      VALUES ($1, $2, 'Beginner', NOW())
      ON CONFLICT (user_id, skill_id) DO NOTHING
      RETURNING id;
    `;
    
    const result = await pool.query(query, [user_id, skill_id]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error adding user skill:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/instructors
 * Find instructors for a specific skill
 * Public Route (can be protected if needed, but usually discovery is public)
 */
app.get('/api/instructors', async (req, res) => {
  try {
    const { skill_id, page = 1, page_size = 12 } = req.query;
    const offset = (page - 1) * page_size;

    if (!skill_id) {
      return res.status(400).json({ success: false, error: 'Missing skill_id' });
    }

    const query = `
      SELECT p.id, p.full_name, p.avatar_url, p.bio, p.qualification, p.languages, 
             array_agg(s.name) as skills, p.role
      FROM profiles p
      JOIN user_skills us ON us.user_id = p.id
      JOIN skills s ON s.id = us.skill_id
      WHERE s.id = $1 AND p.role IN ('Teacher', 'Both', 'instructor', 'both')
      GROUP BY p.id
      ORDER BY p.rating DESC NULLS LAST
      LIMIT $2 OFFSET $3;
    `;

    const result = await pool.query(query, [skill_id, page_size, offset]);
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching instructors:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/mentorship-requests
 * Create a mentorship request
 * Protected Route
 */
app.post('/api/mentorship-requests', authMiddleware, async (req, res) => {
  try {
    const { skill_id, instructor_id, message } = req.body;
    const learner_id = req.user.id;

    if (!skill_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO mentorship_requests (skill_id, learner_id, instructor_id, message, status, created_at)
      VALUES ($1, $2, $3, $4, 'pending', NOW())
      RETURNING id;
    `;

    const result = await pool.query(query, [skill_id, learner_id, instructor_id, message]);
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating mentorship request:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/projects
 * Create a new learning challenge (project)
 * Protected Route
 */
app.post('/api/projects', authMiddleware, async (req, res) => {
  try {
    const { title, description, tags, visibility, capacity } = req.body;
    const owner_id = req.user.id;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Create project
      const projectQuery = `
        INSERT INTO projects (title, owner_id, visibility, status, description, tags, max_members, created_at)
        VALUES ($1, $2, $3, 'active', $4, $5, $6, NOW())
        RETURNING id;
      `;
      
      const projectResult = await client.query(projectQuery, [
        title, 
        owner_id, 
        visibility || 'public', 
        description, 
        tags || [], 
        capacity || 10
      ]);
      
      const projectId = projectResult.rows[0].id;

      // Add owner as member
      const memberQuery = `
        INSERT INTO project_members (project_id, user_id, role, joined_at)
        VALUES ($1, $2, 'owner', NOW());
      `;
      
      await client.query(memberQuery, [projectId, owner_id]);

      await client.query('COMMIT');
      
      res.json({ success: true, data: { id: projectId } });
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/project_members
 * Join a project
 * Protected Route
 */
app.post('/api/project_members', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.body;
    const user_id = req.user.id;

    if (!project_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO project_members (project_id, user_id, role, joined_at)
      SELECT $1, $2, 'member', NOW()
      WHERE NOT EXISTS (
        SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2
      )
      RETURNING id;
    `;

    const result = await pool.query(query, [project_id, user_id]);
    
    if (result.rowCount === 0) {
      return res.json({ success: false, error: 'Already a member or join failed' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error joining project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/project_members
 * Leave a project
 * Protected Route
 */
app.delete('/api/project_members', authMiddleware, async (req, res) => {
  try {
    const { project_id } = req.body;
    const user_id = req.user.id;

    if (!project_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const query = `
      DELETE FROM project_members 
      WHERE project_id = $1 AND user_id = $2
      RETURNING id;
    `;

    const result = await pool.query(query, [project_id, user_id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Membership not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error leaving project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Payment server running on port ${PORT}`);
  console.log(`📘 Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID}`);
});

module.exports = app;
