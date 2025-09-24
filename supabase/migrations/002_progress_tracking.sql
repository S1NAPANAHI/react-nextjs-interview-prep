-- Migration 002: User Progress Tracking
-- Tables for tracking user study progress

-- User flashcard progress
CREATE TABLE public.user_flashcard_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE,
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5) DEFAULT 3,
  times_reviewed INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  is_mastered BOOLEAN DEFAULT false,
  review_history JSONB DEFAULT '[]', -- Array of {timestamp, confidence, response_time}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, flashcard_id)
);

-- User challenge progress
CREATE TABLE public.user_challenge_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed', 'reviewed')) DEFAULT 'not_started',
  user_solution TEXT,
  completion_time INTEGER, -- minutes taken
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  notes TEXT,
  self_rating INTEGER CHECK (self_rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- User checklist progress
CREATE TABLE public.user_checklist_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  checklist_item_id UUID REFERENCES public.checklist_items(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  time_spent INTEGER DEFAULT 0, -- minutes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checklist_item_id)
);

-- Study sessions for tracking daily activity
CREATE TABLE public.study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type TEXT CHECK (session_type IN ('flashcards', 'challenges', 'checklist', 'mixed')) NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  items_studied INTEGER DEFAULT 0,
  performance_score DECIMAL(3,2), -- 0.00 to 1.00
  notes TEXT,
  session_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User goals and streaks
CREATE TABLE public.user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0, -- minutes
  flashcards_mastered INTEGER DEFAULT 0,
  challenges_completed INTEGER DEFAULT 0,
  last_study_date DATE,
  weekly_goal INTEGER DEFAULT 300, -- minutes per week
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);