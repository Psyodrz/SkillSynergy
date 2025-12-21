-- Drop table if exists to ensure clean slate as per strict requirements (or just create if not exists, but user implied unified table)
DROP TABLE IF EXISTS generated_images CASCADE;

CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT CHECK (entity_type IN ('SKILL', 'TUTOR', 'USER_REQUEST')),
  entity_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  generated_by TEXT CHECK (generated_by IN ('SYSTEM', 'USER')),
  status TEXT CHECK (status IN ('PENDING', 'GENERATING', 'READY', 'FAILED')) DEFAULT 'PENDING',
  image_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP
);

-- Unique index to prevent duplicates for same entity
CREATE UNIQUE INDEX idx_generated_images_entity ON generated_images(entity_type, entity_id);
