-- Migration: Add confidence tracking and question tiers system
-- Description: Enhanced user progress tracking with confidence levels and favorites

-- Create question tiers table
CREATE TABLE IF NOT EXISTS question_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  question_count INTEGER NOT NULL,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level >= 1 AND difficulty_level <= 4),
  frequency_percentage INTEGER NOT NULL,
  gradient_colors TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enhanced questions table
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  tier_id TEXT REFERENCES question_tiers(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL,
  code_example JSONB,
  key_points TEXT[],
  follow_up_questions TEXT[],
  tags TEXT[],
  order_index INTEGER,
  frequency_score INTEGER DEFAULT 50,
  importance_level INTEGER DEFAULT 3 CHECK (importance_level >= 1 AND importance_level <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress table with confidence tracking
CREATE TABLE IF NOT EXISTS user_question_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id TEXT REFERENCES questions(id) ON DELETE CASCADE,
  confidence_level INTEGER DEFAULT 0 CHECK (confidence_level >= 0 AND confidence_level <= 5),
  is_favorite BOOLEAN DEFAULT FALSE,
  times_reviewed INTEGER DEFAULT 0,
  first_reviewed_at TIMESTAMP WITH TIME ZONE,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  notes TEXT,
  confidence_history JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Create study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tier_id TEXT REFERENCES question_tiers(id),
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  questions_studied INTEGER DEFAULT 0,
  average_confidence DECIMAL(3,2),
  total_time_minutes INTEGER,
  session_type TEXT DEFAULT 'practice' CHECK (session_type IN ('practice', 'review', 'mock_interview')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_questions_studied INTEGER DEFAULT 0,
  total_study_time_minutes INTEGER DEFAULT 0,
  current_study_streak INTEGER DEFAULT 0,
  longest_study_streak INTEGER DEFAULT 0,
  favorite_questions_count INTEGER DEFAULT 0,
  average_confidence_level DECIMAL(3,2) DEFAULT 0.0,
  mastered_questions_count INTEGER DEFAULT 0,
  last_study_date DATE,
  interview_readiness_score INTEGER DEFAULT 0 CHECK (interview_readiness_score >= 0 AND interview_readiness_score <= 100),
  preferred_difficulty TEXT DEFAULT 'Beginner' CHECK (preferred_difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  study_goal_minutes_per_day INTEGER DEFAULT 30,
  target_interview_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert question tiers
INSERT INTO question_tiers (id, name, description, question_count, difficulty_level, frequency_percentage, gradient_colors, icon) VALUES
('top10', 'Essential Questions', 'Must-know questions that appear in 90% of React interviews', 10, 1, 90, 'linear-gradient(135deg, #ff6b6b, #ee5a24)', 'fas fa-fire'),
('top20', 'Core Concepts', 'Fundamental React concepts every developer should master', 20, 2, 75, 'linear-gradient(135deg, #feca57, #ff9ff3)', 'fas fa-star'),
('top50', 'Advanced Topics', 'Deep dive into advanced patterns and best practices', 50, 3, 50, 'linear-gradient(135deg, #48dbfb, #0abde3)', 'fas fa-chart-line'),
('top100', 'Complete Mastery', 'Comprehensive coverage including edge cases and expert topics', 100, 4, 25, 'linear-gradient(135deg, #1dd1a1, #10ac84)', 'fas fa-trophy')
ON CONFLICT (id) DO NOTHING;

-- Insert sample questions for top10 tier
INSERT INTO questions (id, tier_id, question, answer, difficulty, category, code_example, key_points, order_index, frequency_score, importance_level) VALUES
('q1_essential', 'top10', 'What is React and why is it popular?', 
 'React is a JavaScript library for building user interfaces, created by Facebook. It is popular because of its component-based architecture, Virtual DOM for performance optimization, unidirectional data flow for predictability, and strong ecosystem with extensive community support. React allows developers to build complex UIs from small, reusable components, making code more maintainable and scalable.',
 'Beginner', 'Fundamentals', 
 '{"title": "Basic React Component", "code": "function Welcome({ name }) {\\n  return <h1>Hello, {name}!</h1>;\\n}\\n\\n// Usage\\n<Welcome name=\\"React Developer\\" />"}',
 ARRAY['Component-based architecture', 'Virtual DOM for performance', 'Strong ecosystem and community', 'Backed by Meta (Facebook)'],
 1, 95, 5),

('q2_essential', 'top10', 'What is JSX and how does it differ from HTML?',
 'JSX (JavaScript XML) is a syntax extension for JavaScript that allows writing HTML-like code directly in JavaScript files. Key differences include: className instead of class, self-closing tags must be properly closed, JavaScript expressions with {}, camelCase properties like onClick, and style attributes take objects instead of strings. JSX is transpiled to React.createElement() calls by Babel.',
 'Beginner', 'JSX',
 '{"title": "JSX Example", "code": "function Button({ onClick, children }) {\\n  return (\\n    <button\\n      className=\\"btn-primary\\"\\n      onClick={onClick}\\n      style={{ backgroundColor: \\"blue\\" }}\\n    >\\n      {children}\\n    </button>\\n  );\\n}"}',
 ARRAY['HTML-like syntax in JavaScript', 'Must use className instead of class', 'Self-closing tags must be closed', 'Supports JavaScript expressions'],
 2, 92, 5),

('q3_essential', 'top10', 'What is the difference between state and props?',
 'State is internal, mutable data managed by the component itself that triggers re-renders when updated. Props are external, immutable data passed from parent components that configure child components. State is private to the component, while props are controlled by the parent. State changes cause re-renders, props cannot be modified by children.',
 'Beginner', 'State Management',
 '{"title": "State vs Props", "code": "function Counter({ initialCount }) { // prop\\n  const [count, setCount] = useState(initialCount); // state\\n  return (\\n    <div>\\n      <p>Count: {count}</p>\\n      <button onClick={() => setCount(count + 1)}>\\n        Increment\\n      </button>\\n    </div>\\n  );\\n}"}',
 ARRAY['State is internal and mutable', 'Props are external and read-only', 'State triggers re-renders', 'Props controlled by parent'],
 3, 90, 5),

('q4_essential', 'top10', 'What is the Virtual DOM and how does it improve performance?',
 'The Virtual DOM is a lightweight, in-memory representation of the real DOM. React uses it to optimize updates by creating a new virtual DOM tree when state changes, comparing (diffing) it with the previous tree, then applying only the minimum necessary changes to the real DOM. This batching and selective updating significantly improves performance compared to direct DOM manipulation.',
 'Intermediate', 'Performance',
 '{"title": "Virtual DOM Concept", "code": "// When state changes, React:\\n// 1. Creates new Virtual DOM tree\\n// 2. Compares with previous tree (diffing)\\n// 3. Calculates minimum changes needed\\n// 4. Updates only changed parts in real DOM\\n\\nfunction App() {\\n  const [count, setCount] = useState(0);\\n  // Only the <p> text content updates in real DOM\\n  return (\\n    <div>\\n      <p>Count: {count}</p> {/* This updates */}\\n      <button onClick={() => setCount(count + 1)}>\\n        Click {/* This stays unchanged */}\\n      </button>\\n    </div>\\n  );\\n}"}',
 ARRAY['In-memory representation of real DOM', 'Enables efficient diffing algorithm', 'Minimizes expensive DOM operations', 'Batches updates for better performance'],
 4, 88, 5),

('q5_essential', 'top10', 'Explain the difference between functional and class components',
 'Functional components are simple JavaScript functions that return JSX and use hooks for state and effects. Class components extend React.Component, use this.state for state management, and have lifecycle methods. Functional components became the modern standard after React 16.8 introduced hooks, offering cleaner syntax, better performance optimizations, and easier testing.',
 'Beginner', 'Components',
 '{"title": "Class vs Functional", "code": "// Class Component\\nclass Counter extends React.Component {\\n  constructor(props) {\\n    super(props);\\n    this.state = { count: 0 };\\n  }\\n  render() {\\n    return <div>Count: {this.state.count}</div>;\\n  }\\n}\\n\\n// Functional Component\\nfunction Counter() {\\n  const [count, setCount] = useState(0);\\n  return <div>Count: {count}</div>;\\n}"}',
 ARRAY['Functional components are modern standard', 'Use hooks instead of lifecycle methods', 'Cleaner and more concise syntax', 'Better performance optimizations'],
 5, 85, 5)

ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE question_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Question tiers are public (everyone can read)
CREATE POLICY "Question tiers are public" ON question_tiers FOR SELECT USING (true);

-- Questions are public (everyone can read)
CREATE POLICY "Questions are public" ON questions FOR SELECT USING (true);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_question_progress 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_question_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_question_progress 
  FOR UPDATE USING (auth.uid() = user_id);

-- Study sessions policies
CREATE POLICY "Users can manage own study sessions" ON study_sessions 
  FOR ALL USING (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can manage own stats" ON user_stats 
  FOR ALL USING (auth.uid() = user_id);

-- Create functions for progress tracking

-- Function to update user stats automatically
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user stats when question progress changes
  INSERT INTO user_stats (user_id, total_questions_studied, favorite_questions_count, average_confidence_level, mastered_questions_count, updated_at)
  SELECT 
    NEW.user_id,
    COUNT(*) FILTER (WHERE confidence_level > 0) as total_studied,
    COUNT(*) FILTER (WHERE is_favorite = true) as favorites_count,
    ROUND(AVG(confidence_level), 2) as avg_confidence,
    COUNT(*) FILTER (WHERE confidence_level >= 4) as mastered_count,
    NOW()
  FROM user_question_progress 
  WHERE user_id = NEW.user_id
  GROUP BY user_id
  ON CONFLICT (user_id) DO UPDATE SET
    total_questions_studied = EXCLUDED.total_questions_studied,
    favorite_questions_count = EXCLUDED.favorite_questions_count,
    average_confidence_level = EXCLUDED.average_confidence_level,
    mastered_questions_count = EXCLUDED.mastered_questions_count,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update user stats
DROP TRIGGER IF EXISTS update_user_stats_trigger ON user_question_progress;
CREATE TRIGGER update_user_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_question_progress
  FOR EACH ROW EXECUTE FUNCTION update_user_stats();

-- Function to calculate interview readiness score
CREATE OR REPLACE FUNCTION calculate_interview_readiness(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  readiness_score INTEGER := 0;
  top10_confidence DECIMAL;
  top20_confidence DECIMAL;
  total_studied INTEGER;
BEGIN
  -- Calculate confidence in top 10 questions (weighted 50%)
  SELECT COALESCE(AVG(uqp.confidence_level), 0) INTO top10_confidence
  FROM user_question_progress uqp
  JOIN questions q ON q.id = uqp.question_id
  WHERE uqp.user_id = p_user_id AND q.tier_id = 'top10';
  
  -- Calculate confidence in top 20 questions (weighted 30%)
  SELECT COALESCE(AVG(uqp.confidence_level), 0) INTO top20_confidence
  FROM user_question_progress uqp
  JOIN questions q ON q.id = uqp.question_id
  WHERE uqp.user_id = p_user_id AND q.tier_id = 'top20';
  
  -- Count total questions studied
  SELECT COUNT(*) INTO total_studied
  FROM user_question_progress
  WHERE user_id = p_user_id AND confidence_level > 0;
  
  -- Calculate weighted readiness score
  readiness_score := LEAST(100, GREATEST(0, 
    ROUND(
      (top10_confidence * 10) + -- Max 50 points from top 10
      (top20_confidence * 6) +  -- Max 30 points from top 20
      LEAST(20, total_studied)  -- Max 20 points from total studied
    )
  ));
  
  -- Update user stats
  UPDATE user_stats 
  SET 
    interview_readiness_score = readiness_score,
    updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN readiness_score;
END;
$$ LANGUAGE plpgsql;

-- Function to track confidence history
CREATE OR REPLACE FUNCTION update_confidence_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Add confidence change to history
  NEW.confidence_history := COALESCE(NEW.confidence_history, '[]'::jsonb) || 
    jsonb_build_object(
      'level', NEW.confidence_level,
      'timestamp', extract(epoch from NOW()),
      'session_id', COALESCE(current_setting('app.session_id', true), 'unknown')
    );
    
  -- Update review tracking
  NEW.last_reviewed_at := NOW();
  NEW.times_reviewed := COALESCE(OLD.times_reviewed, 0) + 1;
  
  -- Set first review time if not set
  IF OLD.first_reviewed_at IS NULL THEN
    NEW.first_reviewed_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for confidence history
DROP TRIGGER IF EXISTS confidence_history_trigger ON user_question_progress;
CREATE TRIGGER confidence_history_trigger
  BEFORE UPDATE OF confidence_level ON user_question_progress
  FOR EACH ROW EXECUTE FUNCTION update_confidence_history();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_question_progress_user_id ON user_question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_question_id ON user_question_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_user_question_progress_confidence ON user_question_progress(confidence_level);
CREATE INDEX IF NOT EXISTS idx_questions_tier_id ON questions(tier_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_tier_id ON study_sessions(tier_id);

-- Create views for easy querying

-- View for user progress summary
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
  p.id as user_id,
  p.full_name,
  us.total_questions_studied,
  us.average_confidence_level,
  us.current_study_streak,
  us.interview_readiness_score,
  us.last_study_date,
  us.mastered_questions_count,
  us.favorite_questions_count
FROM profiles p
LEFT JOIN user_stats us ON p.id = us.user_id;

-- View for tier progress
CREATE OR REPLACE VIEW tier_progress_summary AS
SELECT 
  uqp.user_id,
  qt.id as tier_id,
  qt.name as tier_name,
  COUNT(uqp.question_id) as questions_attempted,
  qt.question_count as total_questions,
  ROUND((COUNT(uqp.question_id)::DECIMAL / qt.question_count * 100), 1) as completion_percentage,
  ROUND(AVG(uqp.confidence_level), 2) as average_confidence,
  COUNT(*) FILTER (WHERE uqp.confidence_level >= 4) as mastered_questions,
  COUNT(*) FILTER (WHERE uqp.is_favorite = true) as favorite_questions
FROM question_tiers qt
LEFT JOIN questions q ON q.tier_id = qt.id
LEFT JOIN user_question_progress uqp ON uqp.question_id = q.id
GROUP BY uqp.user_id, qt.id, qt.name, qt.question_count
ORDER BY qt.difficulty_level;

-- Comment on tables
COMMENT ON TABLE question_tiers IS 'Different tiers of interview questions (Top 10, 20, 50, 100)';
COMMENT ON TABLE questions IS 'Interview questions organized by tiers and categories';
COMMENT ON TABLE user_question_progress IS 'User progress tracking with confidence levels (1-5 circles system)';
COMMENT ON TABLE study_sessions IS 'Track user study sessions and time spent';
COMMENT ON TABLE user_stats IS 'Aggregate user statistics and progress metrics';

COMMENT ON COLUMN user_question_progress.confidence_level IS 'User confidence rating (0-5, inspired by pencil circle method)';
COMMENT ON COLUMN user_question_progress.confidence_history IS 'JSON array tracking confidence changes over time';
COMMENT ON COLUMN user_stats.interview_readiness_score IS 'Calculated score (0-100) indicating readiness for interviews';