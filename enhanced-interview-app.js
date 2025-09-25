// Enhanced Interview Application with Five-Stage System
// Integrates all existing JSON data files and implements comprehensive interview preparation stages

class EnhancedInterviewApp {
    constructor() {
        this.currentStage = 1;
        this.userData = this.loadUserData();
        this.allQuestions = {};
        this.stageData = {
            1: { name: "Foundation Assessment", description: "Basic knowledge evaluation", questions: [] },
            2: { name: "Skill Building", description: "Targeted practice areas", questions: [] },
            3: { name: "Advanced Concepts", description: "Complex scenarios and patterns", questions: [] },
            4: { name: "Mock Interview", description: "Simulated interview experience", questions: [] },
            5: { name: "Final Preparation", description: "Last-minute review and confidence check", questions: [] }
        };
        this.init();
    }

    async init() {
        await this.loadAllQuestionData();
        this.setupEventListeners();
        this.renderInterface();
        this.updateProgressDisplay();
    }

    async loadAllQuestionData() {
        try {
            // Load all JSON question files
            const dataFiles = [
                'data/top-10-questions.json',
                'data/top-20-questions.json',
                'data/top-50-questions.json',
                'data/top-100-questions.json',
                'data/flashcards.json',
                'data/challenges.json',
                'data/enhanced-questions.json',
                'data/react-interview-questions-complete.json'
            ];

            const responses = await Promise.all(
                dataFiles.map(file => 
                    fetch(file)
                        .then(response => response.json())
                        .catch(error => {
                            console.warn(`Failed to load ${file}:`, error);
                            return null;
                        })
                )
            );

            // Process and organize questions by difficulty and topic
            responses.forEach((data, index) => {
                if (data) {
                    const fileName = dataFiles[index].split('/').pop().replace('.json', '');
                    this.allQuestions[fileName] = data;
                }
            });

            this.organizeQuestionsByStage();
        } catch (error) {
            console.error('Error loading question data:', error);
            this.loadFallbackQuestions();
        }
    }

    organizeQuestionsByStage() {
        // Stage 1: Foundation (Top 10-20 basic questions)
        if (this.allQuestions['top-10-questions']) {
            this.stageData[1].questions = this.allQuestions['top-10-questions'].slice(0, 15);
        }

        // Stage 2: Skill Building (Top 20-50 intermediate questions)
        if (this.allQuestions['top-20-questions']) {
            this.stageData[2].questions = this.allQuestions['top-20-questions'].slice(10, 30);
        }

        // Stage 3: Advanced Concepts (Complex questions and patterns)
        if (this.allQuestions['top-50-questions']) {
            this.stageData[3].questions = this.allQuestions['top-50-questions'].slice(30, 50);
        }

        // Stage 4: Mock Interview (Comprehensive mix)
        if (this.allQuestions['top-100-questions']) {
            this.stageData[4].questions = this.selectMockInterviewQuestions();
        }

        // Stage 5: Final Preparation (Review and confidence check)
        this.stageData[5].questions = this.selectFinalPrepQuestions();
    }

    selectMockInterviewQuestions() {
        // Select a balanced mix for mock interview
        const mockQuestions = [];
        
        // Add easy, medium, and hard questions
        if (this.allQuestions['top-10-questions']) {
            mockQuestions.push(...this.allQuestions['top-10-questions'].slice(0, 5));
        }
        if (this.allQuestions['top-20-questions']) {
            mockQuestions.push(...this.allQuestions['top-20-questions'].slice(5, 10));
        }
        if (this.allQuestions['top-50-questions']) {
            mockQuestions.push(...this.allQuestions['top-50-questions'].slice(10, 15));
        }
        
        return this.shuffleArray(mockQuestions);
    }

    selectFinalPrepQuestions() {
        // Select high-impact questions for final review
        const finalQuestions = [];
        
        // Get most important questions from each category
        Object.values(this.allQuestions).forEach(questionSet => {
            if (Array.isArray(questionSet)) {
                finalQuestions.push(...questionSet.slice(0, 3));
            }
        });
        
        return finalQuestions.slice(0, 20);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    loadFallbackQuestions() {
        // Fallback questions if JSON files fail to load
        const fallbackQuestions = [
            {
                "id": "fallback-1",
                "question": "What is React and why is it popular?",
                "answer": "React is a JavaScript library for building user interfaces, particularly web applications. It's popular due to its component-based architecture, virtual DOM, and strong ecosystem.",
                "difficulty": "easy",
                "category": "fundamentals"
            },
            {
                "id": "fallback-2",
                "question": "Explain the difference between props and state.",
                "answer": "Props are read-only data passed from parent to child components, while state is mutable data managed within a component that can trigger re-renders when changed.",
                "difficulty": "easy",
                "category": "fundamentals"
            }
        ];
        
        this.stageData[1].questions = fallbackQuestions;
    }

    setupEventListeners() {
        // Stage navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.stage-btn')) {
                const stage = parseInt(e.target.dataset.stage);
                this.setCurrentStage(stage);
            }
            
            if (e.target.matches('.question-toggle')) {
                this.toggleQuestion(e.target);
            }
            
            if (e.target.matches('.mark-complete')) {
                this.markQuestionComplete(e.target);
            }
            
            if (e.target.matches('.start-assessment')) {
                this.startAssessment();
            }
            
            if (e.target.matches('.theme-toggle')) {
                this.toggleTheme();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '5' && e.ctrlKey) {
                e.preventDefault();
                this.setCurrentStage(parseInt(e.key));
            }
        });
    }

    setCurrentStage(stage) {
        this.currentStage = stage;
        this.saveUserData();
        this.renderInterface();
        this.updateProgressDisplay();
    }

    toggleQuestion(button) {
        const questionId = button.dataset.questionId;
        const answerDiv = document.getElementById(`answer-${questionId}`);
        
        if (answerDiv.style.display === 'none' || !answerDiv.style.display) {
            answerDiv.style.display = 'block';
            button.textContent = 'Hide Answer';
            button.classList.add('active');
        } else {
            answerDiv.style.display = 'none';
            button.textContent = 'Show Answer';
            button.classList.remove('active');
        }
    }

    markQuestionComplete(button) {
        const questionId = button.dataset.questionId;
        
        if (!this.userData.completedQuestions) {
            this.userData.completedQuestions = [];
        }
        
        if (!this.userData.completedQuestions.includes(questionId)) {
            this.userData.completedQuestions.push(questionId);
            button.textContent = '✓ Completed';
            button.classList.add('completed');
            button.disabled = true;
        }
        
        this.saveUserData();
        this.updateProgressDisplay();
    }

    startAssessment() {
        const assessmentQuestions = this.stageData[this.currentStage].questions.slice(0, 10);
        this.renderAssessmentMode(assessmentQuestions);
    }

    renderInterface() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="enhanced-interview-app">
                ${this.renderHeader()}
                ${this.renderStageNavigation()}
                ${this.renderProgressSection()}
                ${this.renderCurrentStageContent()}
                ${this.renderFooter()}
            </div>
        `;
    }

    renderHeader() {
        return `
            <header class="app-header">
                <div class="header-content">
                    <h1>🚀 React Interview Mastery</h1>
                    <p>Five-Stage Comprehensive Preparation System</p>
                    <button class="theme-toggle" title="Toggle Theme">🌓</button>
                </div>
            </header>
        `;
    }

    renderStageNavigation() {
        return `
            <nav class="stage-navigation">
                <div class="stage-buttons">
                    ${Object.entries(this.stageData).map(([stageNum, stage]) => `
                        <button 
                            class="stage-btn ${this.currentStage == stageNum ? 'active' : ''}" 
                            data-stage="${stageNum}"
                            title="${stage.description}"
                        >
                            <span class="stage-number">${stageNum}</span>
                            <span class="stage-name">${stage.name}</span>
                        </button>
                    `).join('')}
                </div>
            </nav>
        `;
    }

    renderProgressSection() {
        const totalQuestions = Object.values(this.stageData).reduce((sum, stage) => sum + stage.questions.length, 0);
        const completedQuestions = this.userData.completedQuestions ? this.userData.completedQuestions.length : 0;
        const progressPercentage = totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;

        return `
            <section class="progress-section">
                <div class="progress-stats">
                    <div class="stat-item">
                        <span class="stat-value">${completedQuestions}</span>
                        <span class="stat-label">Completed</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${totalQuestions}</span>
                        <span class="stat-label">Total Questions</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${Math.round(progressPercentage)}%</span>
                        <span class="stat-label">Progress</span>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            </section>
        `;
    }

    renderCurrentStageContent() {
        const currentStageData = this.stageData[this.currentStage];
        
        return `
            <main class="stage-content">
                <div class="stage-header">
                    <h2>Stage ${this.currentStage}: ${currentStageData.name}</h2>
                    <p>${currentStageData.description}</p>
                    <div class="stage-actions">
                        <button class="start-assessment btn-primary">Start Assessment</button>
                        <span class="question-count">${currentStageData.questions.length} Questions Available</span>
                    </div>
                </div>
                
                <div class="questions-container">
                    ${this.renderQuestions(currentStageData.questions)}
                </div>
            </main>
        `;
    }

    renderQuestions(questions) {
        if (!questions || questions.length === 0) {
            return `
                <div class="no-questions">
                    <p>No questions available for this stage yet.</p>
                    <p>Questions are being loaded from your data files...</p>
                </div>
            `;
        }

        return questions.map((question, index) => {
            const isCompleted = this.userData.completedQuestions && 
                              this.userData.completedQuestions.includes(question.id || `q-${index}`);
            
            return `
                <div class="question-card ${isCompleted ? 'completed' : ''}">
                    <div class="question-header">
                        <h3 class="question-title">${question.question || question.title || 'Question'}</h3>
                        <div class="question-meta">
                            ${question.difficulty ? `<span class="difficulty ${question.difficulty}">${question.difficulty}</span>` : ''}
                            ${question.category ? `<span class="category">${question.category}</span>` : ''}
                        </div>
                    </div>
                    
                    <div class="question-actions">
                        <button 
                            class="question-toggle btn-secondary" 
                            data-question-id="${question.id || `q-${index}`}"
                        >
                            Show Answer
                        </button>
                        <button 
                            class="mark-complete btn-success ${isCompleted ? 'completed' : ''}" 
                            data-question-id="${question.id || `q-${index}`}"
                            ${isCompleted ? 'disabled' : ''}
                        >
                            ${isCompleted ? '✓ Completed' : 'Mark Complete'}
                        </button>
                    </div>
                    
                    <div 
                        id="answer-${question.id || `q-${index}`}" 
                        class="question-answer" 
                        style="display: none;"
                    >
                        <div class="answer-content">
                            ${question.answer || question.explanation || 'Answer not available'}
                        </div>
                        
                        ${question.code ? `
                            <div class="code-example">
                                <h4>Code Example:</h4>
                                <pre><code class="language-javascript">${question.code}</code></pre>
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
                        
                        ${question.followUp ? `
                            <div class="follow-up">
                                <h4>Follow-up Questions:</h4>
                                <ul>
                                    ${question.followUp.map(q => `<li>${q}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderAssessmentMode(questions) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="assessment-mode">
                <div class="assessment-header">
                    <h2>Assessment Mode - Stage ${this.currentStage}</h2>
                    <p>Answer these questions to test your knowledge</p>
                    <button onclick="window.interviewApp.renderInterface()" class="btn-secondary">Back to Study Mode</button>
                </div>
                
                <div class="assessment-questions">
                    ${questions.map((question, index) => `
                        <div class="assessment-question">
                            <h3>Question ${index + 1}:</h3>
                            <p>${question.question || question.title}</p>
                            <textarea 
                                class="assessment-answer" 
                                placeholder="Type your answer here..."
                                rows="4"
                            ></textarea>
                            <button 
                                class="reveal-answer btn-outline" 
                                onclick="this.nextElementSibling.style.display='block'; this.style.display='none';"
                            >
                                Reveal Answer
                            </button>
                            <div class="correct-answer" style="display: none;">
                                <h4>Correct Answer:</h4>
                                <p>${question.answer || question.explanation}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderFooter() {
        return `
            <footer class="app-footer">
                <p>🎯 Master React interviews with our comprehensive five-stage system</p>
                <div class="keyboard-shortcuts">
                    <span>Shortcuts: Ctrl + 1-5 (Switch stages)</span>
                </div>
            </footer>
        `;
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    updateProgressDisplay() {
        // Update progress indicators in real-time
        const currentStageQuestions = this.stageData[this.currentStage].questions.length;
        const currentStageCompleted = this.userData.completedQuestions ? 
            this.userData.completedQuestions.filter(id => 
                this.stageData[this.currentStage].questions.some(q => (q.id || q.question) === id)
            ).length : 0;
            
        // Update stage button indicators
        document.querySelectorAll('.stage-btn').forEach(btn => {
            const stage = btn.dataset.stage;
            const stageQuestions = this.stageData[stage].questions.length;
            const stageCompleted = this.userData.completedQuestions ? 
                this.userData.completedQuestions.filter(id => 
                    this.stageData[stage].questions.some(q => (q.id || q.question) === id)
                ).length : 0;
            
            if (stageCompleted === stageQuestions && stageQuestions > 0) {
                btn.classList.add('stage-complete');
            }
        });
    }

    loadUserData() {
        const saved = localStorage.getItem('interviewAppUserData');
        return saved ? JSON.parse(saved) : {
            completedQuestions: [],
            currentStage: 1,
            startDate: new Date().toISOString()
        };
    }

    saveUserData() {
        this.userData.currentStage = this.currentStage;
        this.userData.lastUpdated = new Date().toISOString();
        localStorage.setItem('interviewAppUserData', JSON.stringify(this.userData));
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Create global app instance
    window.interviewApp = new EnhancedInterviewApp();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedInterviewApp;
}