-- 1. Enable Row Level Security (RLS) on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. DROP existing policies to avoid conflicts (clean slate)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 3. Allow ALL logged-in users (Admins & Users) to VIEW all profiles
-- This fixes the "0 Users" bug in the Admin Panel
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING ( auth.role() = 'authenticated' );

-- 4. Allow users to INSERT their own profile (Critical for Signup)
CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK ( auth.uid() = id );

-- 5. Allow users to UPDATE their OWN profile only
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING ( auth.uid() = id );
