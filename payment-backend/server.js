const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Pool } = require('pg');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

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
  res.json({ status: 'ok', endpoints: ['/api/smart-match', '/api/match/teachers'], timestamp: new Date().toISOString() });
});

/**
 * POST /api/smart-match
 * AI-Assisted Discovery for Skills, Projects, and Mentors
 * TEMPORARILY DISABLED - Database connection needs configuration
 */
/* 
app.post('/api/smart-match', async (req, res) => {
  try {
    const { user_id, query } = req.body;

    console.log('Smart Match request:', { user_id, query });

    let queryEmbedding = null;

    // 1. Generate Embedding
    if (query) {
      // If user provided a specific query, use that
      const response = await openai.embeddings.create({
        model: "openai/text-embedding-3-small",
        input: query.replace(/\n/g, ' '),
      });
      queryEmbedding = response.data[0].embedding;
    } else if (user_id) {
      // Fallback: Use user's profile embedding if it exists
      const profileResult = await pool.query('SELECT interests_embedding FROM profiles WHERE id = $1', [user_id]);
      if (profileResult.rows.length > 0 && profileResult.rows[0].interests_embedding) {
        queryEmbedding = JSON.parse(profileResult.rows[0].interests_embedding);
      }
    }

    if (!queryEmbedding) {
      return res.status(400).json({ error: 'Could not generate search context. Please provide a query or update your profile.' });
    }

    // 2. Run Vector Searches
    // Note: We use <=> for cosine distance (requires vector extension)
    // We cast the parameter to vector explicitly: $1::vector

    const vectorStr = JSON.stringify(queryEmbedding);

    // A. Recommended Skills
    const skillsQuery = `
      SELECT id, name, category, description, 
             1 - (embedding <=> $1::vector) as similarity
      FROM skills
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT 6
    `;

    // B. Suggested Projects
    const projectsQuery = `
      SELECT id, title, description, category, status,
             1 - (embedding <=> $1::vector) as similarity
      FROM projects
      WHERE embedding IS NOT NULL AND status = 'active'
      ORDER BY embedding <=> $1::vector
      LIMIT 6
    `;

    // C. Mentors / Experts (Profiles)
    // Exclude current user
    const mentorsQuery = `
      SELECT id, full_name, role, avatar_url, bio,
             1 - (interests_embedding <=> $1::vector) as similarity
      FROM profiles
      WHERE interests_embedding IS NOT NULL 
        AND id != $2
        AND (role ILIKE '%mentor%' OR role ILIKE '%teacher%' OR role ILIKE '%expert%' OR role IS NOT NULL)
      ORDER BY interests_embedding <=> $1::vector
      LIMIT 6
    `;

    const [skillsResult, projectsResult, mentorsResult] = await Promise.all([
      pool.query(skillsQuery, [vectorStr]),
      pool.query(projectsQuery, [vectorStr]),
      pool.query(mentorsQuery, [vectorStr, user_id || '00000000-0000-0000-0000-000000000000'])
    ]);

    res.json({
      skills: skillsResult.rows,
      projects: projectsResult.rows,
      mentors: mentorsResult.rows
    });

  } catch (error) {
    console.error('Smart Match Error:', error);
    res.status(500).json({ error: error.message });
  }
});
*/

/**
 * POST /api/match/teachers
 * AI-Assisted Teacher Matching
 * Finds the best teachers for a given learner and/or skills
 */
app.post('/api/match/teachers', async (req, res) => {
  try {
    const { userId, skillIds, limit = 10 } = req.body;

    console.log('Teacher Match request:', { userId, skillIds, limit });

    // Validate input
    if (!userId && (!skillIds || skillIds.length === 0)) {
      return res.status(400).json({ 
        error: 'Either userId or skillIds must be provided' 
      });
    }

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
    } else if (userId) {
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
          ${userId ? 'AND p.id != $3' : ''}
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
      LIMIT $${userId ? '4' : '2'}
    `;

    const queryParams = [vectorStr];
    if (skillIds && skillIds.length > 0) {
      queryParams.push(skillIds);
    }
    if (userId) {
      queryParams.push(userId);
    }
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
 */
app.post('/api/user-skills', async (req, res) => {
  try {
    const { user_id, skill_id } = req.body;
    
    if (!user_id || !skill_id) {
      return res.status(400).json({ success: false, error: 'Missing user_id or skill_id' });
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
 */
app.post('/api/mentorship-requests', async (req, res) => {
  try {
    const { skill_id, learner_id, instructor_id, message } = req.body;

    if (!skill_id || !learner_id) {
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
 */
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, tags, visibility, capacity, owner_id } = req.body;

    if (!title || !owner_id) {
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
 */
app.post('/api/project_members', async (req, res) => {
  try {
    const { project_id, user_id } = req.body;

    if (!project_id || !user_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check capacity first (optional, but good practice)
    // For now, we'll trust the database constraints or add a check if needed
    
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
      // Either already a member or project doesn't exist (or capacity full if we checked)
      // We'll assume already member for now
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
 */
app.delete('/api/project_members', async (req, res) => {
  try {
    const { project_id, user_id } = req.body;

    if (!project_id || !user_id) {
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
