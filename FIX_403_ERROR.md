# 🚨 FIXING 403 FORBIDDEN ERROR

## Problem

You're seeing `403 Forbidden` errors when trying to access the skills table. This means:

- The `skills` table might not exist yet
- OR the RLS policies are blocking access

## ✅ SOLUTION - Run This Now

### Step 1: Open Supabase SQL Editor

1. Go to https://app.supabase.com
2. Select your SkillSynergy project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"+ New Query"**

### Step 2: Run the Complete Setup Script

**Copy and paste this ENTIRE script:**

```sql
-- Drop and recreate skills table with proper RLS
DROP TABLE IF EXISTS skills CASCADE;

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

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Allow EVERYONE (including anonymous) to view skills
CREATE POLICY "Anyone can view skills"
ON skills FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated users to create skills
CREATE POLICY "Authenticated users can create skills"
ON skills FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update skills
CREATE POLICY "Authenticated users can update skills"
ON skills FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert starter skills
INSERT INTO skills (name, category, level, description, color) VALUES
  ('React', 'Frontend', 'Intermediate', 'A JavaScript library for building user interfaces', 'text-blue-500'),
  ('TypeScript', 'Frontend', 'Intermediate', 'Typed superset of JavaScript', 'text-blue-600'),
  ('Node.js', 'Backend', 'Intermediate', 'JavaScript runtime for server-side development', 'text-green-500'),
  ('Python', 'Backend', 'Beginner', 'High-level programming language', 'text-yellow-500'),
  ('UI/UX Design', 'Design', 'Intermediate', 'User interface and experience design', 'text-purple-500'),
  ('Machine Learning', 'AI/ML', 'Advanced', 'Algorithms that learn from data', 'text-red-500'),
  ('SQL', 'Database', 'Intermediate', 'Structured Query Language for databases', 'text-orange-500'),
  ('AWS', 'Cloud', 'Advanced', 'Amazon Web Services cloud platform', 'text-orange-600');

-- Verify it worked
SELECT COUNT(*) AS total_skills FROM skills;
```

### Step 3: Verify Success

After running the script, you should see:

- ✅ "Success. 8 rows returned" or similar
- ✅ Table shows `total_skills: 8`

### Step 4: Check in Table Editor

1. Go to **Table Editor** (left sidebar)
2. Click on **skills** table
3. You should see 8 rows with React, TypeScript, Node.js, etc.

### Step 5: Test Your App

1. **Refresh your browser** (where SkillSynergy is running)
2. Go to **Discover** page
3. You should now see the 8 skills!
4. Try creating a new skill - should work now ✅

---

## 🔍 What Was Wrong

The key issue was the SELECT policy. It needs to allow BOTH:

- `anon` - Unauthenticated users
- `authenticated` - Logged-in users

The original policy might have been missing the `TO anon, authenticated` part, causing 403 errors.

---

## 🎯 Quick Checklist

- [ ] Ran the SQL script above in Supabase
- [ ] Saw "Success" message
- [ ] Table Editor shows 8 skills
- [ ] Refreshed browser
- [ ] Discover page shows skills
- [ ] Can create new skills

---

## 🆘 Still Not Working?

If you still see 403 errors:

1. **Check RLS Policies:**

   - Go to Supabase → Authentication → Policies
   - Click on `skills` table
   - Should see 3 policies: 1 SELECT (for anon + authenticated), 1 INSERT, 1 UPDATE

2. **Check API Keys:**

   - Your `.env` file should have correct `VITE_SUPABASE_ANON_KEY`
   - Restart dev server after changing `.env`

3. **Check Console for Details:**
   - Open browser DevTools → Console
   - Look for the exact error message
   - Share it with me for further help

---

## ✅ Expected Result

After running the fix:

- Discover page loads with 8 skills visible
- Can filter by category (Frontend, Backend, Design, etc.)
- Can filter by level (Beginner, Intermediate, Advanced)
- Can search for skills
- Can create new skills
- NO 403 errors in console
