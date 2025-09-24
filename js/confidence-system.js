// Confidence-Based Interview System Integration
// Connects the new confidence tracking with existing flashcard system

class ConfidenceBasedInterviewSystem {
    constructor() {
        this.questionsData = null;
        this.confidenceRatings = this.loadConfidenceRatings();
        this.currentTier = 'top_10';
        this.currentQuestionIndex = 0;
        this.expandedQuestions = new Set();
        this.init();
    }

    async init() {
        try {
            await this.loadQuestionsData();
            this.setupEventListeners();
            this.renderDashboard();
            console.log('🎉 Confidence-Based Interview System initialized!');
        } catch (error) {
            console.error('Failed to initialize confidence system:', error);
            this.showError('Failed to load question database. Please refresh the page.');
        }
    }

    async loadQuestionsData() {
        try {
            const response = await fetch('/data/react-interview-questions-complete.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.questionsData = await response.json();
            console.log('📋 Questions loaded:', this.questionsData.tiers[this.currentTier].questions.length);
        } catch (error) {
            console.error('Error loading questions:', error);
            // Fallback to embedded data if available
            if (window.FALLBACK_QUESTIONS) {
                this.questionsData = window.FALLBACK_QUESTIONS;
                console.log('🔄 Using fallback questions data');
            } else {
                throw error;
            }
        }
    }

    loadConfidenceRatings() {
        try {
            const saved = localStorage.getItem('interview-confidence-ratings');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading confidence ratings:', error);
            return {};
        }
    }

    saveConfidenceRatings() {
        try {
            localStorage.setItem('interview-confidence-ratings', JSON.stringify(this.confidenceRatings));
        } catch (error) {
            console.error('Error saving confidence ratings:', error);
        }
    }

    updateConfidenceRating(questionId, level) {
        this.confidenceRatings[questionId] = {
            level: level,
            timestamp: new Date().toISOString(),
            reviewCount: (this.confidenceRatings[questionId]?.reviewCount || 0) + 1
        };
        this.saveConfidenceRatings();
        this.updateDashboardStats();
        
        // Track analytics
        this.trackConfidenceUpdate(questionId, level);
    }

    trackConfidenceUpdate(questionId, level) {
        // Analytics tracking (integrate with your analytics system)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'confidence_update', {
                question_id: questionId,
                confidence_level: level,
                timestamp: new Date().toISOString()
            });
        }
        
        console.log(`📊 Confidence updated: ${questionId} -> Level ${level}`);
    }

    setupEventListeners() {
        // Enhanced study mode integration
        const existingCards = document.querySelectorAll('.study-mode-card');
        existingCards.forEach(card => {
            if (card.dataset.mode === 'enhanced-questions') {
                card.addEventListener('click', () => this.showEnhancedQuestions());
            }
        });

        // Add enhanced questions card if it doesn't exist
        this.addEnhancedQuestionsCard();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    addEnhancedQuestionsCard() {
        const dashboard = document.getElementById('dashboard');
        const studyModesGrid = dashboard?.querySelector('.dashboard-stats') || 
                              dashboard?.querySelector('.study-modes-grid');
        
        if (studyModesGrid && !document.querySelector('[data-mode="enhanced-questions"]')) {
            const enhancedCard = document.createElement('div');
            enhancedCard.className = 'study-mode-card enhanced-questions-card';
            enhancedCard.dataset.mode = 'enhanced-questions';
            enhancedCard.innerHTML = `
                <div class="card-icon">🎯</div>
                <div class="card-content">
                    <h3>Enhanced Questions</h3>
                    <p>Confidence-tracked interview questions with detailed explanations</p>
                    <div class="card-stats">
                        <span id="enhanced-questions-progress">0/10 Complete</span>
                        <span class="card-badge">NEW</span>
                    </div>
                </div>
            `;
            
            enhancedCard.addEventListener('click', () => this.showEnhancedQuestions());
            studyModesGrid.appendChild(enhancedCard);
        }
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when in enhanced questions view
        if (!document.getElementById('enhanced-questions-container')?.classList.contains('active')) {
            return;
        }

        switch(e.key) {
            case 'Escape':
                this.showDashboard();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateQuestion(-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.navigateQuestion(1);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.toggleCurrentQuestion();
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                e.preventDefault();
                this.setCurrentQuestionConfidence(parseInt(e.key));
                break;
        }
    }

    navigateQuestion(direction) {
        const questions = this.questionsData?.tiers[this.currentTier]?.questions || [];
        const newIndex = Math.max(0, Math.min(questions.length - 1, this.currentQuestionIndex + direction));
        
        if (newIndex !== this.currentQuestionIndex) {
            this.currentQuestionIndex = newIndex;
            this.scrollToQuestion(questions[newIndex].id);
        }
    }

    toggleCurrentQuestion() {
        const questions = this.questionsData?.tiers[this.currentTier]?.questions || [];
        if (questions[this.currentQuestionIndex]) {
            const questionId = questions[this.currentQuestionIndex].id;
            this.toggleQuestionExpansion(questionId);
        }
    }

    setCurrentQuestionConfidence(level) {
        const questions = this.questionsData?.tiers[this.currentTier]?.questions || [];
        if (questions[this.currentQuestionIndex]) {
            const questionId = questions[this.currentQuestionIndex].id;
            this.updateConfidenceRating(questionId, level);
        }
    }

    showEnhancedQuestions() {
        this.hideAllViews();
        this.renderEnhancedQuestions();
    }

    showDashboard() {
        this.hideAllViews();
        document.getElementById('dashboard')?.classList.remove('hidden');
        this.updateDashboardStats();
    }

    hideAllViews() {
        const views = ['dashboard', 'study-view', 'enhanced-questions-container'];
        views.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('hidden');
                element.classList.remove('active');
            }
        });
    }

    renderEnhancedQuestions() {
        let container = document.getElementById('enhanced-questions-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'enhanced-questions-container';
            container.className = 'enhanced-questions-container';
            document.body.appendChild(container);
        }

        container.innerHTML = this.generateEnhancedQuestionsHTML();
        container.classList.remove('hidden');
        container.classList.add('active');
        
        this.setupEnhancedQuestionsEventListeners();
        
        // Load the CSS if not already loaded
        this.ensureCSSLoaded();
    }

    generateEnhancedQuestionsHTML() {
        const tierData = this.questionsData?.tiers[this.currentTier];
        if (!tierData) {
            return '<div class="error-message">Error: Questions data not loaded</div>';
        }

        const completedQuestions = tierData.questions.filter(q => 
            this.confidenceRatings[q.id] && this.confidenceRatings[q.id].level >= 3
        ).length;

        return `
            <div class="enhanced-questions-header">
                <button class="back-to-dashboard-btn" id="backToDashboard">
                    ← Back to Dashboard
                </button>
                
                <div class="tier-info">
                    <div class="tier-badge" style="background: ${tierData.gradient}">
                        ${tierData.icon} ${tierData.title}
                    </div>
                    <p class="tier-description">${tierData.description}</p>
                </div>
                
                <div class="progress-info">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${(completedQuestions / tierData.questions.length) * 100}%"></div>
                    </div>
                    <span class="progress-text">${completedQuestions}/${tierData.questions.length} questions confident (Level 3+)</span>
                </div>
            </div>
            
            <div class="questions-controls">
                <div class="search-filter-bar">
                    <input type="text" id="questionSearch" placeholder="🔍 Search questions..." class="search-input">
                    <select id="difficultyFilter" class="filter-select">
                        <option value="all">All Difficulties</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                    <select id="confidenceFilter" class="filter-select">
                        <option value="all">All Confidence Levels</option>
                        <option value="0">Not familiar (0)</option>
                        <option value="1-2">Learning (1-2)</option>
                        <option value="3-4">Confident (3-4)</option>
                        <option value="5">Expert (5)</option>
                    </select>
                </div>
                
                <div class="view-controls">
                    <button id="expandAllBtn" class="control-btn">Expand All</button>
                    <button id="collapseAllBtn" class="control-btn">Collapse All</button>
                    <button id="randomQuestionBtn" class="control-btn primary">🎲 Random Question</button>
                </div>
            </div>
            
            <div class="questions-list" id="questionsList">
                ${this.generateQuestionsListHTML(tierData.questions)}
            </div>
            
            <div class="keyboard-shortcuts-info">
                <details>
                    <summary>⌨️ Keyboard Shortcuts</summary>
                    <div class="shortcuts-grid">
                        <div><kbd>Esc</kbd> Back to dashboard</div>
                        <div><kbd>↑↓</kbd> Navigate questions</div>
                        <div><kbd>Enter/Space</kbd> Toggle question</div>
                        <div><kbd>1-5</kbd> Set confidence level</div>
                    </div>
                </details>
            </div>
        `;
    }

    generateQuestionsListHTML(questions) {
        return questions.map((question, index) => {
            const confidenceRating = this.confidenceRatings[question.id];
            const isExpanded = this.expandedQuestions.has(question.id);
            
            return `<div id="question-${question.id}" data-question-index="${index}"></div>`;
        }).join('');
    }

    setupEnhancedQuestionsEventListeners() {
        // Back to dashboard
        document.getElementById('backToDashboard')?.addEventListener('click', () => {
            this.showDashboard();
        });

        // Search and filter
        document.getElementById('questionSearch')?.addEventListener('input', (e) => {
            this.filterQuestions();
        });

        document.getElementById('difficultyFilter')?.addEventListener('change', () => {
            this.filterQuestions();
        });

        document.getElementById('confidenceFilter')?.addEventListener('change', () => {
            this.filterQuestions();
        });

        // View controls
        document.getElementById('expandAllBtn')?.addEventListener('click', () => {
            this.expandAllQuestions();
        });

        document.getElementById('collapseAllBtn')?.addEventListener('click', () => {
            this.collapseAllQuestions();
        });

        document.getElementById('randomQuestionBtn')?.addEventListener('click', () => {
            this.showRandomQuestion();
        });

        // Render question cards
        this.renderQuestionCards();
    }

    renderQuestionCards() {
        const questions = this.questionsData?.tiers[this.currentTier]?.questions || [];
        
        questions.forEach((question, index) => {
            const container = document.getElementById(`question-${question.id}`);
            if (container && window.React && window.EnhancedQuestionCard) {
                const confidenceRating = this.confidenceRatings[question.id];
                const isExpanded = this.expandedQuestions.has(question.id);
                
                const questionCard = React.createElement(window.EnhancedQuestionCard, {
                    question: question,
                    confidenceRating: confidenceRating,
                    onUpdateConfidence: (questionId, level) => this.updateConfidenceRating(questionId, level),
                    isExpanded: isExpanded,
                    onToggle: () => this.toggleQuestionExpansion(question.id)
                });
                
                ReactDOM.render(questionCard, container);
            } else {
                // Fallback to vanilla HTML if React is not available
                this.renderQuestionCardVanilla(container, question, index);
            }
        });
    }

    renderQuestionCardVanilla(container, question, index) {
        if (!container) return;
        
        const confidenceRating = this.confidenceRatings[question.id];
        const isExpanded = this.expandedQuestions.has(question.id);
        const currentLevel = confidenceRating?.level || 0;
        
        container.innerHTML = `
            <div class="question-card ${isExpanded ? 'expanded' : ''}" data-question-id="${question.id}">
                <div class="question-header" onclick="confidenceSystem.toggleQuestionExpansion('${question.id}')">
                    <div class="question-meta">
                        <span class="frequency-badge">${question.frequency}%</span>
                        <span class="difficulty-badge" style="background: ${this.getDifficultyColor(question.difficulty)}">${question.difficulty}</span>
                        <span class="category-badge">${question.category}</span>
                        <span class="priority-badge">#${question.priority}</span>
                    </div>
                    <h3 class="question-title">${question.question}</h3>
                    <div class="question-actions">
                        <button class="expand-btn">${isExpanded ? '▼' : '▶'}</button>
                    </div>
                </div>
                ${isExpanded ? this.generateExpandedQuestionContent(question, currentLevel) : ''}
            </div>
        `;
    }

    generateExpandedQuestionContent(question, currentLevel) {
        return `
            <div class="question-content">
                <div class="confidence-tracker">
                    <div class="confidence-label">
                        <span>Your confidence:</span>
                        <span class="confidence-emoji">${this.getConfidenceEmoji(currentLevel)}</span>
                    </div>
                    <div class="confidence-circles">
                        ${[1,2,3,4,5].map(level => `
                            <div class="confidence-circle ${currentLevel >= level ? 'filled' : ''}" 
                                 onclick="confidenceSystem.updateConfidenceRating('${question.id}', ${level})"
                                 style="${currentLevel >= level ? `background-color: ${this.getConfidenceColor(level)}` : ''}">
                                <span class="circle-number">${level}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="confidence-description">
                        <span>${this.getConfidenceLabel(currentLevel)}</span>
                        <span class="confidence-percentage">${currentLevel * 20}%</span>
                    </div>
                </div>
                
                <div class="answer-section">
                    <h4>📝 Detailed Answer</h4>
                    <div class="answer-text">${question.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
                </div>
                
                ${question.codeExample ? `
                    <div class="code-section">
                        <h4>💻 Code Example</h4>
                        <h5>${question.codeExample.title}</h5>
                        <pre class="code-block"><code>${question.codeExample.code}</code></pre>
                        <button class="copy-btn" onclick="navigator.clipboard.writeText('${question.codeExample.code.replace(/'/g, "\\'")}')">Copy Code</button>
                    </div>
                ` : ''}
                
                ${question.keyPoints ? `
                    <div class="key-points">
                        <h4>🔑 Key Points</h4>
                        <ul>${question.keyPoints.map(point => `<li>${point}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                
                ${question.followUpQuestions ? `
                    <div class="follow-up-questions">
                        <h4>🎯 Follow-up Questions</h4>
                        <ul>${question.followUpQuestions.map(q => `<li>${q}</li>`).join('')}</ul>
                    </div>
                ` : ''}
            </div>
        `;
    }

    toggleQuestionExpansion(questionId) {
        if (this.expandedQuestions.has(questionId)) {
            this.expandedQuestions.delete(questionId);
        } else {
            this.expandedQuestions.add(questionId);
        }
        this.renderQuestionCards();
    }

    expandAllQuestions() {
        const questions = this.questionsData?.tiers[this.currentTier]?.questions || [];
        questions.forEach(q => this.expandedQuestions.add(q.id));
        this.renderQuestionCards();
    }

    collapseAllQuestions() {
        this.expandedQuestions.clear();
        this.renderQuestionCards();
    }

    showRandomQuestion() {
        const questions = this.questionsData?.tiers[this.currentTier]?.questions || [];
        const randomIndex = Math.floor(Math.random() * questions.length);
        const randomQuestion = questions[randomIndex];
        
        // Collapse all, then expand the random one
        this.expandedQuestions.clear();
        this.expandedQuestions.add(randomQuestion.id);
        this.renderQuestionCards();
        
        // Scroll to the question
        this.scrollToQuestion(randomQuestion.id);
        
        showNotification(`🎲 Random question: ${randomQuestion.question.substring(0, 50)}...`);
    }

    scrollToQuestion(questionId) {
        const element = document.getElementById(`question-${questionId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlighted');
            setTimeout(() => element.classList.remove('highlighted'), 2000);
        }
    }

    filterQuestions() {
        const searchTerm = document.getElementById('questionSearch')?.value.toLowerCase() || '';
        const difficultyFilter = document.getElementById('difficultyFilter')?.value || 'all';
        const confidenceFilter = document.getElementById('confidenceFilter')?.value || 'all';
        
        const questions = this.questionsData?.tiers[this.currentTier]?.questions || [];
        
        questions.forEach(question => {
            const container = document.getElementById(`question-${question.id}`);
            if (!container) return;
            
            let visible = true;
            
            // Search filter
            if (searchTerm) {
                const searchableText = `${question.question} ${question.answer} ${question.category}`.toLowerCase();
                visible = visible && searchableText.includes(searchTerm);
            }
            
            // Difficulty filter
            if (difficultyFilter !== 'all') {
                visible = visible && question.difficulty === difficultyFilter;
            }
            
            // Confidence filter
            if (confidenceFilter !== 'all') {
                const currentLevel = this.confidenceRatings[question.id]?.level || 0;
                
                switch(confidenceFilter) {
                    case '0':
                        visible = visible && currentLevel === 0;
                        break;
                    case '1-2':
                        visible = visible && currentLevel >= 1 && currentLevel <= 2;
                        break;
                    case '3-4':
                        visible = visible && currentLevel >= 3 && currentLevel <= 4;
                        break;
                    case '5':
                        visible = visible && currentLevel === 5;
                        break;
                }
            }
            
            container.style.display = visible ? 'block' : 'none';
        });
    }

    updateDashboardStats() {
        const progressElement = document.getElementById('enhanced-questions-progress');
        if (progressElement) {
            const questions = this.questionsData?.tiers[this.currentTier]?.questions || [];
            const completedQuestions = questions.filter(q => 
                this.confidenceRatings[q.id] && this.confidenceRatings[q.id].level >= 3
            ).length;
            
            progressElement.textContent = `${completedQuestions}/${questions.length} Complete`;
        }
    }

    ensureCSSLoaded() {
        if (!document.getElementById('modern-interview-ui-css')) {
            const link = document.createElement('link');
            link.id = 'modern-interview-ui-css';
            link.rel = 'stylesheet';
            link.href = '/css/modern-interview-ui.css';
            document.head.appendChild(link);
        }
    }

    getDifficultyColor(difficulty) {
        const colors = {
            'Beginner': '#10b981',
            'Intermediate': '#f59e0b',
            'Advanced': '#ef4444',
            'Expert': '#8b5cf6'
        };
        return colors[difficulty] || '#6b7280';
    }

    getConfidenceEmoji(level) {
        const emojis = ['😕', '🤔', '😐', '😊', '😎', '🔥'];
        return emojis[level] || emojis[0];
    }

    getConfidenceColor(level) {
        const colors = {
            0: '#e2e8f0',
            1: '#feb2b2',
            2: '#f6e05e',
            3: '#68d391',
            4: '#63b3ed',
            5: '#9f7aea'
        };
        return colors[level] || colors[0];
    }

    getConfidenceLabel(level) {
        const labels = {
            0: 'Not familiar',
            1: 'Just heard of it',
            2: 'Basic understanding',
            3: 'Can explain it',
            4: 'Very confident',
            5: 'Expert level'
        };
        return labels[level] || labels[0];
    }

    showError(message) {
        console.error(message);
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    // Export data for backup/analysis
    exportProgress() {
        const exportData = {
            timestamp: new Date().toISOString(),
            confidenceRatings: this.confidenceRatings,
            currentTier: this.currentTier,
            totalQuestions: this.questionsData?.tiers[this.currentTier]?.questions.length || 0
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-progress-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Progress exported successfully!');
    }
}

// Initialize the system when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.confidenceSystem = new ConfidenceBasedInterviewSystem();
    });
} else {
    window.confidenceSystem = new ConfidenceBasedInterviewSystem();
}

// Make it globally available
window.ConfidenceBasedInterviewSystem = ConfidenceBasedInterviewSystem;