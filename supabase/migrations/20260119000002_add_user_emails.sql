-- Add User Email Storage
-- Created: 2026-01-19
-- Description: Store user email addresses for registered users

-- =====================================================
-- ADD EMAIL COLUMN TO PROFILES TABLE
-- =====================================================

-- Add email column to profiles table (stores user's email from auth)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Add email validation constraint
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- =====================================================
-- CREATE USER_REGISTRATIONS TABLE (Audit Trail)
-- =====================================================

-- Separate table to track all registration events
CREATE TABLE IF NOT EXISTS public.user_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  registration_source TEXT DEFAULT 'web_app',
  ip_address TEXT,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_registrations_user_id ON public.user_registrations(user_id);
CREATE INDEX idx_user_registrations_email ON public.user_registrations(email);
CREATE INDEX idx_user_registrations_date ON public.user_registrations(registration_date DESC);

-- =====================================================
-- ENABLE RLS ON NEW TABLE
-- =====================================================

ALTER TABLE public.user_registrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own registration record
CREATE POLICY "Users can view own registration" 
  ON public.user_registrations FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own registration (during signup)
CREATE POLICY "Users can insert own registration" 
  ON public.user_registrations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- CREATE FUNCTION TO AUTO-POPULATE EMAIL
-- =====================================================

-- Function to automatically populate email from auth.users
CREATE OR REPLACE FUNCTION populate_user_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Get email from auth.users table
  SELECT email INTO NEW.email 
  FROM auth.users 
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-populate email on profile insert
CREATE TRIGGER auto_populate_email 
  BEFORE INSERT ON public.profiles
  FOR EACH ROW 
  WHEN (NEW.email IS NULL)
  EXECUTE FUNCTION populate_user_email();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON COLUMN public.profiles.email IS 'User email address from auth, stored for quick access';
COMMENT ON TABLE public.user_registrations IS 'Audit trail of all user registrations with metadata';
COMMENT ON INDEX idx_profiles_email IS 'Index for fast email lookup in profiles';
COMMENT ON INDEX idx_user_registrations_email IS 'Index for fast email lookup in registrations';

