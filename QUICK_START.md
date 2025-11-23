# ⚡ Quick Start - Supabase Auth Setup

## 🎯 Steps to Complete the Integration

### Step 1: Run the SQL Schema in Supabase

1. Open your Supabase project dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"+ New query"**
4. Copy the entire contents of `supabase_schema.sql`
5. Paste it into the SQL editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

This creates:

- ✅ `profiles` table
- ✅ Row Level Security policies
- ✅ Auto-create profile trigger

### Step 2: Restart the Development Server

The dev server needs to be restarted to pick up the new `.env` file.

**In your terminal where `npm run dev` is running:**

1. Press `Ctrl+C` to stop the server
2. Run `npm run dev` again
3. The server should start on `http://localhost:5173`

### Step 3: Test the Integration

1. Open `http://localhost:5173/login` in your browser
2. Click the **"Sign Up"** tab
3. Enter a test email and password (e.g., `test@example.com` / `password123`)
4. Click **"Create Account"**
5. You should be redirected to `/dashboard`
6. Check the **Navbar** and **Sidebar** - your name should appear!

### Step 4: Verify in Supabase Dashboard

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. You should see your newly created user
3. Go to **Table Editor** → **profiles**
4. You should see your profile with the full_name and role

---

## ✅ That's It!

You now have real authentication! 🎉

### What Changed?

- ❌ No more fake "John Doe" demo user
- ✅ Real user registration and login
- ✅ Real password validation
- ✅ Session persistence (stays logged in after page refresh)
- ✅ User profiles stored in PostgreSQL

### Troubleshooting

If you encounter any issues, check:

- `SUPABASE_AUTH_GUIDE.md` - Complete documentation
- `AUTH_MIGRATION_SUMMARY.md` - What changed in each file
- Browser console for error messages

### Next Steps

See `SUPABASE_AUTH_GUIDE.md` section "Next Steps / Optional Enhancements" for:

- Profile editing
- Avatar uploads
- Password reset
- Social auth (Google, GitHub)
- Email verification
