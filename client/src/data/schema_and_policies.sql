-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABLE DEFINITIONS
-- ==========================================

-- PROFILES
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SKILLS
create table if not exists skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  level text not null,
  description text,
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER_SKILLS
create table if not exists user_skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  skill_id uuid references skills(id) not null,
  level_override text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, skill_id)
);

-- PROJECTS
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add columns to PROJECTS if they don't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'status') then
    alter table projects add column status text default 'active';
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'max_members') then
    alter table projects add column max_members int default 5;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'visibility') then
    alter table projects add column visibility text default 'public';
  end if;

  -- New columns for richer project data
  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'category') then
    alter table projects add column category text;
  end if;

  if not exists (select 1 from information_schema.columns where table_name = 'projects' and column_name = 'difficulty') then
    alter table projects add column difficulty text;
  end if;

  -- Add created_by to SKILLS if it doesn't exist
  if not exists (select 1 from information_schema.columns where table_name = 'skills' and column_name = 'created_by') then
    alter table skills add column created_by uuid references profiles(id);
  end if;
end $$;

-- PROJECT_MEMBERS
create table if not exists project_members (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references profiles(id) not null,
  role text default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, user_id)
);

-- PROJECT_SKILLS (New Join Table)
create table if not exists project_skills (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  skill_id uuid references skills(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, skill_id)
);

-- ==========================================
-- 2. ROW LEVEL SECURITY & POLICIES
-- ==========================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table skills enable row level security;
alter table user_skills enable row level security;
alter table projects enable row level security;
alter table project_members enable row level security;
alter table project_skills enable row level security;

-- --- PROFILES POLICIES ---
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

drop policy if exists "Users can insert their own profile" on profiles;
create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- --- SKILLS POLICIES ---
drop policy if exists "Skills are viewable by everyone" on skills;
create policy "Skills are viewable by everyone"
  on skills for select
  using ( true );

-- Allow authenticated users to insert new skills (Global Catalog)
drop policy if exists "Authenticated users can insert skills" on skills;
create policy "Authenticated users can insert skills"
  on skills for insert
  with check ( auth.role() = 'authenticated' );

-- Allow users to delete their own skills
drop policy if exists "Users can delete their own skills" on skills;
create policy "Users can delete their own skills"
  on skills for delete
  using ( auth.uid() = created_by );

-- --- USER_SKILLS POLICIES ---
drop policy if exists "Users can see their own skills" on user_skills;
create policy "Users can see their own skills"
  on user_skills for select
  using ( auth.uid() = user_id );

drop policy if exists "Public can view user skills" on user_skills;
create policy "Public can view user skills"
  on user_skills for select
  using ( true );

drop policy if exists "Users can insert their own skills" on user_skills;
create policy "Users can insert their own skills"
  on user_skills for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update their own skills" on user_skills;
create policy "Users can update their own skills"
  on user_skills for update
  using ( auth.uid() = user_id );

drop policy if exists "Users can delete their own skills" on user_skills;
create policy "Users can delete their own skills"
  on user_skills for delete
  using ( auth.uid() = user_id );

-- --- PROJECTS POLICIES ---
drop policy if exists "Public projects are viewable by everyone" on projects;
create policy "Public projects are viewable by everyone"
  on projects for select
  using ( visibility = 'public' );

drop policy if exists "Private projects are viewable by owner and members" on projects;
create policy "Private projects are viewable by owner and members"
  on projects for select
  using (
    auth.uid() = owner_id or
    exists (
      select 1 from project_members
      where project_members.project_id = projects.id
      and project_members.user_id = auth.uid()
    )
  );

drop policy if exists "Authenticated users can create projects" on projects;
create policy "Authenticated users can create projects"
  on projects for insert
  with check ( auth.uid() = owner_id );

drop policy if exists "Owners can update their projects" on projects;
create policy "Owners can update their projects"
  on projects for update
  using ( auth.uid() = owner_id );

drop policy if exists "Owners can delete their projects" on projects;
create policy "Owners can delete their projects"
  on projects for delete
  using ( auth.uid() = owner_id );

-- --- PROJECT_MEMBERS POLICIES ---
drop policy if exists "Project members are viewable by everyone" on project_members;
create policy "Project members are viewable by everyone"
  on project_members for select
  using ( true );

drop policy if exists "Users can join public projects" on project_members;
create policy "Users can join public projects"
  on project_members for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from projects
      where projects.id = project_id
      and projects.visibility = 'public'
    )
  );

drop policy if exists "Owners can add members" on project_members;
create policy "Owners can add members"
  on project_members for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = project_id
      and projects.owner_id = auth.uid()
    )
  );

drop policy if exists "Users can leave projects" on project_members;
create policy "Users can leave projects"
  on project_members for delete
  using ( auth.uid() = user_id );

drop policy if exists "Owners can remove members" on project_members;
create policy "Owners can remove members"
  on project_members for delete
  using (
    exists (
      select 1 from projects
      where projects.id = project_id
      and projects.owner_id = auth.uid()
    )
  );

-- --- PROJECT_SKILLS POLICIES ---
drop policy if exists "Project skills are viewable by everyone" on project_skills;
create policy "Project skills are viewable by everyone"
  on project_skills for select
  using ( true );

drop policy if exists "Owners can add skills to projects" on project_skills;
create policy "Owners can add skills to projects"
  on project_skills for insert
  with check (
    exists (
      select 1 from projects
      where projects.id = project_id
      and projects.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can remove skills from projects" on project_skills;
create policy "Owners can remove skills from projects"
  on project_skills for delete
  using (
    exists (
      select 1 from projects
      where projects.id = project_id
      and projects.owner_id = auth.uid()
    )
  );
