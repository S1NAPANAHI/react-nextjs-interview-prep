// Enhanced Flashcard Application with Supabase Integration
class EnhancedFlashcardApp {
  constructor() {
    this.data = null;
    this.categories = [];
    this.currentCategory = null;
    this.currentCards = [];
    this.currentCardIndex = 0;
    this.isFlipped = false;
    this.progress = new Map();
    this.userStats = null;
    this.interviewDate = this.loadInterviewDate();
    this.studySession = {
      startTime: null,
      itemsStudied: 0,
      correctAnswers: 0
    };
    
    this.init();
  }

  async init() {
    // Wait for auth manager to initialize
    await this.waitForAuthManager();
    
    this.setupEventListeners();
    this.initTheme();
    this.startCountdown();
    
    // Load data from Supabase
    await this.loadData();
    
    // Setup realtime subscriptions if user is authenticated
    if (window.authManager?.isAuthenticated()) {
      this.setupRealtimeSubscriptions();
    }
    
    this.renderDashboard();
    this.updateDashboardStats();
  }

  async waitForAuthManager() {
    while (!window.authManager) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async loadData() {
    try {
      // Load categories
      const { data: categories, error: categoriesError } = await window.dbService.getCategories();
      if (categoriesError) throw categoriesError;
      this.categories = categories || [];

      // Load flashcards
      const { data: flashcards, error: flashcardsError } = await window.dbService.getFlashcards();
      if (flashcardsError) throw flashcardsError;
      
      // Group flashcards by category
      this.data = {};
      this.categories.forEach(category => {
        const categoryCards = flashcards?.filter(card => card.category_id === category.id) || [];
        this.data[category.id] = {
          ...category,
          cards: categoryCards
        };
      });

      // Load user progress if authenticated
      if (window.authManager?.isAuthenticated()) {
        await this.loadUserProgress();
      } else {
        // Load from localStorage for offline use
        this.loadLocalProgress();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to local data
      this.loadFallbackData();
    }
  }

  async loadUserProgress() {
    const user = window.authManager.getCurrentUser();
    if (!user) return;

    try {
      // Load flashcard progress
      const { data: progressData } = await window.dbService.getUserFlashcardProgress(user.id);
      
      // Convert to Map for easier access
      this.progress = new Map();
      progressData?.forEach(progress => {
        this.progress.set(progress.flashcard_id, {
          confidence_level: progress.confidence_level,
          times_reviewed: progress.times_reviewed,
          is_mastered: progress.is_mastered,
          last_reviewed_at: progress.last_reviewed_at,
          next_review_at: progress.next_review_at
        });
      });

      // Load user stats
      const { data: stats } = await window.dbService.getUserStats(user.id);
      this.userStats = stats;

    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  }

  loadLocalProgress() {
    const saved = localStorage.getItem('flashcard-progress');
    if (saved) {
      const progressData = JSON.parse(saved);
      this.progress = new Map();
      Object.entries(progressData).forEach(([cardId, data]) => {
        this.progress.set(cardId, data);
      });
    }
  }

  loadFallbackData() {
    // Use the original static data as fallback
    this.data = {
      'react_fundamentals': {
        id: 'react_fundamentals',
        name: 'React Fundamentals',
        description: 'Core React concepts, components, and patterns',
        color: '#61dafb',
        icon: '⚛️',
        cards: [
          {
            id: 'react_001',
            front: 'What is the Virtual DOM and how does it work?',
            back: 'The Virtual DOM is a JavaScript representation of the actual DOM...'
          }
          // ... more cards
        ]
      }
      // ... more categories
    };
  }

  setupRealtimeSubscriptions() {
    const user = window.authManager.getCurrentUser();
    if (!user) return;

    // Subscribe to progress updates
    window.dbService.subscribeToUserProgress(user.id, (payload) => {
      this.handleProgressUpdate(payload);
    });

    // Subscribe to stats updates
    window.dbService.subscribeToUserStats(user.id, (payload) => {
      this.handleStatsUpdate(payload);
    });
  }

  handleProgressUpdate(payload) {
    // Update local progress cache
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      this.progress.set(newRecord.flashcard_id, {
        confidence_level: newRecord.confidence_level,
        times_reviewed: newRecord.times_reviewed,
        is_mastered: newRecord.is_mastered,
        last_reviewed_at: newRecord.last_reviewed_at,
        next_review_at: newRecord.next_review_at
      });
    } else if (eventType === 'DELETE' && oldRecord) {
      this.progress.delete(oldRecord.flashcard_id);
    }

    // Update UI
    this.updateDashboardStats();
  }

  handleStatsUpdate(payload) {
    if (payload.eventType === 'UPDATE') {
      this.userStats = payload.new;
      window.authManager.updateUserInfo();
    }
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
    
    // Dashboard navigation
    document.getElementById('backToDashboard')?.addEventListener('click', () => this.showDashboard());
    
    // Auth buttons
    document.getElementById('showLogin')?.addEventListener('click', () => this.showLoginModal());
    document.getElementById('showSignup')?.addEventListener('click', () => this.showSignupModal());
    document.getElementById('signOutBtn')?.addEventListener('click', () => this.signOut());
    
    // Study mode cards
    document.querySelectorAll('.study-mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        this.handleStudyModeClick(mode);
      });
    });
    
    // Flashcard controls
    document.getElementById('flashcard')?.addEventListener('click', () => this.flipCard());
    document.getElementById('prevCard')?.addEventListener('click', () => this.previousCard());
    document.getElementById('nextCard')?.addEventListener('click', () => this.nextCard());
    document.getElementById('reviewAgain')?.addEventListener('click', () => this.markCard('review'));
    document.getElementById('knowIt')?.addEventListener('click', () => this.markCard('known'));
    
    // Modal controls
    document.getElementById('closeModal')?.addEventListener('click', () => this.hideModal());
    document.getElementById('studyReviewCards')?.addEventListener('click', () => this.studyReviewCards());
    document.getElementById('restartCategory')?.addEventListener('click', () => this.restartCategory());
    document.getElementById('backToDashboardFromModal')?.addEventListener('click', () => {
      this.hideModal();
      this.showDashboard();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Auth form submissions
    document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
    document.getElementById('signupForm')?.addEventListener('submit', (e) => this.handleSignup(e));
  }

  async startStudying(categoryId) {
    this.currentCategory = categoryId;
    this.currentCards = this.data[categoryId]?.cards || [];
    
    if (this.currentCards.length === 0) {
      alert('No cards found in this category.');
      return;
    }

    // Start study session tracking
    this.startStudySession('flashcards');
    
    // Get optimal cards to study (spaced repetition)
    if (window.authManager?.isAuthenticated()) {
      this.currentCards = await this.getOptimalCards(categoryId);
    }
    
    this.currentCardIndex = 0;
    this.showStudyView();
    this.renderCurrentCard();
    this.updateStudyInterface();
  }

  async getOptimalCards(categoryId) {
    const user = window.authManager.getCurrentUser();
    if (!user) return this.data[categoryId]?.cards || [];

    // Get spaced repetition data
    const { data: spacedData } = await window.dbService.getSpacedRepetitionData(user.id);
    
    const allCards = this.data[categoryId]?.cards || [];
    const now = new Date();
    
    // Sort cards by review priority
    return allCards.sort((a, b) => {
      const aData = spacedData?.find(d => d.flashcard_id === a.id);
      const bData = spacedData?.find(d => d.flashcard_id === b.id);
      
      // Cards due for review first
      if (aData?.next_review && bData?.next_review) {
        const aNext = new Date(aData.next_review);
        const bNext = new Date(bData.next_review);
        
        if (aNext <= now && bNext > now) return -1;
        if (bNext <= now && aNext > now) return 1;
        
        return aNext - bNext;
      }
      
      // New cards last
      if (!aData && bData) return 1;
      if (!bData && aData) return -1;
      
      return 0;
    });
  }

  startStudySession(type) {
    this.studySession = {
      type,
      startTime: new Date(),
      itemsStudied: 0,
      correctAnswers: 0
    };
  }

  async endStudySession() {
    if (!this.studySession.startTime) return;
    
    const duration = Math.round((new Date() - this.studySession.startTime) / 60000); // minutes
    const performanceScore = this.studySession.itemsStudied > 0 
      ? this.studySession.correctAnswers / this.studySession.itemsStudied 
      : 0;
    
    // Save session to database if authenticated
    const user = window.authManager.getCurrentUser();
    if (user) {
      await window.dbService.createStudySession(user.id, {
        session_type: this.studySession.type,
        duration,
        items_studied: this.studySession.itemsStudied,
        performance_score: performanceScore,
        session_date: new Date().toISOString().split('T')[0]
      });
    }
    
    // Reset session
    this.studySession = {
      startTime: null,
      itemsStudied: 0,
      correctAnswers: 0
    };
  }

  async markCard(type) {
    if (!this.currentCategory || !this.currentCards.length) return;
    
    const card = this.currentCards[this.currentCardIndex];
    const user = window.authManager.getCurrentUser();
    
    // Update session stats
    this.studySession.itemsStudied++;
    if (type === 'known') {
      this.studySession.correctAnswers++;
    }
    
    if (user) {
      // Update progress in database
      const confidenceLevel = type === 'known' ? 5 : 2;
      
      await window.dbService.updateFlashcardProgress(user.id, card.id, {
        confidence_level: confidenceLevel,
        times_reviewed: (this.progress.get(card.id)?.times_reviewed || 0) + 1,
        last_reviewed_at: new Date().toISOString(),
        is_mastered: type === 'known'
      });
      
      // Update spaced repetition data
      await window.dbService.updateSpacedRepetitionData(user.id, card.id, confidenceLevel);
    } else {
      // Update local progress
      this.updateLocalProgress(card.id, type);
    }
    
    this.nextCard();
  }

  updateLocalProgress(cardId, type) {
    const current = this.progress.get(cardId) || {
      confidence_level: 3,
      times_reviewed: 0,
      is_mastered: false
    };
    
    current.times_reviewed++;
    current.confidence_level = type === 'known' ? 5 : 2;
    current.is_mastered = type === 'known';
    current.last_reviewed_at = new Date().toISOString();
    
    this.progress.set(cardId, current);
    
    // Save to localStorage
    const progressObj = {};
    this.progress.forEach((value, key) => {
      progressObj[key] = value;
    });
    localStorage.setItem('flashcard-progress', JSON.stringify(progressObj));
  }

  renderDashboard() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Object.entries(this.data || {}).forEach(([key, category]) => {
      const totalCards = category.cards?.length || 0;
      const masteredCards = this.getMasteredCardsCount(category.cards);
      const completionPercentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
      
      const card = document.createElement('div');
      card.className = 'category-card';
      card.style.setProperty('--category-color', category.color);
      card.innerHTML = `
        <div class="category-header">
          <div class="category-icon">${category.icon}</div>
          <div>
            <h3 class="category-title">${category.name}</h3>
          </div>
        </div>
        <p class="category-description">${category.description}</p>
        <div class="category-meta">
          <span class="category-cards-count">${totalCards} cards</span>
          <div class="category-progress">
            <div class="progress-circle">${completionPercentage}%</div>
          </div>
        </div>
      `;
      
      card.addEventListener('click', () => this.startStudying(key));
      grid.appendChild(card);
    });
  }

  getMasteredCardsCount(cards) {
    if (!cards) return 0;
    return cards.filter(card => this.progress.get(card.id)?.is_mastered).length;
  }

  updateDashboardStats() {
    let totalStudied = 0;
    let totalCards = 0;
    let masteredCards = 0;
    
    Object.values(this.data || {}).forEach(category => {
      if (category.cards) {
        totalCards += category.cards.length;
        category.cards.forEach(card => {
          const progress = this.progress.get(card.id);
          if (progress?.times_reviewed > 0) totalStudied++;
          if (progress?.is_mastered) masteredCards++;
        });
      }
    });
    
    const overallPercentage = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
    
    const overallProgressEl = document.getElementById('overallProgress');
    const overallProgressTextEl = document.getElementById('overallProgressText');
    const flashcardProgressEl = document.getElementById('flashcardProgress');
    
    if (overallProgressEl) overallProgressEl.style.width = `${overallPercentage}%`;
    if (overallProgressTextEl) overallProgressTextEl.textContent = `${overallPercentage}% Complete`;
    if (flashcardProgressEl) flashcardProgressEl.textContent = masteredCards;
  }

  // Auth methods
  showLoginModal() {
    this.showModal('loginModal');
  }

  showSignupModal() {
    this.showModal('signupModal');
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  hideModal(modalId = null) {
    if (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('hidden');
    } else {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
      });
    }
  }

  async handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    const result = await window.authManager.signIn(email, password);
    
    if (!result.error) {
      this.hideModal('loginModal');
      // Reload data with user context
      await this.loadData();
      this.renderDashboard();
      this.updateDashboardStats();
    }
  }

  async handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const fullName = formData.get('fullName');
    
    const result = await window.authManager.signUp(email, password, fullName);
    
    if (!result.error) {
      this.hideModal('signupModal');
    }
  }

  async signOut() {
    await this.endStudySession();
    await window.authManager.signOut();
  }

  // All other methods from the original app...
  // (keeping them for compatibility)
  
  // Rest of the original FlashcardApp methods go here
  // (I'll include a few key ones for demonstration)
  
  flipCard() {
    this.isFlipped = !this.isFlipped;
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
      flashcard.classList.toggle('flipped', this.isFlipped);
    }
  }

  nextCard() {
    if (!this.currentCards.length) return;
    
    if (this.currentCardIndex < this.currentCards.length - 1) {
      this.currentCardIndex++;
      this.renderCurrentCard();
      this.updateStudyInterface();
    } else {
      this.showCompletionModal();
    }
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.renderCurrentCard();
      this.updateStudyInterface();
    }
  }

  renderCurrentCard() {
    if (!this.currentCards.length) return;
    
    const card = this.currentCards[this.currentCardIndex];
    
    const frontContent = document.getElementById('card-front-content');
    const backContent = document.getElementById('card-back-content');
    
    if (frontContent) frontContent.innerHTML = this.formatCardContent(card.front);
    if (backContent) backContent.innerHTML = this.formatCardContent(card.back);
    
    // Reset flip state
    this.isFlipped = false;
    const flashcard = document.getElementById('flashcard');
    if (flashcard) flashcard.classList.remove('flipped');
  }

  formatCardContent(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>')
      .replace(/\n/g, '<br>');
  }

  showStudyView() {
    const dashboard = document.getElementById('dashboard');
    const studyView = document.getElementById('study-view');
    
    if (dashboard) dashboard.classList.add('hidden');
    if (studyView) studyView.classList.remove('hidden');
  }

  showDashboard() {
    const studyView = document.getElementById('study-view');
    const dashboard = document.getElementById('dashboard');
    
    if (studyView) studyView.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');
    
    this.endStudySession();
    this.renderDashboard();
    this.updateDashboardStats();
  }

  updateStudyInterface() {
    if (!this.currentCards.length) return;
    
    const totalCards = this.currentCards.length;
    const currentIndex = this.currentCardIndex + 1;
    
    const categoryTitleEl = document.getElementById('categoryTitle');
    const cardProgressEl = document.getElementById('cardProgress');
    const studyProgressEl = document.getElementById('studyProgress');
    
    if (categoryTitleEl && this.currentCategory) {
      categoryTitleEl.textContent = this.data[this.currentCategory]?.name || 'Category';
    }
    
    if (cardProgressEl) {
      cardProgressEl.textContent = `${currentIndex} / ${totalCards}`;
    }
    
    if (studyProgressEl) {
      const progressPercentage = (currentIndex / totalCards) * 100;
      studyProgressEl.style.width = `${progressPercentage}%`;
    }
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevCard');
    const nextBtn = document.getElementById('nextCard');
    
    if (prevBtn) prevBtn.disabled = this.currentCardIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentCardIndex === totalCards - 1;
  }

  showCompletionModal() {
    const modal = document.getElementById('completionModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
    
    this.endStudySession();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-color-scheme', savedTheme);
      this.updateThemeIcon(savedTheme);
    }
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-color-scheme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-color-scheme', newTheme);
    localStorage.setItem('theme', newTheme);
    this.updateThemeIcon(newTheme);
  }

  updateThemeIcon(theme) {
    const icon = document.getElementById('themeToggle');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  loadInterviewDate() {
    const saved = localStorage.getItem('interview-date');
    if (saved) {
      return new Date(saved);
    }
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    return tomorrow;
  }

  startCountdown() {
    const updateCountdown = () => {
      const now = new Date();
      const diff = this.interviewDate - now;
      
      const countdownEl = document.getElementById('countdownTime');
      if (!countdownEl) return;
      
      if (diff <= 0) {
        countdownEl.textContent = '00:00:00';
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      countdownEl.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  handleKeyboard(e) {
    const studyView = document.getElementById('study-view');
    if (!studyView || studyView.classList.contains('hidden')) return;
    
    switch(e.code) {
      case 'Space':
        e.preventDefault();
        this.flipCard();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.previousCard();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextCard();
        break;
      case 'Digit1':
        e.preventDefault();
        this.markCard('review');
        break;
      case 'Digit2':
        e.preventDefault();
        this.markCard('known');
        break;
    }
  }

  handleStudyModeClick(mode) {
    switch(mode) {
      case 'flashcards':
        // Show flashcard categories - this is handled by category cards
        break;
      case 'challenges':
        alert('Coding challenges coming soon! Enhanced version will include full challenge mode.');
        break;
      case 'roadmap':
        alert('Study roadmap coming soon! Enhanced version will include progress tracking.');
        break;
    }
  }

  restartCategory() {
    this.currentCardIndex = 0;
    this.hideModal();
    this.renderCurrentCard();
    this.updateStudyInterface();
    this.startStudySession('flashcards');
  }

  studyReviewCards() {
    // Filter to only review cards (cards marked for review)
    if (window.authManager?.isAuthenticated()) {
      this.currentCards = this.currentCards.filter(card => {
        const progress = this.progress.get(card.id);
        return progress && !progress.is_mastered;
      });
    }
    
    if (this.currentCards.length === 0) {
      alert('No cards to review!');
      return;
    }
    
    this.currentCardIndex = 0;
    this.hideModal();
    this.renderCurrentCard();
    this.updateStudyInterface();
    this.startStudySession('flashcards');
  }

  resetProgress() {
    this.progress = new Map();
    localStorage.removeItem('flashcard-progress');
    this.updateDashboardStats();
  }
}

// Initialize the enhanced application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedFlashcardApp = new EnhancedFlashcardApp();
});