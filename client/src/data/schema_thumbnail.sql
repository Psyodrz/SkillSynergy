-- Skill Thumbnail Schema Update
-- Adds a thumbnail column to store the static thumbnail path

-- Add thumbnail column if it doesn't exist
ALTER TABLE skills ADD COLUMN IF NOT EXISTS thumbnail TEXT;

-- Create index for fast lookups (optional, but good for performance)
CREATE INDEX IF NOT EXISTS idx_skills_thumbnail ON skills(thumbnail) WHERE thumbnail IS NOT NULL;

-- Comment for documentation
COMMENT ON COLUMN skills.thumbnail IS 'Static thumbnail path in format: slug/filename (e.g., tech/tech_1.png)';
