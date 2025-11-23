-- ============================================================================
-- FIX PROFILE SCHEMA
-- ============================================================================
-- Run this script in the Supabase SQL Editor to fix the missing columns issue.
-- ============================================================================

-- 1. Add 'skills' column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;

-- 2. Add 'experience' column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS experience JSONB DEFAULT '[]'::jsonb;

-- 3. Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';
