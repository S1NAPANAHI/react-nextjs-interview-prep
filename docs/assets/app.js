// React Interview Prep Platform JavaScript

class ReactInterviewApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.completedQuestions = new Set();
        this.bookmarkedQuestions = new Set();
        this.practiceMode = false;
        this.practiceTimer = null;
        this.practiceStartTime = null;
        this.filteredQuestions = [];
        
        // Enhanced data structure with more diverse questions
        this.data = {
            "sampleQuestions": {
                "top10": [
                    {
                        "id": "q1",
                        "question": "What is React and why would you use it?",
                        "difficulty": "Beginner", 
                        "category": "React Fundamentals",
                        "answer": "React is a JavaScript library developed by Facebook for building user interfaces, particularly single-page applications. It uses a component-based architecture, Virtual DOM for efficient updates, and follows a declarative programming paradigm. Key benefits include reusable components, better performance through Virtual DOM, strong community support, and excellent developer tools.",
                        "keyPoints": [
                            "Virtual DOM for performance",
                            "Component-based architecture", 
                            "Strong ecosystem and community",
                            "Backed by Meta (Facebook)"
                        ],
                        "codeExample": "function Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\n// Usage\n<Welcome name=\"World\" />",
                        "followUpQuestions": [
                            "How does React differ from vanilla JavaScript?",
                            "What are the benefits of using React?",
                            "Can you provide a simple example?"
                        ]
                    },
                    {
                        "id": "q2", 
                        "question": "What is JSX and how does it work?",
                        "difficulty": "Beginner",
                        "category": "React Fundamentals", 
                        "answer": "JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. It makes React components more readable and easier to write. JSX gets transpiled by tools like Babel into React.createElement() calls.",
                        "keyPoints": [
                            "Syntax extension for JavaScript",
                            "HTML-like syntax in JS", 
                            "Transpiled to React.createElement",
                            "Supports JavaScript expressions"
                        ],
                        "codeExample": "// JSX\nconst element = <h1>Hello, world!</h1>;\n\n// Transpiled to:\nconst element = React.createElement('h1', null, 'Hello, world!');",
                        "followUpQuestions": [
                            "How does JSX differ from HTML?",
                            "What are JSX expressions?",
                            "Can you use if statements in JSX?"
                        ]
                    },
                    {
                        "id": "q3",
                        "question": "What is the Virtual DOM?",
                        "difficulty": "Intermediate",
                        "category": "React Fundamentals",
                        "answer": "The Virtual DOM is a JavaScript representation of the real DOM kept in memory. React uses it to optimize rendering by comparing the virtual representation with the previous version (diffing) and only updating the parts that changed (reconciliation).",
                        "keyPoints": [
                            "JavaScript representation of DOM",
                            "Enables efficient diffing algorithm",
                            "Minimizes expensive DOM operations",
                            "Improves performance significantly"
                        ],
                        "codeExample": "// React creates virtual DOM nodes\nconst element = {\n  type: 'h1',\n  props: {\n    className: 'greeting',\n    children: 'Hello, world!'\n  }\n};",
                        "followUpQuestions": [
                            "How does diffing work?",
                            "What is reconciliation?",
                            "Why is Virtual DOM faster?"
                        ]
                    },
                    {
                        "id": "q4",
                        "question": "What are React components and how do you create them?",
                        "difficulty": "Beginner",
                        "category": "React Fundamentals",
                        "answer": "React components are reusable pieces of UI that can be either functional or class-based. They accept props as input and return JSX describing what should appear on screen. Modern React favors functional components with hooks.",
                        "keyPoints": [
                            "Building blocks of React applications",
                            "Can be functional or class-based",
                            "Accept props and return JSX",
                            "Promote code reusability"
                        ],
                        "codeExample": "// Functional Component\nfunction Button({ text, onClick }) {\n  return (\n    <button onClick={onClick}>\n      {text}\n    </button>\n  );\n}\n\n// Class Component\nclass Button extends React.Component {\n  render() {\n    return (\n      <button onClick={this.props.onClick}>\n        {this.props.text}\n      </button>\n    );\n  }\n}",
                        "followUpQuestions": [
                            "What's the difference between functional and class components?",
                            "How do you pass data between components?",
                            "What are component lifecycle methods?"
                        ]
                    },
                    {
                        "id": "q5",
                        "question": "What is the difference between props and state?",
                        "difficulty": "Beginner",
                        "category": "React Fundamentals",
                        "answer": "Props (properties) are read-only data passed from parent to child components, while state is mutable data that belongs to a component and can be changed over time. Props flow down the component tree, while state is managed within the component.",
                        "keyPoints": [
                            "Props are read-only and passed from parent",
                            "State is mutable and owned by component",
                            "Props flow down, events flow up",
                            "State changes trigger re-renders"
                        ],
                        "codeExample": "function UserProfile({ name, age }) { // props\n  const [isVisible, setIsVisible] = useState(true); // state\n  \n  return (\n    <div>\n      {isVisible && (\n        <div>\n          <h2>{name}</h2>\n          <p>Age: {age}</p>\n          <button onClick={() => setIsVisible(false)}>\n            Hide\n          </button>\n        </div>\n      )}\n    </div>\n  );\n}",
                        "followUpQuestions": [
                            "Can you modify props inside a component?",
                            "How do you pass functions as props?",
                            "What happens when state changes?"
                        ]
                    }
                ],
                "hooks": [
                    {
                        "id": "h1",
                        "question": "What is useState hook and how does it work?",
                        "difficulty": "Beginner",
                        "category": "React Hooks",
                        "answer": "useState is a React Hook that lets you add state variables to functional components. It returns an array with two elements: the current state value and a function to update it. When state changes, the component re-renders.",
                        "keyPoints": [
                            "Adds state to functional components",
                            "Returns [value, setter] array", 
                            "Triggers re-renders on state change",
                            "Supports functional updates"
                        ],
                        "codeExample": "function Counter() {\n  const [count, setCount] = useState(0);\n\n  const increment = () => setCount(prevCount => prevCount + 1);\n  const decrement = () => setCount(count - 1);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={increment}>+</button>\n      <button onClick={decrement}>-</button>\n    </div>\n  );\n}",
                        "followUpQuestions": [
                            "What are the rules of hooks?",
                            "How do you update state based on previous state?",
                            "Can you have multiple useState calls?"
                        ]
                    },
                    {
                        "id": "h2",
                        "question": "What is useEffect hook and when do you use it?",
                        "difficulty": "Intermediate",
                        "category": "React Hooks",
                        "answer": "useEffect is a React Hook that lets you perform side effects in functional components. It combines componentDidMount, componentDidUpdate, and componentWillUnmount. Use it for data fetching, subscriptions, timers, or manually changing the DOM.",
                        "keyPoints": [
                            "Handles side effects in functional components",
                            "Runs after every render by default",
                            "Can be controlled with dependency array",
                            "Cleanup function prevents memory leaks"
                        ],
                        "codeExample": "function DataFetcher({ userId }) {\n  const [user, setUser] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    let cancelled = false;\n    \n    fetch(`/api/users/${userId}`)\n      .then(response => response.json())\n      .then(userData => {\n        if (!cancelled) {\n          setUser(userData);\n          setLoading(false);\n        }\n      });\n    \n    return () => { cancelled = true; };\n  }, [userId]);\n\n  if (loading) return <div>Loading...</div>;\n  return <div>{user.name}</div>;\n}",
                        "followUpQuestions": [
                            "What is the dependency array?",
                            "When does the cleanup function run?",
                            "How to prevent infinite loops?"
                        ]
                    },
                    {
                        "id": "h3",
                        "question": "What are custom hooks and how do you create them?",
                        "difficulty": "Intermediate",
                        "category": "React Hooks",
                        "answer": "Custom hooks are JavaScript functions that use other hooks and allow you to extract component logic into reusable functions. They must start with 'use' and can call other hooks. They help share stateful logic between components.",
                        "keyPoints": [
                            "Functions that use other hooks",
                            "Must start with 'use' prefix",
                            "Share stateful logic between components",
                            "Follow all rules of hooks"
                        ],
                        "codeExample": "// Custom hook for local storage\nfunction useLocalStorage(key, initialValue) {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      return initialValue;\n    }\n  });\n\n  const setValue = (value) => {\n    try {\n      setStoredValue(value);\n      window.localStorage.setItem(key, JSON.stringify(value));\n    } catch (error) {\n      console.error(error);\n    }\n  };\n\n  return [storedValue, setValue];\n}\n\n// Usage\nfunction Settings() {\n  const [theme, setTheme] = useLocalStorage('theme', 'light');\n  return (\n    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>\n      Current theme: {theme}\n    </button>\n  );\n}",
                        "followUpQuestions": [
                            "What are the rules for custom hooks?",
                            "How do you test custom hooks?",
                            "Can custom hooks have their own state?"
                        ]
                    }
                ],
                "advanced": [
                    {
                        "id": "a1",
                        "question": "What are Higher-Order Components (HOCs)?",
                        "difficulty": "Advanced",
                        "category": "Advanced Patterns",
                        "answer": "Higher-Order Components are functions that take a component and return a new component with enhanced functionality. They're used for code reuse, logic abstraction, and cross-cutting concerns like authentication, logging, or data fetching.",
                        "keyPoints": [
                            "Functions that take and return components",
                            "Used for code reuse and logic abstraction",
                            "Don't modify original component",
                            "Follow naming convention: withFeatureName"
                        ],
                        "codeExample": "function withAuth(Component) {\n  return function AuthenticatedComponent(props) {\n    const [isAuthenticated, setIsAuthenticated] = useState(false);\n    \n    useEffect(() => {\n      // Check authentication status\n      checkAuthStatus().then(setIsAuthenticated);\n    }, []);\n    \n    if (!isAuthenticated) {\n      return <div>Please log in</div>;\n    }\n    \n    return <Component {...props} />;\n  };\n}\n\n// Usage\nconst ProtectedDashboard = withAuth(Dashboard);",
                        "followUpQuestions": [
                            "What are the disadvantages of HOCs?",
                            "How do HOCs compare to hooks?",
                            "What is prop drilling in HOCs?"
                        ]
                    }
                ],
                "challenges": [
                    {
                        "id": "c1",
                        "title": "Counter Component with Hooks",
                        "difficulty": "Beginner",
                        "question": "Build a counter that increments/decrements and resets to zero",
                        "category": "React Hooks",
                        "answer": "Create a functional component using useState hook to manage counter state with three buttons for increment, decrement, and reset functionality.",
                        "keyPoints": [
                            "Use useState hook for state management",
                            "Three buttons: increment, decrement, reset",
                            "Display current count value", 
                            "Handle negative numbers properly"
                        ],
                        "codeExample": "function Counter() {\n  const [count, setCount] = useState(0);\n  \n  const increment = () => setCount(prev => prev + 1);\n  const decrement = () => setCount(prev => prev - 1);\n  const reset = () => setCount(0);\n  \n  return (\n    <div className=\"counter\">\n      <h2>Count: {count}</h2>\n      <div className=\"controls\">\n        <button onClick={increment}>+</button>\n        <button onClick={decrement}>-</button>\n        <button onClick={reset}>Reset</button>\n      </div>\n    </div>\n  );\n}",
                        "followUpQuestions": [
                            "How would you add validation for maximum/minimum values?",
                            "Can you make the counter persistent?",
                            "How to add keyboard shortcuts for controls?"
                        ]
                    },
                    {
                        "id": "c2",
                        "title": "Todo List with Local Storage",
                        "difficulty": "Intermediate",
                        "question": "Build a todo list that persists data in localStorage",
                        "category": "State Management",
                        "answer": "Create a todo list component that manages todos in state and syncs with localStorage for persistence. Include add, toggle, and delete functionality.",
                        "keyPoints": [
                            "Use useState for todos state",
                            "Implement useEffect for localStorage sync",
                            "Add, toggle, and delete functionality",
                            "Persist data across browser sessions"
                        ],
                        "codeExample": "function TodoList() {\n  const [todos, setTodos] = useState(() => {\n    const saved = localStorage.getItem('todos');\n    return saved ? JSON.parse(saved) : [];\n  });\n  const [input, setInput] = useState('');\n\n  useEffect(() => {\n    localStorage.setItem('todos', JSON.stringify(todos));\n  }, [todos]);\n\n  const addTodo = () => {\n    if (input.trim()) {\n      setTodos([...todos, {\n        id: Date.now(),\n        text: input,\n        completed: false\n      }]);\n      setInput('');\n    }\n  };\n\n  const toggleTodo = (id) => {\n    setTodos(todos.map(todo =>\n      todo.id === id ? { ...todo, completed: !todo.completed } : todo\n    ));\n  };\n\n  return (\n    <div>\n      <input \n        value={input}\n        onChange={(e) => setInput(e.target.value)}\n        onKeyPress={(e) => e.key === 'Enter' && addTodo()}\n      />\n      <button onClick={addTodo}>Add</button>\n      <ul>\n        {todos.map(todo => (\n          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>\n            {todo.completed ? '✅' : '⭕'} {todo.text}\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n}",
                        "followUpQuestions": [
                            "How would you add edit functionality?",
                            "Can you implement drag-and-drop reordering?",
                            "How to add categories or tags?"
                        ]
                    }
                ]
            }
        };

        this.sectionData = {
            'dashboard': { title: 'Dashboard', questions: [] },
            'top-10': { title: 'Top 10 Questions', questions: this.data.sampleQuestions.top10 },
            'top-20': { title: 'Top 20 Questions', questions: [...this.data.sampleQuestions.top10, ...this.data.sampleQuestions.hooks] },
            'getting-started': { title: 'Getting Started', questions: this.data.sampleQuestions.top10.slice(0, 3) },
            'components-jsx': { title: 'Components & JSX', questions: this.data.sampleQuestions.top10.filter(q => q.question.includes('JSX') || q.question.includes('component')) },
            'props-state': { title: 'Props vs State', questions: this.data.sampleQuestions.top10.filter(q => q.question.includes('props') || q.question.includes('state')) },
            'event-handling': { title: 'Event Handling', questions: [] },
            'virtual-dom': { title: 'Virtual DOM', questions: this.data.sampleQuestions.top10.filter(q => q.question.includes('Virtual DOM')) },
            'basic-hooks': { title: 'useState & useEffect', questions: this.data.sampleQuestions.hooks },
            'custom-hooks': { title: 'Custom Hooks', questions: this.data.sampleQuestions.hooks.filter(q => q.question.includes('custom')) },
            'advanced-hooks': { title: 'Advanced Hooks', questions: this.data.sampleQuestions.hooks },
            'context-reducer': { title: 'useContext & useReducer', questions: [] },
            'local-state': { title: 'Local State', questions: this.data.sampleQuestions.hooks.slice(0, 1) },
            'context-api': { title: 'Context API', questions: [] },
            'redux-patterns': { title: 'Redux Patterns', questions: [] },
            'zustand': { title: 'Zustand & Others', questions: [] },
            'react-memo': { title: 'React.memo', questions: [] },
            'memo-callback': { title: 'useMemo & useCallback', questions: [] },
            'code-splitting': { title: 'Code Splitting', questions: [] },
            'optimization': { title: 'Bundle Optimization', questions: [] },
            'error-boundaries': { title: 'Error Boundaries', questions: [] },
            'hoc': { title: 'Higher-Order Components', questions: this.data.sampleQuestions.advanced || [] },
            'render-props': { title: 'Render Props', questions: [] },
            'testing': { title: 'Testing Strategies', questions: [] },
            'top-50': { title: 'Top 50 Questions', questions: [...this.data.sampleQuestions.top10, ...this.data.sampleQuestions.hooks, ...this.data.sampleQuestions.challenges] },
            'top-100': { title: 'Top 100 Questions', questions: [...this.data.sampleQuestions.top10, ...this.data.sampleQuestions.hooks, ...this.data.sampleQuestions.challenges, ...(this.data.sampleQuestions.advanced || [])] },
            'challenges': { title: 'Coding Challenges', questions: this.data.sampleQuestions.challenges },
            'mock-interviews': { title: 'Mock Interviews', questions: [] }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressDisplay();
        this.showSection('dashboard');
        this.highlightCode();
    }

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.setActiveNavLink(link);
            });
        });

        // Difficulty filter
        document.getElementById('difficultyFilter').addEventListener('change', (e) => {
            this.filterQuestions(e.target.value);
        });

        // Practice mode buttons
        document.getElementById('startPractice').addEventListener('click', () => {
            this.startPracticeMode();
        });

        document.getElementById('startPracticeDashboard').addEventListener('click', () => {
            this.startPracticeMode();
        });

        document.getElementById('exitPractice').addEventListener('click', () => {
            this.exitPracticeMode();
        });

        // Random question
        document.getElementById('randomQuestion').addEventListener('click', () => {
            this.showRandomQuestion();
        });

        // Modal close
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });

        document.querySelector('.modal-overlay').addEventListener('click', () => {
            this.closeModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.exitPracticeMode();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
        } else {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('.theme-icon');
        
        const currentTheme = body.dataset.colorScheme || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.dataset.colorScheme = newTheme;
        themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.showCurrentSectionQuestions();
            return;
        }

        const allQuestions = Object.values(this.sectionData)
            .flatMap(section => section.questions)
            .filter(q => q && q.question);

        // Remove duplicates based on question ID
        const uniqueQuestions = allQuestions.filter((question, index, self) => 
            index === self.findIndex(q => q.id === question.id)
        );

        const filteredQuestions = uniqueQuestions.filter(question => 
            question.question.toLowerCase().includes(query.toLowerCase()) ||
            question.category.toLowerCase().includes(query.toLowerCase()) ||
            (question.answer && question.answer.toLowerCase().includes(query.toLowerCase())) ||
            (question.keyPoints && question.keyPoints.some(point => 
                point.toLowerCase().includes(query.toLowerCase())
            ))
        );

        this.displayQuestions(filteredQuestions, `Search Results for "${query}"`);
        this.updateBreadcrumb(`Search Results`);
    }

    showSection(sectionId) {
        this.currentSection = sectionId;
        
        // Hide all content sections
        document.querySelectorAll('#contentBody > div').forEach(div => {
            div.classList.add('hidden');
        });

        if (sectionId === 'dashboard') {
            document.getElementById('dashboard').classList.remove('hidden');
            this.updateBreadcrumb('Dashboard');
        } else {
            this.showCurrentSectionQuestions();
        }

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    }

    showCurrentSectionQuestions() {
        const sectionData = this.sectionData[this.currentSection];
        if (!sectionData) return;

        this.displayQuestions(sectionData.questions, sectionData.title);
        this.updateBreadcrumb(sectionData.title);
    }

    displayQuestions(questions, title) {
        const questionsContainer = document.getElementById('questionsContainer');
        const questionsList = document.getElementById('questionsList');
        const sectionTitle = document.getElementById('sectionTitle');
        const questionsCount = document.getElementById('questionsCount');

        questionsContainer.classList.remove('hidden');
        sectionTitle.textContent = title;
        questionsCount.textContent = `${questions.length} questions`;

        questionsList.innerHTML = '';

        if (questions.length === 0) {
            questionsList.innerHTML = `
                <div class="card">
                    <div class="card__body text-center">
                        <p class="text-muted">No questions available in this section yet.</p>
                        <p class="text-muted">Check back soon for more content!</p>
                    </div>
                </div>
            `;
            return;
        }

        questions.forEach((question, index) => {
            const questionCard = this.createQuestionCard(question, index + 1);
            questionsList.appendChild(questionCard);
        });
    }

    createQuestionCard(question, number) {
        const isCompleted = this.completedQuestions.has(question.id);
        const isBookmarked = this.bookmarkedQuestions.has(question.id);

        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="question-header" onclick="app.toggleQuestion('${question.id}')">
                <div class="question-title">
                    <div class="question-number">${number}</div>
                    <div class="question-text">${question.question}</div>
                </div>
                <div class="question-meta">
                    <span class="difficulty-badge ${question.difficulty.toLowerCase()}">${question.difficulty}</span>
                    <div class="question-actions" onclick="event.stopPropagation()">
                        <button class="action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                                onclick="app.toggleBookmark('${question.id}')" 
                                title="${isBookmarked ? 'Remove bookmark' : 'Bookmark question'}">
                            ${isBookmarked ? '★' : '☆'}
                        </button>
                        <button class="action-btn" 
                                onclick="app.openQuestionModal('${question.id}')" 
                                title="View in modal">
                            🔍
                        </button>
                        <button class="action-btn" 
                                onclick="app.markCompleted('${question.id}')" 
                                title="${isCompleted ? 'Mark incomplete' : 'Mark completed'}">
                            ${isCompleted ? '✅' : '⭕'}
                        </button>
                    </div>
                </div>
            </div>
            <div class="question-content" id="content-${question.id}">
                <div class="question-answer">
                    <p>${question.answer}</p>
                </div>
                ${question.keyPoints ? `
                <div class="key-points">
                    <h4>Key Points:</h4>
                    <ul>
                        ${question.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                ${question.codeExample ? `
                <div class="code-example">
                    <div class="code-header">
                        <div class="code-title">Code Example</div>
                        <button class="copy-btn" onclick="app.copyCode('${question.id}')">Copy</button>
                    </div>
                    <pre class="code-block"><code id="code-${question.id}">${question.codeExample}</code></pre>
                </div>
                ` : ''}
                ${question.followUpQuestions ? `
                <div class="key-points">
                    <h4>Follow-up Questions:</h4>
                    <ul>
                        ${question.followUpQuestions.map(q => `<li>${q}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `;

        return card;
    }

    toggleQuestion(questionId) {
        const content = document.getElementById(`content-${questionId}`);
        content.classList.toggle('expanded');
        
        if (content.classList.contains('expanded')) {
            this.highlightCode();
        }
    }

    toggleBookmark(questionId) {
        if (this.bookmarkedQuestions.has(questionId)) {
            this.bookmarkedQuestions.delete(questionId);
        } else {
            this.bookmarkedQuestions.add(questionId);
        }
        
        this.updateProgressDisplay();
        
        // Update bookmark button
        const bookmarkBtn = document.querySelector(`[onclick="app.toggleBookmark('${questionId}')"]`);
        if (bookmarkBtn) {
            const isBookmarked = this.bookmarkedQuestions.has(questionId);
            bookmarkBtn.textContent = isBookmarked ? '★' : '☆';
            bookmarkBtn.className = `action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`;
            bookmarkBtn.title = isBookmarked ? 'Remove bookmark' : 'Bookmark question';
        }
    }

    markCompleted(questionId) {
        if (this.completedQuestions.has(questionId)) {
            this.completedQuestions.delete(questionId);
        } else {
            this.completedQuestions.add(questionId);
        }
        
        this.updateProgressDisplay();
        
        // Update completed button
        const completedBtn = document.querySelector(`[onclick="app.markCompleted('${questionId}')"]`);
        if (completedBtn) {
            const isCompleted = this.completedQuestions.has(questionId);
            completedBtn.textContent = isCompleted ? '✅' : '⭕';
            completedBtn.title = isCompleted ? 'Mark incomplete' : 'Mark completed';
        }
    }

    updateProgressDisplay() {
        document.getElementById('completedCount').textContent = this.completedQuestions.size;
        document.getElementById('bookmarkedCount').textContent = this.bookmarkedQuestions.size;
    }

    copyCode(questionId) {
        const codeElement = document.getElementById(`code-${questionId}`);
        const code = codeElement.textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            const copyBtn = document.querySelector(`[onclick="app.copyCode('${questionId}')"]`);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = 'var(--color-success)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        });
    }

    openQuestionModal(questionId) {
        const allQuestions = Object.values(this.sectionData)
            .flatMap(section => section.questions)
            .filter(q => q && q.id);
            
        const question = allQuestions.find(q => q.id === questionId);
        if (!question) return;

        const modal = document.getElementById('questionModal');
        const modalTitle = document.getElementById('modalQuestionTitle');
        const modalBody = document.getElementById('modalQuestionBody');

        modalTitle.textContent = question.question;
        modalBody.innerHTML = `
            <div class="question-answer">
                <p>${question.answer}</p>
            </div>
            ${question.keyPoints ? `
            <div class="key-points">
                <h4>Key Points:</h4>
                <ul>
                    ${question.keyPoints.map(point => `<li>${point}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            ${question.codeExample ? `
            <div class="code-example">
                <div class="code-header">
                    <div class="code-title">Code Example</div>
                    <button class="copy-btn" onclick="app.copyCodeFromModal('${question.id}')">Copy</button>
                </div>
                <pre class="code-block"><code id="modal-code-${question.id}">${question.codeExample}</code></pre>
            </div>
            ` : ''}
            ${question.followUpQuestions ? `
            <div class="key-points">
                <h4>Follow-up Questions:</h4>
                <ul>
                    ${question.followUpQuestions.map(q => `<li>${q}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        `;

        modal.classList.remove('hidden');
        this.highlightCode();
    }

    copyCodeFromModal(questionId) {
        const codeElement = document.getElementById(`modal-code-${questionId}`);
        const code = codeElement.textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            const copyBtn = document.querySelector(`[onclick="app.copyCodeFromModal('${questionId}')"]`);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = 'var(--color-success)';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        });
    }

    closeModal() {
        document.getElementById('questionModal').classList.add('hidden');
    }

    filterQuestions(difficulty) {
        if (this.currentSection === 'dashboard') return;

        const sectionData = this.sectionData[this.currentSection];
        if (!sectionData) return;

        let questions = sectionData.questions;
        
        if (difficulty) {
            questions = questions.filter(q => q.difficulty === difficulty);
        }

        this.displayQuestions(questions, sectionData.title + (difficulty ? ` (${difficulty})` : ''));
    }

    showRandomQuestion() {
        const allQuestions = Object.values(this.sectionData)
            .flatMap(section => section.questions)
            .filter(q => q && q.question);

        // Remove duplicates
        const uniqueQuestions = allQuestions.filter((question, index, self) => 
            index === self.findIndex(q => q.id === question.id)
        );

        if (uniqueQuestions.length === 0) return;

        const randomQuestion = uniqueQuestions[Math.floor(Math.random() * uniqueQuestions.length)];
        this.openQuestionModal(randomQuestion.id);
    }

    startPracticeMode() {
        const allQuestions = Object.values(this.sectionData)
            .flatMap(section => section.questions)
            .filter(q => q && q.question);

        // Remove duplicates
        const uniqueQuestions = allQuestions.filter((question, index, self) => 
            index === self.findIndex(q => q.id === question.id)
        );

        if (uniqueQuestions.length === 0) {
            alert('No questions available for practice mode!');
            return;
        }

        this.practiceMode = true;
        this.practiceStartTime = Date.now();
        
        // Hide all content and show practice mode
        document.querySelectorAll('#contentBody > div').forEach(div => {
            div.classList.add('hidden');
        });
        
        document.getElementById('practiceMode').classList.remove('hidden');
        
        this.startPracticeTimer();
        this.showNextPracticeQuestion();
        this.updateBreadcrumb('Practice Mode');
    }

    startPracticeTimer() {
        let seconds = 0;
        this.practiceTimer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    showNextPracticeQuestion() {
        const allQuestions = Object.values(this.sectionData)
            .flatMap(section => section.questions)
            .filter(q => q && q.question);

        // Remove duplicates
        const uniqueQuestions = allQuestions.filter((question, index, self) => 
            index === self.findIndex(q => q.id === question.id)
        );

        const randomQuestion = uniqueQuestions[Math.floor(Math.random() * uniqueQuestions.length)];
        
        const practiceQuestion = document.getElementById('practiceQuestion');
        practiceQuestion.innerHTML = this.createQuestionCard(randomQuestion, 1).innerHTML;
        
        // Auto-expand the question in practice mode
        setTimeout(() => {
            const content = practiceQuestion.querySelector('.question-content');
            content.classList.add('expanded');
            this.highlightCode();
        }, 100);
    }

    exitPracticeMode() {
        if (this.practiceTimer) {
            clearInterval(this.practiceTimer);
            this.practiceTimer = null;
        }
        
        this.practiceMode = false;
        document.getElementById('practiceMode').classList.add('hidden');
        this.showSection(this.currentSection);
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    updateBreadcrumb(text) {
        document.getElementById('breadcrumb').textContent = text;
    }

    highlightCode() {
        // Highlight code blocks with hljs
        setTimeout(() => {
            document.querySelectorAll('pre code').forEach(block => {
                if (typeof hljs !== 'undefined') {
                    hljs.highlightElement(block);
                }
            });
        }, 100);
    }
}

// Global function to navigate to sections (used by dashboard buttons)
function navigateToSection(sectionId) {
    app.showSection(sectionId);
    
    // Update active nav link
    const navLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (navLink) {
        app.setActiveNavLink(navLink);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ReactInterviewApp();
});

// Handle window resize for responsive sidebar
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
        if (!sidebar.classList.contains('collapsed')) {
            mainContent.classList.remove('sidebar-collapsed');
        }
    }
});