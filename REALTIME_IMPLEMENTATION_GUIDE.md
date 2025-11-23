# 🔄 Realtime Features Implementation Guide

## Overview

Your SkillSynergy platform now has **4 powerful realtime hooks** that enable multi-user collaboration without page refreshes:

1. **`useDirectMessages`** - Realtime chat
2. **`useProjects`** - Realtime project updates
3. **`usePresence`** - Online/offline status
4. **`useProfiles`** - Realtime profile updates

---

## ✅ Created Hooks

### 1. `client/src/hooks/useDirectMessages.ts`

**Purpose:** Realtime chat between two users

**Usage:**

```typescript
import { useDirectMessages } from "../hooks/useDirectMessages";

const { messages, loading, sendMessage, markAsRead } = useDirectMessages(
  currentUserId,
  otherUserId
);
```

**Features:**

- ✅ Fetches initial conversation
- ✅ Subscribes to new messages (INSERT)
- ✅ Updates when messages are read (UPDATE)
- ✅ Send messages
- ✅ Mark messages as read
- ✅ Auto-cleanup on unmount

---

### 2. `client/src/hooks/useProjects.ts`

**Purpose:** Realtime project list with filtering

**Usage:**

```typescript
import { useProjects } from "../hooks/useProjects";

// For "My Projects"
const { projects, loading, createProject, updateProject, deleteProject } =
  useProjects({
    ownerOnly: true,
    ownerId: currentUserId,
  });

// For "All Projects" (Discover)
const { projects, loading } = useProjects({
  ownerOnly: false,
});
```

**Features:**

- ✅ Fetches projects with filters
- ✅ Realtime INSERT (new projects appear instantly)
- ✅ Realtime UPDATE (project changes appear instantly)
- ✅ Realtime DELETE (deleted projects disappear instantly)
- ✅ CRUD operations included
- ✅ Smart filtering (only shows projects matching your filters)

---

### 3. `client/src/hooks/usePresence.ts`

**Purpose:** Track who's online in realtime

**Usage:**

```typescript
import { usePresence } from "../hooks/usePresence";
import { useAuth } from "../context/AuthContext";

const { user } = useAuth();
const { onlineUsers, isOnline } = usePresence(user?.id, {
  full_name: user?.name,
  avatar_url: user?.avatar_url,
});

// Check if specific user is online
{
  isOnline(someUserId) && <span className="online-indicator" />;
}
```

**Features:**

- ✅ Broadcasts your presence when logged in
- ✅ Shows list of all online users
- ✅ Helper function `isOnline(userId)`
- ✅ Automatically untracks on logout/unmount

---

### 4. `client/src/hooks/useProfiles.ts`

**Purpose:** Realtime profile updates across the platform

**Usage:**

```typescript
import { useProfiles } from "../hooks/useProfiles";

const { profiles, loading } = useProfiles();
```

**Features:**

- ✅ Fetches all profiles
- ✅ Real time INSERT (new users appear)
- ✅ Realtime UPDATE (profile changes appear)

---

## 🔧 How to Integrate Into Your Pages

### MyProjectsPage.tsx - Replace Manual Fetching

**Before:**

```typescript
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchProjects(); // Manual fetch
}, [userId]);
```

**After:**

```typescript
import { useProjects } from "../hooks/useProjects";

const { projects, loading, createProject, updateProject, deleteProject } =
  useProjects({
    ownerOnly: true,
    ownerId: userId,
  });

// That's it! Projects now update in realtime
// Remove all manual fetchProjects() calls
```

**Benefits:**

- ✅ No manual refetching needed
- ✅ New projects appear instantly when created (even from another tab)
- ✅ Updates appear instantly
- ✅ Deletions happen instantly

---

### ProjectsPage.jsx - Discover Projects

**Replace:**

```typescript
const [projects, setProjects] = useState([]);
useEffect(() => {
  fetchProjects();
}, []);
```

**With:**

```typescript
import { useProjects } from "../hooks/useProjects";

const { user } = useAuth();
const { projects, loading } = useProjects({
  ownerOnly: false, // Show all projects except mine
});

// Filter out current user's projects client-side if needed
const discoveryProjects = projects.filter((p) => p.owner_id !== user?.id);
```

---

### MessagesPage.jsx - Realtime Chat

**Complete rewrite needed. Here's the structure:**

```typescript
import { useDirectMessages } from '../hooks/useDirectMessages';
import { useState } from 'react';

const MessagesPage = () => {
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { messages, loading, sendMessage, markAsRead } = useDirectMessages(
    user?.id,
    selectedUserId
  );

  const handleSend = async (text) => {
    await sendMessage(text);
  };

  return (
    // Render messages
    // They update in realtime!
  );
};
```

---

### DashboardPage.tsx - Show Online Users + Recent Projects

**Add presence:**

```typescript
import { usePresence } from '../hooks/usePresence';
import { useProjects } from '../hooks/useProjects';

const { user } = useAuth();
const { onlineUsers, isOnline } = usePresence(user?.id, {
  full_name: user?.name,
  avatar_url: user?.avatar_url
});

const { projects: recentProjects } = useProjects({});

// Show online count
<div>👥 {onlineUsers.length} online</div>

// Show recent projects (limited to 6)
{recentProjects.slice(0, 6).map(project => ...)}
```

---

### DiscoverPage.tsx - Online Indicators on User Cards

**Add presence to show green dots:**

```typescript
import { usePresence } from "../hooks/usePresence";
import { useProfiles } from "../hooks/useProfiles";

const { user } = useAuth();
const { onlineUsers, isOnline } = usePresence(user?.id, {
  full_name: user?.name,
  avatar_url: user?.avatar_url,
});

const { profiles, loading } = useProfiles();

// In UserCard component:
<UserCard user={profile} isOnline={isOnline(profile.id)} />;

// In UserCard.tsx, add:
{
  isOnline && (
    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
  );
}
```

---

## 🧪 Testing Realtime Features

### Test 1: Realtime Projects

1. **Open two browser windows** (or use incognito mode)
2. **Login with different accounts** in each window
3. **Go to Projects page** in both
4. **In Window 1:** Create a new project
5. **In Window 2:** The project should appear **instantly** without refresh!
6. **In Window 1:** Edit the project title
7. **In Window 2:** Title updates **instantly**!
8. **In Window 1:** Delete the project
9. **In Window 2:** Project disappears **instantly**!

### Test 2: Realtime Chat

1. **Open two windows** with different accounts
2. **Go to Messages page** in both
3. **Select each other's conversation**
4. **Type in Window 1** and send
5. **Window 2** receives the message **instantly**!
6. **Type in Window 2** and send
7. **Window 1** receives **instantly**!

### Test 3: Online Presence

1. **Open two windows** with different accounts
2. **Go to Discover/Dashboard** in both
3. **You should see each other** in the online users list
4. **Close Window 1** (or logout)
5. **Window 2** should show that user went offline (green dot disappears)

### Test 4: Profile Updates

1. **Open two windows**, both on Discover page
2. **In Window 1:** Go to Profile, change your name
3. **In Window 2:** The user card with your profile **updates instantly**!

---

## ⚙️ How to Disable Realtime Temporarily

If you need to disable realtime for debugging or performance:

### Option 1: Comment out subscriptions

In each hook, comment out the subscription `useEffect`:

```typescript
// useEffect(() => {
//   const channel = supabase.channel(...)
//   ...
//   return () => channel.unsubscribe();
// }, []);
```

### Option 2: Feature flag

Create a config file:

```typescript
// client/src/config/features.ts
export const FEATURES = {
  REALTIME_ENABLED: true, // Set to false to disable
};
```

Then in hooks:

```typescript
import { FEATURES } from "../config/features";

useEffect(() => {
  if (!FEATURES.REALTIME_ENABLED) return;

  // ... subscription code
}, []);
```

---

## 🔐 Security Notes

✅ **All realtime subscriptions respect RLS policies**

- Users can't see messages they're not part of
- Users can't see draft projects they don't own
- Presence data is limited to basic info

✅ **Subscriptions auto-cleanup**

- All hooks properly unsubscribe on unmount
- No memory leaks

✅ **Using anon client**

- All hooks use the standard Supabase client
- No bypassing of security rules

---

## 📊 Performance Considerations

### Subscription Limits

- Supabase Free tier: ~200 concurrent connections
- Each hook creates 1 subscription channel
- A user with all hooks active = ~4 channels

### Optimization Tips

1. **Only subscribe when needed:**

   - Don't use `useProjects` on pages that don't show projects
   - Only use `useDirectMessages` when a conversation is open

2. **Cleanup properly:**

   - All hooks already handle this
   - Subscriptions unsubscribe on page navigate

3. **Filter client-side when possible:**
   - Fetch all projects once, filter in React
   - Better than multiple filtered queries

---

## 🎉 Result

Your SkillSynergy platform is now a **fully realtime collaborative workspace**:

- ✅ Users see new content **instantly**
- ✅ No more "refresh to see updates"
- ✅ Online presence tracking
- ✅ Realtime chat
- ✅ Live project updates
- ✅ Seamless multi-user experience

**Next Steps:**

1. Integrate hooks into your pages (follow patterns above)
2. Test with multiple browser windows
3. Add UI indicators (loading spinners, "typing..." indicators)
4. Add notifications for important realtime events

---

## 🐛 Troubleshooting

**"Messages not appearing in realtime"**

- Check that both users are subscribed to the same channel
- Verify RLS policies allow SELECT on messages for both users
- Check browser console for subscription errors

**"Too many connections"**

- Reduce number of active subscriptions
- Unsubscribe from channels when not in view
- Use feature flags to disable realtime on certain pages

**"Subscription not cleaning up"**

- Verify `return () => channel.unsubscribe()` is in useEffect
- Check for multiple instances of the same hook
- Use React DevTools to check for memory leaks

---

Enjoy your realtime collaborative platform! 🚀
