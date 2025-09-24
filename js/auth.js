// Authentication management
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.authListeners = [];
    this.init();
  }

  async init() {
    // Check for existing session
    this.currentUser = await window.dbService.getCurrentUser();
    
    // Listen for auth state changes
    window.dbService.onAuthStateChange((event, session) => {
      this.currentUser = session?.user || null;
      this.notifyListeners(event, session);
      
      if (event === 'SIGNED_IN') {
        this.handleSignIn(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.handleSignOut();
      }
    });

    // Update UI based on auth state
    this.updateAuthUI();
  }

  async handleSignIn(user) {
    // Get or create user profile
    const { data: profile, error } = await window.dbService.getProfile(user.id);
    
    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    // Update UI for logged in user
    this.updateAuthUI();
    
    // Load user data
    await this.loadUserData();
    
    // Show success message
    this.showNotification('Welcome back!', 'success');
  }

  async handleSignOut() {
    this.currentUser = null;
    this.updateAuthUI();
    
    // Clear local storage
    localStorage.removeItem('flashcard-progress');
    localStorage.removeItem('interview-date');
    
    // Reset app state
    if (window.flashcardApp) {
      window.flashcardApp.resetProgress();
    }
    
    this.showNotification('Signed out successfully', 'info');
  }

  async signUp(email, password, fullName) {
    const { data, error } = await window.dbService.signUp(email, password, {
      full_name: fullName
    });
    
    if (error) {
      this.showNotification(error.message, 'error');
      return { error };
    }
    
    this.showNotification('Account created! Please check your email to verify.', 'success');
    return { data };
  }

  async signIn(email, password) {
    const { data, error } = await window.dbService.signIn(email, password);
    
    if (error) {
      this.showNotification(error.message, 'error');
      return { error };
    }
    
    return { data };
  }

  async signOut() {
    const { error } = await window.dbService.signOut();
    
    if (error) {
      this.showNotification(error.message, 'error');
      return { error };
    }
    
    return { success: true };
  }

  async loadUserData() {
    if (!this.currentUser) return;
    
    // Load user stats
    const { data: stats } = await window.dbService.getUserStats(this.currentUser.id);
    
    // Load progress data
    const { data: progress } = await window.dbService.getUserFlashcardProgress(this.currentUser.id);
    
    // Update app with user data
    if (window.flashcardApp) {
      window.flashcardApp.loadUserProgress(progress, stats);
    }
  }

  updateAuthUI() {
    const authContainer = document.getElementById('authContainer');
    const userContainer = document.getElementById('userContainer');
    const mainApp = document.getElementById('mainApp');
    
    if (this.currentUser) {
      // User is logged in
      if (authContainer) authContainer.style.display = 'none';
      if (userContainer) {
        userContainer.style.display = 'block';
        this.updateUserInfo();
      }
      if (mainApp) mainApp.style.display = 'block';
    } else {
      // User is not logged in
      if (authContainer) authContainer.style.display = 'block';
      if (userContainer) userContainer.style.display = 'none';
      if (mainApp) mainApp.style.display = 'none';
    }
  }

  async updateUserInfo() {
    if (!this.currentUser) return;
    
    const { data: profile } = await window.dbService.getProfile(this.currentUser.id);
    const { data: stats } = await window.dbService.getUserStats(this.currentUser.id);
    
    // Update user info in UI
    const userNameElement = document.getElementById('userName');
    const userStatsElement = document.getElementById('userStats');
    
    if (userNameElement && profile) {
      userNameElement.textContent = profile.full_name || profile.email;
    }
    
    if (userStatsElement && stats) {
      userStatsElement.innerHTML = `
        <div class="stat">
          <span class="stat-number">${stats.current_streak}</span>
          <span class="stat-label">Day Streak</span>
        </div>
        <div class="stat">
          <span class="stat-number">${Math.round(stats.total_study_time / 60)}h</span>
          <span class="stat-label">Total Time</span>
        </div>
        <div class="stat">
          <span class="stat-number">${stats.flashcards_mastered}</span>
          <span class="stat-label">Cards Mastered</span>
        </div>
      `;
    }
  }

  addAuthListener(callback) {
    this.authListeners.push(callback);
  }

  notifyListeners(event, session) {
    this.authListeners.forEach(callback => {
      callback(event, session);
    });
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// Initialize auth manager
window.authManager = new AuthManager();