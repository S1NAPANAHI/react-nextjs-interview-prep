-- Migration 004: Security and Functions
-- Row Level Security policies and utility functions

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaced_repetition_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_analytics ENABLE ROW LEVEL SECURITY;

-- User can only access their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own flashcard progress" ON public.user_flashcard_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own challenge progress" ON public.user_challenge_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own checklist progress" ON public.user_checklist_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own study sessions" ON public.study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own stats" ON public.user_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own spaced repetition" ON public.spaced_repetition_data FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notes" ON public.user_notes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own interviews" ON public.mock_interviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own analytics" ON public.performance_analytics FOR ALL USING (auth.uid() = user_id);

-- Public read access for content tables
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view flashcards" ON public.flashcards FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view challenges" ON public.challenges FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view checklist items" ON public.checklist_items FOR SELECT USING (true);

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update user stats
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'study_sessions' THEN
    UPDATE public.user_stats 
    SET 
      total_study_time = total_study_time + NEW.duration,
      last_study_date = NEW.session_date,
      updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    -- Update streak
    UPDATE public.user_stats 
    SET 
      current_streak = CASE 
        WHEN last_study_date = CURRENT_DATE - INTERVAL '1 day' OR last_study_date = CURRENT_DATE 
        THEN current_streak + 1 
        ELSE 1 
      END,
      longest_streak = GREATEST(longest_streak, current_streak + 1)
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for stats updates
CREATE TRIGGER update_stats_on_study
  AFTER INSERT ON public.study_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.update_user_stats();

-- Function to calculate next review date for spaced repetition
CREATE OR REPLACE FUNCTION public.calculate_next_review(
  ease_factor DECIMAL,
  interval_days INTEGER,
  repetitions INTEGER,
  quality INTEGER -- 0-5 rating
)
RETURNS TABLE(new_ease_factor DECIMAL, new_interval INTEGER, new_repetitions INTEGER) AS $$
BEGIN
  -- SM-2 Algorithm implementation
  new_repetitions := repetitions + 1;
  
  IF quality >= 3 THEN
    IF repetitions = 0 THEN
      new_interval := 1;
    ELSIF repetitions = 1 THEN
      new_interval := 6;
    ELSE
      new_interval := ROUND(interval_days * ease_factor);
    END IF;
  ELSE
    new_repetitions := 0;
    new_interval := 1;
  END IF;
  
  new_ease_factor := ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  IF new_ease_factor < 1.3 THEN
    new_ease_factor := 1.3;
  END IF;
  
  RETURN QUERY SELECT new_ease_factor, new_interval, new_repetitions;
END;
$$ LANGUAGE plpgsql;