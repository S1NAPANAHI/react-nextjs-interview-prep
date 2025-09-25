// Enhanced Organized React Interview Prep Application

class EnhancedOrganizedApp {
    constructor() {
        // Core state management
        this.currentSection = 'dashboard';
        this.currentSubsection = null;
        this.sidebarCollapsed = false;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        // User progress tracking
        this.completedQuestions = new Set(JSON.parse(localStorage.getItem('completedQuestions') || '[]'));
        this.bookmarkedQuestions = new Set(JSON.parse(localStorage.getItem('bookmarkedQuestions') || '[]'));
        this.questionProgress = JSON.parse(localStorage.getItem('questionProgress') || '{}');
        
        // Data storage
        this.allQuestionsData = {};
        this.categorizedQuestions = {};
        this.filteredQuestions = [];
        this.searchResults = [];
        
        // Practice mode state
        this.practiceMode = {
            active: false,
            type: null,
            questions: [],
            currentIndex: 0,
            startTime: null,
            settings: {}
        };
        
        // Initialize the application
        this.init();
    }

    async init() {
        this.showLoading();
        await this.loadAllData();
        this.categorizeAllQuestions();
        this.setupUI();
        this.setupEventListeners();
        this.applyTheme(this.currentTheme);
        this.hideLoading();
        this.navigateToSection('dashboard');
        this.updateProgressStats();
    }

    // =========================
    // DATA LOADING & PROCESSING
    // =========================

    async loadAllData() {
        const dataFiles = [
            { file: 'data/top-10-questions.json', key: 'top10' },
            { file: 'data/top-20-questions.json', key: 'top20' },
            { file: 'data/top-50-questions.json', key: 'top50' },
            { file: 'data/top-100-questions.json', key: 'top100' },
            { file: 'data/flashcards.json', key: 'flashcards' },
            { file: 'data/challenges.json', key: 'challenges' },
            { file: 'data/enhanced-questions.json', key: 'enhanced' },
            { file: 'data/enhanced-interview-system.json', key: 'interview_system' },
            { file: 'data/react-interview-questions-complete.json', key: 'complete' },
            { file: 'data/tier-system.json', key: 'tiers' }
        ];

        const loadPromises = dataFiles.map(async ({ file, key }) => {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const data = await response.json();
                    this.allQuestionsData[key] = data;
                    console.log(`✓ Loaded ${file}:`, {
                        hasQuestions: !!data.questions,
                        questionCount: data.questions?.length || 0,
                        structure: Object.keys(data)
                    });
                }
            } catch (error) {
                console.warn(`Could not load ${file}:`, error);
            }
        });

        await Promise.all(loadPromises);
        console.log('All data loaded:', Object.keys(this.allQuestionsData));
    }

    categorizeAllQuestions() {
        // Initialize category structure with proper organization
        this.categorizedQuestions = {
            'quick-start': {
                title: 'Quick Start',
                icon: '🚀',
                description: 'Essential questions to get you started',
                questions: [],
                subcategories: {
                    'top-10': { name: 'Top 10 Essential', questions: [], path: 'quick-start/top-10' },
                    'top-20': { name: 'Top 20 Core', questions: [], path: 'quick-start/top-20' },
                    'getting-started': { name: 'Getting Started Guide', questions: [], path: 'quick-start/guide' }
                }
            },
            'react-fundamentals': {
                title: 'React Fundamentals',
                icon: '⚛️',
                description: 'Core React concepts and principles',
                questions: [],
                subcategories: {
                    'components-jsx': { name: 'Components & JSX', questions: [], path: 'fundamentals/components' },
                    'props-state': { name: 'Props vs State', questions: [], path: 'fundamentals/props-state' },
                    'lifecycle': { name: 'Component Lifecycle', questions: [], path: 'fundamentals/lifecycle' },
                    'virtual-dom': { name: 'Virtual DOM', questions: [], path: 'fundamentals/virtual-dom' },
                    'events': { name: 'Event Handling', questions: [], path: 'fundamentals/events' }
                }
            },
            'hooks': {
                title: 'React Hooks',
                icon: '🪝',
                description: 'Modern React with Hooks',
                questions: [],
                subcategories: {
                    'basic-hooks': { name: 'useState & useEffect', questions: [], path: 'hooks/basic' },
                    'custom-hooks': { name: 'Custom Hooks', questions: [], path: 'hooks/custom' },
                    'context-reducer': { name: 'useContext & useReducer', questions: [], path: 'hooks/context-reducer' },
                    'performance-hooks': { name: 'Performance Hooks', questions: [], path: 'hooks/performance' },
                    'advanced-hooks': { name: 'Advanced Hooks', questions: [], path: 'hooks/advanced' }
                }
            },
            'state-management': {
                title: 'State Management',
                icon: '🗄️',
                description: 'Managing application state effectively',
                questions: [],
                subcategories: {
                    'local-state': { name: 'Local State', questions: [], path: 'state/local' },
                    'context-api': { name: 'Context API', questions: [], path: 'state/context' },
                    'redux': { name: 'Redux & RTK', questions: [], path: 'state/redux' },
                    'other-tools': { name: 'Zustand & Others', questions: [], path: 'state/other' },
                    'patterns': { name: 'State Patterns', questions: [], path: 'state/patterns' }
                }
            },
            'performance': {
                title: 'Performance & Optimization',
                icon: '⚡',
                description: 'Optimizing React applications',
                questions: [],
                subcategories: {
                    'react-memo': { name: 'React.memo', questions: [], path: 'performance/memo' },
                    'memoization': { name: 'useMemo & useCallback', questions: [], path: 'performance/memoization' },
                    'code-splitting': { name: 'Code Splitting', questions: [], path: 'performance/splitting' },
                    'bundle-optimization': { name: 'Bundle Optimization', questions: [], path: 'performance/bundle' },
                    'monitoring': { name: 'Performance Monitoring', questions: [], path: 'performance/monitoring' }
                }
            },
            'advanced-topics': {
                title: 'Advanced Topics',
                icon: '🔬',
                description: 'Advanced React patterns and concepts',
                questions: [],
                subcategories: {
                    'error-boundaries': { name: 'Error Boundaries', questions: [], path: 'advanced/error-boundaries' },
                    'hoc': { name: 'Higher-Order Components', questions: [], path: 'advanced/hoc' },
                    'render-props': { name: 'Render Props', questions: [], path: 'advanced/render-props' },
                    'testing': { name: 'Testing Strategies', questions: [], path: 'advanced/testing' },
                    'patterns': { name: 'Architecture Patterns', questions: [], path: 'advanced/patterns' }
                }
            },
            'practice-assessment': {
                title: 'Practice & Assessment',
                icon: '🏅',
                description: 'Test your knowledge and practice',
                questions: [],
                subcategories: {
                    'complete-sets': { name: 'Complete Collections', questions: [], path: 'practice/complete' },
                    'random-practice': { name: 'Random Practice', questions: [], path: 'practice/random' },
                    'timed-sessions': { name: 'Timed Sessions', questions: [], path: 'practice/timed' },
                    'flashcards': { name: 'Flashcards Review', questions: [], path: 'practice/flashcards' },
                    'challenges': { name: 'Coding Challenges', questions: [], path: 'practice/challenges' }
                }
            }
        };

        // Process and categorize all questions
        this.processQuestionData();
    }

    processQuestionData() {
        // Process Top 10 questions
        if (this.allQuestionsData.top10?.questions) {
            const questions = this.normalizeQuestions(this.allQuestionsData.top10.questions, 'top10');
            this.categorizedQuestions['quick-start'].subcategories['top-10'].questions = questions;
            this.categorizedQuestions['quick-start'].questions.push(...questions);
        }

        // Process Top 20 questions
        if (this.allQuestionsData.top20?.questions) {
            const questions = this.normalizeQuestions(this.allQuestionsData.top20.questions, 'top20');
            this.categorizedQuestions['quick-start'].subcategories['top-20'].questions = questions;
            this.categorizedQuestions['quick-start'].questions.push(...questions);
        }

        // Process all other questions and categorize them
        const allQuestions = [];
        
        // Collect questions from all sources
        Object.entries(this.allQuestionsData).forEach(([source, data]) => {
            let questions = [];
            
            if (data.questions) {
                questions = this.normalizeQuestions(data.questions, source);
            } else if (data.categories) {
                // Handle flashcards format
                Object.values(data.categories).forEach(category => {
                    if (category.cards) {
                        const cards = category.cards.map(card => ({
                            id: card.id,
                            question: card.front,
                            answer: card.back,
                            category: category.title,
                            difficulty: 'Intermediate',
                            source: source,
                            type: 'flashcard'
                        }));
                        questions.push(...cards);
                    }
                });
            } else if (data.react_challenges) {
                // Handle challenges format
                Object.values(data.react_challenges).forEach(difficulty => {
                    if (Array.isArray(difficulty)) {
                        const challenges = difficulty.map(challenge => ({
                            id: `challenge-${challenge.title.replace(/\s+/g, '-').toLowerCase()}`,
                            question: challenge.title,
                            answer: challenge.description,
                            category: 'Coding Challenges',
                            difficulty: challenge.difficulty || 'Intermediate',
                            source: source,
                            type: 'challenge',
                            requirements: challenge.requirements,
                            solution_approach: challenge.solution_approach,
                            code_skeleton: challenge.code_skeleton
                        }));
                        questions.push(...challenges);
                    }
                });
            }
            
            allQuestions.push(...questions);
        });

        // Categorize questions based on content
        allQuestions.forEach(question => {
            const category = this.determineQuestionCategory(question);
            const subcategory = this.determineQuestionSubcategory(question, category);
            
            if (this.categorizedQuestions[category]) {
                this.categorizedQuestions[category].questions.push(question);
                
                if (subcategory && this.categorizedQuestions[category].subcategories[subcategory]) {
                    this.categorizedQuestions[category].subcategories[subcategory].questions.push(question);
                }
            }
        });

        // Remove duplicates and sort questions
        Object.values(this.categorizedQuestions).forEach(category => {
            category.questions = this.removeDuplicates(category.questions);
            Object.values(category.subcategories).forEach(subcategory => {
                subcategory.questions = this.removeDuplicates(subcategory.questions);
            });
        });

        console.log('Questions categorized:', 
            Object.entries(this.categorizedQuestions).map(([key, cat]) => 
                [key, cat.questions.length, Object.keys(cat.subcategories).length]
            )
        );
    }

    normalizeQuestions(questions, source) {
        return questions.map(q => ({
            ...q,
            id: q.id || `${source}-${Date.now()}-${Math.random()}`,
            source: source,
            category: q.category || 'General',
            difficulty: q.difficulty || 'Intermediate'
        }));
    }

    determineQuestionCategory(question) {
        const text = (question.question + ' ' + (question.answer || '') + ' ' + (question.category || '')).toLowerCase();
        
        // Quick start questions (already categorized)
        if (['top10', 'top20'].includes(question.source)) {
            return 'quick-start';
        }
        
        // Hook-related questions
        if (text.includes('hook') || text.includes('usestate') || text.includes('useeffect') || 
            text.includes('usememo') || text.includes('usecallback') || text.includes('usecontext')) {
            return 'hooks';
        }
        
        // Performance-related questions
        if (text.includes('performance') || text.includes('optimization') || text.includes('memo') ||
            text.includes('lazy') || text.includes('bundle') || text.includes('splitting')) {
            return 'performance';
        }
        
        // State management questions
        if (text.includes('redux') || text.includes('context api') || text.includes('state management') ||
            text.includes('zustand') || text.includes('jotai') || text.includes('recoil')) {
            return 'state-management';
        }
        
        // Advanced topics
        if (text.includes('error boundary') || text.includes('higher-order') || text.includes('hoc') ||
            text.includes('render prop') || text.includes('testing') || text.includes('architecture')) {
            return 'advanced-topics';
        }
        
        // Practice and challenges
        if (question.type === 'challenge' || question.type === 'flashcard' || 
            text.includes('challenge') || text.includes('practice')) {
            return 'practice-assessment';
        }
        
        // Default to fundamentals
        return 'react-fundamentals';
    }

    determineQuestionSubcategory(question, category) {
        const text = (question.question + ' ' + (question.answer || '') + ' ' + (question.category || '')).toLowerCase();
        
        switch (category) {
            case 'hooks':
                if (text.includes('usestate') || text.includes('useeffect')) return 'basic-hooks';
                if (text.includes('custom hook')) return 'custom-hooks';
                if (text.includes('usecontext') || text.includes('usereducer')) return 'context-reducer';
                if (text.includes('usememo') || text.includes('usecallback')) return 'performance-hooks';
                return 'advanced-hooks';
                
            case 'react-fundamentals':
                if (text.includes('component') || text.includes('jsx')) return 'components-jsx';
                if (text.includes('props') || text.includes('state')) return 'props-state';
                if (text.includes('lifecycle') || text.includes('mount')) return 'lifecycle';
                if (text.includes('virtual dom') || text.includes('reconciliation')) return 'virtual-dom';
                if (text.includes('event') || text.includes('onclick')) return 'events';
                return 'components-jsx';
                
            case 'state-management':
                if (text.includes('redux')) return 'redux';
                if (text.includes('context')) return 'context-api';
                if (text.includes('local state') || text.includes('usestate')) return 'local-state';
                if (text.includes('zustand') || text.includes('jotai')) return 'other-tools';
                return 'patterns';
                
            case 'performance':
                if (text.includes('react.memo')) return 'react-memo';
                if (text.includes('usememo') || text.includes('usecallback')) return 'memoization';
                if (text.includes('code splitting') || text.includes('lazy')) return 'code-splitting';
                if (text.includes('bundle') || text.includes('webpack')) return 'bundle-optimization';
                return 'monitoring';
                
            case 'practice-assessment':
                if (question.type === 'challenge') return 'challenges';
                if (question.type === 'flashcard') return 'flashcards';
                if (question.source === 'top50' || question.source === 'top100') return 'complete-sets';
                return 'random-practice';
                
            default:
                return Object.keys(this.categorizedQuestions[category].subcategories)[0];
        }
    }

    removeDuplicates(questions) {
        const seen = new Set();
        return questions.filter(q => {
            const key = q.question.toLowerCase().trim();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    // =========================
    // UI SETUP & RENDERING
    // =========================

    setupUI() {
        this.renderSidebar();
        this.updateProgressStats();
    }

    renderSidebar() {
        const navigationElement = document.getElementById('navigationSections');
        const sectionsHTML = Object.entries(this.categorizedQuestions).map(([key, section]) => {
            const isExpanded = this.currentSection === key;
            const subsectionsHTML = Object.entries(section.subcategories).map(([subKey, subsection]) => {
                const isActive = this.currentSection === key && this.currentSubsection === subKey;
                return `
                    <div class="nav-item ${isActive ? 'active' : ''}" 
                         onclick="app.navigateToSubsection('${key}', '${subKey}')" 
                         data-path="${subsection.path}">
                        <span class="nav-item-name">${subsection.name}</span>
                        <span class="nav-item-count">${subsection.questions.length}</span>
                    </div>
                `;
            }).join('');

            return `
                <div class="nav-section">
                    <div class="section-header ${isExpanded ? 'expanded active' : ''}"
                         onclick="app.toggleSection('${key}')">
                        <span class="section-icon">${section.icon}</span>
                        <span class="section-title">${section.title}</span>
                        <span class="section-count">${section.questions.length}</span>
                        <span class="section-toggle">▼</span>
                    </div>
                    <div class="section-items ${isExpanded ? 'expanded' : ''}">
                        ${subsectionsHTML}
                    </div>
                </div>
            `;
        }).join('');

        navigationElement.innerHTML = sectionsHTML;
    }

    // =========================
    // NAVIGATION & ROUTING
    // =========================

    navigateToSection(sectionKey, subsectionKey = null) {
        this.currentSection = sectionKey;
        this.currentSubsection = subsectionKey;
        
        // Update sidebar active states
        this.updateSidebarActiveStates();
        
        // Render appropriate content
        if (sectionKey === 'dashboard') {
            this.renderDashboard();
        } else {
            this.renderQuestionPage(sectionKey, subsectionKey);
        }
    }

    navigateToSubsection(sectionKey, subsectionKey) {
        this.navigateToSection(sectionKey, subsectionKey);
    }

    toggleSection(sectionKey) {
        const sectionHeader = document.querySelector(`[onclick="app.toggleSection('${sectionKey}')"]`);
        const sectionItems = sectionHeader.nextElementSibling;
        const isExpanded = sectionHeader.classList.contains('expanded');
        
        if (isExpanded) {
            sectionHeader.classList.remove('expanded');
            sectionItems.classList.remove('expanded');
        } else {
            // Collapse all other sections
            document.querySelectorAll('.section-header.expanded').forEach(header => {
                header.classList.remove('expanded');
                header.nextElementSibling.classList.remove('expanded');
            });
            
            // Expand this section
            sectionHeader.classList.add('expanded');
            sectionItems.classList.add('expanded');
            
            // If no subsection is active, navigate to the section overview
            if (this.currentSection !== sectionKey) {
                this.navigateToSection(sectionKey);
            }
        }
    }

    updateSidebarActiveStates() {
        // Remove all active states
        document.querySelectorAll('.section-header.active, .nav-item.active').forEach(el => {
            el.classList.remove('active');
        });
        
        // Add active state to current section header
        const sectionHeader = document.querySelector(`[onclick="app.toggleSection('${this.currentSection}')"]`);
        if (sectionHeader) {
            sectionHeader.classList.add('active');
        }
        
        // Add active state to current subsection
        if (this.currentSubsection) {
            const navItem = document.querySelector(`[onclick="app.navigateToSubsection('${this.currentSection}', '${this.currentSubsection}')"]`);
            if (navItem) {
                navItem.classList.add('active');
            }
        }
    }

    // =========================
    // CONTENT RENDERING
    // =========================

    renderDashboard() {
        const mainContent = document.getElementById('mainContent');
        const totalQuestions = this.getTotalQuestions();
        const completionPercentage = this.getCompletionPercentage();
        
        const dashboardCards = Object.entries(this.categorizedQuestions).map(([key, section]) => `
            <div class="dashboard-card" onclick="app.navigateToSection('${key}')">
                <h3>${section.icon} ${section.title}</h3>
                <p>${section.description}</p>
                <div class="card-stats">
                    <span>${section.questions.length} questions</span>
                    <span>•</span>
                    <span>${Object.keys(section.subcategories).length} topics</span>
                </div>
                <button class="card-action">Explore →</button>
            </div>
        `).join('');

        mainContent.innerHTML = `
            <div class="content-area">
                <div class="page-header">
                    <h1 class="page-title">🚀 Welcome to React Interview Prep</h1>
                    <p class="page-description">
                        Master React interviews with our comprehensive, organized question bank. 
                        Track your progress and practice with confidence.
                    </p>
                    <div class="page-meta">
                        <span>📊 ${totalQuestions} Total Questions</span>
                        <span>•</span>
                        <span>✅ ${this.completedQuestions.size} Completed</span>
                        <span>•</span>
                        <span>⭐ ${this.bookmarkedQuestions.size} Bookmarked</span>
                        <span>•</span>
                        <span>📊 ${completionPercentage}% Progress</span>
                    </div>
                </div>
                
                <div class="question-controls">
                    <div class="filter-controls">
                        <h3>Quick Actions:</h3>
                    </div>
                    <div class="view-controls">
                        <button class="control-btn" onclick="app.startPracticeMode()">
                            ⏱️ Start Practice
                        </button>
                        <button class="control-btn" onclick="app.showBookmarks()">
                            ⭐ View Bookmarks
                        </button>
                        <button class="control-btn" onclick="app.navigateToSection('quick-start')">
                            🚀 Quick Start
                        </button>
                    </div>
                </div>
                
                <div class="dashboard-grid">
                    ${dashboardCards}
                </div>
            </div>
        `;
    }

    renderQuestionPage(sectionKey, subsectionKey = null) {
        const section = this.categorizedQuestions[sectionKey];
        if (!section) return;
        
        let questions, pageTitle, pageDescription;
        
        if (subsectionKey && section.subcategories[subsectionKey]) {
            const subsection = section.subcategories[subsectionKey];
            questions = subsection.questions;
            pageTitle = `${section.icon} ${subsection.name}`;
            pageDescription = `Part of ${section.title} - ${questions.length} questions`;
        } else {
            questions = section.questions;
            pageTitle = `${section.icon} ${section.title}`;
            pageDescription = `${section.description} - ${questions.length} questions`;
        }
        
        const mainContent = document.getElementById('mainContent');
        const questionsHTML = questions.map((question, index) => 
            this.renderQuestionCard(question, index)
        ).join('');
        
        mainContent.innerHTML = `
            <div class="content-area">
                <div class="page-header">
                    <h1 class="page-title">${pageTitle}</h1>
                    <p class="page-description">${pageDescription}</p>
                    <div class="page-meta">
                        <span>📊 ${questions.length} Questions</span>
                        <span>•</span>
                        <span>✅ ${this.getCompletedInSection(questions)} Completed</span>
                        <span>•</span>
                        <span>⭐ ${this.getBookmarkedInSection(questions)} Bookmarked</span>
                    </div>
                </div>
                
                <div class="question-controls">
                    <div class="filter-controls">
                        <select class="filter-select" id="difficultyFilter" onchange="app.filterQuestions()">
                            <option value="all">All Difficulties</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <select class="filter-select" id="statusFilter" onchange="app.filterQuestions()">
                            <option value="all">All Questions</option>
                            <option value="completed">Completed</option>
                            <option value="incomplete">Not Completed</option>
                            <option value="bookmarked">Bookmarked</option>
                        </select>
                    </div>
                    <div class="view-controls">
                        <button class="control-btn" onclick="app.shuffleQuestions()">
                            🎲 Shuffle
                        </button>
                        <button class="control-btn" onclick="app.expandAll()">
                            📜 Expand All
                        </button>
                        <button class="control-btn" onclick="app.collapseAll()">
                            📄 Collapse All
                        </button>
                    </div>
                </div>
                
                <div class="questions-container" id="questionsContainer">
                    ${questionsHTML}
                </div>
            </div>
        `;
    }

    renderQuestionCard(question, index) {
        const isCompleted = this.completedQuestions.has(question.id);
        const isBookmarked = this.bookmarkedQuestions.has(question.id);
        const answerId = `answer-${question.id}`;
        
        return `
            <div class="question-card ${isCompleted ? 'completed' : ''}" data-question-id="${question.id}">
                <div class="question-header">
                    <div class="question-number">Q${index + 1}</div>
                    <div class="question-meta">
                        <span class="difficulty-badge ${(question.difficulty || 'intermediate').toLowerCase()}">
                            ${question.difficulty || 'Intermediate'}
                        </span>
                        <span class="category-tag">${question.category}</span>
                    </div>
                    <div class="question-actions">
                        <button class="action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                                onclick="app.toggleBookmark('${question.id}')" 
                                title="${isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}">
                            ${isBookmarked ? '⭐' : '☆'}
                        </button>
                        <button class="action-btn copy-btn" 
                                onclick="app.copyQuestion('${question.id}')" 
                                title="Copy question">
                            📋
                        </button>
                    </div>
                </div>
                
                <div class="question-content">
                    <h3 class="question-title">${question.question}</h3>
                    
                    <div class="question-expand">
                        <button class="expand-btn" onclick="app.toggleAnswer('${question.id}')">
                            <span class="expand-icon">▼</span>
                            <span class="expand-text">Show Answer</span>
                        </button>
                    </div>
                    
                    <div class="answer-content" id="${answerId}" style="display: none;">
                        <div class="answer-text">
                            ${question.answer || 'Answer not available'}
                        </div>
                        
                        ${question.codeExample ? `
                            <div class="code-example">
                                <div class="code-header">
                                    <span>Code Example</span>
                                    <button class="copy-btn" onclick="app.copyCode('code-${question.id}')">
                                        📋 Copy
                                    </button>
                                </div>
                                <div class="code-content">
                                    <pre><code class="language-javascript" id="code-${question.id}">${question.codeExample.code || question.codeExample}</code></pre>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${question.keyPoints ? `
                            <div class="key-points">
                                <h4>Key Points:</h4>
                                <ul>
                                    ${question.keyPoints.map(point => `<li>${point}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        
                        ${question.followUpQuestions ? `
                            <div class="follow-up-questions">
                                <h4>Follow-up Questions:</h4>
                                <ul>
                                    ${question.followUpQuestions.map(q => `<li>${q}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="question-footer">
                    <button class="completion-btn ${isCompleted ? 'completed' : ''}" 
                            onclick="app.toggleComplete('${question.id}')">
                        ${isCompleted ? '✓ Completed' : '○ Mark Complete'}
                    </button>
                </div>
            </div>
        `;
    }

    // =========================
    // INTERACTION HANDLERS
    // =========================

    toggleAnswer(questionId) {
        const answerElement = document.getElementById(`answer-${questionId}`);
        const expandBtn = answerElement.parentElement.querySelector('.expand-btn');
        const expandIcon = expandBtn.querySelector('.expand-icon');
        const expandText = expandBtn.querySelector('.expand-text');
        
        if (answerElement.style.display === 'none') {
            answerElement.style.display = 'block';
            expandIcon.style.transform = 'rotate(180deg)';
            expandText.textContent = 'Hide Answer';
            expandBtn.classList.add('expanded');
            
            // Highlight code blocks
            answerElement.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        } else {
            answerElement.style.display = 'none';
            expandIcon.style.transform = 'rotate(0deg)';
            expandText.textContent = 'Show Answer';
            expandBtn.classList.remove('expanded');
        }
    }

    toggleBookmark(questionId) {
        if (this.bookmarkedQuestions.has(questionId)) {
            this.bookmarkedQuestions.delete(questionId);
            this.showToast('Bookmark removed', 'info');
        } else {
            this.bookmarkedQuestions.add(questionId);
            this.showToast('Question bookmarked', 'success');
        }
        
        this.saveToLocalStorage();
        this.updateProgressStats();
        this.updateBookmarkButton(questionId);
    }

    toggleComplete(questionId) {
        if (this.completedQuestions.has(questionId)) {
            this.completedQuestions.delete(questionId);
            this.showToast('Marked as incomplete', 'info');
        } else {
            this.completedQuestions.add(questionId);
            this.showToast('Question completed!', 'success');
        }
        
        this.saveToLocalStorage();
        this.updateProgressStats();
        this.updateCompletionButton(questionId);
        this.updateQuestionCardState(questionId);
    }

    copyQuestion(questionId) {
        const question = this.findQuestionById(questionId);
        if (question) {
            const text = `Q: ${question.question}\n\nA: ${question.answer || 'Answer not provided'}`;
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Question copied to clipboard', 'success');
            });
        }
    }

    copyCode(codeElementId) {
        const codeElement = document.getElementById(codeElementId);
        if (codeElement) {
            navigator.clipboard.writeText(codeElement.textContent).then(() => {
                this.showToast('Code copied to clipboard', 'success');
            });
        }
    }

    // =========================
    // UTILITY FUNCTIONS
    // =========================

    updateBookmarkButton(questionId) {
        const button = document.querySelector(`[onclick="app.toggleBookmark('${questionId}')"]`);
        if (button) {
            const isBookmarked = this.bookmarkedQuestions.has(questionId);
            button.classList.toggle('bookmarked', isBookmarked);
            button.innerHTML = isBookmarked ? '⭐' : '☆';
            button.title = isBookmarked ? 'Remove bookmark' : 'Bookmark this question';
        }
    }

    updateCompletionButton(questionId) {
        const button = document.querySelector(`[onclick="app.toggleComplete('${questionId}')"]`);
        if (button) {
            const isCompleted = this.completedQuestions.has(questionId);
            button.classList.toggle('completed', isCompleted);
            button.innerHTML = isCompleted ? '✓ Completed' : '○ Mark Complete';
        }
    }

    updateQuestionCardState(questionId) {
        const card = document.querySelector(`[data-question-id="${questionId}"]`);
        if (card) {
            const isCompleted = this.completedQuestions.has(questionId);
            card.classList.toggle('completed', isCompleted);
        }
    }

    updateProgressStats() {
        const totalQuestions = this.getTotalQuestions();
        const completedCount = this.completedQuestions.size;
        const bookmarkedCount = this.bookmarkedQuestions.size;
        const progressPercentage = this.getCompletionPercentage();
        
        // Update sidebar stats
        const completedCountEl = document.getElementById('completedCount');
        const totalCountEl = document.getElementById('totalCount');
        const bookmarkedCountEl = document.getElementById('bookmarkedCount');
        const progressFillEl = document.getElementById('progressFill');
        
        if (completedCountEl) completedCountEl.textContent = completedCount;
        if (totalCountEl) totalCountEl.textContent = totalQuestions;
        if (bookmarkedCountEl) bookmarkedCountEl.textContent = bookmarkedCount;
        if (progressFillEl) progressFillEl.style.width = `${progressPercentage}%`;
    }

    getTotalQuestions() {
        return Object.values(this.categorizedQuestions)
            .reduce((sum, category) => sum + category.questions.length, 0);
    }

    getCompletionPercentage() {
        const total = this.getTotalQuestions();
        if (total === 0) return 0;
        return Math.round((this.completedQuestions.size / total) * 100);
    }

    getCompletedInSection(questions) {
        return questions.filter(q => this.completedQuestions.has(q.id)).length;
    }

    getBookmarkedInSection(questions) {
        return questions.filter(q => this.bookmarkedQuestions.has(q.id)).length;
    }

    findQuestionById(questionId) {
        for (const category of Object.values(this.categorizedQuestions)) {
            const question = category.questions.find(q => q.id === questionId);
            if (question) return question;
        }
        return null;
    }

    // =========================
    // EVENT LISTENERS
    // =========================

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Global search
        const searchInput = document.getElementById('globalSearch');
        searchInput.addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });
        
        // Practice mode
        document.getElementById('practiceMode').addEventListener('click', () => {
            this.showPracticeModal();
        });
        
        // Modal close
        document.getElementById('closePracticeModal').addEventListener('click', () => {
            this.hidePracticeModal();
        });
        
        // ESC key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hidePracticeModal();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('collapsed');
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
    }

    handleGlobalSearch(query) {
        // Implement global search functionality
        if (query.length < 2) {
            this.searchResults = [];
            return;
        }
        
        // Search through all questions
        this.searchResults = [];
        Object.values(this.categorizedQuestions).forEach(category => {
            category.questions.forEach(question => {
                const searchText = (question.question + ' ' + (question.answer || '')).toLowerCase();
                if (searchText.includes(query.toLowerCase())) {
                    this.searchResults.push(question);
                }
            });
        });
        
        console.log(`Found ${this.searchResults.length} results for "${query}"`);
        // You can implement search results display here
    }

    // =========================
    // PRACTICE MODE
    // =========================

    showPracticeModal() {
        const modal = document.getElementById('practiceModal');
        modal.classList.add('show');
    }

    hidePracticeModal() {
        const modal = document.getElementById('practiceModal');
        modal.classList.remove('show');
    }

    startPracticeMode() {
        this.showPracticeModal();
    }

    // =========================
    // PERSISTENCE
    // =========================

    saveToLocalStorage() {
        localStorage.setItem('completedQuestions', JSON.stringify([...this.completedQuestions]));
        localStorage.setItem('bookmarkedQuestions', JSON.stringify([...this.bookmarkedQuestions]));
        localStorage.setItem('questionProgress', JSON.stringify(this.questionProgress));
    }

    // =========================
    // LOADING STATES
    // =========================

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
        }
    }

    // =========================
    // TOAST NOTIFICATIONS
    // =========================

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: '✓',
            error: '✕',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
            <span class="toast-message">${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialize the application when the DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new EnhancedOrganizedApp();
    });
} else {
    window.app = new EnhancedOrganizedApp();
}