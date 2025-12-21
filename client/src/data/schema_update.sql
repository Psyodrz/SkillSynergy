-- ============================================
-- PHASE 6: Image Generation Tracking
-- ============================================

-- Create generated_images table
CREATE TABLE IF NOT EXISTS generated_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  prompt text NOT NULL,
  context text NOT NULL, -- e.g., 'skill_thumbnail', 'avatar'
  generated_by text DEFAULT 'SYSTEM', -- 'USER' or 'SYSTEM'
  status text NOT NULL CHECK (status IN ('PENDING', 'GENERATING', 'READY', 'FAILED')),
  image_url text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Add index for status polling
CREATE INDEX IF NOT EXISTS idx_generated_images_status ON generated_images(status);
CREATE INDEX IF NOT EXISTS idx_generated_images_user ON generated_images(user_id);

-- Update skills table to track current thumbnail status
ALTER TABLE skills ADD COLUMN IF NOT EXISTS thumbnail_status text DEFAULT 'PENDING';
ALTER TABLE skills ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Add constraint for valid statuses
ALTER TABLE skills DROP CONSTRAINT IF EXISTS check_thumbnail_status;
ALTER TABLE skills ADD CONSTRAINT check_thumbnail_status 
  CHECK (thumbnail_status IN ('PENDING', 'GENERATING', 'READY', 'FAILED'));
