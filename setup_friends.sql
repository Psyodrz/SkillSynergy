-- Add role column to profiles if it doesn't exist (it likely does, but ensuring default)
-- Note: We can't easily check column existence in a simple script without PL/pgSQL, 
-- but adding a column that exists usually errors. 
-- Assuming 'role' exists as per user description.

-- Create friend_requests table
CREATE TABLE IF NOT EXISTS friend_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  UNIQUE(sender_id, receiver_id)
);

-- Enable RLS on friend_requests
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;

-- Friend Requests policies
CREATE POLICY "Users can view requests they sent or received" 
ON friend_requests FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create requests" 
ON friend_requests FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update requests they are involved in" 
ON friend_requests FOR UPDATE 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create friends table
CREATE TABLE IF NOT EXISTS friends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user1 UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user2 UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(user1, user2)
);

-- Enable RLS on friends
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Friends policies
CREATE POLICY "Users can view their own friendships" 
ON friends FOR SELECT 
USING (auth.uid() = user1 OR auth.uid() = user2);

CREATE POLICY "Users can insert friendships" 
ON friends FOR INSERT 
WITH CHECK (auth.uid() = user1 OR auth.uid() = user2);
