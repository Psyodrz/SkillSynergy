const { Pool } = require('pg');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const EMBEDDING_MODEL = "openai/text-embedding-3-small";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function generateEmbedding(text) {
  if (!text) return null;
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text.replace(/\n/g, ' '),
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

async function processSkills() {
  console.log('Processing Skills...');
  const { rows } = await pool.query('SELECT id, name, category, description FROM skills WHERE embedding IS NULL');
  console.log(`Found ${rows.length} skills to process.`);

  for (const skill of rows) {
    const text = `Skill: ${skill.name}. Category: ${skill.category}. Description: ${skill.description || ''}`;
    const embedding = await generateEmbedding(text);
    if (embedding) {
      await pool.query('UPDATE skills SET embedding = $1 WHERE id = $2', [JSON.stringify(embedding), skill.id]);
      console.log(`Updated skill: ${skill.name}`);
    }
  }
}

async function processProjects() {
  console.log('Processing Projects...');
  const { rows } = await pool.query('SELECT id, title, description, category FROM projects WHERE embedding IS NULL');
  console.log(`Found ${rows.length} projects to process.`);

  for (const project of rows) {
    const text = `Project: ${project.title}. Category: ${project.category || 'General'}. Description: ${project.description || ''}`;
    const embedding = await generateEmbedding(text);
    if (embedding) {
      await pool.query('UPDATE projects SET embedding = $1 WHERE id = $2', [JSON.stringify(embedding), project.id]);
      console.log(`Updated project: ${project.title}`);
    }
  }
}

async function processProfiles() {
  console.log('Processing Profiles...');
  const { rows } = await pool.query('SELECT id, full_name, role, bio, interests FROM profiles WHERE interests_embedding IS NULL');
  console.log(`Found ${rows.length} profiles to process.`);

  for (const profile of rows) {
    const text = `User: ${profile.full_name}. Role: ${profile.role || 'Member'}. Bio: ${profile.bio || ''}. Interests: ${profile.interests || ''}`;
    const embedding = await generateEmbedding(text);
    if (embedding) {
      await pool.query('UPDATE profiles SET interests_embedding = $1 WHERE id = $2', [JSON.stringify(embedding), profile.id]);
      console.log(`Updated profile: ${profile.full_name}`);
    }
  }
}

async function main() {
  try {
    await processSkills();
    await processProjects();
    await processProfiles();
    console.log('Done!');
  } catch (error) {
    console.error('Script error:', error);
  } finally {
    await pool.end();
  }
}

main();
