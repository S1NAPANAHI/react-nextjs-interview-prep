// Enhanced Interview Application with Full Data Integration
class EnhancedInterviewSystem {
    constructor() {
        this.currentStage = 1;
        this.userProgress = {
            completedQuestions: new Set(),
            scores: {},
            currentStreak: 0,
            totalCorrect: 0,
            weakAreas: [],
            strengths: []
        };
        
        // Load all your existing data
        this.loadInterviewData();
        this.initializeUI();
    }

    async loadInterviewData() {
        try {
            // Load all your existing JSON data files
            const dataFiles = [
                'data/top-10-questions.json',
                'data/top-20-questions.json',
                'data/top-50-questions.json',
                'data/top-100-questions.json',
                'data/flashcards.json',
                'data/challenges.json',
                'data/enhanced-questions.json',
                'data/tier-system.json'
            ];

            const loadedData = {};
            for (const file of dataFiles) {
                try {
                    const response = await fetch(file);
                    const data = await response.json();
                    const fileName = file.split('/')[1].replace('.json', '');
                    loadedData[fileName] = data;
                } catch (error) {
                    console.warn(`Could not load ${file}:`, error);
                }
            }

            this.interviewData = loadedData;
            this.processInterviewData();
        } catch (error) {
            console.error('Error loading interview data:', error);
        }
    }

    processInterviewData() {
        // Combine all questions from different sources
        this.allQuestions = [];
        
        // Process top questions
        ['top-10-questions', 'top-20-questions', 'top-50-questions', 'top-100-questions'].forEach(source => {
            if (this.interviewData[source]) {
                this.allQuestions.push(...this.interviewData[source].questions || []);
            }
        });

        // Add enhanced questions
        if (this.interviewData['enhanced-questions']) {
            this.allQuestions.push(...this.interviewData['enhanced-questions'].questions || []);
        }

        // Organize by categories and difficulty
        this.organizeQuestionsByCategory();
        this.setupFiveStageSystem();
    }

    organizeQuestionsByCategory() {
        this.categorizedQuestions = {
            'react-fundamentals': [],
            'hooks': [],
            'state-management': [],
            'performance': [],
            'testing': [],
            'advanced-patterns': []
        };

        this.allQuestions.forEach(question => {
            const category = this.determineCategory(question);
            if (this.categorizedQuestions[category]) {
                this.categorizedQuestions[category].push(question);
            }
        });
    }

    setupFiveStageSystem() {
        this.stages = {
            1: {
                name: "Foundation Check",
                description: "Basic React concepts and fundamentals",
                questions: this.categorizedQuestions['react-fundamentals'].slice(0, 10),
                passingScore: 70,
                timeLimit: 15 // minutes
            },
            2: {
                name: "Hooks Mastery",
                description: "React Hooks and modern patterns",
                questions: this.categorizedQuestions['hooks'].slice(0, 15),
                passingScore: 75,
                timeLimit: 20
            },
            3: {
                name: "State & Logic",
                description: "State management and complex logic",
                questions: this.categorizedQuestions['state-management'].slice(0, 15),
                passingScore: 75,
                timeLimit: 25
            },
            4: {
                name: "Performance & Optimization",
                description: "Advanced performance concepts",
                questions: this.categorizedQuestions['performance'].slice(0, 12),
                passingScore: 80,
                timeLimit: 30
            },
            5: {
                name: "Expert Level",
                description: "Advanced patterns and architecture",
                questions: this.categorizedQuestions['advanced-patterns'].slice(0, 20),
                passingScore: 85,
                timeLimit: 40
            }
        };
    }

    // UI Integration Methods
    renderWikiWithInterviewData() {
        const mainContent = document.querySelector('.wiki-content');
        
        // Create navigation for interview stages
        const stageNavigation = this.createStageNavigation();
        
        // Create question browsers for each category
        const questionBrowsers = this.createQuestionBrowsers();
        
        // Add practice modes
        const practiceModes = this.createPracticeModes();
        
        mainContent.innerHTML = `
            ${stageNavigation}
            ${questionBrowsers}
            ${practiceModes}
            ${this.createProgressDashboard()}
        `;
    }

    createStageNavigation() {
        return `
            <div class="interview-stages">
                <h2>🎯 Five-Stage Interview System</h2>
                <div class="stage-grid">
                    ${Object.entries(this.stages).map(([stageNum, stage]) => `
                        <div class="stage-card" data-stage="${stageNum}">
                            <div class="stage-number">Stage ${stageNum}</div>
                            <h3>${stage.name}</h3>
                            <p>${stage.description}</p>
                            <div class="stage-stats">
                                <span>📝 ${stage.questions.length} questions</span>
                                <span>⏱️ ${stage.timeLimit} mins</span>
                                <span>🎯 ${stage.passingScore}% to pass</span>
                            </div>
                            <button class="btn-primary" onclick="interviewSystem.startStage(${stageNum})">
                                Start Stage ${stageNum}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createQuestionBrowsers() {
        return `
            <div class="question-browsers">
                <h2>📚 Question Collections</h2>
                <div class="browser-grid">
                    ${Object.entries(this.categorizedQuestions).map(([category, questions]) => `
                        <div class="question-browser-card">
                            <h3>${this.formatCategoryName(category)}</h3>
                            <p>${questions.length} questions available</p>
                            <button class="btn-secondary" onclick="interviewSystem.browseCategory('${category}')">
                                Browse Questions
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createPracticeModes() {
        return `
            <div class="practice-modes">
                <h2>🏋️ Practice Modes</h2>
                <div class="mode-grid">
                    <div class="practice-card">
                        <h3>🎲 Random Quiz</h3>
                        <p>Test yourself with random questions from all categories</p>
                        <button class="btn-accent" onclick="interviewSystem.startRandomQuiz()">Start Quiz</button>
                    </div>
                    <div class="practice-card">
                        <h3>⚡ Quick Review</h3>
                        <p>Flashcard-style review of key concepts</p>
                        <button class="btn-accent" onclick="interviewSystem.startFlashcards()">Review Cards</button>
                    </div>
                    <div class="practice-card">
                        <h3>💪 Coding Challenges</h3>
                        <p>Hands-on coding exercises</p>
                        <button class="btn-accent" onclick="interviewSystem.startChallenges()">Code Now</button>
                    </div>
                </div>
            </div>
        `;
    }

    createProgressDashboard() {
        return `
            <div class="progress-dashboard">
                <h2>📊 Your Progress</h2>
                <div class="progress-stats">
                    <div class="stat-card">
                        <h3>Questions Completed</h3>
                        <div class="big-number">${this.userProgress.completedQuestions.size}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Success Rate</h3>
                        <div class="big-number">${this.calculateSuccessRate()}%</div>
                    </div>
                    <div class="stat-card">
                        <h3>Current Streak</h3>
                        <div class="big-number">${this.userProgress.currentStreak}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Stage Management
    startStage(stageNumber) {
        const stage = this.stages[stageNumber];
        this.currentStage = stageNumber;
        
        // Create stage interface
        this.renderStageInterface(stage, stageNumber);
        this.startTimer(stage.timeLimit);
    }

    renderStageInterface(stage, stageNumber) {
        const mainContent = document.querySelector('.wiki-content');
        
        mainContent.innerHTML = `
            <div class="stage-interface">
                <div class="stage-header">
                    <h1>Stage ${stageNumber}: ${stage.name}</h1>
                    <div class="stage-progress">
                        <span>Question <span id="current-question">1</span> of ${stage.questions.length}</span>
                        <span>Time: <span id="timer">${stage.timeLimit}:00</span></span>
                    </div>
                </div>
                
                <div class="question-container" id="question-container">
                    ${this.renderQuestion(stage.questions[0], 0)}
                </div>
                
                <div class="stage-controls">
                    <button id="prev-btn" class="btn-secondary" disabled>Previous</button>
                    <button id="next-btn" class="btn-primary">Next</button>
                    <button id="submit-stage" class="btn-accent" style="display: none;">Submit Stage</button>
                </div>
            </div>
        `;
        
        this.setupStageEventListeners(stage);
    }

    renderQuestion(question, index) {
        return `
            <div class="question-card">
                <h3>Question ${index + 1}</h3>
                <div class="question-text">${question.question}</div>
                
                ${question.type === 'multiple-choice' ? `
                    <div class="answer-options">
                        ${question.options.map((option, i) => `
                            <label class="option-label">
                                <input type="radio" name="answer-${index}" value="${i}">
                                <span class="option-text">${option}</span>
                            </label>
                        `).join('')}
                    </div>
                ` : `
                    <textarea class="answer-textarea" placeholder="Type your answer here..." rows="6"></textarea>
                `}
                
                ${question.code ? `
                    <div class="code-example">
                        <pre><code class="language-javascript">${question.code}</code></pre>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Coincidence Checking System
    checkAnswerCoincidence(userAnswer, correctAnswer, question) {
        const coincidenceScore = this.calculateCoincidence(userAnswer, correctAnswer);
        
        return {
            score: coincidenceScore,
            feedback: this.generateFeedback(coincidenceScore, question),
            suggestions: this.generateSuggestions(coincidenceScore, question)
        };
    }

    calculateCoincidence(userAnswer, correctAnswer) {
        // Implement sophisticated string matching
        const userWords = userAnswer.toLowerCase().split(/\s+/);
        const correctWords = correctAnswer.toLowerCase().split(/\s+/);
        
        const matches = userWords.filter(word => 
            correctWords.some(correctWord => 
                correctWord.includes(word) || word.includes(correctWord)
            )
        ).length;
        
        return Math.min(100, (matches / correctWords.length) * 100);
    }

    generateFeedback(score, question) {
        if (score >= 90) return "Excellent! Perfect understanding.";
        if (score >= 75) return "Very good! Minor improvements possible.";
        if (score >= 60) return "Good grasp, but some key concepts missing.";
        if (score >= 40) return "Partial understanding, needs more study.";
        return "Needs significant improvement in this area.";
    }

    // Utility Methods
    determineCategory(question) {
        const text = (question.question + ' ' + (question.answer || '')).toLowerCase();
        
        if (text.includes('hook') || text.includes('usestate') || text.includes('useeffect')) return 'hooks';
        if (text.includes('performance') || text.includes('optimization') || text.includes('memo')) return 'performance';
        if (text.includes('test') || text.includes('jest') || text.includes('enzyme')) return 'testing';
        if (text.includes('redux') || text.includes('context') || text.includes('state')) return 'state-management';
        if (text.includes('component') || text.includes('jsx') || text.includes('props')) return 'react-fundamentals';
        
        return 'advanced-patterns';
    }

    formatCategoryName(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    calculateSuccessRate() {
        const totalAttempts = Object.keys(this.userProgress.scores).length;
        if (totalAttempts === 0) return 0;
        
        const totalScore = Object.values(this.userProgress.scores).reduce((sum, score) => sum + score, 0);
        return Math.round(totalScore / totalAttempts);
    }

    // Save progress to localStorage
    saveProgress() {
        localStorage.setItem('interviewProgress', JSON.stringify(this.userProgress));
    }

    loadProgress() {
        const saved = localStorage.getItem('interviewProgress');
        if (saved) {
            this.userProgress = { ...this.userProgress, ...JSON.parse(saved) };
        }
    }
}

// Initialize the enhanced system
document.addEventListener('DOMContentLoaded', () => {
    window.interviewSystem = new EnhancedInterviewSystem();
});
