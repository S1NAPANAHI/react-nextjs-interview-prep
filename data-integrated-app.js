// Enhanced React Interview Prep Application with Full Data Integration
// This app loads all JSON data files and displays them interactively

class ReactInterviewPrepApp {
  constructor() {
    // Application state
    this.currentView = 'dashboard';
    this.currentSection = null;
    this.currentQuestionSet = [];
    this.currentQuestionIndex = 0;
    this.sidebarCollapsed = false;
    
    // Progress tracking
    this.completedQuestions = new Set(JSON.parse(localStorage.getItem('completedQuestions') || '[]'));
    this.bookmarkedQuestions = new Set(JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]'));
    this.progress = JSON.parse(localStorage.getItem('progress') || '{}');
    
    // Data storage
    this.allData = {};
    this.organizedData = {
      quickStart: [],
      fundamentals: [],
      hooks: [],
      stateManagement: [],
      performance: [],
      advanced: [],
      practice: [],
      flashcards: {},
      challenges: []
    };
    
    // Theme and UI state
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  async init() {
    this.showLoading('Initializing application...');
    await this.loadAllDataFiles();
    this.organizeAllData();
    this.setupUI();
    this.setupEventListeners();
    this.applyTheme();
    this.hideLoading();
    this.renderDashboard();
    console.log('✅ React Interview Prep App initialized successfully!');
  }

  // ==============================================
  // DATA LOADING AND ORGANIZATION
  // ==============================================

  async loadAllDataFiles() {
    const dataFiles = [
      { name: 'top10', file: 'data/top-10-questions.json' },
      { name: 'top20', file: 'data/top-20-questions.json' },
      { name: 'top50', file: 'data/top-50-questions.json' },
      { name: 'top100', file: 'data/top-100-questions.json' },
      { name: 'flashcards', file: 'data/flashcards.json' },
      { name: 'challenges', file: 'data/challenges.json' },
      { name: 'enhanced', file: 'data/enhanced-questions.json' },
      { name: 'complete', file: 'data/react-interview-questions-complete.json' },
      { name: 'interviewSystem', file: 'data/enhanced-interview-system.json' },
      { name: 'tiers', file: 'data/tier-system.json' }
    ];

    this.updateLoadingProgress(0, 'Loading data files...');
    
    const loadPromises = dataFiles.map(async ({ name, file }, index) => {
      try {
        console.log(`📥 Loading ${file}...`);
        const response = await fetch(file);
        
        if (!response.ok) {
          console.warn(`⚠️ Could not load ${file}: ${response.statusText}`);
          return null;
        }
        
        const data = await response.json();
        this.allData[name] = data;
        
        this.updateLoadingProgress(
          ((index + 1) / dataFiles.length) * 50,
          `Loaded ${name}...`
        );
        
        console.log(`✅ Loaded ${file}:`, {
          hasQuestions: !!data.questions,
          questionCount: data.questions?.length || 0,
          hasCategories: !!data.categories,
          structure: Object.keys(data).slice(0, 5)
        });
        
        return { name, data };
      } catch (error) {
        console.error(`❌ Error loading ${file}:`, error);
        return null;
      }
    });

    await Promise.all(loadPromises);
    this.updateLoadingProgress(50, 'Processing data...');
    console.log('📊 All data loaded:', Object.keys(this.allData));
  }

  organizeAllData() {
    console.log('🗂️ Organizing data into sections...');
    
    // Organize Top Questions
    this.organizeTopQuestions();
    
    // Organize by categories
    this.organizeByCategoryContent();
    
    // Process Flashcards
    this.processFlashcardsData();
    
    // Process Challenges
    this.processChallengesData();
    
    this.updateLoadingProgress(75, 'Finalizing organization...');
    console.log('📋 Data organized:', {
      quickStart: this.organizedData.quickStart.length,
      fundamentals: this.organizedData.fundamentals.length,
      hooks: this.organizedData.hooks.length,
      flashcards: Object.keys(this.organizedData.flashcards).length,
      challenges: this.organizedData.challenges.length
    });
  }

  organizeTopQuestions() {
    // Top 10 Essential Questions
    if (this.allData.top10?.questions) {
      this.organizedData.quickStart.push({
        id: 'top-10-essential',
        title: '🚀 Top 10 Essential Questions',
        description: this.allData.top10.description || 'Most important React questions',
        icon: '⭐',
        questions: this.normalizeQuestions(this.allData.top10.questions, 'top10'),
        difficulty: 'Beginner',
        priority: 'high'
      });
    }
    
    // Top 20 Core Questions
    if (this.allData.top20?.questions) {
      this.organizedData.quickStart.push({
        id: 'top-20-core',
        title: '🔥 Top 20 Core Questions',
        description: this.allData.top20.description || 'Core React concepts',
        icon: '💪',
        questions: this.normalizeQuestions(this.allData.top20.questions, 'top20'),
        difficulty: 'Intermediate',
        priority: 'high'
      });
    }

    // Complete Collections
    if (this.allData.top50?.questions) {
      this.organizedData.practice.push({
        id: 'top-50-complete',
        title: '💯 Top 50 Questions',
        description: 'Comprehensive question set',
        icon: '📚',
        questions: this.normalizeQuestions(this.allData.top50.questions, 'top50'),
        difficulty: 'Mixed',
        priority: 'medium'
      });
    }

    if (this.allData.top100?.questions) {
      this.organizedData.practice.push({
        id: 'top-100-complete',
        title: '🎯 Top 100 Questions',
        description: 'Ultimate practice collection',
        icon: '🏆',
        questions: this.normalizeQuestions(this.allData.top100.questions, 'top100'),
        difficulty: 'Advanced',
        priority: 'low'
      });
    }
  }

  organizeByCategoryContent() {
    const allQuestions = [];
    
    // Collect all questions from all sources
    Object.entries(this.allData).forEach(([source, data]) => {
      if (data.questions && Array.isArray(data.questions)) {
        const normalized = this.normalizeQuestions(data.questions, source);
        allQuestions.push(...normalized);
      }
    });

    // Categorize questions by content
    allQuestions.forEach(question => {
      const categories = this.categorizeQuestion(question);
      
      categories.forEach(category => {
        if (this.organizedData[category]) {
          // Check if question already exists to avoid duplicates
          const exists = this.organizedData[category].some(existing => 
            existing.questions && existing.questions.some(q => q.id === question.id)
          );
          
          if (!exists) {
            // Find or create section for this category
            let section = this.organizedData[category].find(s => s.category === question.category);
            if (!section) {
              section = {
                id: `${category}-${question.category.toLowerCase().replace(/\s+/g, '-')}`,
                title: question.category,
                description: `Questions about ${question.category.toLowerCase()}`,
                icon: this.getCategoryIcon(question.category),
                questions: [],
                difficulty: question.difficulty,
                category: question.category
              };
              this.organizedData[category].push(section);
            }
            section.questions.push(question);
          }
        }
      });
    });
  }

  categorizeQuestion(question) {
    const text = (question.question + ' ' + (question.answer || '') + ' ' + (question.category || '')).toLowerCase();
    const categories = [];

    // React Hooks
    if (text.includes('hook') || text.includes('usestate') || text.includes('useeffect') || 
        text.includes('usememo') || text.includes('usecallback') || text.includes('usecontext') ||
        text.includes('usereducer') || text.includes('useref')) {
      categories.push('hooks');
    }

    // State Management
    if (text.includes('redux') || text.includes('context api') || text.includes('state management') ||
        text.includes('zustand') || text.includes('provider') || text.includes('store')) {
      categories.push('stateManagement');
    }

    // Performance
    if (text.includes('performance') || text.includes('optimization') || text.includes('memo') ||
        text.includes('lazy') || text.includes('suspense') || text.includes('code splitting')) {
      categories.push('performance');
    }

    // Advanced Topics
    if (text.includes('error boundary') || text.includes('higher-order') || text.includes('hoc') ||
        text.includes('render prop') || text.includes('compound component') || text.includes('portal')) {
      categories.push('advanced');
    }

    // Default to fundamentals if no specific category found
    if (categories.length === 0) {
      categories.push('fundamentals');
    }

    return categories;
  }

  getCategoryIcon(category) {
    const iconMap = {
      'React Fundamentals': '⚛️',
      'React Hooks': '🎣',
      'Components': '🧩',
      'State Management': '🗃️',
      'Props': '📦',
      'JSX': '📝',
      'Event Handling': '🎯',
      'Performance': '⚡',
      'Testing': '🧪',
      'Advanced': '🔬',
      'Next.js': '▲'
    };
    
    return iconMap[category] || '📄';
  }

  processFlashcardsData() {
    if (!this.allData.flashcards?.categories) return;
    
    console.log('🎴 Processing flashcards data...');
    
    Object.entries(this.allData.flashcards.categories).forEach(([key, category]) => {
      this.organizedData.flashcards[key] = {
        id: key,
        title: category.title,
        description: category.description,
        icon: category.icon || '🎴',
        color: category.color || '#007bff',
        cards: category.cards || [],
        totalCards: category.cards?.length || 0
      };
    });
  }

  processChallengesData() {
    if (!this.allData.challenges) return;
    
    console.log('🎯 Processing challenges data...');
    
    // Handle different challenge data structures
    if (this.allData.challenges.react_challenges) {
      Object.entries(this.allData.challenges.react_challenges).forEach(([difficulty, challenges]) => {
        if (Array.isArray(challenges)) {
          challenges.forEach(challenge => {
            this.organizedData.challenges.push({
              id: challenge.id || `challenge-${Date.now()}-${Math.random()}`,
              title: challenge.title,
              description: challenge.description,
              difficulty: difficulty,
              requirements: challenge.requirements || [],
              hints: challenge.hints || [],
              solution: challenge.solution || '',
              category: 'React Challenges'
            });
          });
        }
      });
    }
  }

  normalizeQuestions(questions, source) {
    return questions.map((q, index) => ({
      ...q,
      id: q.id || `${source}-${index}-${Date.now()}`,
      source: source,
      category: q.category || 'General',
      difficulty: q.difficulty || 'Intermediate',
      keyPoints: q.keyPoints || [],
      followUpQuestions: q.followUpQuestions || [],
      codeExample: q.codeExample || null
    }));
  }

  // ==============================================
  // UI RENDERING
  // ==============================================

  setupUI() {
    this.renderSidebar();
    this.updateProgressStats();
  }

  renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    sidebar.innerHTML = `
      <div class="sidebar-content">
        <div class="sidebar-header">
          <h2>🚀 React Prep</h2>
          <button id="sidebarToggle" class="sidebar-toggle">
            <span class="hamburger"></span>
          </button>
        </div>
        
        <!-- Progress Summary -->
        <div class="progress-summary">
          <h3>📊 Your Progress</h3>
          <div class="progress-stats">
            <div class="stat">
              <span class="stat-number" id="completedCount">${this.completedQuestions.size}</span>
              <span class="stat-label">Completed</span>
            </div>
            <div class="stat">
              <span class="stat-number" id="bookmarkedCount">${this.bookmarkedQuestions.size}</span>
              <span class="stat-label">Bookmarked</span>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" id="overallProgressBar"></div>
          </div>
        </div>

        <!-- Navigation Sections -->
        <nav class="sidebar-nav">
          ${this.renderNavigationSections()}
        </nav>
      </div>
    `;
  }

  renderNavigationSections() {
    const sections = [
      {
        key: 'quickStart',
        title: '🚀 Quick Start',
        description: 'Essential questions to get started',
        sections: this.organizedData.quickStart
      },
      {
        key: 'fundamentals',
        title: '⚛️ React Fundamentals',
        description: 'Core React concepts',
        sections: this.organizedData.fundamentals
      },
      {
        key: 'hooks',
        title: '🎣 React Hooks',
        description: 'Modern React with Hooks',
        sections: this.organizedData.hooks
      },
      {
        key: 'stateManagement',
        title: '🗃️ State Management',
        description: 'Managing application state',
        sections: this.organizedData.stateManagement
      },
      {
        key: 'performance',
        title: '⚡ Performance',
        description: 'Optimization techniques',
        sections: this.organizedData.performance
      },
      {
        key: 'advanced',
        title: '🔬 Advanced Topics',
        description: 'Advanced React patterns',
        sections: this.organizedData.advanced
      },
      {
        key: 'practice',
        title: '🏆 Practice Collections',
        description: 'Complete question sets',
        sections: this.organizedData.practice
      },
      {
        key: 'flashcards',
        title: '🎴 Flashcards',
        description: 'Interactive study cards',
        sections: Object.values(this.organizedData.flashcards)
      },
      {
        key: 'challenges',
        title: '🎯 Coding Challenges',
        description: 'Hands-on practice',
        sections: [{ title: 'All Challenges', questions: this.organizedData.challenges }]
      }
    ];

    return sections.map(section => {
      if (!section.sections || section.sections.length === 0) {
        return ``; // Skip empty sections
      }

      return `
        <div class="nav-section">
          <div class="nav-section-header" onclick="app.toggleSection('${section.key}')">
            <span class="nav-section-title">${section.title}</span>
            <span class="nav-section-count">${this.getSectionCount(section.sections)}</span>
            <span class="nav-section-arrow">▼</span>
          </div>
          
          <div class="nav-section-content" id="section-${section.key}">
            ${section.sections.map(subsection => `
              <div class="nav-item" onclick="app.loadSection('${section.key}', '${subsection.id || subsection.title}')">
                <span class="nav-item-icon">${subsection.icon || '📄'}</span>
                <div class="nav-item-content">
                  <span class="nav-item-title">${subsection.title}</span>
                  <span class="nav-item-count">${subsection.questions?.length || subsection.cards?.length || subsection.totalCards || 0}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  getSectionCount(sections) {
    if (!sections || !Array.isArray(sections)) return 0;
    return sections.reduce((total, section) => {
      return total + (section.questions?.length || section.cards?.length || section.totalCards || 0);
    }, 0);
  }

  renderDashboard() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    const totalQuestions = this.getTotalQuestions();
    const completionPercentage = this.getCompletionPercentage();

    mainContent.innerHTML = `
      <div class="dashboard">
        <div class="dashboard-header">
          <h1>🚀 React & Next.js Interview Prep</h1>
          <p class="dashboard-subtitle">Master React interviews with comprehensive, organized practice</p>
          
          <div class="dashboard-stats">
            <div class="stat-card">
              <div class="stat-number">${totalQuestions}</div>
              <div class="stat-label">Total Questions</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${this.completedQuestions.size}</div>
              <div class="stat-label">Completed</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${this.bookmarkedQuestions.size}</div>
              <div class="stat-label">Bookmarked</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${completionPercentage}%</div>
              <div class="stat-label">Progress</div>
            </div>
          </div>
        </div>

        <div class="dashboard-actions">
          <button class="action-btn primary" onclick="app.startQuickPractice()">
            ⚡ Quick Practice
          </button>
          <button class="action-btn secondary" onclick="app.showBookmarks()">
            ⭐ View Bookmarks
          </button>
          <button class="action-btn secondary" onclick="app.showProgress()">
            📊 View Progress
          </button>
        </div>

        <div class="dashboard-sections">
          ${this.renderDashboardSections()}
        </div>
      </div>
    `;
  }

  renderDashboardSections() {
    const sections = [
      { key: 'quickStart', title: '🚀 Quick Start', data: this.organizedData.quickStart },
      { key: 'fundamentals', title: '⚛️ React Fundamentals', data: this.organizedData.fundamentals },
      { key: 'hooks', title: '🎣 React Hooks', data: this.organizedData.hooks },
      { key: 'flashcards', title: '🎴 Flashcards', data: Object.values(this.organizedData.flashcards) }
    ];

    return sections.filter(section => section.data.length > 0).map(section => `
      <div class="section-preview">
        <div class="section-preview-header">
          <h3>${section.title}</h3>
          <span class="section-count">${section.data.length} sets</span>
        </div>
        
        <div class="preview-grid">
          ${section.data.slice(0, 4).map(item => `
            <div class="preview-card" onclick="app.loadSection('${section.key}', '${item.id || item.title}')">
              <div class="preview-icon">${item.icon || '📄'}</div>
              <div class="preview-title">${item.title}</div>
              <div class="preview-count">${item.questions?.length || item.cards?.length || item.totalCards || 0}</div>
            </div>
          `).join('')}
        </div>
        
        ${section.data.length > 4 ? `
          <button class="view-all-btn" onclick="app.toggleSection('${section.key}')">
            View All ${section.data.length} Sets →
          </button>
        ` : ''}
      </div>
    `).join('');
  }

  // ==============================================
  // QUESTION DISPLAY AND INTERACTION
  // ==============================================

  loadSection(sectionKey, itemId) {
    console.log(`📖 Loading section: ${sectionKey}/${itemId}`);
    
    let sectionData = null;
    
    // Find the section data
    if (this.organizedData[sectionKey]) {
      if (sectionKey === 'flashcards') {
        sectionData = this.organizedData[sectionKey][itemId];
        if (sectionData) {
          this.showFlashcards(sectionData);
          return;
        }
      } else {
        sectionData = this.organizedData[sectionKey].find(item => 
          (item.id === itemId) || (item.title === itemId)
        );
      }
    }
    
    if (!sectionData) {
      console.error('Section not found:', sectionKey, itemId);
      return;
    }
    
    this.currentSection = sectionData;
    this.currentQuestionSet = sectionData.questions || [];
    this.currentQuestionIndex = 0;
    
    this.showQuestionView();
  }

  showQuestionView() {
    if (!this.currentSection || !this.currentQuestionSet.length) {
      console.error('No questions to display');
      return;
    }

    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    const totalQuestions = this.currentQuestionSet.length;
    const completedInSection = this.currentQuestionSet.filter(q => 
      this.completedQuestions.has(q.id)).length;

    mainContent.innerHTML = `
      <div class="question-view">
        <div class="question-header">
          <button class="back-btn" onclick="app.renderDashboard()">
            ← Back to Dashboard
          </button>
          
          <div class="question-header-info">
            <h1>${this.currentSection.icon || '📄'} ${this.currentSection.title}</h1>
            <p>${this.currentSection.description || ''}</p>
            <div class="question-stats">
              <span>📊 ${totalQuestions} questions</span>
              <span>✅ ${completedInSection} completed</span>
              <span>⭐ ${this.currentQuestionSet.filter(q => this.bookmarkedQuestions.has(q.id)).length} bookmarked</span>
            </div>
          </div>
        </div>

        <div class="question-controls">
          <div class="question-navigation">
            <button id="prevQuestion" onclick="app.previousQuestion()" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
              ← Previous
            </button>
            <span class="question-counter">
              ${this.currentQuestionIndex + 1} / ${totalQuestions}
            </span>
            <button id="nextQuestion" onclick="app.nextQuestion()" ${this.currentQuestionIndex === totalQuestions - 1 ? 'disabled' : ''}>
              Next →
            </button>
          </div>
          
          <div class="question-actions">
            <button class="action-btn" onclick="app.shuffleQuestions()">
              🎲 Shuffle
            </button>
            <button class="action-btn" onclick="app.toggleAllAnswers()">
              👁️ Show All
            </button>
          </div>
        </div>

        <div class="question-content" id="questionContent">
          ${this.renderCurrentQuestion()}
        </div>
      </div>
    `;
  }

  renderCurrentQuestion() {
    if (!this.currentQuestionSet || this.currentQuestionIndex >= this.currentQuestionSet.length) {
      return '<div class="no-question">No question available</div>';
    }

    const question = this.currentQuestionSet[this.currentQuestionIndex];
    const isCompleted = this.completedQuestions.has(question.id);
    const isBookmarked = this.bookmarkedQuestions.has(question.id);

    return `
      <div class="question-card ${isCompleted ? 'completed' : ''}" data-question-id="${question.id}">
        <div class="question-card-header">
          <div class="question-meta">
            <span class="question-number">Q${this.currentQuestionIndex + 1}</span>
            <span class="difficulty-badge ${(question.difficulty || 'intermediate').toLowerCase()}">
              ${question.difficulty || 'Intermediate'}
            </span>
            <span class="category-badge">${question.category}</span>
          </div>
          
          <div class="question-actions">
            <button class="action-btn bookmark ${isBookmarked ? 'active' : ''}" 
                    onclick="app.toggleBookmark('${question.id}')" 
                    title="${isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}">
              ${isBookmarked ? '⭐' : '☆'}
            </button>
            <button class="action-btn copy" 
                    onclick="app.copyQuestion('${question.id}')" 
                    title="Copy question">
              📋
            </button>
          </div>
        </div>

        <div class="question-content">
          <h3 class="question-title">${question.question}</h3>
          
          <div class="answer-section">
            <button class="show-answer-btn" id="showAnswerBtn-${question.id}" 
                    onclick="app.toggleAnswer('${question.id}')">
              <span class="btn-icon">👁️</span>
              <span class="btn-text">Show Answer</span>
            </button>
            
            <div class="answer-content" id="answer-${question.id}" style="display: none;">
              <div class="answer-text">
                ${this.formatAnswer(question.answer || 'Answer not available')}
              </div>
              
              ${question.codeExample ? `
                <div class="code-example">
                  <h4>💻 Code Example</h4>
                  <div class="code-block">
                    <pre><code>${this.escapeHtml(typeof question.codeExample === 'string' ? question.codeExample : question.codeExample.code || '')}</code></pre>
                    <button class="copy-code-btn" onclick="app.copyCode('${question.id}')">
                      📋 Copy
                    </button>
                  </div>
                </div>
              ` : ''}
              
              ${question.keyPoints && question.keyPoints.length > 0 ? `
                <div class="key-points">
                  <h4>🔑 Key Points</h4>
                  <ul>
                    ${question.keyPoints.map(point => `<li>${point}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${question.followUpQuestions && question.followUpQuestions.length > 0 ? `
                <div class="follow-up">
                  <h4>🤔 Follow-up Questions</h4>
                  <ul>
                    ${question.followUpQuestions.map(q => `<li>${q}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div class="question-footer">
          <button class="completion-btn ${isCompleted ? 'completed' : ''}" 
                  onclick="app.toggleComplete('${question.id}')">
            ${isCompleted ? '✅ Completed' : '⭕ Mark Complete'}
          </button>
        </div>
      </div>
    `;
  }

  // ==============================================
  // FLASHCARD FUNCTIONALITY
  // ==============================================

  showFlashcards(flashcardSet) {
    console.log('🎴 Showing flashcards:', flashcardSet.title);
    
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    this.currentFlashcardSet = flashcardSet;
    this.currentFlashcardIndex = 0;
    this.isFlashcardFlipped = false;

    mainContent.innerHTML = `
      <div class="flashcard-view">
        <div class="flashcard-header">
          <button class="back-btn" onclick="app.renderDashboard()">
            ← Back to Dashboard
          </button>
          
          <div class="flashcard-info">
            <h1>${flashcardSet.icon || '🎴'} ${flashcardSet.title}</h1>
            <p>${flashcardSet.description || ''}</p>
            <div class="flashcard-progress">
              <span>${this.currentFlashcardIndex + 1} / ${flashcardSet.cards.length}</span>
            </div>
          </div>
        </div>

        <div class="flashcard-container">
          <div class="flashcard" id="flashcard" onclick="app.flipFlashcard()">
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <div class="flashcard-content" id="flashcardFront">
                  ${flashcardSet.cards[0]?.front || 'No content'}
                </div>
              </div>
              <div class="flashcard-back">
                <div class="flashcard-content" id="flashcardBack">
                  ${flashcardSet.cards[0]?.back || 'No content'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flashcard-controls">
          <button id="prevFlashcard" onclick="app.previousFlashcard()" 
                  ${this.currentFlashcardIndex === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          
          <button class="flip-btn" onclick="app.flipFlashcard()">
            🔄 Flip Card
          </button>
          
          <button id="nextFlashcard" onclick="app.nextFlashcard()" 
                  ${this.currentFlashcardIndex === flashcardSet.cards.length - 1 ? 'disabled' : ''}>
            Next →
          </button>
        </div>
        
        <div class="flashcard-actions">
          <button class="difficulty-btn easy" onclick="app.markFlashcard('easy')">
            😊 Easy
          </button>
          <button class="difficulty-btn medium" onclick="app.markFlashcard('medium')">
            😐 Medium
          </button>
          <button class="difficulty-btn hard" onclick="app.markFlashcard('hard')">
            😓 Hard
          </button>
        </div>
      </div>
    `;
  }

  flipFlashcard() {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;
    
    this.isFlashcardFlipped = !this.isFlashcardFlipped;
    flashcard.classList.toggle('flipped', this.isFlashcardFlipped);
  }

  previousFlashcard() {
    if (this.currentFlashcardIndex > 0) {
      this.currentFlashcardIndex--;
      this.updateFlashcard();
    }
  }

  nextFlashcard() {
    if (this.currentFlashcardIndex < this.currentFlashcardSet.cards.length - 1) {
      this.currentFlashcardIndex++;
      this.updateFlashcard();
    }
  }

  updateFlashcard() {
    const flashcard = this.currentFlashcardSet.cards[this.currentFlashcardIndex];
    if (!flashcard) return;
    
    document.getElementById('flashcardFront').innerHTML = flashcard.front;
    document.getElementById('flashcardBack').innerHTML = flashcard.back;
    
    // Reset flip state
    this.isFlashcardFlipped = false;
    document.getElementById('flashcard').classList.remove('flipped');
    
    // Update navigation buttons
    document.getElementById('prevFlashcard').disabled = this.currentFlashcardIndex === 0;
    document.getElementById('nextFlashcard').disabled = this.currentFlashcardIndex === this.currentFlashcardSet.cards.length - 1;
    
    // Update progress
    document.querySelector('.flashcard-progress span').textContent = 
      `${this.currentFlashcardIndex + 1} / ${this.currentFlashcardSet.cards.length}`;
  }

  markFlashcard(difficulty) {
    const cardId = this.currentFlashcardSet.cards[this.currentFlashcardIndex]?.id;
    if (!cardId) return;
    
    // Save flashcard progress (implement as needed)
    console.log(`Marked flashcard ${cardId} as ${difficulty}`);
    
    // Auto-advance to next card
    if (this.currentFlashcardIndex < this.currentFlashcardSet.cards.length - 1) {
      setTimeout(() => this.nextFlashcard(), 500);
    }
  }

  // ==============================================
  // INTERACTION METHODS
  // ==============================================

  toggleAnswer(questionId) {
    const answerElement = document.getElementById(`answer-${questionId}`);
    const buttonElement = document.getElementById(`showAnswerBtn-${questionId}`);
    
    if (!answerElement || !buttonElement) return;
    
    const isVisible = answerElement.style.display === 'block';
    
    answerElement.style.display = isVisible ? 'none' : 'block';
    
    const btnText = buttonElement.querySelector('.btn-text');
    const btnIcon = buttonElement.querySelector('.btn-icon');
    
    if (btnText) btnText.textContent = isVisible ? 'Show Answer' : 'Hide Answer';
    if (btnIcon) btnIcon.textContent = isVisible ? '👁️' : '🙈';
  }

  toggleComplete(questionId) {
    if (this.completedQuestions.has(questionId)) {
      this.completedQuestions.delete(questionId);
      this.showToast('❌ Marked as incomplete', 'info');
    } else {
      this.completedQuestions.add(questionId);
      this.showToast('✅ Question completed!', 'success');
    }
    
    this.saveProgress();
    this.updateQuestionDisplay(questionId);
    this.updateProgressStats();
  }

  toggleBookmark(questionId) {
    if (this.bookmarkedQuestions.has(questionId)) {
      this.bookmarkedQuestions.delete(questionId);
      this.showToast('⭐ Bookmark removed', 'info');
    } else {
      this.bookmarkedQuestions.add(questionId);
      this.showToast('⭐ Question bookmarked!', 'success');
    }
    
    this.saveProgress();
    this.updateQuestionDisplay(questionId);
    this.updateProgressStats();
  }

  copyQuestion(questionId) {
    const question = this.findQuestionById(questionId);
    if (!question) return;
    
    const text = `Q: ${question.question}\n\nA: ${question.answer || 'Answer not provided'}`;
    
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('📋 Question copied!', 'success');
    }).catch(() => {
      this.showToast('❌ Copy failed', 'error');
    });
  }

  copyCode(questionId) {
    const question = this.findQuestionById(questionId);
    if (!question || !question.codeExample) return;
    
    const code = typeof question.codeExample === 'string' 
      ? question.codeExample 
      : question.codeExample.code || '';
    
    navigator.clipboard.writeText(code).then(() => {
      this.showToast('📋 Code copied!', 'success');
    }).catch(() => {
      this.showToast('❌ Copy failed', 'error');
    });
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.updateQuestionView();
    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.currentQuestionSet.length - 1) {
      this.currentQuestionIndex++;
      this.updateQuestionView();
    }
  }

  shuffleQuestions() {
    // Fisher-Yates shuffle algorithm
    for (let i = this.currentQuestionSet.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.currentQuestionSet[i], this.currentQuestionSet[j]] = 
        [this.currentQuestionSet[j], this.currentQuestionSet[i]];
    }
    
    this.currentQuestionIndex = 0;
    this.updateQuestionView();
    this.showToast('🎲 Questions shuffled!', 'info');
  }

  toggleAllAnswers() {
    const answerElements = document.querySelectorAll('.answer-content');
    const allVisible = Array.from(answerElements).every(el => el.style.display === 'block');
    
    answerElements.forEach(el => {
      el.style.display = allVisible ? 'none' : 'block';
    });
    
    // Update all buttons
    document.querySelectorAll('.show-answer-btn').forEach(btn => {
      const btnText = btn.querySelector('.btn-text');
      const btnIcon = btn.querySelector('.btn-icon');
      if (btnText) btnText.textContent = allVisible ? 'Show Answer' : 'Hide Answer';
      if (btnIcon) btnIcon.textContent = allVisible ? '👁️' : '🙈';
    });
    
    this.showToast(allVisible ? '🙈 All answers hidden' : '👁️ All answers shown', 'info');
  }

  startQuickPractice() {
    // Quick practice with random questions from all sets
    const allQuestions = [];
    
    Object.values(this.organizedData).forEach(sections => {
      if (Array.isArray(sections)) {
        sections.forEach(section => {
          if (section.questions) {
            allQuestions.push(...section.questions);
          }
        });
      }
    });
    
    if (allQuestions.length === 0) {
      this.showToast('❌ No questions available', 'error');
      return;
    }
    
    // Shuffle and take first 10 questions
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    
    this.currentSection = {
      id: 'quick-practice',
      title: 'Quick Practice',
      description: 'Random selection of questions for quick practice',
      icon: '⚡'
    };
    
    this.currentQuestionSet = shuffled.slice(0, Math.min(10, shuffled.length));
    this.currentQuestionIndex = 0;
    
    this.showQuestionView();
    this.showToast('⚡ Quick practice started!', 'success');
  }

  // ==============================================
  // UTILITY METHODS
  // ==============================================

  updateQuestionView() {
    const questionContent = document.getElementById('questionContent');
    if (!questionContent) return;
    
    questionContent.innerHTML = this.renderCurrentQuestion();
    
    // Update navigation buttons
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const counter = document.querySelector('.question-counter');
    
    if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentQuestionIndex === this.currentQuestionSet.length - 1;
    if (counter) counter.textContent = `${this.currentQuestionIndex + 1} / ${this.currentQuestionSet.length}`;
  }

  updateQuestionDisplay(questionId) {
    const questionCard = document.querySelector(`[data-question-id="${questionId}"]`);
    if (!questionCard) return;
    
    const isCompleted = this.completedQuestions.has(questionId);
    const isBookmarked = this.bookmarkedQuestions.has(questionId);
    
    // Update completed state
    questionCard.classList.toggle('completed', isCompleted);
    
    // Update completion button
    const completionBtn = questionCard.querySelector('.completion-btn');
    if (completionBtn) {
      completionBtn.classList.toggle('completed', isCompleted);
      completionBtn.innerHTML = isCompleted ? '✅ Completed' : '⭕ Mark Complete';
    }
    
    // Update bookmark button
    const bookmarkBtn = questionCard.querySelector('.bookmark');
    if (bookmarkBtn) {
      bookmarkBtn.classList.toggle('active', isBookmarked);
      bookmarkBtn.innerHTML = isBookmarked ? '⭐' : '☆';
      bookmarkBtn.title = isBookmarked ? 'Remove bookmark' : 'Bookmark this question';
    }
  }

  findQuestionById(questionId) {
    // Search through all organized data
    for (const sections of Object.values(this.organizedData)) {
      if (Array.isArray(sections)) {
        for (const section of sections) {
          if (section.questions) {
            const found = section.questions.find(q => q.id === questionId);
            if (found) return found;
          }
        }
      }
    }
    return null;
  }

  formatAnswer(answer) {
    if (!answer) return 'Answer not available';
    
    // Basic markdown-like formatting
    return answer
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.*)/, '<p>$1')
      .replace(/(.*?)$/, '$1</p>');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getTotalQuestions() {
    let total = 0;
    Object.values(this.organizedData).forEach(sections => {
      if (Array.isArray(sections)) {
        sections.forEach(section => {
          total += section.questions?.length || 0;
        });
      }
    });
    return total;
  }

  getCompletionPercentage() {
    const total = this.getTotalQuestions();
    return total > 0 ? Math.round((this.completedQuestions.size / total) * 100) : 0;
  }

  updateProgressStats() {
    const completedCountEl = document.getElementById('completedCount');
    const bookmarkedCountEl = document.getElementById('bookmarkedCount');
    const progressBarEl = document.getElementById('overallProgressBar');
    
    if (completedCountEl) completedCountEl.textContent = this.completedQuestions.size;
    if (bookmarkedCountEl) bookmarkedCountEl.textContent = this.bookmarkedQuestions.size;
    
    if (progressBarEl) {
      const percentage = this.getCompletionPercentage();
      progressBarEl.style.width = `${percentage}%`;
    }
  }

  saveProgress() {
    localStorage.setItem('completedQuestions', JSON.stringify([...this.completedQuestions]));
    localStorage.setItem('bookmarkedQuestions', JSON.stringify([...this.bookmarkedQuestions]));
    localStorage.setItem('progress', JSON.stringify(this.progress));
  }

  // ==============================================
  // UI MANAGEMENT
  // ==============================================

  toggleSection(sectionKey) {
    const sectionContent = document.getElementById(`section-${sectionKey}`);
    if (!sectionContent) return;
    
    const isExpanded = sectionContent.classList.contains('expanded');
    
    // Collapse all sections
    document.querySelectorAll('.nav-section-content').forEach(content => {
      content.classList.remove('expanded');
    });
    
    // Expand clicked section if it wasn't already expanded
    if (!isExpanded) {
      sectionContent.classList.add('expanded');
    }
  }

  setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  handleKeyboard(e) {
    // Only handle shortcuts in question view
    if (this.currentView !== 'question') return;
    
    switch(e.code) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previousQuestion();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextQuestion();
        break;
      case 'Space':
        e.preventDefault();
        // Toggle current question answer
        if (this.currentQuestionSet[this.currentQuestionIndex]) {
          this.toggleAnswer(this.currentQuestionSet[this.currentQuestionIndex].id);
        }
        break;
      case 'KeyB':
        e.preventDefault();
        // Bookmark current question
        if (this.currentQuestionSet[this.currentQuestionIndex]) {
          this.toggleBookmark(this.currentQuestionSet[this.currentQuestionIndex].id);
        }
        break;
      case 'KeyC':
        e.preventDefault();
        // Complete current question
        if (this.currentQuestionSet[this.currentQuestionIndex]) {
          this.toggleComplete(this.currentQuestionSet[this.currentQuestionIndex].id);
        }
        break;
    }
  }

  handleResize() {
    // Handle responsive layout changes
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth < 768 && sidebar) {
      sidebar.classList.add('mobile');
    } else if (sidebar) {
      sidebar.classList.remove('mobile');
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }
  }

  // ==============================================
  // LOADING AND FEEDBACK
  // ==============================================

  showLoading(message = 'Loading...') {
    const existingLoader = document.getElementById('appLoader');
    if (existingLoader) {
      existingLoader.querySelector('.loading-message').textContent = message;
      return;
    }
    
    const loader = document.createElement('div');
    loader.id = 'appLoader';
    loader.className = 'app-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loading-message">${message}</div>
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="loadingProgress"></div>
          </div>
          <div class="progress-text" id="loadingProgressText">0%</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(loader);
  }

  updateLoadingProgress(percentage, message) {
    const progressFill = document.getElementById('loadingProgress');
    const progressText = document.getElementById('loadingProgressText');
    const loadingMessage = document.querySelector('.loading-message');
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${Math.round(percentage)}%`;
    if (loadingMessage) loadingMessage.textContent = message;
  }

  hideLoading() {
    const loader = document.getElementById('appLoader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new ReactInterviewPrepApp();
  });
} else {
  window.app = new ReactInterviewPrepApp();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReactInterviewPrepApp;
}