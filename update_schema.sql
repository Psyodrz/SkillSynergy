-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb;

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Intermediate',
  description TEXT,
  users_count INTEGER DEFAULT 0,
  color TEXT DEFAULT 'text-blue-500'
);

-- Enable RLS on skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Skills policies
CREATE POLICY "Skills are viewable by everyone" 
ON skills FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create skills" 
ON skills FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills" 
ON skills FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  collaborators JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT
);

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Projects are viewable by everyone" 
ON projects FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own projects" 
ON projects FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects" 
ON projects FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own projects" 
ON projects FOR DELETE 
USING (auth.uid() = owner_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view their own messages (sent or received)" 
ON messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
ON messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- Insert some initial skills (optional starter data)
INSERT INTO skills (name, category, level, description, color, users_count) VALUES
  ('React', 'Frontend', 'Intermediate', 'A JavaScript library for building user interfaces', 'text-blue-500', 0),
  ('TypeScript', 'Frontend', 'Intermediate', 'Typed superset of JavaScript', 'text-blue-600', 0),
  ('Node.js', 'Backend', 'Intermediate', 'JavaScript runtime for server-side development', 'text-green-500', 0),
  ('Python', 'Backend', 'Beginner', 'High-level programming language', 'text-yellow-500', 0),
  ('UI/UX Design', 'Design', 'Intermediate', 'User interface and experience design', 'text-purple-500', 0),
  ('Machine Learning', 'AI/ML', 'Advanced', 'Algorithms that learn from data', 'text-red-500', 0),
  ('SQL', 'Database', 'Intermediate', 'Structured Query Language for databases', 'text-orange-500', 0),
  ('AWS', 'Cloud', 'Advanced', 'Amazon Web Services cloud platform', 'text-orange-600', 0)
ON CONFLICT (name) DO NOTHING;
