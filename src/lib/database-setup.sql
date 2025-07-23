-- Database Setup and Row-Level Security (RLS) Policies for POLIGAP Authentication System
-- Run these commands in your Supabase SQL Editor

-- 1. Create profiles table to store user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  job_title TEXT,
  phone TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  preferences JSONB DEFAULT '{"notifications": true, "newsletter": false, "analytics": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- 2. Create user activity tracking table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create policy analysis results table
CREATE TABLE IF NOT EXISTS public.policy_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  policy_type TEXT,
  industry TEXT,
  analysis_result JSONB,
  compliance_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create document uploads table
CREATE TABLE IF NOT EXISTS public.document_uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processed_content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_uploads ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies for profiles table
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update any profile (for role management)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 7. Create RLS Policies for user_activities table
-- Users can view their own activities
CREATE POLICY "Users can view own activities"
  ON public.user_activities FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own activities
CREATE POLICY "Users can insert own activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all activities
CREATE POLICY "Admins can view all activities"
  ON public.user_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 8. Create RLS Policies for policy_analyses table
-- Users can view, insert, and update their own analyses
CREATE POLICY "Users can manage own policy analyses"
  ON public.policy_analyses FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all analyses
CREATE POLICY "Admins can view all policy analyses"
  ON public.policy_analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 9. Create RLS Policies for document_uploads table
-- Users can manage their own documents
CREATE POLICY "Users can manage own documents"
  ON public.document_uploads FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
  ON public.document_uploads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    COALESCE(new.raw_user_meta_data->>'picture', new.raw_user_meta_data->>'avatar_url')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 12. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER policy_analyses_updated_at
  BEFORE UPDATE ON public.policy_analyses
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER document_uploads_updated_at
  BEFORE UPDATE ON public.document_uploads
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 14. Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS user_activities_user_id_idx ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS user_activities_created_at_idx ON public.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS policy_analyses_user_id_idx ON public.policy_analyses(user_id);
CREATE INDEX IF NOT EXISTS policy_analyses_created_at_idx ON public.policy_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS document_uploads_user_id_idx ON public.document_uploads(user_id);
CREATE INDEX IF NOT EXISTS document_uploads_status_idx ON public.document_uploads(processing_status);

-- 15. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.user_activities TO authenticated;
GRANT ALL ON public.policy_analyses TO authenticated;
GRANT ALL ON public.document_uploads TO authenticated;

-- 16. Create a function to check if user is admin (for use in applications)
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Insert a default admin user (replace with your email)
-- Note: This will only work after the user signs up through Google OAuth
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- 18. Create a view for admin statistics
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT 
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') as total_admins,
  (SELECT COUNT(*) FROM public.policy_analyses) as total_analyses,
  (SELECT COUNT(*) FROM public.document_uploads) as total_documents,
  (SELECT COUNT(*) FROM public.user_activities WHERE created_at > NOW() - INTERVAL '24 hours') as activities_24h;

-- Grant access to the view
GRANT SELECT ON public.admin_stats TO authenticated;

-- 19. Create RLS policy for admin stats view
CREATE POLICY "Only admins can view stats"
  ON public.admin_stats FOR SELECT
  USING (public.is_admin());
