/*
  # Fix Profile Policies and Triggers

  1. Changes
    - Create profile trigger function
    - Set up auth trigger
    - Configure RLS policies safely
    - Enable RLS on profiles table

  2. Security
    - Public read access to profiles
    - Authenticated users can update their own profiles
    - Secure trigger function with SECURITY DEFINER
*/

-- Create or replace the trigger function with simplified logic
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in create_profile_for_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_user();

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Safely recreate policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  
  -- Create new policies
  CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles
    FOR SELECT 
    TO public 
    USING (true);

  CREATE POLICY "Users can update own profile" 
    ON public.profiles
    FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
END $$;