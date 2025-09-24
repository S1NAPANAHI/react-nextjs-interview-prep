// Supabase configuration and client setup
// Supports both environment variables (Vercel) and direct configuration (local)

// Try to get from environment variables first (Vercel deployment)
const SUPABASE_URL = 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof import !== 'undefined' && import.meta?.env?.VITE_SUPABASE_URL) ||
  'YOUR_SUPABASE_URL'; // Replace with your Supabase project URL for local development

const SUPABASE_ANON_KEY = 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof import !== 'undefined' && import.meta?.env?.VITE_SUPABASE_ANON_KEY) ||
  'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anon key for local development

// Initialize Supabase client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Development logging
if (typeof console !== 'undefined' && SUPABASE_URL === 'YOUR_SUPABASE_URL') {
  console.warn('⚠️ Supabase not configured. Please update config/supabase.js or set environment variables.');
  console.info('📖 See setup/README.md for configuration instructions.');
}

// Database service for handling all Supabase operations
class DatabaseService {
  constructor() {
    this.client = supabase;
    this.isConfigured = SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
  }

  // Check if Supabase is properly configured
  isReady() {
    return this.client && this.isConfigured;
  }

  // Get configuration status
  getStatus() {
    return {
      hasClient: !!this.client,
      isConfigured: this.isConfigured,
      url: SUPABASE_URL.includes('supabase') ? 'configured' : 'not configured',
      key: SUPABASE_ANON_KEY.length > 50 ? 'configured' : 'not configured'
    };
  }

  // Authentication methods
  async signUp(email, password, userData = {}) {
    if (!this.isReady()) {
      return { error: new Error('Supabase not configured. Please set up your database first.') };
    }
    
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  }

  async signIn(email, password) {
    if (!this.isReady()) {
      return { error: new Error('Supabase not configured. Please set up your database first.') };
    }
    
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signOut() {
    if (!this.isReady()) return { error: null };
    
    const { error } = await this.client.auth.signOut();
    return { error };
  }

  async getCurrentUser() {
    if (!this.isReady()) return null;
    
    const { data: { user } } = await this.client.auth.getUser();
    return user;
  }

  onAuthStateChange(callback) {
    if (!this.isReady()) {
      // Return a mock subscription for offline mode
      return {
        unsubscribe: () => {}
      };
    }
    
    return this.client.auth.onAuthStateChange(callback);
  }

  // Profile methods
  async getProfile(userId) {
    if (!this.isReady()) {
      return { error: new Error('Database not available in offline mode') };
    }
    
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  }

  async updateProfile(userId, updates) {
    if (!this.isReady()) {
      return { error: new Error('Database not available in offline mode') };
    }
    
    const { data, error } = await this.client
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  }

  // Categories methods
  async getCategories() {
    if (!this.isReady()) {
      // Return fallback static data
      return {
        data: [
          { id: 'react_fundamentals', name: 'React Fundamentals', description: 'Core React concepts', icon: '⚛️', color: '#61DAFB', sort_order: 1 },
          { id: 'react_hooks', name: 'React Hooks', description: 'Hooks and optimization', icon: '🎣', color: '#61DAFB', sort_order: 2 },
          { id: 'nextjs', name: 'Next.js', description: 'SSR, SSG, and full-stack', icon: '▲', color: '#000000', sort_order: 3 },
          { id: 'javascript', name: 'JavaScript Core', description: 'Language fundamentals', icon: '🟨', color: '#F7DF1E', sort_order: 4 },
          { id: 'system_design', name: 'System Design', description: 'Architecture and scalability', icon: '🏗️', color: '#FF6B6B', sort_order: 5 },
          { id: 'interview_questions', name: 'Interview Questions', description: 'Common interview questions', icon: '❓', color: '#4ECDC4', sort_order: 6 }
        ],
        error: null
      };
    }
    
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    return { data, error };
  }

  // Flashcards methods
  async getFlashcards(categoryId = null) {
    if (!this.isReady()) {
      return { data: [], error: new Error('Database not available. Using local mode.') };
    }
    
    let query = this.client
      .from('flashcards')
      .select(`
        *,
        categories(name, color, icon)
      `)
      .eq('is_active', true);
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    const { data, error } = await query.order('created_at');
    return { data, error };
  }

  async getFlashcardsByCategory(categoryId) {
    return this.getFlashcards(categoryId);
  }

  // User progress methods
  async getUserFlashcardProgress(userId, flashcardId = null) {
    if (!this.isReady()) {
      return { data: [], error: new Error('Database not available in offline mode') };
    }
    
    let query = this.client
      .from('user_flashcard_progress')
      .select(`
        *,
        flashcards(id, front, back, difficulty)
      `)
      .eq('user_id', userId);
    
    if (flashcardId) {
      query = query.eq('flashcard_id', flashcardId);
    }
    
    const { data, error } = await query;
    return { data, error };
  }

  async updateFlashcardProgress(userId, flashcardId, progressData) {
    if (!this.isReady()) {
      return { error: new Error('Database not available in offline mode') };
    }
    
    const updateData = {
      user_id: userId,
      flashcard_id: flashcardId,
      ...progressData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.client
      .from('user_flashcard_progress')
      .upsert(updateData)
      .select()
      .single();
    
    return { data, error };
  }

  // Study sessions
  async createStudySession(userId, sessionData) {
    if (!this.isReady()) {
      return { error: new Error('Database not available in offline mode') };
    }
    
    const { data, error } = await this.client
      .from('study_sessions')
      .insert({
        user_id: userId,
        ...sessionData
      })
      .select()
      .single();
    
    return { data, error };
  }

  async getUserStats(userId) {
    if (!this.isReady()) {
      return { 
        data: {
          current_streak: 0,
          longest_streak: 0,
          total_study_time: 0,
          flashcards_mastered: 0,
          challenges_completed: 0,
          weekly_goal: 300
        }, 
        error: null 
      };
    }
    
    const { data, error } = await this.client
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return { data, error };
  }

  // Spaced repetition methods
  async getSpacedRepetitionData(userId, flashcardId = null) {
    if (!this.isReady()) {
      return { data: [], error: new Error('Database not available in offline mode') };
    }
    
    let query = this.client
      .from('spaced_repetition_data')
      .select('*')
      .eq('user_id', userId);
    
    if (flashcardId) {
      query = query.eq('flashcard_id', flashcardId);
    }
    
    const { data, error } = await query;
    return { data, error };
  }

  async updateSpacedRepetitionData(userId, flashcardId, quality) {
    if (!this.isReady()) {
      return { error: new Error('Database not available in offline mode') };
    }
    
    // Get current data
    const { data: current } = await this.getSpacedRepetitionData(userId, flashcardId);
    const currentData = current?.[0] || {
      ease_factor: 2.5,
      interval_days: 1,
      repetitions: 0
    };

    // Calculate next review using the database function
    const { data: nextReview, error: calcError } = await this.client
      .rpc('calculate_next_review', {
        ease_factor: currentData.ease_factor,
        interval_days: currentData.interval_days,
        repetitions: currentData.repetitions,
        quality: quality
      });

    if (calcError) return { error: calcError };

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextReview[0].new_interval);

    const updateData = {
      user_id: userId,
      flashcard_id: flashcardId,
      ease_factor: nextReview[0].new_ease_factor,
      interval_days: nextReview[0].new_interval,
      repetitions: nextReview[0].new_repetitions,
      last_reviewed: new Date().toISOString(),
      next_review: nextReviewDate.toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.client
      .from('spaced_repetition_data')
      .upsert(updateData)
      .select()
      .single();
    
    return { data, error };
  }

  // Challenges methods
  async getChallenges(difficulty = null, category = null) {
    if (!this.isReady()) {
      return { data: [], error: new Error('Database not available in offline mode') };
    }
    
    let query = this.client
      .from('challenges')
      .select('*')
      .eq('is_active', true);
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query.order('created_at');
    return { data, error };
  }

  async getUserChallengeProgress(userId, challengeId = null) {
    if (!this.isReady()) {
      return { data: [], error: new Error('Database not available in offline mode') };
    }
    
    let query = this.client
      .from('user_challenge_progress')
      .select(`
        *,
        challenges(id, title, difficulty, category)
      `)
      .eq('user_id', userId);
    
    if (challengeId) {
      query = query.eq('challenge_id', challengeId);
    }
    
    const { data, error } = await query;
    return { data, error };
  }

  async updateChallengeProgress(userId, challengeId, progressData) {
    if (!this.isReady()) {
      return { error: new Error('Database not available in offline mode') };
    }
    
    const updateData = {
      user_id: userId,
      challenge_id: challengeId,
      ...progressData,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.client
      .from('user_challenge_progress')
      .upsert(updateData)
      .select()
      .single();
    
    return { data, error };
  }

  // Analytics methods
  async getPerformanceAnalytics(userId, startDate = null, endDate = null) {
    if (!this.isReady()) {
      return { data: [], error: new Error('Database not available in offline mode') };
    }
    
    let query = this.client
      .from('performance_analytics')
      .select(`
        *,
        categories(name, color)
      `)
      .eq('user_id', userId);
    
    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      query = query.lte('date', endDate);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    return { data, error };
  }

  async updatePerformanceAnalytics(userId, categoryId, analyticsData) {
    if (!this.isReady()) {
      return { error: new Error('Database not available in offline mode') };
    }
    
    const updateData = {
      user_id: userId,
      category_id: categoryId,
      date: new Date().toISOString().split('T')[0],
      ...analyticsData
    };

    const { data, error } = await this.client
      .from('performance_analytics')
      .upsert(updateData)
      .select()
      .single();
    
    return { data, error };
  }

  // Realtime subscriptions
  subscribeToUserProgress(userId, callback) {
    if (!this.isReady()) {
      return {
        unsubscribe: () => {}
      };
    }
    
    return this.client
      .channel('user-progress')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_flashcard_progress',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }

  subscribeToUserStats(userId, callback) {
    if (!this.isReady()) {
      return {
        unsubscribe: () => {}
      };
    }
    
    return this.client
      .channel('user-stats')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_stats',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }
}

// Create global database service instance
window.dbService = new DatabaseService();

// Log configuration status for debugging
if (typeof console !== 'undefined') {
  const status = window.dbService.getStatus();
  console.info('🗄️ Database Service Status:', status);
  
  if (!status.isConfigured) {
    console.info('💡 Running in offline mode. Set up Supabase for full functionality.');
  }
}