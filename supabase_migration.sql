-- 1. Add the email column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. COPY EMAILS from the secure Auth system to your Public Profiles
-- This will instantly fix the "N/A" emails in your Admin Panel
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.id = auth.users.id;

-- 3. (Optional) Standardize Roles
-- Convert old "New User" roles to "Learner" so your charts look better
UPDATE public.profiles
SET role = 'Learner'
WHERE role = 'New User';

-- 4. Verify the results
SELECT id, full_name, email, role FROM public.profiles LIMIT 10;
