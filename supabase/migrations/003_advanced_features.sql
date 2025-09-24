-- Migration 003: Advanced Features
-- Advanced features for enhanced learning experience

-- Spaced repetition algorithm data
CREATE TABLE public.spaced_repetition_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  flashcard_id UUID REFERENCES public.flashcards(id) ON DELETE CASCADE,
  ease_factor DECIMAL(3,2) DEFAULT 2.50,
  interval_days INTEGER DEFAULT 1,
  repetitions INTEGER DEFAULT 0,
  last_reviewed TIMESTAMPTZ,
  next_review TIMESTAMPTZ,
  algorithm_version TEXT DEFAULT 'SM-2',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, flashcard_id)
);

-- User notes and bookmarks
CREATE TABLE public.user_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT CHECK (content_type IN ('flashcard', 'challenge', 'general')) NOT NULL,
  content_id UUID, -- References flashcard or challenge ID
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_bookmark BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mock interview sessions
CREATE TABLE public.mock_interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  interview_type TEXT CHECK (interview_type IN ('technical', 'behavioral', 'system_design', 'mixed')) NOT NULL,
  duration INTEGER, -- minutes
  questions_asked JSONB DEFAULT '[]',
  responses JSONB DEFAULT '[]',
  self_assessment JSONB DEFAULT '{}',
  areas_for_improvement TEXT[] DEFAULT '{}',
  confidence_rating INTEGER CHECK (confidence_rating BETWEEN 1 AND 10),
  scheduled_for TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance analytics
CREATE TABLE public.performance_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  category_id UUID REFERENCES public.categories(id),
  accuracy_rate DECIMAL(3,2), -- 0.00 to 1.00
  average_response_time INTEGER, -- seconds
  items_studied INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- minutes
  difficulty_level TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, category_id)
);