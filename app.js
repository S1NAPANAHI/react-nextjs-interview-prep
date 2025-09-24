// Interactive Learning Platform for React + Next.js Interview Prep
// Comprehensive update integrating all new components and features

// Import React and required dependencies
const { useState, useEffect, useCallback, useRef } = React;

// Import components from their files
// Note: In a real setup, these would be proper ES6 imports
// For HTML script setup, we'll define them in separate script tags or files

// Application Data (keeping existing flashcard data for backward compatibility)
const FLASHCARD_DATA = {
  "react_fundamentals": {
    "title": "React Fundamentals",
    "description": "Core React concepts, components, and patterns",
    "color": "#61dafb",
    "icon": "⚛️",
    "cards": [
      {
        "id": "react_001",
        "front": "What is the Virtual DOM and how does it work?",
        "back": "The Virtual DOM is a JavaScript representation of the actual DOM. React creates a virtual copy of the real DOM in memory. When state changes, React compares the new virtual DOM with the previous virtual DOM (diffing), identifies what changed, and updates only those parts in the real DOM (reconciliation). This makes updates faster than manipulating the real DOM directly."
      },
      {
        "id": "react_002",
        "front": "What's the difference between props and state?",
        "back": "**Props**: Data passed from parent to child component, read-only, immutable from child's perspective. **State**: Internal data managed by component itself, mutable, triggers re-render when changed. Props flow down, state is local to component."
      },
      {
        "id": "react_003",
        "front": "Explain the component lifecycle in functional components",
        "back": "Functional components use hooks to mimic lifecycle:\n- **Mount**: useEffect with empty dependency array []\n- **Update**: useEffect with dependencies [dep1, dep2]\n- **Unmount**: useEffect cleanup function (return statement)\n- **Every render**: useEffect with no dependency array"
      },
      {
        "id": "react_004",
        "front": "What is prop drilling and how can you avoid it?",
        "back": "Prop drilling is passing props through multiple component levels even when intermediate components don't need them. Solutions:\n1. **Context API** - Create context to share data across component tree\n2. **State management** - Redux, Zustand, Jotai\n3. **Component composition** - Render props, children props\n4. **Custom hooks** - Share stateful logic"
      },
      {
        "id": "react_005",
        "front": "When should you use a key prop in React?",
        "back": "Use keys when rendering lists to help React identify which items have changed, added, or removed. Keys should be:\n- **Unique** among siblings\n- **Stable** (don't use array index if list can reorder)\n- **Predictable** (same key for same item across renders)\nHelps React optimize re-rendering and maintain component state correctly."
      }
    ]
  },
  "react_hooks": {
    "title": "React Hooks",
    "description": "useState, useEffect, custom hooks, and optimization",
    "color": "#ff6b6b",
    "icon": "🎣",
    "cards": [
      {
        "id": "hooks_001",
        "front": "What are the rules of hooks?",
        "back": "1. **Only call hooks at the top level** - Never inside loops, conditions, or nested functions\n2. **Only call hooks from React functions** - React function components or custom hooks\n3. **Custom hooks must start with 'use'** - Naming convention for linting\nThese rules ensure hooks are called in the same order every time the component renders."
      },
      {
        "id": "hooks_002",
        "front": "What's the difference between useCallback and useMemo?",
        "back": "**useCallback**: Memoizes a function reference, prevents recreation on every render\n```jsx\nconst memoizedCallback = useCallback(() => { /* function */ }, [deps])\n```\n**useMemo**: Memoizes a computed value, prevents expensive calculations\n```jsx\nconst memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])\n```\nBoth help with performance optimization by preventing unnecessary work."
      }
    ]
  }
};

// Content Structure for Interactive Learning
const CONTENT_STRUCTURE = {
  weeks: {
    1: {
      title: 'React Fundamentals',
      description: 'Master the core concepts of React including components, JSX, state, and hooks',
      days: [
        {
          id: 'day1',
          title: 'React Fundamentals & JSX',
          theory: 'Learn about React components, JSX syntax, Virtual DOM, and the component lifecycle. Understand how React differs from vanilla JavaScript and why it\'s so popular for building user interfaces.',
          codeExamples: [
            { 
              label: 'Basic Component', 
              code: `function MyComponent() {
  return (
    <div className="greeting">
      <h1>Hello React!</h1>
      <p>This is my first component</p>
    </div>
  );
}`, 
              lang: 'jsx' 
            },
            {
              label: 'Component with Props',
              code: `function UserCard({ name, email, role }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <span className="role">{role}</span>
    </div>
  );
}

// Usage
<UserCard 
  name="John Doe" 
  email="john@example.com" 
  role="Developer" 
/>`,
              lang: 'jsx'
            }
          ],
          quizzes: [
            { 
              question: 'What is JSX?', 
              answer: 'A syntax extension for JavaScript that allows writing HTML-like code in JavaScript',
              options: [
                'A new programming language',
                'A syntax extension for JavaScript',
                'A CSS framework',
                'A database query language'
              ],
              correct: 1
            },
            {
              question: 'What is the Virtual DOM?',
              answer: 'A JavaScript representation of the real DOM that React uses for efficient updates',
              options: [
                'A copy of the browser DOM',
                'A virtual representation for efficient updates',
                'A new DOM API',
                'A caching mechanism'
              ],
              correct: 1
            }
          ],
          checklist: [
            'Understand what React is and why it\'s used',
            'Create your first React component',
            'Learn JSX syntax and transpilation',
            'Understand props and component composition',
            'Know the difference between components and elements'
          ],
          challenges: [{
            id: 'challenge1',
            title: 'Build a User Profile Card',
            description: 'Create a reusable UserProfile component that displays user information with conditional rendering for optional fields.',
            requirements: [
              'Display name, email, and avatar',
              'Show role badge if provided',
              'Handle missing avatar gracefully',
              'Add hover effects with CSS'
            ],
            starterCode: `function UserProfile({ user }) {
  // TODO: Implement component
  return (
    <div className="user-profile">
      {/* Your code here */}
    </div>
  );
}`,
            solution: `function UserProfile({ user }) {
  const { name, email, role, avatar } = user;
  
  return (
    <div className="user-profile">
      <div className="avatar">
        {avatar ? (
          <img src={avatar} alt={name} />
        ) : (
          <div className="avatar-placeholder">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="user-info">
        <h3>{name}</h3>
        <p>{email}</p>
        {role && <span className="role-badge">{role}</span>}
      </div>
    </div>
  );
}`
          }]
        },
        {
          id: 'day2',
          title: 'State Management with useState',
          theory: 'Deep dive into React state management using the useState hook. Learn how to update state, handle multiple state variables, and understand re-rendering patterns.',
          codeExamples: [
            {
              label: 'useState Basic Example',
              code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);
  
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
              lang: 'jsx'
            }
          ],
          quizzes: [
            {
              question: 'When does a component re-render?',
              answer: 'When state changes, props change, or parent component re-renders',
              options: [
                'Only when props change',
                'When state or props change, or parent re-renders',
                'Every second automatically',
                'Only when explicitly called'
              ],
              correct: 1
            }
          ],
          checklist: [
            'Understand the useState hook syntax',
            'Handle multiple state variables',
            'Update state with objects and arrays correctly',
            'Know when components re-render',
            'Practice functional state updates'
          ],
          challenges: [{
            id: 'challenge2',
            title: 'Interactive Todo List',
            description: 'Build a todo list with add, delete, and toggle functionality using useState hook.',
            requirements: [
              'Add new todos with input field',
              'Mark todos as complete/incomplete',
              'Delete individual todos',
              'Show total and completed count',
              'Filter by all/active/completed'
            ]
          }]
        }
      ]
    },
    2: {
      title: 'Advanced React Patterns',
      description: 'Explore advanced React patterns including custom hooks, context API, and performance optimization',
      days: [
        {
          id: 'day3',
          title: 'Custom Hooks & Reusable Logic',
          theory: 'Learn how to create reusable logic with custom hooks. Understand the rules of hooks and how to extract component logic into reusable functions that can be shared across components.',
          codeExamples: [
            {
              label: 'Custom Hook - useCounter',
              code: `import { useState, useCallback } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);
  
  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return { count, increment, decrement, reset };
}`,
              lang: 'jsx'
            }
          ],
          quizzes: [
            {
              question: 'What must custom hook names start with?',
              answer: 'use (lowercase)',
              options: ['Use', 'use', 'hook', 'custom'],
              correct: 1
            }
          ],
          checklist: [
            'Create custom hooks for reusable logic',
            'Follow the rules of hooks',
            'Extract component logic effectively',
            'Use custom hooks in multiple components'
          ],
          challenges: [{
            id: 'challenge3',
            title: 'useLocalStorage Hook',
            description: 'Create a custom hook that syncs state with localStorage and handles edge cases like JSON parsing errors.'
          }]
        }
      ]
    }
  }
};

// Enhanced Flashcard Application with Interactive Learning Platform
class InteractiveLearningApp {
  constructor() {
    this.data = FLASHCARD_DATA;
    this.contentStructure = CONTENT_STRUCTURE;
    this.currentView = 'dashboard'; // dashboard, flashcards, roadmap, lesson, challenge
    this.currentCategory = null;
    this.currentCardIndex = 0;
    this.selectedLesson = null;
    this.selectedChallenge = null;
    this.isFlipped = false;
    this.progress = this.loadProgress();
    this.interviewDate = this.loadInterviewDate();
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderDashboard();
    this.updateDashboardStats();
    this.startCountdown();
    this.initTheme();
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
    
    // Dashboard navigation
    document.getElementById('backToDashboard')?.addEventListener('click', () => this.showDashboard());
    
    // Study mode cards - Enhanced for interactive learning
    document.querySelectorAll('.study-mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        this.handleStudyModeClick(mode);
      });
    });
    
    // Flashcard controls (existing functionality)
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
    
    // Interactive learning controls
    this.setupInteractiveLearningControls();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  setupInteractiveLearningControls() {
    // Back to roadmap button
    const backToRoadmapBtn = document.createElement('button');
    backToRoadmapBtn.id = 'backToRoadmap';
    backToRoadmapBtn.innerHTML = '🗺️ Back to Roadmap';
    backToRoadmapBtn.className = 'back-btn';
    backToRoadmapBtn.addEventListener('click', () => this.showRoadmap());
    
    // Add to header if it exists
    const header = document.querySelector('.header');
    if (header && !document.getElementById('backToRoadmap')) {
      header.appendChild(backToRoadmapBtn);
    }
  }

  handleStudyModeClick(mode) {
    switch(mode) {
      case 'flashcards':
        this.showDashboard(); // Show existing flashcard categories
        break;
      case 'roadmap':
        this.showRoadmap();
        break;
      case 'challenges':
        this.showChallenges();
        break;
      default:
        console.log('Unknown study mode:', mode);
    }
  }

  showRoadmap() {
    this.currentView = 'roadmap';
    this.hideAllViews();
    this.renderRoadmapView();
  }

  showChallenges() {
    alert('🔥 Coding challenges are coming soon! For now, use the interactive roadmap to practice with hands-on exercises.');
  }

  renderRoadmapView() {
    const container = document.getElementById('roadmap-container') || this.createRoadmapContainer();
    
    container.innerHTML = this.generateRoadmapHTML();
    container.classList.remove('hidden');
    
    // Setup roadmap event listeners
    this.setupRoadmapEventListeners();
  }

  createRoadmapContainer() {
    const container = document.createElement('div');
    container.id = 'roadmap-container';
    container.className = 'roadmap-container';
    document.body.appendChild(container);
    return container;
  }

  generateRoadmapHTML() {
    return `
      <div class="roadmap-nav">
        <div class="roadmap-header">
          <h1>🚀 React & Next.js Interview Prep Roadmap</h1>
          <p>Your structured learning journey to master React and Next.js interviews</p>
        </div>
        
        <div class="roadmap-timeline">
          ${Object.entries(this.contentStructure.weeks).map(([weekNum, weekData]) => `
            <div class="week-section">
              <div class="week-header">
                <div class="week-number">Week ${weekNum}</div>
                <h3 class="week-title">${weekData.title}</h3>
                <p class="week-description">${weekData.description}</p>
              </div>
              
              <div class="days-grid">
                ${weekData.days.map((day, dayIndex) => `
                  <div class="day-card" data-lesson-id="${day.id}">
                    <div class="day-header">
                      <div class="day-number">Day ${dayIndex + 1}</div>
                      <h4 class="day-title">${day.title}</h4>
                    </div>
                    
                    <div class="day-content">
                      <p class="day-summary">${day.theory.slice(0, 100)}...</p>
                      
                      <div class="day-stats">
                        ${day.codeExamples ? `<span class="stat-item">💻 ${day.codeExamples.length} examples</span>` : ''}
                        ${day.quizzes ? `<span class="stat-item">❓ ${day.quizzes.length} quizzes</span>` : ''}
                        ${day.checklist ? `<span class="stat-item">✅ ${day.checklist.length} tasks</span>` : ''}
                      </div>
                    </div>
                    
                    <div class="day-actions">
                      <button class="start-lesson-btn primary-btn" data-lesson-id="${day.id}">
                        📚 Start Lesson
                      </button>
                      
                      ${day.challenges ? day.challenges.map(challenge => `
                        <button class="challenge-btn secondary-btn" data-challenge-id="${challenge.id}">
                          🔥 ${challenge.title}
                        </button>
                      `).join('') : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="roadmap-footer">
          <div class="progress-summary">
            <h3>📊 Your Progress</h3>
            <div class="progress-stats">
              <div class="stat-card">
                <div class="stat-number">0</div>
                <div class="stat-label">Lessons Complete</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">0</div>
                <div class="stat-label">Challenges Solved</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">0%</div>
                <div class="stat-label">Overall Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupRoadmapEventListeners() {
    // Start lesson buttons
    document.querySelectorAll('.start-lesson-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lessonId = e.target.dataset.lessonId;
        this.startLesson(lessonId);
      });
    });

    // Challenge buttons
    document.querySelectorAll('.challenge-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const challengeId = e.target.dataset.challengeId;
        this.startChallenge(challengeId);
      });
    });
  }

  startLesson(lessonId) {
    // Find the lesson in content structure
    for (const week of Object.values(this.contentStructure.weeks)) {
      const lesson = week.days.find(day => day.id === lessonId);
      if (lesson) {
        this.selectedLesson = lesson;
        this.showLessonView();
        return;
      }
    }
    console.error('Lesson not found:', lessonId);
  }

  startChallenge(challengeId) {
    // Find the challenge in content structure
    for (const week of Object.values(this.contentStructure.weeks)) {
      for (const day of week.days) {
        if (day.challenges) {
          const challenge = day.challenges.find(c => c.id === challengeId);
          if (challenge) {
            this.selectedChallenge = challenge;
            this.showChallengeView();
            return;
          }
        }
      }
    }
    console.error('Challenge not found:', challengeId);
  }

  showLessonView() {
    this.currentView = 'lesson';
    this.hideAllViews();
    this.renderLessonView();
  }

  showChallengeView() {
    this.currentView = 'challenge';
    this.hideAllViews();
    this.renderChallengeView();
  }

  renderLessonView() {
    const container = document.getElementById('lesson-container') || this.createLessonContainer();
    
    if (!this.selectedLesson) {
      console.error('No lesson selected');
      return;
    }

    container.innerHTML = this.generateLessonHTML(this.selectedLesson);
    container.classList.remove('hidden');
    
    this.setupLessonEventListeners();
  }

  createLessonContainer() {
    const container = document.createElement('div');
    container.id = 'lesson-container';
    container.className = 'lesson-container';
    document.body.appendChild(container);
    return container;
  }

  generateLessonHTML(lesson) {
    return `
      <div class="lesson-viewer">
        <div class="lesson-header">
          <button class="back-to-roadmap-btn">← Back to Roadmap</button>
          <h2>${lesson.title}</h2>
        </div>
        
        <div class="tab-navigation">
          <button class="tab-button active" data-tab="theory">📖 Theory</button>
          <button class="tab-button" data-tab="practice">💻 Practice</button>
          <button class="tab-button" data-tab="quiz">❓ Quiz</button>
          <button class="tab-button" data-tab="checklist">✅ Checklist</button>
        </div>
        
        <div class="tab-content">
          <div class="tab-pane active" id="theory-tab">
            <div class="theory-content">
              ${this.formatMarkdownContent(lesson.theory)}
            </div>
          </div>
          
          <div class="tab-pane" id="practice-tab">
            <div class="practice-content">
              <h3>Code Examples</h3>
              ${lesson.codeExamples ? lesson.codeExamples.map((example, index) => `
                <div class="code-example">
                  <h4>${example.label}</h4>
                  <div class="code-editor-wrapper">
                    <pre><code class="language-${example.lang}">${this.escapeHtml(example.code)}</code></pre>
                    <button class="copy-code-btn" data-code="${this.escapeHtml(example.code)}">Copy</button>
                  </div>
                </div>
              `).join('') : '<p>No code examples available for this lesson.</p>'}
            </div>
          </div>
          
          <div class="tab-pane" id="quiz-tab">
            <div class="quiz-content">
              <h3>Knowledge Check</h3>
              ${lesson.quizzes ? lesson.quizzes.map((quiz, index) => `
                <div class="quiz-question" data-question-index="${index}">
                  <h4>Question ${index + 1}</h4>
                  <p class="question-text">${quiz.question}</p>
                  ${quiz.options ? `
                    <div class="quiz-options">
                      ${quiz.options.map((option, optIndex) => `
                        <label class="quiz-option">
                          <input type="radio" name="question-${index}" value="${optIndex}">
                          <span>${option}</span>
                        </label>
                      `).join('')}
                    </div>
                    <button class="check-answer-btn" data-question-index="${index}" data-correct="${quiz.correct}">Check Answer</button>
                    <div class="answer-feedback" style="display: none;"></div>
                  ` : `
                    <div class="answer-reveal">
                      <button class="show-answer-btn" data-answer="${quiz.answer}">Show Answer</button>
                      <div class="answer-content" style="display: none;">
                        <p><strong>Answer:</strong> ${quiz.answer}</p>
                      </div>
                    </div>
                  `}
                </div>
              `).join('') : '<p>No quizzes available for this lesson.</p>'}
            </div>
          </div>
          
          <div class="tab-pane" id="checklist-tab">
            <div class="checklist-content">
              <h3>Learning Objectives</h3>
              ${lesson.checklist ? `
                <ul class="checklist">
                  ${lesson.checklist.map((item, index) => `
                    <li class="checklist-item">
                      <input type="checkbox" id="checklist-${index}" data-lesson-id="${lesson.id}" data-item-index="${index}">
                      <label for="checklist-${index}">${item}</label>
                    </li>
                  `).join('')}
                </ul>
              ` : '<p>No checklist available for this lesson.</p>'}
            </div>
          </div>
        </div>
        
        <div class="lesson-actions">
          <button class="complete-lesson-btn primary-btn" data-lesson-id="${lesson.id}">
            ✅ Mark Lesson Complete
          </button>
        </div>
      </div>
    `;
  }

  formatMarkdownContent(content) {
    // Basic markdown formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n#{3}\s(.+)/g, '<h3>$1</h3>')
      .replace(/\n#{2}\s(.+)/g, '<h2>$1</h2>')
      .replace(/\n#{1}\s(.+)/g, '<h1>$1</h1>')
      .replace(/\n/g, '<br>');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setupLessonEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });

    // Back to roadmap
    document.querySelector('.back-to-roadmap-btn')?.addEventListener('click', () => {
      this.showRoadmap();
    });

    // Copy code buttons
    document.querySelectorAll('.copy-code-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = e.target.dataset.code;
        navigator.clipboard.writeText(code).then(() => {
          e.target.textContent = 'Copied!';
          setTimeout(() => {
            e.target.textContent = 'Copy';
          }, 2000);
        });
      });
    });

    // Quiz answer checking
    document.querySelectorAll('.check-answer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const questionIndex = e.target.dataset.questionIndex;
        const correctAnswer = parseInt(e.target.dataset.correct);
        this.checkQuizAnswer(questionIndex, correctAnswer);
      });
    });

    // Show answer buttons
    document.querySelectorAll('.show-answer-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const answerContent = e.target.nextElementSibling;
        answerContent.style.display = answerContent.style.display === 'none' ? 'block' : 'none';
        e.target.textContent = answerContent.style.display === 'none' ? 'Show Answer' : 'Hide Answer';
      });
    });

    // Checklist items
    document.querySelectorAll('.checklist-item input').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        this.updateChecklistProgress(e.target.dataset.lessonId, e.target.dataset.itemIndex, e.target.checked);
      });
    });

    // Complete lesson button
    document.querySelector('.complete-lesson-btn')?.addEventListener('click', (e) => {
      const lessonId = e.target.dataset.lessonId;
      this.markLessonComplete(lessonId);
    });
  }

  switchTab(tabName) {
    // Remove active class from all tabs and panes
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    // Add active class to selected tab and pane
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  }

  checkQuizAnswer(questionIndex, correctAnswer) {
    const selectedOption = document.querySelector(`input[name="question-${questionIndex}"]:checked`);
    const feedbackDiv = document.querySelector(`[data-question-index="${questionIndex}"] .answer-feedback`);
    
    if (!selectedOption) {
      feedbackDiv.innerHTML = '<p class="feedback-warning">Please select an answer first.</p>';
      feedbackDiv.style.display = 'block';
      return;
    }

    const selectedValue = parseInt(selectedOption.value);
    const isCorrect = selectedValue === correctAnswer;

    feedbackDiv.innerHTML = `
      <p class="feedback-${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? '✅ Correct!' : '❌ Incorrect.'}
        ${isCorrect ? ' Great job!' : ` The correct answer is option ${correctAnswer + 1}.`}
      </p>
    `;
    feedbackDiv.style.display = 'block';
  }

  updateChecklistProgress(lessonId, itemIndex, completed) {
    // Save checklist progress to localStorage
    const progressKey = `checklist-${lessonId}`;
    const savedProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');
    savedProgress[itemIndex] = completed;
    localStorage.setItem(progressKey, JSON.stringify(savedProgress));
  }

  markLessonComplete(lessonId) {
    // Mark lesson as completed
    const completedLessons = JSON.parse(localStorage.getItem('completed-lessons') || '[]');
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
      localStorage.setItem('completed-lessons', JSON.stringify(completedLessons));
    }

    // Show success message and return to roadmap
    alert('🎉 Lesson completed! Great job on your learning journey.');
    this.showRoadmap();
  }

  renderChallengeView() {
    const container = document.getElementById('challenge-container') || this.createChallengeContainer();
    
    if (!this.selectedChallenge) {
      console.error('No challenge selected');
      return;
    }

    container.innerHTML = this.generateChallengeHTML(this.selectedChallenge);
    container.classList.remove('hidden');
    
    this.setupChallengeEventListeners();
  }

  createChallengeContainer() {
    const container = document.createElement('div');
    container.id = 'challenge-container';
    container.className = 'challenge-container';
    document.body.appendChild(container);
    return container;
  }

  generateChallengeHTML(challenge) {
    return `
      <div class="challenge-player">
        <div class="challenge-header">
          <button class="back-to-roadmap-btn">← Back to Roadmap</button>
          <h2>${challenge.title}</h2>
        </div>
        
        <div class="challenge-layout">
          <div class="challenge-instructions">
            <h3>📋 Instructions</h3>
            <p>${challenge.description}</p>
            
            ${challenge.requirements ? `
              <h4>Requirements:</h4>
              <ul>
                ${challenge.requirements.map(req => `<li>${req}</li>`).join('')}
              </ul>
            ` : ''}
            
            <div class="challenge-actions">
              <button class="toggle-hints-btn">💡 Toggle Hints</button>
              <button class="show-solution-btn">🔍 Show Solution</button>
            </div>
            
            <div class="hints-section" style="display: none;">
              <h4>💡 Hints:</h4>
              ${challenge.hints ? `
                <ul>
                  ${challenge.hints.map(hint => `<li>${hint}</li>`).join('')}
                </ul>
              ` : '<p>No hints available for this challenge.</p>'}
            </div>
          </div>
          
          <div class="challenge-workspace">
            <div class="code-editor">
              <div class="editor-header">
                <h4>🖥️ Your Code</h4>
                <button class="run-code-btn">▶️ Run Code</button>
              </div>
              <textarea 
                class="code-textarea" 
                placeholder="${challenge.starterCode || '// Write your code here...'}">${challenge.starterCode || '// Write your code here...'}</textarea>
            </div>
            
            <div class="test-results">
              <h4>🧪 Test Results</h4>
              <div class="results-content">
                <p>Click "Run Code" to see test results...</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="solution-section" style="display: none;">
          <h3>✅ Solution</h3>
          <pre><code>${this.escapeHtml(challenge.solution || 'Solution not available yet.')}</code></pre>
        </div>
        
        <div class="challenge-completion">
          <button class="complete-challenge-btn primary-btn" data-challenge-id="${challenge.id}">
            🏆 Complete Challenge
          </button>
        </div>
      </div>
    `;
  }

  setupChallengeEventListeners() {
    // Back to roadmap
    document.querySelector('.back-to-roadmap-btn')?.addEventListener('click', () => {
      this.showRoadmap();
    });

    // Toggle hints
    document.querySelector('.toggle-hints-btn')?.addEventListener('click', () => {
      const hintsSection = document.querySelector('.hints-section');
      const isHidden = hintsSection.style.display === 'none';
      hintsSection.style.display = isHidden ? 'block' : 'none';
    });

    // Show solution
    document.querySelector('.show-solution-btn')?.addEventListener('click', () => {
      const solutionSection = document.querySelector('.solution-section');
      const isHidden = solutionSection.style.display === 'none';
      solutionSection.style.display = isHidden ? 'block' : 'none';
    });

    // Run code
    document.querySelector('.run-code-btn')?.addEventListener('click', () => {
      this.runChallengeCode();
    });

    // Complete challenge
    document.querySelector('.complete-challenge-btn')?.addEventListener('click', (e) => {
      const challengeId = e.target.dataset.challengeId;
      this.markChallengeComplete(challengeId);
    });
  }

  runChallengeCode() {
    const codeTextarea = document.querySelector('.code-textarea');
    const resultsContent = document.querySelector('.results-content');
    const userCode = codeTextarea.value;

    // Simulate running tests (in a real app, this would send to a backend)
    const mockTestResults = [
      { test: 'Component renders without crashing', passed: true, message: '✅ Test passed' },
      { test: 'Props are displayed correctly', passed: Math.random() > 0.3, message: Math.random() > 0.3 ? '✅ Test passed' : '❌ Expected "John Doe", got "undefined"' },
      { test: 'Event handlers work correctly', passed: Math.random() > 0.5, message: Math.random() > 0.5 ? '✅ Test passed' : '❌ onClick handler not triggered' }
    ];

    const passedTests = mockTestResults.filter(test => test.passed).length;
    const totalTests = mockTestResults.length;

    resultsContent.innerHTML = `
      <div class="test-summary">
        <h5>Test Results: ${passedTests}/${totalTests} passed</h5>
      </div>
      <div class="test-details">
        ${mockTestResults.map(test => `
          <div class="test-result ${test.passed ? 'passed' : 'failed'}">
            <strong>${test.test}</strong>
            <p>${test.message}</p>
          </div>
        `).join('')}
      </div>
      ${passedTests === totalTests ? '<div class="all-tests-passed">🎉 All tests passed! Great job!</div>' : ''}
    `;
  }

  markChallengeComplete(challengeId) {
    // Mark challenge as completed
    const completedChallenges = JSON.parse(localStorage.getItem('completed-challenges') || '[]');
    if (!completedChallenges.includes(challengeId)) {
      completedChallenges.push(challengeId);
      localStorage.setItem('completed-challenges', JSON.stringify(completedChallenges));
    }

    // Show success message and return to roadmap
    alert('🏆 Challenge completed! You\'re making excellent progress.');
    this.showRoadmap();
  }

  hideAllViews() {
    // Hide all view containers
    const containers = ['dashboard', 'study-view', 'roadmap-container', 'lesson-container', 'challenge-container'];
    containers.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.add('hidden');
      }
    });
  }

  // Keep all existing methods for flashcard functionality
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

  loadProgress() {
    const saved = localStorage.getItem('flashcard-progress');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Initialize progress for all categories
    const progress = {};
    Object.keys(this.data).forEach(key => {
      progress[key] = {
        currentIndex: 0,
        known: new Set(),
        review: new Set(),
        studied: new Set()
      };
    });
    return progress;
  }

  saveProgress() {
    // Convert Sets to Arrays for JSON storage
    const progressToSave = {};
    Object.keys(this.progress).forEach(key => {
      progressToSave[key] = {
        currentIndex: this.progress[key].currentIndex,
        known: Array.from(this.progress[key].known),
        review: Array.from(this.progress[key].review),
        studied: Array.from(this.progress[key].studied)
      };
    });
    localStorage.setItem('flashcard-progress', JSON.stringify(progressToSave));
  }

  loadInterviewDate() {
    const saved = localStorage.getItem('interview-date');
    if (saved) {
      return new Date(saved);
    }
    // Default to 24 hours from now
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    return tomorrow;
  }

  startCountdown() {
    const updateCountdown = () => {
      const now = new Date();
      const diff = this.interviewDate - now;
      
      const countdownElement = document.getElementById('countdownTime');
      if (!countdownElement) return;
      
      if (diff <= 0) {
        countdownElement.textContent = '00:00:00';
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      countdownElement.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  renderDashboard() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Object.entries(this.data).forEach(([key, category]) => {
      const progress = this.progress[key];
      const totalCards = category.cards.length;
      const studiedCards = progress.studied.size;
      const completionPercentage = Math.round((studiedCards / totalCards) * 100);
      
      const card = document.createElement('div');
      card.className = 'category-card';
      card.style.setProperty('--category-color', category.color);
      card.innerHTML = `
        <div class="category-header">
          <div class="category-icon">${category.icon}</div>
          <div>
            <h3 class="category-title">${category.title}</h3>
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

  updateDashboardStats() {
    let totalStudied = 0;
    let totalCards = 0;
    let challengesSolved = 0;
    let daysComplete = 0;
    
    Object.entries(this.data).forEach(([key, category]) => {
      totalCards += category.cards.length;
      totalStudied += this.progress[key].studied.size;
    });
    
    const overallPercentage = totalCards > 0 ? Math.round((totalStudied / totalCards) * 100) : 0;
    
    const overallProgress = document.getElementById('overallProgress');
    const overallProgressText = document.getElementById('overallProgressText');
    const flashcardProgress = document.getElementById('flashcardProgress');
    const challengeProgress = document.getElementById('challengeProgress');
    const roadmapProgress = document.getElementById('roadmapProgress');
    
    if (overallProgress) overallProgress.style.width = `${overallPercentage}%`;
    if (overallProgressText) overallProgressText.textContent = `${overallPercentage}% Complete`;
    if (flashcardProgress) flashcardProgress.textContent = totalStudied;
    if (challengeProgress) challengeProgress.textContent = challengesSolved;
    if (roadmapProgress) roadmapProgress.textContent = daysComplete;
  }

  startStudying(categoryKey) {
    this.currentCategory = categoryKey;
    this.currentCardIndex = this.progress[categoryKey].currentIndex;
    this.showStudyView();
    this.renderCurrentCard();
    this.updateStudyInterface();
  }

  showStudyView() {
    this.hideAllViews();
    document.getElementById('study-view')?.classList.remove('hidden');
  }

  showDashboard() {
    this.hideAllViews();
    document.getElementById('dashboard')?.classList.remove('hidden');
    this.renderDashboard();
    this.updateDashboardStats();
  }

  // Add all other existing methods for flashcard functionality...
  // (keeping them for backward compatibility)

  renderCurrentCard() {
    if (!this.currentCategory) return;
    
    const category = this.data[this.currentCategory];
    const card = category.cards[this.currentCardIndex];
    
    if (!card) return;
    
    const frontContent = document.getElementById('card-front-content');
    const backContent = document.getElementById('card-back-content');
    
    if (frontContent) frontContent.innerHTML = this.formatCardContent(card.front);
    if (backContent) backContent.innerHTML = this.formatCardContent(card.back);
    
    // Reset flip state
    this.isFlipped = false;
    const flashcard = document.getElementById('flashcard');
    if (flashcard) flashcard.classList.remove('flipped');
    
    // Mark as studied
    this.progress[this.currentCategory].studied.add(card.id);
  }

  formatCardContent(content) {
    // Convert markdown-style formatting to HTML
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/```\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>')
      .replace(/\n/g, '<br>');
    
    return formatted;
  }

  updateStudyInterface() {
    if (!this.currentCategory) return;
    
    const category = this.data[this.currentCategory];
    const totalCards = category.cards.length;
    const currentIndex = this.currentCardIndex + 1;
    
    const categoryTitle = document.getElementById('categoryTitle');
    const cardProgress = document.getElementById('cardProgress');
    const studyProgress = document.getElementById('studyProgress');
    const prevCard = document.getElementById('prevCard');
    const nextCard = document.getElementById('nextCard');
    
    if (categoryTitle) categoryTitle.textContent = category.title;
    if (cardProgress) cardProgress.textContent = `${currentIndex} / ${totalCards}`;
    
    const progressPercentage = (currentIndex / totalCards) * 100;
    if (studyProgress) studyProgress.style.width = `${progressPercentage}%`;
    
    // Update navigation buttons
    if (prevCard) prevCard.disabled = this.currentCardIndex === 0;
    if (nextCard) nextCard.disabled = this.currentCardIndex === totalCards - 1;
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
      flashcard.classList.toggle('flipped', this.isFlipped);
    }
  }

  previousCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.progress[this.currentCategory].currentIndex = this.currentCardIndex;
      this.renderCurrentCard();
      this.updateStudyInterface();
      this.saveProgress();
    }
  }

  nextCard() {
    const category = this.data[this.currentCategory];
    if (this.currentCardIndex < category.cards.length - 1) {
      this.currentCardIndex++;
      this.progress[this.currentCategory].currentIndex = this.currentCardIndex;
      this.renderCurrentCard();
      this.updateStudyInterface();
      this.saveProgress();
    } else {
      this.showCompletionModal();
    }
  }

  markCard(type) {
    if (!this.currentCategory) return;
    
    const category = this.data[this.currentCategory];
    const card = category.cards[this.currentCardIndex];
    const progress = this.progress[this.currentCategory];
    
    if (type === 'known') {
      progress.known.add(card.id);
      progress.review.delete(card.id);
    } else if (type === 'review') {
      progress.review.add(card.id);
      progress.known.delete(card.id);
    }
    
    this.saveProgress();
    this.nextCard();
  }

  showCompletionModal() {
    const progress = this.progress[this.currentCategory];
    const knownCount = progress.known.size;
    const reviewCount = progress.review.size;
    
    const knownCountEl = document.getElementById('knownCount');
    const reviewCountEl = document.getElementById('reviewCount');
    const completionModal = document.getElementById('completionModal');
    
    if (knownCountEl) knownCountEl.textContent = knownCount;
    if (reviewCountEl) reviewCountEl.textContent = reviewCount;
    if (completionModal) completionModal.classList.remove('hidden');
  }

  hideModal() {
    const completionModal = document.getElementById('completionModal');
    if (completionModal) completionModal.classList.add('hidden');
  }

  studyReviewCards() {
    // Filter to only review cards
    const category = this.data[this.currentCategory];
    const reviewCards = category.cards.filter(card => 
      this.progress[this.currentCategory].review.has(card.id)
    );
    
    if (reviewCards.length === 0) {
      alert('No cards to review!');
      return;
    }
    
    // Create a temporary category with only review cards
    // For simplicity, just restart the category
    this.restartCategory();
  }

  restartCategory() {
    this.currentCardIndex = 0;
    this.progress[this.currentCategory].currentIndex = 0;
    this.hideModal();
    this.renderCurrentCard();
    this.updateStudyInterface();
    this.saveProgress();
  }

  handleKeyboard(e) {
    // Only handle keyboard shortcuts in appropriate views
    if (this.currentView === 'lesson' || this.currentView === 'challenge' || this.currentView === 'roadmap') {
      return; // Don't interfere with interactive learning views
    }
    
    if (document.getElementById('study-view')?.classList.contains('hidden')) {
      return;
    }
    
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
}

// Initialize the enhanced application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Convert Sets back to Sets for loaded progress
  const app = new InteractiveLearningApp();
  const progress = app.progress;
  
  Object.keys(progress).forEach(key => {
    if (Array.isArray(progress[key].known)) {
      progress[key].known = new Set(progress[key].known);
    }
    if (Array.isArray(progress[key].review)) {
      progress[key].review = new Set(progress[key].review);
    }
    if (Array.isArray(progress[key].studied)) {
      progress[key].studied = new Set(progress[key].studied);
    }
  });
  
  // Make globally accessible
  window.interactiveLearningApp = app;
  window.flashcardApp = app; // Backward compatibility
  
  console.log('🚀 Interactive Learning Platform initialized successfully!');
  console.log('Features: Flashcards, Interactive Roadmap, Lessons, Challenges, Progress Tracking');
});