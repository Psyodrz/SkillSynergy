-- ============================================
-- Image Generation System Schema
-- ============================================

-- 1. Extend Skills Table
-- Track thumbnail status directly on the skill to avoid joins for simple display
ALTER TABLE skills 
ADD COLUMN IF NOT EXISTS thumbnail_url text,
ADD COLUMN IF NOT EXISTS thumbnail_status text DEFAULT 'PENDING' CHECK (thumbnail_status IN ('PENDING', 'GENERATING', 'READY', 'FAILED'));

-- 2. User/System Generated Images Table
-- Central store for all async generated images (chat diagrams, user requests, etc.)
CREATE TABLE IF NOT EXISTS generated_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL, -- Null if system generated
  prompt text NOT NULL,
  context text, -- e.g., 'skill_explanation', 'chat_diagram', 'user_request'
  generated_by text DEFAULT 'system' CHECK (generated_by IN ('USER', 'SYSTEM')),
  image_url text,
  status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'GENERATING', 'READY', 'FAILED')),
  error_message text,
  metadata jsonb DEFAULT '{}', -- Store model used, params, seed, etc.
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Index for fast status checks
CREATE INDEX IF NOT EXISTS idx_generated_images_user ON generated_images(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_status ON generated_images(status);

-- RLS Policies
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

-- Users can view their own images (and all system images? Maybe restricting for now)
CREATE POLICY "Users can view own images"
  ON generated_images FOR SELECT
  USING (user_id = auth.uid() OR generated_by = 'SYSTEM');

-- Users can create images (via API)
CREATE POLICY "Users can insert own images"
  ON generated_images FOR INSERT
  WITH CHECK (user_id = auth.uid());
