const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});

const sql = `
-- Skill Room Messages
CREATE TABLE IF NOT EXISTS skill_room_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid,
  sender_id uuid,
  sender_name text,
  is_ai boolean DEFAULT false,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skill_room_messages_skill_id 
ON skill_room_messages(skill_id, created_at DESC);

-- AI Chat Sessions
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  skill_id uuid,
  skill_name text,
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- AI Chat Messages
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session ON ai_chat_messages(session_id, created_at);

-- Challenge Milestones
CREATE TABLE IF NOT EXISTS challenge_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid,
  title text NOT NULL,
  description text,
  order_index int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Challenge Tasks
CREATE TABLE IF NOT EXISTS challenge_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid,
  milestone_id uuid REFERENCES challenge_milestones(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  task_type text DEFAULT 'exercise',
  content jsonb DEFAULT '{}',
  order_index int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Challenge Progress
CREATE TABLE IF NOT EXISTS challenge_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid,
  user_id uuid,
  current_milestone_id uuid,
  completion_percentage int DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(project_id, user_id)
);

-- Task Completions
CREATE TABLE IF NOT EXISTS task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES challenge_tasks(id) ON DELETE CASCADE,
  user_id uuid,
  completed_at timestamptz DEFAULT now(),
  ai_feedback text,
  user_answer jsonb,
  UNIQUE(task_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_challenge_milestones_project ON challenge_milestones(project_id, order_index);
CREATE INDEX IF NOT EXISTS idx_challenge_tasks_milestone ON challenge_tasks(milestone_id, order_index);
CREATE INDEX IF NOT EXISTS idx_challenge_progress_user ON challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_task_completions_user ON task_completions(user_id);
`;

async function migrate() {
  try {
    console.log('Running database migration...');
    await pool.query(sql);
    console.log('✅ All tables created successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    await pool.end();
  }
}

migrate();
