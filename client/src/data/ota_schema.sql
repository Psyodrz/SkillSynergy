-- OTA Updates Table
CREATE TABLE IF NOT EXISTS app_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version TEXT NOT NULL UNIQUE, -- e.g. "1.0.2"
  url TEXT NOT NULL,            -- e.g. "https://github.com/Aditya/SkillSynergy/releases/download/v1.0.2/update.zip"
  notes TEXT,                   -- Release notes
  released_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true 
);

-- RLS Policies (Public Read, Admin Write)
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active versions" ON app_versions;

CREATE POLICY "Public can read active versions" 
ON app_versions FOR SELECT 
USING (is_active = true);

-- Insert initial version (placeholder)
INSERT INTO app_versions (version, url, notes)
VALUES ('0.0.0', '', 'Initial Release')
ON CONFLICT (version) DO NOTHING;
