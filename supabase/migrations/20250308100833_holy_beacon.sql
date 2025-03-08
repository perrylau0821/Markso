/*
  # Create trigger for automatic profile creation

  This migration sets up a trigger that automatically creates a profile
  when a new user signs up through Supabase Auth.

  1. Functions
    - Creates function to handle new user registration
    - Creates trigger to automatically create profile

  2. Security
    - Function is owned by postgres role for security
*/

-- Create the function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();