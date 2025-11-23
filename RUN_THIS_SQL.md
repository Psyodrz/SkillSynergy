# 🚨 CRITICAL: Run This SQL to Enable New Features

To make the **Profile Editing**, **User Discovery**, and **Projects** features work, you must update your Supabase database schema.

## 1. Open Supabase SQL Editor

Go to your Supabase Dashboard -> SQL Editor -> New Query.

## 2. Copy & Paste This SQL

Copy the entire block below and run it.

```sql
-- 1. Add rich profile fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb;

-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  status TEXT DEFAULT 'Active',
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  members_count INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 5,
  skills JSONB DEFAULT '[]'::jsonb,
  deadline DATE,
  progress INTEGER DEFAULT 0,
  image_url TEXT
);

-- 3. Enable Security for Projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 4. Projects Policies
-- Everyone can view projects
CREATE POLICY "Projects are viewable by everyone"
ON projects FOR SELECT
USING (true);

-- Authenticated users can create projects
CREATE POLICY "Users can insert their own projects"
ON projects FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Project owners can update their projects
CREATE POLICY "Users can update their own projects"
ON projects FOR UPDATE
USING (auth.uid() = owner_id);

-- Project owners can delete their projects
CREATE POLICY "Users can delete their own projects"
ON projects FOR DELETE
USING (auth.uid() = owner_id);

-- 5. Create Messages Table (for future use)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
ON messages FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);
```

## 3. Verify

After running this, go to your app:

1.  **Profile Page**: Try adding a bio and some skills. It should save!
2.  **Discover Page**: You should see other users (create a second account to test this!).
