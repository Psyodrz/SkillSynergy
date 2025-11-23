# Database Setup Instructions

## ⚠️ Required: Run Database Migration

If you're seeing errors about the `projects` table not existing, you need to run the SQL migration script to create the necessary database tables.

## Steps to Create the Projects Table:

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open your Supabase Dashboard**

   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**

   - Click on "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Copy and Run the Migration Script**

   - Open the file: `update_schema.sql` in the root of your project
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" button

4. **Verify Success**
   - You should see a success message
   - Check the "Table Editor" to confirm the `projects` table now exists

### Method 2: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push
```

## What the Migration Creates:

The `update_schema.sql` script creates:

✅ **projects table** with columns:

- id (UUID, primary key)
- created_at (timestamp)
- updated_at (timestamp)
- title (text)
- description (text)
- status (text)
- owner_id (UUID, references auth.users)
- collaborators (JSONB array)
- tags (text array)
- image_url (text)

✅ **Row Level Security (RLS) policies**:

- Everyone can view all projects
- Users can create their own projects
- Users can update their own projects
- Users can delete their own projects

✅ **messages table** (for the messaging feature)

## After Running the Migration:

1. Refresh your application
2. You should no longer see database errors
3. You can start creating projects!

## Troubleshooting:

**Error: "relation does not exist"**

- This means the migration hasn't been run yet
- Follow Method 1 above

**Error: "permission denied"**

- Check that your Supabase connection credentials are correct in `.env`
- Verify you're logged into the correct Supabase project

**Still having issues?**

- Check the browser console for detailed error messages
- Verify your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in `.env`
