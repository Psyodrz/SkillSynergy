-- Add missing columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS max_members INTEGER DEFAULT 10;

-- Create mentorship_requests table
CREATE TABLE IF NOT EXISTS mentorship_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  learner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed'))
);

-- Enable RLS on mentorship_requests
ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Policies for mentorship_requests
DROP POLICY IF EXISTS "Users can view their own requests" ON mentorship_requests;
CREATE POLICY "Users can view their own requests" 
ON mentorship_requests FOR SELECT 
USING (auth.uid() = learner_id OR auth.uid() = instructor_id);

DROP POLICY IF EXISTS "Users can create requests" ON mentorship_requests;
CREATE POLICY "Users can create requests" 
ON mentorship_requests FOR INSERT 
WITH CHECK (auth.uid() = learner_id);

DROP POLICY IF EXISTS "Users can update their own requests" ON mentorship_requests;
CREATE POLICY "Users can update their own requests" 
ON mentorship_requests FOR UPDATE 
USING (auth.uid() = learner_id OR auth.uid() = instructor_id);


-- Create project_members table
CREATE TABLE IF NOT EXISTS project_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  UNIQUE(project_id, user_id)
);

-- Enable RLS on project_members
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Policies for project_members
DROP POLICY IF EXISTS "Project members are viewable by everyone" ON project_members;
CREATE POLICY "Project members are viewable by everyone" 
ON project_members FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can join public projects" ON project_members;
CREATE POLICY "Users can join public projects" 
ON project_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave projects" ON project_members;
CREATE POLICY "Users can leave projects" 
ON project_members FOR DELETE 
USING (auth.uid() = user_id);
