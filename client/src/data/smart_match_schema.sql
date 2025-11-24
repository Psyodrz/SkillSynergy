-- Enable pgvector extension
create extension if not exists vector;

-- Add embedding column to skills
alter table skills add column if not exists embedding vector(1536);

-- Add embedding column to projects
alter table projects add column if not exists embedding vector(1536);

-- Add interests and embedding columns to profiles
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists interests text; -- For storing raw text of interests
alter table profiles add column if not exists interests_embedding vector(1536);

-- Create indexes for faster similarity search (IVFFlat is good for larger datasets, HNSW is better but IVFFlat is standard in Supabase examples)
-- Note: You might need to drop these indexes before bulk loading if you have a lot of data, then recreate them.
-- Also, for small datasets (< 2000 rows), indexes might not be used by Postgres, but good to have.

create index if not exists skills_embedding_idx on skills using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists projects_embedding_idx on projects using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists profiles_interests_embedding_idx on profiles using ivfflat (interests_embedding vector_cosine_ops)
  with (lists = 100);
