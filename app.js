// Application Data
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
      },
      {
        "id": "hooks_003",
        "front": "When should you use useReducer over useState?",
        "back": "Use useReducer when:\n- **Complex state logic** with multiple sub-values\n- **Next state depends on previous** state\n- **Multiple actions** can update the state\n- **State updates are predictable** and you want centralized logic\n- **Testing** - reducers are pure functions, easier to test\n\nExample: Form with validation, shopping cart, game state"
      },
      {
        "id": "hooks_004",
        "front": "How do you handle cleanup in useEffect?",
        "back": "Return a cleanup function from useEffect:\n```jsx\nuseEffect(() => {\n  const subscription = subscribeTo(something);\n  const timer = setTimeout(() => {}, 1000);\n  \n  // Cleanup function\n  return () => {\n    subscription.unsubscribe();\n    clearTimeout(timer);\n  };\n}, []);\n```\nCleanup runs before component unmounts and before effect runs again."
      },
      {
        "id": "hooks_005",
        "front": "How do you create a custom hook?",
        "back": "Custom hooks are functions that:\n1. **Start with 'use'** - naming convention\n2. **Can call other hooks** - useState, useEffect, etc.\n3. **Return values/functions** for components to use\n\n```jsx\nfunction useCounter(initialValue = 0) {\n  const [count, setCount] = useState(initialValue);\n  \n  const increment = useCallback(() => setCount(c => c + 1), []);\n  const decrement = useCallback(() => setCount(c => c - 1), []);\n  const reset = useCallback(() => setCount(initialValue), [initialValue]);\n  \n  return { count, increment, decrement, reset };\n}\n```"
      }
    ]
  },
  "nextjs": {
    "title": "Next.js",
    "description": "SSR, SSG, API routes, and full-stack development",
    "color": "#000000",
    "icon": "▲",
    "cards": [
      {
        "id": "nextjs_001",
        "front": "What's the difference between SSR, SSG, and ISR in Next.js?",
        "back": "**SSR (Server-Side Rendering)**: HTML generated on each request using getServerSideProps\n**SSG (Static Site Generation)**: HTML generated at build time using getStaticProps\n**ISR (Incremental Static Regeneration)**: SSG + periodic regeneration using revalidate option\n\nSSG is fastest, SSR is most dynamic, ISR balances both."
      },
      {
        "id": "nextjs_002",
        "front": "When should you use getStaticProps vs getServerSideProps?",
        "back": "**Use getStaticProps when**:\n- Data available at build time\n- Data doesn't change often\n- Page can be cached by CDN\n- SEO important and fast loading needed\n\n**Use getServerSideProps when**:\n- Data changes frequently\n- Need request-time data (user, cookies)\n- Cannot pre-render the page\n- Personalized content required"
      },
      {
        "id": "nextjs_003",
        "front": "How do API routes work in Next.js?",
        "back": "API routes create serverless functions in the `pages/api` or `app/api` directory:\n\n```jsx\n// pages/api/users.js\nexport default function handler(req, res) {\n  if (req.method === 'POST') {\n    // Handle POST\n    res.status(200).json({ name: 'John' });\n  } else {\n    res.status(405).json({ message: 'Method not allowed' });\n  }\n}\n```\n\nEach file becomes an endpoint. Support all HTTP methods, middleware, and serverless deployment."
      },
      {
        "id": "nextjs_004",
        "front": "What is Next.js middleware and when do you use it?",
        "back": "Middleware runs before a request is completed, allowing you to:\n- **Authentication** - Check tokens, redirect unauthorized users\n- **Logging** - Track requests and responses\n- **Feature flags** - A/B testing, gradual rollouts\n- **Redirects/Rewrites** - URL modifications\n- **Headers** - Add security headers\n\n```jsx\n// middleware.js\nimport { NextResponse } from 'next/server';\n\nexport function middleware(request) {\n  const token = req.cookies.get('token');\n  if (!token) {\n    return NextResponse.redirect('/login');\n  }\n}\n\nexport const config = {\n  matcher: '/dashboard/:path*'\n};\n```"
      },
      {
        "id": "nextjs_005",
        "front": "How does Next.js handle code splitting and optimization?",
        "back": "Next.js automatically:\n- **Route-based code splitting** - Each page is a separate bundle\n- **Dynamic imports** - Lazy load components with next/dynamic\n- **Image optimization** - next/image with WebP, lazy loading\n- **Bundle analyzer** - Visualize bundle sizes\n- **Tree shaking** - Remove unused code\n- **Minification** - Compress JavaScript and CSS\n\n```jsx\nconst DynamicComponent = dynamic(() => import('./Heavy'), {\n  loading: () => <p>Loading...</p>,\n});\n```"
      }
    ]
  },
  "javascript": {
    "title": "JavaScript Core",
    "description": "ES6+, async programming, and language fundamentals",
    "color": "#f7df1e",
    "icon": "🟨",
    "cards": [
      {
        "id": "js_001",
        "front": "Explain closures in JavaScript with an example",
        "back": "A closure is when a function has access to variables from its outer (enclosing) scope even after the outer function has finished executing.\n\n```jsx\nfunction outerFunction(x) {\n  // This is the outer scope\n  return function innerFunction(y) {\n    // This inner function has access to x\n    console.log(x + y); // x is from outer scope\n  };\n}\n\nconst addFive = outerFunction(5);\naddFive(3); // Prints 8\n```\n\nThe inner function 'closes over' the variable x from its outer scope."
      },
      {
        "id": "js_002",
        "front": "What's the difference between var, let, and const?",
        "back": "**var**: Function-scoped, hoisted, can be redeclared, undefined when accessed before declaration\n**let**: Block-scoped, hoisted but not accessible (temporal dead zone), cannot be redeclared\n**const**: Block-scoped, hoisted but not accessible, cannot be redeclared or reassigned, must be initialized\n\n```jsx\nvar x = 1; // Function scoped\nlet y = 2; // Block scoped\nconst z = 3; // Block scoped, immutable binding\n```"
      },
      {
        "id": "js_003",
        "front": "How does the event loop work in JavaScript?",
        "back": "JavaScript is single-threaded but uses an event loop for asynchronous operations:\n\n1. **Call Stack** - Executes synchronous code\n2. **Web APIs** - Handle async operations (timers, HTTP, DOM events)\n3. **Callback Queue** - Queues completed async operations\n4. **Event Loop** - Moves callbacks from queue to stack when stack is empty\n\nOrder: Sync code → Microtasks (Promises) → Macrotasks (setTimeout, setInterval)"
      },
      {
        "id": "js_004",
        "front": "What's the difference between Promise.all() and Promise.allSettled()?",
        "back": "**Promise.all()**:\n- Waits for ALL promises to resolve\n- Fails fast - if any promise rejects, the whole thing rejects\n- Returns array of resolved values\n\n**Promise.allSettled()**:\n- Waits for ALL promises to settle (resolve or reject)\n- Never rejects - always waits for all\n- Returns array of objects with status and value/reason\n\n```jsx\nPromise.allSettled([p1, p2, p3]).then(results => {\n  results.forEach(result => console.log(result.status));\n});\n```"
      },
      {
        "id": "js_005",
        "front": "Explain hoisting in JavaScript",
        "back": "Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation.\n\n**Function declarations**: Fully hoisted (can call before declaration)\n**var**: Declaration hoisted, initialization not (undefined)\n**let/const**: Declaration hoisted but not accessible (temporal dead zone)\n\n```jsx\nconsole.log(x); // undefined (not error)\nvar x = 5;\n\nconsole.log(y); // ReferenceError\nlet y = 10;\n\nhello(); // Works!\nfunction hello() { console.log('Hello'); }\n```"
      }
    ]
  },
  "system_design": {
    "title": "System Design",
    "description": "Architecture, scalability, and best practices",
    "color": "#4caf50",
    "icon": "🏗️",
    "cards": [
      {
        "id": "design_001",
        "front": "How would you design a scalable React application architecture?",
        "back": "**Structure by features**, not file types:\n```\nsrc/\n  components/      # Reusable UI components\n  features/        # Feature-specific code\n    auth/\n      components/\n      hooks/\n      services/\n      types/\n  shared/          # Shared utilities\n    hooks/\n    utils/\n    types/\n  store/           # Global state management\n```\n\n**Patterns**: Container/Presentational, Custom hooks, Context for feature state, Props drilling alternatives"
      },
      {
        "id": "design_002",
        "front": "What are the trade-offs between different state management solutions?",
        "back": "**Local State (useState)**:\n✅ Simple, no boilerplate\n❌ Limited scope, prop drilling\n\n**Context API**:\n✅ Built-in, good for theme/auth\n❌ Re-renders all consumers\n\n**Redux**:\n✅ Predictable, devtools, middleware\n❌ Boilerplate, learning curve\n\n**Zustand**:\n✅ Simple API, no providers\n❌ Less ecosystem\n\n**Choose based on**: App complexity, team size, performance needs"
      },
      {
        "id": "design_003",
        "front": "How do you handle performance in large React applications?",
        "back": "**Rendering Optimization**:\n- React.memo for expensive components\n- useMemo for expensive calculations\n- useCallback for stable function references\n- Virtualization for large lists\n\n**Code Splitting**:\n- Route-based splitting\n- Component-based lazy loading\n- Dynamic imports\n\n**Bundle Optimization**:\n- Tree shaking\n- Code analysis tools\n- Compression (gzip/brotli)\n\n**Caching**:\n- HTTP caching\n- Service workers\n- React Query/SWR for server state"
      },
      {
        "id": "design_004",
        "front": "How would you implement real-time features in a web application?",
        "back": "**WebSockets**: Full-duplex communication, best for chat/gaming\n```jsx\nconst ws = new WebSocket('ws://localhost:8080');\nws.onmessage = (event) => setMessages(prev => [...prev, event.data]);\n```\n\n**Server-Sent Events**: One-way server→client, simpler than WebSockets\n```jsx\nconst eventSource = new EventSource('/api/events');\neventSource.onmessage = (event) => handleUpdate(event.data);\n```\n\n**Polling**: Regular HTTP requests, fallback option\n\n**Choose based on**: Bidirectional needs, browser support, infrastructure complexity"
      },
      {
        "id": "design_005",
        "front": "What are the key considerations for API design?",
        "back": "**RESTful Principles**:\n- Use HTTP methods correctly (GET, POST, PUT, DELETE)\n- Resource-based URLs (/users/123, not /getUser?id=123)\n- Stateless requests\n\n**Error Handling**:\n- Consistent error response format\n- Proper HTTP status codes\n- Detailed error messages for development\n\n**Performance**:\n- Pagination for large datasets\n- Caching headers\n- Rate limiting\n- Compression\n\n**Security**:\n- Authentication (JWT, OAuth)\n- Input validation\n- CORS configuration\n- HTTPS only"
      }
    ]
  },
  "interview_questions": {
    "title": "Common Interview Questions",
    "description": "Frequently asked technical interview questions",
    "color": "#9c27b0",
    "icon": "❓",
    "cards": [
      {
        "id": "interview_001",
        "front": "How do you optimize a React component that re-renders too often?",
        "back": "**1. Identify the cause**:\n- Use React DevTools Profiler\n- Check for unnecessary state updates\n- Look for prop reference changes\n\n**2. Solutions**:\n- React.memo for props comparison\n- useMemo for expensive calculations\n- useCallback for function props\n- Split components to isolate updates\n- Move state closer to where it's used\n\n**3. Example**:\n```jsx\nconst ExpensiveComponent = React.memo(({ items, onSelect }) => {\n  const sortedItems = useMemo(() => \n    items.sort((a, b) => a.name.localeCompare(b.name)), [items]\n  );\n  \n  return <ItemList items={sortedItems} onSelect={onSelect} />;\n});\n```"
      },
      {
        "id": "interview_002",
        "front": "How do you handle error boundaries in React?",
        "back": "Error boundaries catch JavaScript errors in component tree and display fallback UI:\n\n```jsx\nclass ErrorBoundary extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { hasError: false, error: null };\n  }\n\n  static getDerivedStateFromError(error) {\n    return { hasError: true, error };\n  }\n\n  componentDidCatch(error, errorInfo) {\n    console.error('Error caught:', error, errorInfo);\n    // Log to error reporting service\n  }\n\n  render() {\n    if (this.state.hasError) {\n      return <h1>Something went wrong: {this.state.error.message}</h1>;\n    }\n    return this.props.children;\n  }\n}\n```\n\n**Note**: Only class components can be error boundaries (for now)"
      },
      {
        "id": "interview_003",
        "front": "Explain the difference between controlled and uncontrolled components",
        "back": "**Controlled Components**:\n- Form data handled by React state\n- Single source of truth\n- Value controlled by React\n\n```jsx\nconst [value, setValue] = useState('');\n<input \n  value={value} \n  onChange={e => setValue(e.target.value)} \n/>\n```\n\n**Uncontrolled Components**:\n- Form data handled by DOM\n- Use refs to access values\n- DOM is source of truth\n\n```jsx\nconst inputRef = useRef();\n<input ref={inputRef} defaultValue=\"hello\" />\n// Access with inputRef.current.value\n```\n\n**Controlled is recommended** for validation, formatting, dynamic inputs"
      },
      {
        "id": "interview_004",
        "front": "How do you implement authentication in a Next.js application?",
        "back": "**1. JWT-based Authentication**:\n```jsx\n// pages/api/auth/login.js\nexport default async function handler(req, res) {\n  const { email, password } = req.body;\n  const user = await validateUser(email, password);\n  \n  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);\n  \n  res.setHeader('Set-Cookie', serialize('token', token, {\n    httpOnly: true,\n    secure: true,\n    sameSite: 'strict',\n    path: '/'\n  }));\n  \n  res.json({ success: true });\n}\n```\n\n**2. Middleware Protection**:\n```jsx\nexport function middleware(req) {\n  const token = req.cookies.get('token');\n  if (!token) {\n    return NextResponse.redirect('/login');\n  }\n}\n```\n\n**3. Client-side**: Context for auth state, protected routes"
      },
      {
        "id": "interview_005",
        "front": "How would you implement infinite scrolling in React?",
        "back": "**Using Intersection Observer**:\n\n```jsx\nconst useInfiniteScroll = (fetchMore, hasMore) => {\n  const [loading, setLoading] = useState(false);\n  const lastElementRef = useRef();\n\n  useEffect(() => {\n    const observer = new IntersectionObserver(([entry]) => {\n      if (entry.isIntersecting && hasMore && !loading) {\n        setLoading(true);\n        fetchMore().finally(() => setLoading(false));\n      }\n    });\n\n    if (lastElementRef.current) {\n      observer.observe(lastElementRef.current);\n    }\n\n    return () => observer.disconnect();\n  }, [fetchMore, hasMore, loading]);\n\n  return { lastElementRef, loading };\n};\n\n// Usage\nconst { lastElementRef, loading } = useInfiniteScroll(loadMore, hasNextPage);\n```\n\n**Key considerations**: Loading states, error handling, performance optimization"
      }
    ]
  }
};

// Flashcard Application Logic
class FlashcardApp {
  constructor() {
    this.data = FLASHCARD_DATA;
    this.currentCategory = null;
    this.currentCardIndex = 0;
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
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    
    // Dashboard navigation
    document.getElementById('backToDashboard').addEventListener('click', () => this.showDashboard());
    
    // Study mode cards
    document.querySelectorAll('.study-mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        this.handleStudyModeClick(mode);
      });
    });
    
    // Flashcard controls
    document.getElementById('flashcard').addEventListener('click', () => this.flipCard());
    document.getElementById('prevCard').addEventListener('click', () => this.previousCard());
    document.getElementById('nextCard').addEventListener('click', () => this.nextCard());
    document.getElementById('reviewAgain').addEventListener('click', () => this.markCard('review'));
    document.getElementById('knowIt').addEventListener('click', () => this.markCard('known'));
    
    // Modal controls
    document.getElementById('closeModal').addEventListener('click', () => this.hideModal());
    document.getElementById('studyReviewCards').addEventListener('click', () => this.studyReviewCards());
    document.getElementById('restartCategory').addEventListener('click', () => this.restartCategory());
    document.getElementById('backToDashboardFromModal').addEventListener('click', () => {
      this.hideModal();
      this.showDashboard();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  handleStudyModeClick(mode) {
    switch(mode) {
      case 'flashcards':
        // Show flashcard categories - this is already handled by the category cards
        break;
      case 'challenges':
        alert('Coding challenges coming soon! For now, use the flashcards to practice.');
        break;
      case 'roadmap':
        alert('Study roadmap coming soon! For now, use the flashcards to study systematically.');
        break;
    }
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
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
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
      
      if (diff <= 0) {
        document.getElementById('countdownTime').textContent = '00:00:00';
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      document.getElementById('countdownTime').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  renderDashboard() {
    const grid = document.getElementById('categoriesGrid');
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
    
    document.getElementById('overallProgress').style.width = `${overallPercentage}%`;
    document.getElementById('overallProgressText').textContent = `${overallPercentage}% Complete`;
    document.getElementById('flashcardProgress').textContent = totalStudied;
    document.getElementById('challengeProgress').textContent = challengesSolved;
    document.getElementById('roadmapProgress').textContent = daysComplete;
  }

  startStudying(categoryKey) {
    this.currentCategory = categoryKey;
    this.currentCardIndex = this.progress[categoryKey].currentIndex;
    this.showStudyView();
    this.renderCurrentCard();
    this.updateStudyInterface();
  }

  showStudyView() {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('study-view').classList.remove('hidden');
  }

  showDashboard() {
    document.getElementById('study-view').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    this.renderDashboard();
    this.updateDashboardStats();
  }

  renderCurrentCard() {
    if (!this.currentCategory) return;
    
    const category = this.data[this.currentCategory];
    const card = category.cards[this.currentCardIndex];
    
    if (!card) return;
    
    document.getElementById('card-front-content').innerHTML = this.formatCardContent(card.front);
    document.getElementById('card-back-content').innerHTML = this.formatCardContent(card.back);
    
    // Reset flip state
    this.isFlipped = false;
    document.getElementById('flashcard').classList.remove('flipped');
    
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
    
    document.getElementById('categoryTitle').textContent = category.title;
    document.getElementById('cardProgress').textContent = `${currentIndex} / ${totalCards}`;
    
    const progressPercentage = (currentIndex / totalCards) * 100;
    document.getElementById('studyProgress').style.width = `${progressPercentage}%`;
    
    // Update navigation buttons
    document.getElementById('prevCard').disabled = this.currentCardIndex === 0;
    document.getElementById('nextCard').disabled = this.currentCardIndex === totalCards - 1;
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    const flashcard = document.getElementById('flashcard');
    flashcard.classList.toggle('flipped', this.isFlipped);
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
    
    document.getElementById('knownCount').textContent = knownCount;
    document.getElementById('reviewCount').textContent = reviewCount;
    document.getElementById('completionModal').classList.remove('hidden');
  }

  hideModal() {
    document.getElementById('completionModal').classList.add('hidden');
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
    // Only handle keyboard shortcuts in study view
    if (document.getElementById('study-view').classList.contains('hidden')) {
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

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Convert Sets back to Sets for loaded progress
  const app = new FlashcardApp();
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
  
  window.flashcardApp = app;
});