-- Fix RLS policies for skills table
-- Run this in Supabase SQL Editor if you're getting RLS violations

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can create skills" ON skills;
DROP POLICY IF EXISTS "Authenticated users can update skills" ON skills;

-- Recreate INSERT policy with proper configuration
CREATE POLICY "Authenticated users can create skills" 
ON skills 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Recreate UPDATE policy with proper configuration
CREATE POLICY "Authenticated users can update skills" 
ON skills 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'skills';
