import { createClient } from '@supabase/supabase-js'
import CapacitorStorage from './CapacitorStorage'

// Get Supabase credentials from Vite environment variables
// These should be defined in a .env file in the project root
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
  )
}

// Create and export a single Supabase client instance
// This client will be used throughout the application for all Supabase operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Auto refresh the session when it expires
    autoRefreshToken: true,
    // Persist the session to storage (localStorage on web, Preferences on mobile)
    persistSession: true,
    storage: CapacitorStorage,
    // Detect session from URL (useful for email confirmations, password resets, etc.)
    detectSessionInUrl: true
  }
})

// TypeScript interface for user profile
// This matches the structure of the 'profiles' table in Supabase
export interface UserProfile {
  id: string
  email?: string // Added for admin display
  full_name: string | null
  avatar_url: string | null
  role: string | null
  location: string | null
  bio: string | null
  created_at: string
  skills?: any[]
  experience?: any[]
}

// TypeScript interface for project
// This matches the structure of the 'projects' table in Supabase
export interface Project {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string | null
  status: string
  owner_id: string
  collaborators: any[]
  tags: string[]
  image_url: string | null
}
