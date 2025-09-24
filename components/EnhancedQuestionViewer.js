class EnhancedQuestionViewer {
    constructor(container, questions) {
        this.container = container;
        this.questions = questions;
        this.currentIndex = 0;
        this.confidenceLevels = new Map(); // Store confidence for each question
        this.favorites = new Set(JSON.parse(localStorage.getItem('favorite-questions') || '[]'));
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="enhanced-question-viewer">
                <div class="question-header">
                    <div class="question-nav">
                        <button class="nav-btn" id="prevQuestion" ${this.currentIndex === 0 ? 'disabled' : ''}>⬅️ Previous</button>
                        <span class="question-counter">${this.currentIndex + 1}/${this.questions.length}</span>
                        <button class="nav-btn" id="nextQuestion" ${this.currentIndex === this.questions.length - 1 ? 'disabled' : ''}>Next ➡️</button>
                    </div>
                    <div class="question-actions">
                        <button class="action-btn favorite-btn" id="favoriteBtn">${this.favorites.has(this.questions[this.currentIndex]?.id) ? '❤️' : '🤍'}</button>
                        <button class="action-btn copy-btn" id="copyBtn">📋</button>
                        <button class="action-btn settings-btn" id="settingsBtn">⚙️</button>
                    </div>
                </div>
                
                <div class="question-content">
                    <div class="question-card">
                        <div class="question-meta">
                            <span class="difficulty-badge ${this.getCurrentQuestion().difficulty.toLowerCase()}">${this.getCurrentQuestion().difficulty}</span>
                            <span class="category-tag">${this.getCurrentQuestion().category}</span>
                            <span class="frequency-indicator">${'★'.repeat(Math.ceil(this.getCurrentQuestion().frequency / 20))}</span>
                        </div>
                        <h2 class="question-text">${this.getCurrentQuestion().question}</h2>
                        
                        <div class="confidence-tracker">
                            <h3>How confident are you with this topic?</h3>
                            <div class="confidence-circles">
                                ${[1,2,3,4,5].map(level => `
                                    <button class="confidence-circle" data-confidence="${level}" title="${this.getConfidenceLabel(level)}">
                                        <span class="circle-number">${level}</span>
                                        <span class="circle-label">${this.getConfidenceLabel(level)}</span>
                                    </button>
                                `).join('')}
                            </div>
                            <p class="confidence-description">1 = Never heard of it | 5 = Can teach others</p>
                        </div>
                    </div>
                    
                    <div class="answer-section" id="answerSection" style="display: none">
                        <div class="answer-content">
                            <h3>📖 Detailed Answer</h3>
                            <div class="answer-text">${this.formatAnswer(this.getCurrentQuestion().answer)}</div>
                            
                            ${this.getCurrentQuestion().codeExample ? `
                                <div class="code-example">
                                    <h4>💻 Code Example</h4>
                                    <pre><code class="language-jsx">${this.getCurrentQuestion().codeExample.code}</code></pre>
                                    <button class="copy-code-btn" data-code="${this.getCurrentQuestion().codeExample.code}">📋 Copy Code</button>
                                </div>
                            ` : ''}
                            
                            ${this.getCurrentQuestion().keyPoints ? `
                                <div class="key-points">
                                    <h4>🎯 Key Points</h4>
                                    <ul>${this.getCurrentQuestion().keyPoints.map(point => `<li>${point}</li>`).join('')}</ul>
                                </div>
                            ` : ''}
                            
                            ${this.getCurrentQuestion().followUpQuestions ? `
                                <div class="follow-up">
                                    <h4>🔄 Follow-up Questions</h4>
                                    <ul>${this.getCurrentQuestion().followUpQuestions.map(q => `<li>${q}</li>`).join('')}</ul>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="question-controls">
                        <button class="control-btn show-answer-btn" id="showAnswerBtn">Show Answer</button>
                        <button class="control-btn study-mode-btn" id="studyModeBtn">Study Mode</button>
                    </div>
                </div>
                
                <div class="progress-section">
                    <div class="overall-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((this.currentIndex + 1) / this.questions.length) * 100}%"></div>
                        </div>
                        <span class="progress-text">Progress: ${Math.round(((this.currentIndex + 1) / this.questions.length) * 100)}%</span>
                    </div>
                    
                    <div class="confidence-summary">
                        <div class="confidence-stats">
                            <div class="stat">
                                <span class="stat-number">${this.getConfidenceStats().confident}</span>
                                <span class="stat-label">Confident (4-5)</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${this.getConfidenceStats().needsWork}</span>
                                <span class="stat-label">Needs Work (1-3)</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number">${this.getConfidenceStats().notRated}</span>
                                <span class="stat-label">Not Rated</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.setupEventListeners();
        this.updateConfidenceDisplay();
    }

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    getConfidenceLabel(level) {
        const labels = {1: 'Beginner', 2: 'Learning', 3: 'Comfortable', 4: 'Confident', 5: 'Expert'};
        return labels[level];
    }

    formatAnswer(answer) {
        return answer
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    setupEventListeners() {
        // Navigation
        this.container.querySelector('#prevQuestion').addEventListener('click', () => {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.render();
            }
        });

        this.container.querySelector('#nextQuestion').addEventListener('click', () => {
            if (this.currentIndex < this.questions.length - 1) {
                this.currentIndex++;
                this.render();
            }
        });

        // Confidence tracking
        this.container.querySelectorAll('.confidence-circle').forEach(circle => {
            circle.addEventListener('click', (e) => {
                const confidence = parseInt(e.currentTarget.dataset.confidence);
                this.setConfidence(this.getCurrentQuestion().id, confidence);
                this.updateConfidenceDisplay();
            });
        });

        // Show/hide answer
        this.container.querySelector('#showAnswerBtn').addEventListener('click', () => {
            this.toggleAnswer();
        });

        // Favorite toggle
        this.container.querySelector('#favoriteBtn').addEventListener('click', () => {
            this.toggleFavorite();
        });

        // Copy functionality
        this.container.querySelector('#copyBtn').addEventListener('click', () => {
            this.copyQuestion();
        });

        // Copy code buttons
        this.container.querySelectorAll('.copy-code-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.dataset.code;
                navigator.clipboard.writeText(code);
                e.target.textContent = '✅ Copied!';
                setTimeout(() => e.target.textContent = '📋 Copy Code', 2000);
            });
        });
    }

    setConfidence(questionId, level) {
        this.confidenceLevels.set(questionId, level);
        localStorage.setItem('question-confidence', JSON.stringify(Array.from(this.confidenceLevels.entries())));
    }

    updateConfidenceDisplay() {
        const currentConfidence = this.confidenceLevels.get(this.getCurrentQuestion().id);
        this.container.querySelectorAll('.confidence-circle').forEach(circle => {
            const level = parseInt(circle.dataset.confidence);
            circle.classList.toggle('selected', level === currentConfidence);
        });
    }

    getConfidenceStats() {
        let confident = 0;
        let needsWork = 0;
        let notRated = 0;

        this.questions.forEach(q => {
            const confidence = this.confidenceLevels.get(q.id);
            if (!confidence) {
                notRated++;
            } else if (confidence >= 4) {
                confident++;
            } else {
                needsWork++;
            }
        });

        return {confident, needsWork, notRated};
    }

    toggleAnswer() {
        const answerSection = this.container.querySelector('#answerSection');
        const isVisible = answerSection.style.display !== 'none';
        answerSection.style.display = isVisible ? 'none' : 'block';
        this.container.querySelector('#showAnswerBtn').textContent = isVisible ? 'Show Answer' : 'Hide Answer';
    }

    toggleFavorite() {
        const questionId = this.getCurrentQuestion().id;
        if (this.favorites.has(questionId)) {
            this.favorites.delete(questionId);
        } else {
            this.favorites.add(questionId);
        }
        localStorage.setItem('favorite-questions', JSON.stringify(Array.from(this.favorites)));
        this.container.querySelector('#favoriteBtn').textContent = this.favorites.has(questionId) ? '❤️' : '🤍';
    }

    copyQuestion() {
        const question = this.getCurrentQuestion();
        const text = `Q: ${question.question}\n\nA: ${question.answer}`;
        navigator.clipboard.writeText(text);
        const btn = this.container.querySelector('#copyBtn');
        btn.textContent = '✅';
        setTimeout(() => btn.textContent = '📋', 2000);
    }
}