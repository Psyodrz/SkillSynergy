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

-- Skill Room Messages (Public Chat)
CREATE TABLE IF NOT EXISTS skill_room_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  skill_id UUID NOT NULL REFERENCES skills(id),
  user_id UUID REFERENCES profiles(id), -- Can be null for system/AI messages
  user_name TEXT,
  user_avatar TEXT,
  content TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'user', 'ai', 'system'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE skill_room_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (or restrict write to auth/members)
DROP POLICY IF EXISTS "Public read/write messages" ON skill_room_messages;
CREATE POLICY "Public read/write messages" ON skill_room_messages FOR ALL USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_messages_skill_id ON skill_room_messages(skill_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON skill_room_messages(created_at);
