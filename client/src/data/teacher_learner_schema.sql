-- ==========================================
-- TEACHER/LEARNER SYSTEM SCHEMA MIGRATION
-- ==========================================

-- Enable pgvector if not already enabled
create extension if not exists vector;

-- Add teacher/learner columns to profiles table
alter table profiles add column if not exists onboarding_completed boolean default false;
alter table profiles add column if not exists headline text;
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists languages text[];
alter table profiles add column if not exists timezone text;
alter table profiles add column if not exists experience_years int;
alter table profiles add column if not exists qualification text;
alter table profiles add column if not exists teaching_modes text[];
alter table profiles add column if not exists hourly_rate numeric(10,2);
alter table profiles add column if not exists learning_goals text;
alter table profiles add column if not exists learning_modes text[];
alter table profiles add column if not exists interests text;
alter table profiles add column if not exists interests_embedding vector(1536);

-- Add embedding to skills table (if not exists from earlier migration)
alter table skills add column if not exists embedding vector(1536);

-- Add embedding to projects table (if not exists from earlier migration)
alter table projects add column if not exists embedding vector(1536);

-- Ensure user_skills has a level column for skill proficiency
-- This will be used for both teachers (what level they can teach) and learners (current level)
alter table user_skills add column if not exists skill_level text default 'intermediate';

-- Create indexes for vector similarity searches
create index if not exists profiles_interests_embedding_idx on profiles using ivfflat (interests_embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists skills_embedding_idx on skills using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists projects_embedding_idx on projects using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Create index on profiles role for faster teacher queries
create index if not exists profiles_role_idx on profiles(role);

-- Add constraint to ensure role values are valid
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'profiles_role_check'
  ) then
    alter table profiles add constraint profiles_role_check 
      check (role in ('learner', 'teacher', 'both', null));
  end if;
end $$;

-- Update existing null roles to 'learner' as default
update profiles set role = 'learner' where role is null;

-- ==========================================
-- HELPER FUNCTION: Calculate Teacher Match Score
-- ==========================================

create or replace function calculate_teacher_match_score(
  teacher_id uuid,
  query_embedding vector(1536)
)
returns table (
  profile_id uuid,
  full_name text,
  avatar_url text,
  headline text,
  bio text,
  languages text[],
  experience_years int,
  qualification text,
  teaching_modes text[],
  similarity float,
  matching_skills jsonb
)
language plpgsql
as $$
begin
  return query
  select 
    p.id as profile_id,
    p.full_name,
    p.avatar_url,
    p.headline,
    p.bio,
    p.languages,
    p.experience_years,
    p.qualification,
    p.teaching_modes,
    -- Calculate similarity using cosine distance
    case 
      when p.interests_embedding is not null then
        (1 - (p.interests_embedding <=> query_embedding))::float
      else 0.5::float -- Default score if no embedding
    end as similarity,
    -- Get top 3 matching skills for this teacher
    (
      select jsonb_agg(
        jsonb_build_object(
          'name', s.name,
          'level', us.skill_level,
          'category', s.category
        )
      )
      from user_skills us
      join skills s on us.skill_id = s.id
      where us.user_id = p.id
      limit 3
    ) as matching_skills
  from profiles p
  where p.id = teacher_id
    and p.role in ('teacher', 'both');
end;
$$;

-- ==========================================
-- RLS POLICIES (if needed)
-- ==========================================

-- Ensure profiles are still viewable by everyone
-- (already exists but ensuring it's there)
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- Users can update their own profile
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );
