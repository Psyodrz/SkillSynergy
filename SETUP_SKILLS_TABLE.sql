-- ============================================
-- COMPLETE SKILLS TABLE SETUP
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Drop existing table if it exists (start fresh)
DROP TABLE IF EXISTS skills CASCADE;

-- Step 2: Create skills table
CREATE TABLE skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Intermediate',
  description TEXT,
  users_count INTEGER DEFAULT 0,
  color TEXT DEFAULT 'text-blue-500'
);

-- Step 3: Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies (with proper permissions)
CREATE POLICY "Anyone can view skills" 
ON skills 
FOR SELECT 
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can create skills" 
ON skills 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills" 
ON skills 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 5: Insert starter skills
INSERT INTO skills (name, category, level, description, color, users_count) VALUES
  ('React', 'Frontend', 'Intermediate', 'A JavaScript library for building user interfaces', 'text-blue-500', 0),
  ('TypeScript', 'Frontend', 'Intermediate', 'Typed superset of JavaScript', 'text-blue-600', 0),
  ('Node.js', 'Backend', 'Intermediate', 'JavaScript runtime for server-side development', 'text-green-500', 0),
  ('Python', 'Backend', 'Beginner', 'High-level programming language', 'text-yellow-500', 0),
  ('UI/UX Design', 'Design', 'Intermediate', 'User interface and experience design', 'text-purple-500', 0),
  ('Machine Learning', 'AI/ML', 'Advanced', 'Algorithms that learn from data', 'text-red-500', 0),
  ('SQL', 'Database', 'Intermediate', 'Structured Query Language for databases', 'text-orange-500', 0),
  ('AWS', 'Cloud', 'Advanced', 'Amazon Web Services cloud platform', 'text-orange-600', 0),
  ('Docker', 'DevOps', 'Intermediate', 'Containerization platform', 'text-blue-400', 0),
  ('GraphQL', 'Backend', 'Intermediate', 'Query language for APIs', 'text-pink-500', 0)
ON CONFLICT (name) DO NOTHING;

-- Step 6: Verify everything worked
SELECT 
  'Table created' AS status,
  COUNT(*) AS skill_count 
FROM skills;

-- Step 7: Check RLS policies
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'skills';

-- ============================================
-- If you see results above, it worked! ✅
-- ============================================
