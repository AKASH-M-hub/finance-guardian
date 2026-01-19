-- ============================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Step-by-step to add email storage
-- ============================================

-- STEP 1: Add email column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- STEP 2: Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- STEP 3: Add email validation
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS valid_email_format;

ALTER TABLE public.profiles 
ADD CONSTRAINT valid_email_format 
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- STEP 4: Create user_registrations table
CREATE TABLE IF NOT EXISTS public.user_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  registration_source TEXT DEFAULT 'web_app',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 5: Create indexes for user_registrations
CREATE INDEX IF NOT EXISTS idx_user_registrations_user_id ON public.user_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_registrations_email ON public.user_registrations(email);
CREATE INDEX IF NOT EXISTS idx_user_registrations_date ON public.user_registrations(registration_date DESC);

-- STEP 6: Enable RLS on user_registrations
ALTER TABLE public.user_registrations ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create RLS policies for user_registrations
DROP POLICY IF EXISTS "Users can view own registration" ON public.user_registrations;
CREATE POLICY "Users can view own registration" 
  ON public.user_registrations FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own registration" ON public.user_registrations;
CREATE POLICY "Users can insert own registration" 
  ON public.user_registrations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- STEP 8: Create function to auto-populate email
CREATE OR REPLACE FUNCTION populate_user_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS NULL THEN
    SELECT email INTO NEW.email 
    FROM auth.users 
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 9: Create trigger for auto-populating email
DROP TRIGGER IF EXISTS auto_populate_email ON public.profiles;
CREATE TRIGGER auto_populate_email 
  BEFORE INSERT ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION populate_user_email();

-- STEP 10: Populate existing users' emails
UPDATE public.profiles p
SET email = (SELECT email FROM auth.users WHERE id = p.id)
WHERE email IS NULL;

-- STEP 11: Verify setup
SELECT 'Setup Complete!' as status;
SELECT COUNT(*) as profiles_with_email FROM public.profiles WHERE email IS NOT NULL;
SELECT COUNT(*) as registration_records FROM public.user_registrations;

-- Done! Now the email field and user_registrations table are ready.
