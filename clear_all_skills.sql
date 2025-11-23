-- Remove all starter/preset skills from the database
-- Run this in Supabase SQL Editor

DELETE FROM skills;

-- Verify they're gone
SELECT COUNT(*) as remaining_skills FROM skills;

-- This should return: remaining_skills: 0
