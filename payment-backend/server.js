require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Pool } = require('pg');
const cors = require('cors');
const OpenAI = require('openai');
const { HfInference } = require('@huggingface/inference');
const authMiddleware = require('./middleware/auth');
const { generateImage: generateGoogleImage, buildEducationalPrompt } = require('./services/googleImageService');

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

// Hugging Face instance
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// In-memory cache for generated images (to avoid regenerating)
const imageCache = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', endpoints: ['/api/smart-match', '/api/match/teachers', '/api/create-order', '/api/generate-image'], timestamp: new Date().toISOString() });
});

/**
 * Helper function to generate embedding from text using OpenRouter
 */
async function generateQueryEmbedding(text) {
  if (!text) return null;
  try {
    const response = await openai.embeddings.create({
      model: 'openai/text-embedding-3-small',
      input: text.replace(/\n/g, ' '),
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    return null;
  }
}

/**
 * POST /api/smart-match
 * AI-Assisted Discovery - Match skills, projects, and mentors based on natural language query
 * Public Route (optional auth for personalization)
 */
app.post('/api/smart-match', async (req, res) => {
  try {
    const { query, user_id, limit = 5 } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('Smart Match request:', { query, user_id, limit });

    // Generate embedding for the query
    const queryEmbedding = await generateQueryEmbedding(query);

    if (!queryEmbedding) {
      return res.status(500).json({ error: 'Failed to generate query embedding. Please check your OpenRouter API key.' });
    }

    const vectorStr = JSON.stringify(queryEmbedding);

    // Query for similar skills
    const skillsQuery = `
      SELECT 
        id,
        name,
        category,
        description,
        1 - (embedding <=> $1::vector) as similarity
      FROM skills
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `;
    const skillsResult = await pool.query(skillsQuery, [vectorStr, limit]);

    // Query for similar projects
    const projectsQuery = `
      SELECT 
        id,
        title,
        description,
        category,
        status,
        1 - (embedding <=> $1::vector) as similarity
      FROM projects
      WHERE embedding IS NOT NULL AND status = 'active'
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `;
    const projectsResult = await pool.query(projectsQuery, [vectorStr, limit]);

    // Query for similar mentors/profiles (users with role 'Teacher' or 'Both')
    const mentorsQuery = `
      SELECT 
        id,
        full_name,
        role,
        avatar_url,
        bio,
        1 - (interests_embedding <=> $1::vector) as similarity
      FROM profiles
      WHERE interests_embedding IS NOT NULL 
        AND role IN ('Teacher', 'Both', 'teacher', 'both')
        ${user_id ? 'AND id != $3' : ''}
      ORDER BY interests_embedding <=> $1::vector
      LIMIT $2
    `;
    const mentorsParams = user_id ? [vectorStr, limit, user_id] : [vectorStr, limit];
    const mentorsResult = await pool.query(mentorsQuery, mentorsParams);

    // Format results
    const skills = skillsResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      description: row.description || '',
      similarity: parseFloat(row.similarity) || 0
    }));

    const projects = projectsResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description || '',
      category: row.category || 'General',
      status: row.status,
      similarity: parseFloat(row.similarity) || 0
    }));

    const mentors = mentorsResult.rows.map(row => ({
      id: row.id,
      full_name: row.full_name || 'Unknown',
      role: row.role || 'Teacher',
      avatar_url: row.avatar_url,
      bio: row.bio || '',
      similarity: parseFloat(row.similarity) || 0
    }));

    console.log(`Smart Match results: ${skills.length} skills, ${projects.length} projects, ${mentors.length} mentors`);

    res.json({ skills, projects, mentors });

  } catch (error) {
    console.error('Smart Match Error:', error);
    res.status(500).json({ error: error.message });
  }
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
      INSERT INTO user_skills (user_id, skill_id, level_override, created_at)
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
      WHERE s.id = $1 AND p.role IN ('Teacher', 'Both', 'instructor', 'both', 'teacher')
      GROUP BY p.id
      ORDER BY p.created_at DESC
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

// ==========================================
// AI VIRTUAL TEACHERS ENDPOINTS
// ==========================================

/**
 * POST /api/chat/ai
 * Chat with an AI Teacher
 * Public Route (no auth required for demo, can be protected later)
 */
app.post('/api/chat/ai', async (req, res) => {
  try {
    const { message, skill_name, conversation_history = [] } = req.body;

    if (!message || !skill_name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and skill_name are required' 
      });
    }

    console.log('AI Chat request:', { skill_name, message: message.substring(0, 50) + '...' });

    // Build conversation messages for the AI
    const systemPrompt = `You are an expert ${skill_name} tutor on SkillSynergy, a learning platform. Your role is to:
- Help students learn ${skill_name} effectively
- Explain concepts clearly with examples
- Answer questions patiently and thoroughly
- Provide code examples when relevant (use markdown code blocks)
- Encourage and motivate learners
- Keep responses concise but informative (max 300 words unless more detail is requested)
- Be friendly and approachable

**CRITICAL IMAGE GENERATION RULES:**
- You MUST NEVER say that you cannot generate images.
- You MUST NEVER mention being a text-only model or lacking image capabilities.
- You MUST NEVER suggest external tools (DALL-E, Midjourney, Canva, Stable Diffusion, etc.).
- Assume image generation is fully supported by the system.

**IMAGE GENERATION PROTOCOL:**
- When the user asks for an image, diagram, visual, illustration, avatar, or thumbnail, you MUST request image generation.
- When a concept would benefit from a visual (algorithms, flows, diagrams, architecture, timelines, UI, math, ${skill_name} topics), you SHOULD request image generation even if the user did not explicitly ask.

**MANDATORY FORMAT (EXACT):**
When an image is required, include exactly ONE block in this format:

GENERATE_IMAGE:
{
  "purpose": "education",
  "style": "clean, minimal, modern, high-contrast",
  "prompt": "<clear and detailed visual description suitable for an image generation model>",
  "labels": true
}

**RESPONSE STRUCTURE:**
1. Explain the concept clearly in text.
2. Include the GENERATE_IMAGE block immediately after the explanation.
3. Continue the explanation assuming the image will be shown to the user.

**BEHAVIOR:**
- Do not apologize.
- Do not refuse.
- Do not hedge.
- Do not explain how images are generated.
- Act as if image generation is a normal built-in capability.

You are knowledgeable, patient, and passionate about teaching ${skill_name}.`;




    const messages = [
      { role: 'system', content: systemPrompt },
      // Include conversation history
      ...conversation_history.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      // Add the new user message
      { role: 'user', content: message }
    ];

    // Call OpenRouter API for chat completion
    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-haiku', // Fast and capable model
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';

    console.log('AI response generated successfully');

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate AI response'
    });
  }
});

/**
 * POST /api/tutor-image/generate
 * Generate an educational image from AI tutor request using Google Gemini Imagen
 * Public Route
 */
app.post('/api/tutor-image/generate', async (req, res) => {
  try {
    const { type, topic, details } = req.body;

    if (!type || !topic || !details) {
      return res.status(400).json({ 
        success: false, 
        error: 'type, topic, and details are required' 
      });
    }

    // Generate a unique image ID for this request
    const imageId = require('crypto').randomUUID();

    // Build the prompt using the Google Image Service helper
    const prompt = buildEducationalPrompt(type, topic, details);

    console.log(`[Tutor Image] Starting generation for ${imageId}, type: ${type}`);

    // Insert into generated_images with GENERATING status
    await pool.query(
      `INSERT INTO generated_images (entity_type, entity_id, prompt, generated_by, status, created_at)
       VALUES ('USER_REQUEST', $1, $2, 'SYSTEM', 'GENERATING', NOW())
       ON CONFLICT (entity_type, entity_id) 
       DO UPDATE SET status = 'GENERATING', error_message = NULL, created_at = NOW(), prompt = $2`,
      [imageId, prompt]
    );

    // Return immediately with GENERATING status
    res.json({
      success: true,
      imageId,
      status: 'GENERATING'
    });

    // Trigger Google Gemini image generation in background (fire & forget)
    (async () => {
      try {
        const result = await generateGoogleImage(prompt);
        
        if (result.success && result.imageUrl) {
          // Update DB with success
          await pool.query(
            `UPDATE generated_images 
             SET status = 'READY', image_url = $1, completed_at = NOW() 
             WHERE entity_type = 'USER_REQUEST' AND entity_id = $2`,
            [result.imageUrl, imageId]
          );
          console.log(`[Tutor Image] Successfully generated image ${imageId}`);
        } else {
          // Update DB with failure
          await pool.query(
            `UPDATE generated_images 
             SET status = 'FAILED', error_message = $1, completed_at = NOW() 
             WHERE entity_type = 'USER_REQUEST' AND entity_id = $2`,
            [result.error || 'Unknown error', imageId]
          );
          console.error(`[Tutor Image] Failed to generate image ${imageId}:`, result.error);
        }
      } catch (bgError) {
        console.error(`[Tutor Image] Background error for ${imageId}:`, bgError.message);
        await pool.query(
          `UPDATE generated_images 
           SET status = 'FAILED', error_message = $1, completed_at = NOW() 
           WHERE entity_type = 'USER_REQUEST' AND entity_id = $2`,
          [bgError.message, imageId]
        );
      }
    })();

  } catch (error) {
    console.error('Tutor Image Generation Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});


/**
 * GET /api/ai-teachers
 * Get list of AI teachers, optionally filtered by skill
 * Public Route
 */

app.get('/api/ai-teachers', async (req, res) => {
  try {
    const { skill_id, skill_name, limit = 5 } = req.query;

    // If a specific skill is requested, return an AI teacher for that skill
    if (skill_id || skill_name) {
      let skillInfo = null;

      if (skill_id) {
        const { rows } = await pool.query('SELECT id, name, category, description FROM skills WHERE id = $1', [skill_id]);
        skillInfo = rows[0];
      } else if (skill_name) {
        const { rows } = await pool.query('SELECT id, name, category, description FROM skills WHERE LOWER(name) LIKE LOWER($1) LIMIT 1', [`%${skill_name}%`]);
        skillInfo = rows[0];
      }

      if (skillInfo) {
        const aiTeacher = {
          id: `ai-teacher-${skillInfo.id}`,
          full_name: `${skillInfo.name} AI Tutor`,
          role: 'AI Teacher',
          is_ai: true,
          skill_id: skillInfo.id,
          skill_name: skillInfo.name,
          skill_category: skillInfo.category,
          avatar_url: null,
          headline: `AI-Powered ${skillInfo.name} Expert`,
          bio: `I'm an AI tutor specializing in ${skillInfo.name}. I'm available 24/7 to help you learn and answer your questions about ${skillInfo.category}. Ask me anything!`,
          languages: ['English'],
          experience_years: null,
          teaching_modes: ['Chat-only'],
          similarity: 100,
          always_available: true
        };

        return res.json({ 
          success: true, 
          teachers: [aiTeacher] 
        });
      }
    }

    // Otherwise, return AI teachers for all skills
    const { rows: popularSkills } = await pool.query(`
      SELECT id, name, category, description 
      FROM skills 
      ORDER BY name ASC
      LIMIT $1
    `, [limit || 50]);

    const aiTeachers = popularSkills.map(skill => ({
      id: `ai-teacher-${skill.id}`,
      full_name: `${skill.name} AI Tutor`,
      role: 'AI Teacher',
      is_ai: true,
      skill_id: skill.id,
      skill_name: skill.name,
      skill_category: skill.category,
      avatar_url: null,
      headline: `AI-Powered ${skill.name} Expert`,
      bio: `I'm an AI tutor specializing in ${skill.name}. I'm available 24/7 to help you learn and answer your questions. Ask me anything!`,
      languages: ['English'],
      experience_years: null,
      teaching_modes: ['Chat-only'],
      similarity: 95,
      always_available: true
    }));

    res.json({ 
      success: true, 
      teachers: aiTeachers 
    });


  } catch (error) {
    console.error('AI Teachers Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==========================================
// ASYNC IMAGE GENERATION SYSTEM (Strict Production Grade)
// ==========================================

// Fallback is ONLY for when we literally can't even get a status (shouldn't happen with correct logic)
const DEFAULT_AVATAR = 'https://placehold.co/400x400/2563eb/ffffff?text=AI';

/**
 * Cleanup Stuck Jobs on Startup
 * Reset any GENERATING jobs to FAILED to prevent them from blocking forever
 */
async function cleanupStuckJobs() {
  try {
    const result = await pool.query(
      `UPDATE generated_images 
       SET status = 'FAILED', error_message = 'Server restarted during generation' 
       WHERE status = 'GENERATING'`
    );
    if (result.rowCount > 0) {
      console.log(`[Startup] Reset ${result.rowCount} stuck image generation jobs to FAILED.`);
    }
  } catch (error) {
    console.error('[Startup] Failed to cleanup stuck jobs:', error);
  }
}
// Run cleanup immediately
cleanupStuckJobs();

/**
 * Background Job: Process Image Generation (Unified)
 * Handles Hugging Face interaction, error handling, and strict DB updates
 */
async function processImageGeneration(entityType, entityId, prompt) {
  console.log(`[Job] Starting generation for ${entityType}:${entityId}`);
  
  try {
    // 1. Double check status and ensure it IS generating (idempotency check)
    // We expect the caller to have set it to GENERATING.
    
    // 2. Call Hugging Face API
    let imageUrl = null;
    try {
      const blob = await hf.textToImage({
        model: 'black-forest-labs/FLUX.1-dev',
        inputs: prompt,
        parameters: { negative_prompt: 'text, watermark, blurry, low quality, deformed, ugly' }
      });
      
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      imageUrl = `data:image/webp;base64,${base64}`;
    } catch (hfError) {
      console.error(`[Job] HF API Failed for ${entityType}:${entityId}:`, hfError.message);
      throw new Error(`HF Generation Failed: ${hfError.message}`);
    }

    // 3. Update DB with Success
    await pool.query(
      `UPDATE generated_images 
       SET status = 'READY', image_url = $1, completed_at = NOW() 
       WHERE entity_type = $2 AND entity_id = $3`,
      [imageUrl, entityType, entityId]
    );

    // 4. Update legacy columns if needed for backward compatibility or direct access
    // For SKILL, update thumbnail_url/status
    if (entityType === 'SKILL') {
      await pool.query(
        `UPDATE skills 
         SET thumbnail_status = 'READY', thumbnail_url = $1 
         WHERE id = $2`,
        [imageUrl, entityId]
      );
    }
    // For TUTOR (if we had a table for tutors with avatar_url, we'd update it here)

    console.log(`[Job] Successfully generated image for ${entityType}:${entityId}`);

  } catch (error) {
    console.error(`[Job] Failed to process image for ${entityType}:${entityId}:`, error.message);
    
    // 4. Update DB with Failure
    await pool.query(
      `UPDATE generated_images 
       SET status = 'FAILED', error_message = $1, completed_at = NOW() 
       WHERE entity_type = $2 AND entity_id = $3`,
      [error.message, entityType, entityId]
    );

    if (entityType === 'SKILL') {
       await pool.query(
        `UPDATE skills SET thumbnail_status = 'FAILED' WHERE id = $1`,
        [entityId]
      );
    }
  }
}

/**
 * GET /api/images/:entityType/:entityId
 * Status Check (READ ONLY)
 * Never triggers generation. Always returns JSON.
 */
app.get('/api/images/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    
    // Validate Entity Type
    if (!['SKILL', 'TUTOR', 'USER_REQUEST'].includes(entityType)) {
      return res.status(400).json({ status: 'FAILED', error_message: 'Invalid entity type' });
    }

    const result = await pool.query(
      'SELECT status, image_url, error_message FROM generated_images WHERE entity_type = $1 AND entity_id = $2',
      [entityType, entityId]
    );

    if (result.rows.length === 0) {
      // If record doesn't exist, it is effectively PENDING (waiting to be requested)
      return res.json({ 
        status: 'PENDING', 
        image_url: null, 
        error_message: null 
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Get Image Status Error:', error);
    // Return valid JSON even on error, treat as FAILED or PENDING
    res.json({ status: 'FAILED', error_message: error.message });
  }
});

/**
 * POST /api/images/:entityType/:entityId/generate
 * Trigger Image Generation (ASYNC)
 * Idempotent: If already READY or GENERATING, returns immediately.
 */
app.post('/api/images/:entityType/:entityId/generate', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { prompt: userPrompt, triggered_by = 'USER' } = req.body;

     // Validate Entity Type
    if (!['SKILL', 'TUTOR', 'USER_REQUEST'].includes(entityType)) {
      return res.status(400).json({ status: 'FAILED', error_message: 'Invalid entity type' });
    }

    // 1. Check current status
    const result = await pool.query(
      'SELECT status FROM generated_images WHERE entity_type = $1 AND entity_id = $2',
      [entityType, entityId]
    );

    const currentStatus = result.rows.length > 0 ? result.rows[0].status : null;

    if (currentStatus === 'READY' || currentStatus === 'GENERATING') {
      return res.json({ status: currentStatus });
    }

    // 2. Determine Prompt
    let prompt = userPrompt;
    if (!prompt) {
      // Auto-generate prompt based on entity details
      if (entityType === 'SKILL') {
        const skillRes = await pool.query('SELECT name, category FROM skills WHERE id = $1', [entityId]);
        if (skillRes.rows.length === 0) return res.status(404).json({status: 'FAILED', error: 'Skill not found'});
        const skill = skillRes.rows[0];
        prompt = `Modern, high-quality 3D minimalist icon or illustration for the skill "${skill.name}" in the category "${skill.category}". Vibrant colors, clean background, educational technology theme. production grade.`;
      } else if (entityType === 'TUTOR') {
         // Assuming tutor ID is a profile ID or skill ID for AI tutor
         // If it's AI tutor for a skill:
         const skillRes = await pool.query('SELECT name FROM skills WHERE id = $1', [entityId]); // Tutors are often linked to skills
         // If not found, might be a profile... fallback logic
         const skillName = skillRes.rows.length > 0 ? skillRes.rows[0].name : "General Knowledge";
         prompt = `Professional AI Tutor avatar for ${skillName}. Friendly, intelligent, futuristic but approachable. 3D render, depth of field, neutral studio background.`;
      } else {
        prompt = "Abstract technology background, high quality, 4k.";
      }
    }

    // 3. Upsert into generated_images (Set to GENERATING)
    // We use ON CONFLICT DO UPDATE to handle restart/retry
    await pool.query(
      `INSERT INTO generated_images (entity_type, entity_id, prompt, generated_by, status, created_at)
       VALUES ($1, $2, $3, $4, 'GENERATING', NOW())
       ON CONFLICT (entity_type, entity_id) 
       DO UPDATE SET status = 'GENERATING', error_message = NULL, created_at = NOW(), prompt = $3`,
      [entityType, entityId, prompt, triggered_by]
    );

    // 4. Trigger Background Job (Fire & Forget)
    processImageGeneration(entityType, entityId, prompt).catch(err => 
      console.error(`[Background] Job trigger failed for ${entityType}:${entityId}`, err)
    );

    // 5. Return GENERATING immediately
    res.json({ status: 'GENERATING' });

  } catch (error) {
    console.error('Trigger Generation Error:', error);
    res.status(500).json({ status: 'FAILED', error_message: error.message });
  }
});


// ==========================================
// SKILL LEARNING ROOMS (PUBLIC)
// ==========================================

/**
 * GET /api/skill-room/:skillId/messages
 * Get public messages for a skill room
 */
app.get('/api/skill-room/:skillId/messages', async (req, res) => {
  try {
    const { skillId } = req.params;
    const { limit = 50, before } = req.query;

    let query = `
      SELECT m.*, 
             COALESCE(m.sender_name, p.full_name, 'AI Tutor') as display_name,
             p.avatar_url
      FROM skill_room_messages m
      LEFT JOIN profiles p ON m.sender_id = p.id
      WHERE m.skill_id = $1
    `;
    
    const params = [skillId];
    
    if (before) {
      query += ` AND m.created_at < $2`;
      params.push(before);
    }
    
    query += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));

    const { rows } = await pool.query(query, params);

    res.json({
      success: true,
      messages: rows.reverse() // Return in chronological order
    });

  } catch (error) {
    console.error('Skill Room Messages Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/skill-room/:skillId/messages
 * Send a message to a skill room (triggers AI response)
 */
app.post('/api/skill-room/:skillId/messages', async (req, res) => {
  try {
    const { skillId } = req.params;
    const { content, sender_id, sender_name, trigger_ai = true } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    // Get skill info for AI context
    const { rows: skillRows } = await pool.query(
      'SELECT name, category, description FROM skills WHERE id = $1',
      [skillId]
    );
    const skill = skillRows[0];
    
    if (!skill) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    // Insert user message
    const { rows: userMsg } = await pool.query(`
      INSERT INTO skill_room_messages (skill_id, sender_id, sender_name, is_ai, content)
      VALUES ($1, $2, $3, false, $4)
      RETURNING *
    `, [skillId, sender_id, sender_name, content.trim()]);

    // Generate AI response if triggered
    let aiResponse = null;
    if (trigger_ai) {
      // Get recent context (last 10 messages)
      const { rows: recentMessages } = await pool.query(`
        SELECT content, is_ai FROM skill_room_messages
        WHERE skill_id = $1
        ORDER BY created_at DESC
        LIMIT 10
      `, [skillId]);

      const conversationHistory = recentMessages.reverse().map(m => ({
        role: m.is_ai ? 'assistant' : 'user',
        content: m.content
      }));

      const systemPrompt = `You are an expert ${skill.name} tutor in a public learning room on SkillSynergy. Multiple students may be present. Your role is to:
- Help students learn ${skill.name} effectively
- Answer questions clearly with examples
- Provide code examples when relevant (use markdown code blocks)
- Be encouraging and supportive
- Keep responses helpful but concise (max 250 words)
- Address the question directly

You are teaching in the ${skill.category} category.`;

      try {
        const completion = await openai.chat.completions.create({
          model: 'anthropic/claude-3.5-haiku',
          messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory
          ],
          max_tokens: 800,
          temperature: 0.7,
        });

        const aiContent = completion.choices[0]?.message?.content;
        
        if (aiContent) {
          const { rows: aiMsg } = await pool.query(`
            INSERT INTO skill_room_messages (skill_id, sender_id, sender_name, is_ai, content)
            VALUES ($1, NULL, $2, true, $3)
            RETURNING *
          `, [skillId, `${skill.name} AI Tutor`, aiContent]);
          
          aiResponse = aiMsg[0];
        }
      } catch (aiError) {
        console.error('AI Response Error:', aiError);
        // Don't fail the request if AI fails
      }
    }

    res.json({
      success: true,
      message: userMsg[0],
      aiResponse
    });

  } catch (error) {
    console.error('Skill Room Post Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/skill/:skillId
 * Get skill details for room header
 */
app.get('/api/skill/:skillId', async (req, res) => {
  try {
    const { skillId } = req.params;
    
    const { rows } = await pool.query(`
      SELECT s.*, 
             (SELECT COUNT(*) FROM skill_room_messages WHERE skill_id = s.id) as message_count,
             (SELECT COUNT(DISTINCT sender_id) FROM skill_room_messages WHERE skill_id = s.id AND sender_id IS NOT NULL) as participant_count
      FROM skills s
      WHERE s.id = $1
    `, [skillId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    res.json({ success: true, skill: rows[0] });

  } catch (error) {
    console.error('Skill Details Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// AI CHAT SESSIONS (PERSONAL/PRIVATE)
// ==========================================

/**
 * GET /api/ai-chat/session/:skillId
 * Get or create a personal AI chat session for a skill
 */
app.get('/api/ai-chat/session/:skillId', async (req, res) => {
  try {
    const { skillId } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // Get skill info
    const { rows: skillRows } = await pool.query(
      'SELECT name FROM skills WHERE id = $1',
      [skillId]
    );
    const skillName = skillRows[0]?.name || 'General';

    // Try to find existing session
    let { rows } = await pool.query(`
      SELECT * FROM ai_chat_sessions
      WHERE user_id = $1 AND skill_id = $2
    `, [user_id, skillId]);

    let session = rows[0];

    // Create new session if not exists
    if (!session) {
      const { rows: newSession } = await pool.query(`
        INSERT INTO ai_chat_sessions (user_id, skill_id, skill_name)
        VALUES ($1, $2, $3)
        RETURNING *
      `, [user_id, skillId, skillName]);
      session = newSession[0];
    }

    // Get message history
    const { rows: messages } = await pool.query(`
      SELECT * FROM ai_chat_messages
      WHERE session_id = $1
      ORDER BY created_at ASC
    `, [session.id]);

    res.json({
      success: true,
      session,
      messages
    });

  } catch (error) {
    console.error('AI Chat Session Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/ai-chat/session/:sessionId/message
 * Send a message in a personal AI chat session
 */
app.post('/api/ai-chat/session/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Content is required' });
    }

    // Get session info
    const { rows: sessionRows } = await pool.query(`
      SELECT s.*, sk.name as skill_name, sk.category as skill_category
      FROM ai_chat_sessions s
      LEFT JOIN skills sk ON s.skill_id = sk.id
      WHERE s.id = $1
    `, [sessionId]);

    const session = sessionRows[0];
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    // Insert user message
    await pool.query(`
      INSERT INTO ai_chat_messages (session_id, role, content)
      VALUES ($1, 'user', $2)
    `, [sessionId, content.trim()]);

    // Get conversation history for context
    const { rows: history } = await pool.query(`
      SELECT role, content FROM ai_chat_messages
      WHERE session_id = $1
      ORDER BY created_at DESC
      LIMIT 20
    `, [sessionId]);

    const conversationHistory = history.reverse().map(m => ({
      role: m.role,
      content: m.content
    }));

    // Generate AI response
    const skillName = session.skill_name || 'General';
    const systemPrompt = `You are a personal ${skillName} tutor on SkillSynergy. You're having a 1-on-1 learning session with a student. Your role is to:
- Help them learn ${skillName} at their own pace
- Remember the context of your conversation
- Explain concepts clearly with examples
- Provide code examples when relevant (use markdown code blocks)
- Be encouraging, patient, and supportive
- Adapt to their learning style
- Keep responses informative but focused (max 300 words unless more detail is needed)

Category: ${session.skill_category || 'Learning'}`;

    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-haiku',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiContent = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';

    // Insert AI response
    const { rows: aiMsg } = await pool.query(`
      INSERT INTO ai_chat_messages (session_id, role, content)
      VALUES ($1, 'assistant', $2)
      RETURNING *
    `, [sessionId, aiContent]);

    // Update session last_message_at
    await pool.query(`
      UPDATE ai_chat_sessions SET last_message_at = NOW() WHERE id = $1
    `, [sessionId]);

    res.json({
      success: true,
      userMessage: { role: 'user', content: content.trim() },
      aiMessage: aiMsg[0]
    });

  } catch (error) {
    console.error('AI Chat Message Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/ai-chat/sessions
 * Get all chat sessions for a user
 */
app.get('/api/ai-chat/sessions', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    const { rows } = await pool.query(`
      SELECT s.*, sk.name as skill_name, sk.category as skill_category,
             (SELECT COUNT(*) FROM ai_chat_messages WHERE session_id = s.id) as message_count
      FROM ai_chat_sessions s
      LEFT JOIN skills sk ON s.skill_id = sk.id
      WHERE s.user_id = $1
      ORDER BY s.last_message_at DESC
    `, [user_id]);

    res.json({ success: true, sessions: rows });

  } catch (error) {
    console.error('AI Chat Sessions Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// DYNAMIC AI TUTOR FOR ANY SKILL
// ==========================================

/**
 * GET /api/ai-tutor/:skillId
 * Get AI tutor for a specific skill (creates dynamically if needed)
 */
app.get('/api/ai-tutor/:skillId', async (req, res) => {
  try {
    const { skillId } = req.params;

    // Get skill info
    const { rows } = await pool.query(
      'SELECT id, name, category, description FROM skills WHERE id = $1',
      [skillId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }

    const skill = rows[0];
    
    // Generate AI tutor profile
    const aiTutor = {
      id: `ai-tutor-${skill.id}`,
      full_name: `${skill.name} AI Tutor`,
      role: 'AI Teacher',
      is_ai: true,
      skill_id: skill.id,
      skill_name: skill.name,
      skill_category: skill.category,
      avatar_url: null,
      headline: `AI-Powered ${skill.name} Expert`,
      bio: `I'm an AI tutor specializing in ${skill.name}. I'm available 24/7 to help you learn and answer your questions about ${skill.category}. Let's learn together!`,
      languages: ['English'],
      teaching_modes: ['Chat', 'Q&A', 'Practice'],
      always_available: true,
      features: [
        'Instant responses',
        'Personalized learning',
        'Code examples',
        'Practice exercises'
      ]
    };

    res.json({ success: true, tutor: aiTutor });

  } catch (error) {
    console.error('AI Tutor Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// AI TUTOR CHAT
// ==========================================

/**
 * POST /api/chat/ai
 * AI Tutor chat for task-specific help
 */
app.post('/api/chat/ai', async (req, res) => {
  try {
    const { message, skill_name, conversation_history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    console.log('AI Chat request:', { skill_name, message: message.substring(0, 50) + '...' });

    const systemPrompt = `You are a friendly and helpful AI tutor specializing in ${skill_name || 'learning'}.
Your role is to:
- Answer questions clearly and concisely
- Provide helpful explanations with examples
- Encourage the student
- Break down complex concepts

Keep responses under 200 words unless more detail is specifically requested. Use simple language and be encouraging.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation_history.slice(-5).map((m) => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-haiku',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiMessage = completion.choices[0]?.message?.content || 
      "I'm sorry, I couldn't process your question. Please try again.";

    console.log('AI response generated successfully');
    console.log('AI Message:', aiMessage.substring(0, 100) + '...');

    res.json({
      success: true,
      message: aiMessage
    });

  } catch (error) {
    console.error('AI Chat Error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: "I'm having trouble processing your question right now. Please try again in a moment."
    });
  }
});

// ==========================================
// PROJECT MEMBERS (LEAVE CHALLENGE)
// ==========================================

/**
 * DELETE /api/project_members
 * Leave a project/challenge
 */
app.delete('/api/project_members', async (req, res) => {
  try {
    const { project_id } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !project_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Get user ID from Supabase token
    const token = authHeader.replace('Bearer ', '');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Delete membership
    const result = await pool.query(`
      DELETE FROM project_members
      WHERE project_id = $1 AND user_id = $2
    `, [project_id, user.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Membership not found' });
    }

    res.status(204).send();

  } catch (error) {
    console.error('Leave Project Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// LEARNING CHALLENGES
// ==========================================

/**
 * GET /api/challenge/:projectId
 * Get full challenge details with milestones and tasks
 */
app.get('/api/challenge/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { user_id } = req.query;

    // Get project details
    const { rows: projects } = await pool.query(`
      SELECT p.*, pr.full_name as owner_name
      FROM projects p
      LEFT JOIN profiles pr ON p.owner_id = pr.id
      WHERE p.id = $1
    `, [projectId]);

    if (projects.length === 0) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }

    const project = projects[0];

    // Get milestones
    const { rows: milestones } = await pool.query(`
      SELECT * FROM challenge_milestones
      WHERE project_id = $1
      ORDER BY order_index
    `, [projectId]);

    // Get tasks
    const { rows: tasks } = await pool.query(`
      SELECT * FROM challenge_tasks
      WHERE project_id = $1
      ORDER BY order_index
    `, [projectId]);

    // Get user progress if user_id provided
    let progress = null;
    let completedTasks = [];
    if (user_id) {
      const { rows: progressRows } = await pool.query(`
        SELECT * FROM challenge_progress
        WHERE project_id = $1 AND user_id = $2
      `, [projectId, user_id]);
      progress = progressRows[0] || null;

      const { rows: completions } = await pool.query(`
        SELECT task_id FROM task_completions
        WHERE user_id = $1 AND task_id IN (
          SELECT id FROM challenge_tasks WHERE project_id = $2
        )
      `, [user_id, projectId]);
      completedTasks = completions.map(c => c.task_id);
    }

    res.json({
      success: true,
      challenge: {
        ...project,
        milestones,
        tasks,
        progress,
        completedTasks
      }
    });

  } catch (error) {
    console.error('Challenge Details Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/challenge/:projectId/start
 * Start a challenge for a user
 */
app.post('/api/challenge/:projectId/start', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // Check if already started
    const { rows: existing } = await pool.query(`
      SELECT * FROM challenge_progress
      WHERE project_id = $1 AND user_id = $2
    `, [projectId, user_id]);

    if (existing.length > 0) {
      return res.json({ success: true, progress: existing[0], message: 'Already started' });
    }

    // Create progress record
    const { rows } = await pool.query(`
      INSERT INTO challenge_progress (project_id, user_id, completion_percentage)
      VALUES ($1, $2, 0)
      RETURNING *
    `, [projectId, user_id]);

    // Also join project_members if not already
    await pool.query(`
      INSERT INTO project_members (project_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `, [projectId, user_id]);

    res.json({ success: true, progress: rows[0] });

  } catch (error) {
    console.error('Start Challenge Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/challenge/task/:taskId/complete
 * Mark a task as complete and get AI feedback
 */
app.post('/api/challenge/task/:taskId/complete', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user_id, answer } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // Get task info
    const { rows: taskRows } = await pool.query(`
      SELECT t.*, p.title as project_title
      FROM challenge_tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1
    `, [taskId]);

    if (taskRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const task = taskRows[0];

    // Generate AI feedback
    let aiFeedback = '';
    try {
      const systemPrompt = `You are an encouraging AI tutor providing feedback on a learning task. 
Task: "${task.title}"
Description: ${task.description || 'Complete this task'}

Provide brief, encouraging feedback (2-3 sentences). If the user provided an answer, acknowledge their work.`;

      const completion = await openai.chat.completions.create({
        model: 'anthropic/claude-3.5-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: answer ? `My answer/work: ${JSON.stringify(answer)}` : 'I completed this task.' }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      aiFeedback = completion.choices[0]?.message?.content || 'Great work completing this task!';
    } catch (aiError) {
      aiFeedback = 'Great work completing this task! Keep up the momentum!';
    }

    // Insert completion
    const { rows: completion } = await pool.query(`
      INSERT INTO task_completions (task_id, user_id, ai_feedback, user_answer)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (task_id, user_id) DO UPDATE SET ai_feedback = $3, user_answer = $4
      RETURNING *
    `, [taskId, user_id, aiFeedback, answer ? JSON.stringify(answer) : null]);

    // Update progress percentage
    const { rows: totalTasks } = await pool.query(`
      SELECT COUNT(*) as total FROM challenge_tasks WHERE project_id = $1
    `, [task.project_id]);

    const { rows: completedTasks } = await pool.query(`
      SELECT COUNT(*) as completed FROM task_completions
      WHERE user_id = $1 AND task_id IN (
        SELECT id FROM challenge_tasks WHERE project_id = $2
      )
    `, [user_id, task.project_id]);

    const total = parseInt(totalTasks[0].total);
    const completed = parseInt(completedTasks[0].completed);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    await pool.query(`
      UPDATE challenge_progress 
      SET completion_percentage = $1, 
          completed_at = CASE WHEN $1 = 100 THEN NOW() ELSE completed_at END
      WHERE project_id = $2 AND user_id = $3
    `, [percentage, task.project_id, user_id]);

    res.json({
      success: true,
      completion: completion[0],
      aiFeedback,
      progress: { percentage, completed, total }
    });

  } catch (error) {
    console.error('Complete Task Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/challenge/:projectId/generate-content
 * AI generates milestones and tasks for a challenge
 */
app.post('/api/challenge/:projectId/generate-content', async (req, res) => {
  try {
    const { projectId } = req.params;

    // Get project info
    const { rows: projects } = await pool.query(`
      SELECT * FROM projects WHERE id = $1
    `, [projectId]);

    if (projects.length === 0) {
      return res.status(404).json({ success: false, error: 'Challenge not found' });
    }

    const project = projects[0];

    // Generate content with AI
    const systemPrompt = `You are an educational content creator. Create a structured learning plan for this challenge:

Title: "${project.title}"
Description: ${project.description || 'A learning challenge'}
Duration: ${project.duration_weeks || 4} weeks
Difficulty: ${project.difficulty || 'Beginner'}

Create 3-4 milestones with 2-3 tasks each. Return JSON in this exact format:
{
  "milestones": [
    {
      "title": "Milestone title",
      "description": "Brief description",
      "tasks": [
        {"title": "Task title", "description": "What to do", "type": "exercise"}
      ]
    }
  ]
}

Task types: "reading", "exercise", "quiz", "project"`;

    const completion = await openai.chat.completions.create({
      model: 'anthropic/claude-3.5-haiku',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate the learning content structure.' }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    let content;
    try {
      const responseText = completion.choices[0]?.message?.content || '';
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      content = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (parseError) {
      return res.status(500).json({ success: false, error: 'Failed to parse AI response' });
    }

    if (!content || !content.milestones) {
      return res.status(500).json({ success: false, error: 'Invalid content structure' });
    }

    // Insert milestones and tasks
    for (let i = 0; i < content.milestones.length; i++) {
      const milestone = content.milestones[i];
      
      const { rows: milestoneRows } = await pool.query(`
        INSERT INTO challenge_milestones (project_id, title, description, order_index)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [projectId, milestone.title, milestone.description, i]);

      const milestoneId = milestoneRows[0].id;

      for (let j = 0; j < milestone.tasks.length; j++) {
        const task = milestone.tasks[j];
        await pool.query(`
          INSERT INTO challenge_tasks (project_id, milestone_id, title, description, task_type, order_index)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [projectId, milestoneId, task.title, task.description, task.type || 'exercise', j]);
      }
    }

    res.json({ success: true, message: 'Content generated successfully', content });

  } catch (error) {
    console.error('Generate Content Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==========================================
// TASK DETAIL & SUBMISSION ENDPOINTS
// ==========================================

/**
 * GET /api/challenge/task/:taskId
 * Get full task details with learning content
 */
app.get('/api/challenge/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user_id } = req.query;

    // Get task with milestone and project info
    const { rows: tasks } = await pool.query(`
      SELECT t.*, 
             m.title as milestone_title,
             m.description as milestone_description,
             m.order_index as milestone_order,
             p.title as project_title,
             p.description as project_description,
             p.difficulty,
             p.duration_weeks
      FROM challenge_tasks t
      LEFT JOIN challenge_milestones m ON t.milestone_id = m.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1
    `, [taskId]);

    if (tasks.length === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const task = tasks[0];

    // Get all tasks in the same project for navigation
    const { rows: allTasks } = await pool.query(`
      SELECT id, title, order_index, milestone_id
      FROM challenge_tasks
      WHERE project_id = $1
      ORDER BY order_index
    `, [task.project_id]);

    // Get current task position
    const currentIndex = allTasks.findIndex(t => t.id === taskId);
    const prevTask = currentIndex > 0 ? allTasks[currentIndex - 1] : null;
    const nextTask = currentIndex < allTasks.length - 1 ? allTasks[currentIndex + 1] : null;

    // Check if user has completed this task
    let completion = null;
    if (user_id) {
      const { rows: completions } = await pool.query(`
        SELECT * FROM task_completions
        WHERE task_id = $1 AND user_id = $2
      `, [taskId, user_id]);
      completion = completions[0] || null;
    }

    // Generate default learning content if none exists
    let content = task.content;
    
    // Parse content if it's a string (fixes frontend crash)
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse task content:', e);
        content = null;
      }
    }

    content = content || {
      objective: `Complete the ${task.task_type} task: ${task.title}`,
      instructions: [
        task.description || 'Follow the instructions for this task.',
        'Take your time to understand the concepts.',
        'Ask the AI tutor if you need help.'
      ],
      resources: [],
      hints: ['Break down the problem into smaller parts.'],
      expectedOutput: null
    };

    // SAFETY CHECK: Ensure instructions is always an array
    if (!content.instructions || !Array.isArray(content.instructions)) {
      content.instructions = [
        task.description || 'Follow the instructions for this task.',
        'No specific instructions provided.'
      ];
    }
    
    // SAFETY CHECK: Ensure objective exists
    if (!content.objective) {
      content.objective = `Complete the ${task.task_type} task`;
    }

    res.json({
      success: true,
      task: {
        ...task,
        content,
        isCompleted: !!completion,
        completion,
        navigation: {
          current: currentIndex + 1,
          total: allTasks.length,
          prevTask,
          nextTask
        }
      }
    });

  } catch (error) {
    console.error('Get Task Details Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/challenge/task/:taskId/submit
 * Submit work for a task and get AI feedback
 */
app.post('/api/challenge/task/:taskId/submit', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { user_id, work, notes } = req.body;

    if (!user_id) {
      return res.status(400).json({ success: false, error: 'user_id is required' });
    }

    // Get task info
    const { rows: taskRows } = await pool.query(`
      SELECT t.*, p.title as project_title
      FROM challenge_tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1
    `, [taskId]);

    if (taskRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    const task = taskRows[0];

    // Generate detailed AI feedback
    let aiFeedback = '';
    try {
      const systemPrompt = `You are an encouraging AI tutor providing detailed feedback on a learning task.
Challenge: "${task.project_title}"
Task: "${task.title}"
Task Type: ${task.task_type}
Description: ${task.description || 'Complete this task'}

The student has submitted their work. Provide:
1. Acknowledgment of their effort (1 sentence)
2. What they did well (1-2 points)
3. Suggestions for improvement (1-2 points if applicable)
4. Encouragement to continue (1 sentence)

Keep the response friendly, specific, and constructive. Maximum 150 words.`;

      const completion = await openai.chat.completions.create({
        model: 'anthropic/claude-3.5-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: work ? `My work:\n${JSON.stringify(work)}${notes ? `\n\nMy notes: ${notes}` : ''}` : 'I completed this task.' }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      aiFeedback = completion.choices[0]?.message?.content || 'Great work completing this task! Keep up the momentum!';
    } catch (aiError) {
      console.error('AI Feedback Error:', aiError.message);
      aiFeedback = `Well done completing "${task.title}"! You're making great progress. Keep up the excellent work and continue to the next task!`;
    }

    // Insert or update completion
    const { rows: completion } = await pool.query(`
      INSERT INTO task_completions (task_id, user_id, ai_feedback, user_answer, completed_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (task_id, user_id) 
      DO UPDATE SET ai_feedback = $3, user_answer = $4, completed_at = NOW()
      RETURNING *
    `, [taskId, user_id, aiFeedback, work ? JSON.stringify({ work, notes }) : null]);

    // Update progress percentage
    const { rows: totalTasks } = await pool.query(`
      SELECT COUNT(*) as total FROM challenge_tasks WHERE project_id = $1
    `, [task.project_id]);

    const { rows: completedTasks } = await pool.query(`
      SELECT COUNT(*) as completed FROM task_completions
      WHERE user_id = $1 AND task_id IN (
        SELECT id FROM challenge_tasks WHERE project_id = $2
      )
    `, [user_id, task.project_id]);

    const total = parseInt(totalTasks[0].total);
    const completed = parseInt(completedTasks[0].completed);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update or insert challenge progress
    await pool.query(`
      INSERT INTO challenge_progress (project_id, user_id, completion_percentage, started_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (project_id, user_id) 
      DO UPDATE SET completion_percentage = $3, 
                    completed_at = CASE WHEN $3 = 100 THEN NOW() ELSE challenge_progress.completed_at END
    `, [task.project_id, user_id, percentage]);

    res.json({
      success: true,
      completion: completion[0],
      aiFeedback,
      progress: { percentage, completed, total }
    });

  } catch (error) {
    console.error('Submit Task Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Payment server running on http://localhost:${PORT}`);
  console.log(`📘 Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID}`);
});

module.exports = app;
