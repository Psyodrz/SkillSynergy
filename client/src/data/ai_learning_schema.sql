-- ============================================
-- AI-First Learning Experience Database Schema
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PHASE 1: Skill Learning Rooms (Public)
-- ============================================

-- Public messages in skill learning rooms
CREATE TABLE IF NOT EXISTS skill_room_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  sender_name text, -- Cache name for display (in case of deleted users)
  is_ai boolean DEFAULT false,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for efficient querying by skill
CREATE INDEX IF NOT EXISTS idx_skill_room_messages_skill_id ON skill_room_messages(skill_id, created_at DESC);

-- RLS Policies for skill_room_messages
ALTER TABLE skill_room_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can read skill room messages
CREATE POLICY "Anyone can read skill room messages"
  ON skill_room_messages FOR SELECT
  USING (true);

-- Authenticated users can insert messages
CREATE POLICY "Authenticated users can send messages"
  ON skill_room_messages FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- PHASE 2: Personal AI Chat with History
-- ============================================

-- AI Chat Sessions (one per user per skill)
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  skill_name text, -- Cache skill name
  created_at timestamptz DEFAULT now(),
  last_message_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Personal AI chat messages
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_session ON ai_chat_messages(session_id, created_at);

-- RLS Policies for ai_chat_sessions
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat sessions"
  ON ai_chat_sessions FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for ai_chat_messages
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat messages"
  ON ai_chat_messages FOR ALL
  USING (
    session_id IN (
      SELECT id FROM ai_chat_sessions WHERE user_id = auth.uid()
    )
  );

-- ============================================
-- PHASE 5: Learning Challenges Enhancement
-- ============================================

-- Add learning structure to projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS learning_objectives jsonb DEFAULT '[]';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration_weeks int DEFAULT 4;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'Beginner';

-- Challenge milestones
CREATE TABLE IF NOT EXISTS challenge_milestones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Challenge tasks within milestones
CREATE TABLE IF NOT EXISTS challenge_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES challenge_milestones(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  task_type text DEFAULT 'exercise' CHECK (task_type IN ('reading', 'exercise', 'quiz', 'project')),
  content jsonb DEFAULT '{}', -- Task content, questions, etc.
  order_index int NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS challenge_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  current_milestone_id uuid REFERENCES challenge_milestones(id),
  completion_percentage int DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(project_id, user_id)
);

-- Task completions
CREATE TABLE IF NOT EXISTS task_completions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid REFERENCES challenge_tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
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

-- RLS Policies
ALTER TABLE challenge_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_completions ENABLE ROW LEVEL SECURITY;

-- Public read for milestones and tasks
CREATE POLICY "Anyone can read milestones" ON challenge_milestones FOR SELECT USING (true);
CREATE POLICY "Anyone can read tasks" ON challenge_tasks FOR SELECT USING (true);

-- Users manage their own progress
CREATE POLICY "Users manage own progress" ON challenge_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own completions" ON task_completions FOR ALL USING (auth.uid() = user_id);

-- Project owners can manage milestones/tasks
CREATE POLICY "Owners manage milestones" ON challenge_milestones FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()));
CREATE POLICY "Owners manage tasks" ON challenge_tasks FOR ALL
  USING (project_id IN (SELECT id FROM projects WHERE owner_id = auth.uid()));
