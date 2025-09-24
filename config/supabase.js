// Supabase configuration and client setup
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anon key

// Initialize Supabase client
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Database service for handling all Supabase operations
class DatabaseService {
  constructor() {
    this.client = supabase;
  }

  // Authentication methods
  async signUp(email, password, userData = {}) {
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
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    return { error };
  }

  async getCurrentUser() {
    const { data: { user } } = await this.client.auth.getUser();
    return user;
  }

  onAuthStateChange(callback) {
    return this.client.auth.onAuthStateChange(callback);
  }

  // Profile methods
  async getProfile(userId) {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  }

  async updateProfile(userId, updates) {
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
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    return { data, error };
  }

  // Flashcards methods
  async getFlashcards(categoryId = null) {
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
    const { data, error } = await this.client
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    return { data, error };
  }

  // Spaced repetition methods
  async getSpacedRepetitionData(userId, flashcardId = null) {
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