# Continue building Top 50 questions (adding questions 21-50)
top_50_questions = top_20_questions + [
    {
        "rank": 21,
        "question": "What is useMemo and when should you use it?",
        "answer": "useMemo memoizes expensive calculations, recomputing only when dependencies change. Use for computationally intensive operations that don't need to run on every render. Example: const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]). Don't overuse - memoization has overhead.",
        "difficulty": "Intermediate",
        "category": "React Hooks"
    },
    {
        "rank": 22,
        "question": "What is useCallback and when should you use it?",
        "answer": "useCallback memoizes functions to prevent recreation on every render. Useful when passing callbacks to optimized child components that depend on reference equality. Example: const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]). Helps prevent unnecessary child re-renders.",
        "difficulty": "Intermediate",
        "category": "React Hooks"
    },
    {
        "rank": 23,
        "question": "What is useReducer and when would you use it over useState?",
        "answer": "useReducer manages complex state logic through actions and reducers, similar to Redux. Use when: state has multiple sub-values, next state depends on previous one, complex state transitions, or when you need more predictable state updates. Better than useState for complex state logic.",
        "difficulty": "Intermediate",
        "category": "React Hooks"
    },
    {
        "rank": 24,
        "question": "How do you create custom hooks?",
        "answer": "Custom hooks are JavaScript functions starting with 'use' that can call other hooks. They extract component logic into reusable functions. Example: function useCounter(initialValue) { const [count, setCount] = useState(initialValue); const increment = () => setCount(count + 1); return { count, increment }; }",
        "difficulty": "Intermediate",
        "category": "React Hooks"
    },
    {
        "rank": 25,
        "question": "What are Higher-Order Components (HOCs)?",
        "answer": "HOCs are functions that take a component and return a new component with additional props or behavior. Used for cross-cutting concerns like authentication, logging, or data fetching. Example: const withAuth = (WrappedComponent) => (props) => isAuthenticated ? <WrappedComponent {...props} /> : <Login />",
        "difficulty": "Advanced",
        "category": "Advanced Patterns"
    },
    {
        "rank": 26,
        "question": "What are render props?",
        "answer": "A technique for sharing code between components using a prop whose value is a function. The component calls this function instead of implementing its own render logic. Example: <DataProvider render={(data) => <DisplayComponent data={data} />} />. Provides flexibility in what gets rendered.",
        "difficulty": "Advanced",
        "category": "Advanced Patterns"
    },
    {
        "rank": 27,
        "question": "What are error boundaries?",
        "answer": "Error boundaries are React components that catch JavaScript errors in their child component tree, log errors, and display fallback UI. Implemented using componentDidCatch and static getDerivedStateFromError in class components. They don't catch errors in event handlers, async code, or during SSR.",
        "difficulty": "Advanced",
        "category": "Error Handling"
    },
    {
        "rank": 28,
        "question": "What is React.lazy and Suspense?",
        "answer": "React.lazy enables dynamic imports for code splitting. Suspense provides fallback UI while lazy components load. Example: const LazyComponent = React.lazy(() => import('./LazyComponent')); <Suspense fallback={<Loading />}><LazyComponent /></Suspense>. Improves initial load performance.",
        "difficulty": "Advanced",
        "category": "Performance"
    },
    {
        "rank": 29,
        "question": "What are React Portals?",
        "answer": "Portals render children into a DOM node outside the parent component's hierarchy. Useful for modals, tooltips, dropdowns that need to escape parent overflow/z-index constraints. Example: ReactDOM.createPortal(child, document.getElementById('modal-root'))",
        "difficulty": "Advanced",
        "category": "Advanced Concepts"
    },
    {
        "rank": 30,
        "question": "What is forwardRef and when do you use it?",
        "answer": "forwardRef allows passing refs through components to child elements. Useful for library components that need to expose DOM elements to parent components. Example: const MyInput = forwardRef((props, ref) => <input {...props} ref={ref} />)",
        "difficulty": "Advanced",
        "category": "Advanced Concepts"
    },
    {
        "rank": 31,
        "question": "Explain React's reconciliation process",
        "answer": "Reconciliation is React's algorithm to determine what changes need to be made to the DOM. It compares (diffs) the new virtual DOM tree with the previous one, identifies minimal changes needed, and efficiently updates the real DOM. Uses heuristics like component type and keys for optimization.",
        "difficulty": "Advanced",
        "category": "React Internals"
    },
    {
        "rank": 32,
        "question": "What is React Fiber?",
        "answer": "React Fiber is a complete rewrite of React's core algorithm for better performance and new features. It enables incremental rendering, pause/abort/resume work, priority-based updates, and time-slicing. Allows React to break rendering work into chunks and spread it over multiple frames.",
        "difficulty": "Advanced",
        "category": "React Internals"
    },
    {
        "rank": 33,
        "question": "What are synthetic events in React?",
        "answer": "SyntheticEvents are React's wrapper around native DOM events, providing consistent API across different browsers. They have the same interface as native events but work identically across all browsers. Events are pooled for performance - use event.persist() if accessing asynchronously.",
        "difficulty": "Intermediate",
        "category": "Events"
    },
    {
        "rank": 34,
        "question": "How do you handle asynchronous data fetching in React?",
        "answer": "Use useEffect for side effects, manage loading/error states with useState, handle cleanup to prevent memory leaks. Consider custom hooks for reusable logic, libraries like SWR/React Query for caching, and proper error boundaries. Example pattern: loading -> success/error states.",
        "difficulty": "Intermediate",
        "category": "Data Fetching"
    },
    {
        "rank": 35,
        "question": "What is React.memo and when should you use it?",
        "answer": "React.memo is a higher-order component that memoizes functional components, preventing re-renders when props haven't changed (shallow comparison). Use when component renders often with same props or parent re-renders frequently. Can provide custom comparison function as second argument.",
        "difficulty": "Intermediate",
        "category": "Performance"
    },
    {
        "rank": 36,
        "question": "How do you test React components?",
        "answer": "Use React Testing Library for user-centric testing, Jest for test runner, render components and interact with them as users would. Test behavior, not implementation. Mock external dependencies, use screen queries (getByRole, getByText), simulate user interactions with userEvent.",
        "difficulty": "Intermediate",
        "category": "Testing"
    },
    {
        "rank": 37,
        "question": "What is the difference between controlled and uncontrolled components?",
        "answer": "Controlled: React controls the input value via state, value prop, and onChange handler. Single source of truth, predictable, easier to validate. Uncontrolled: DOM controls the value, accessed via refs, form data handled at submission. Less code but harder to validate dynamically.",
        "difficulty": "Beginner",
        "category": "Forms"
    },
    {
        "rank": 38,
        "question": "How do you optimize performance in large React applications?",
        "answer": "Use code splitting (React.lazy), memoization (React.memo, useMemo, useCallback), virtualization for large lists, optimize bundle size, implement proper state management, avoid unnecessary re-renders, use production builds, monitor with React DevTools Profiler, consider SSR/SSG.",
        "difficulty": "Advanced",
        "category": "Performance"
    },
    {
        "rank": 39,
        "question": "What is the component lifecycle in class components?",
        "answer": "Mounting: constructor, componentDidMount. Updating: shouldComponentUpdate, componentDidUpdate. Unmounting: componentWillUnmount. Error: componentDidCatch. Each phase allows different operations - setup, cleanup, optimization, error handling. Hooks replace these in functional components.",
        "difficulty": "Intermediate",
        "category": "Lifecycle"
    },
    {
        "rank": 40,
        "question": "How do you handle state management in large applications?",
        "answer": "For local state use useState/useReducer. For global state consider Context API, Redux (predictable state updates), Zustand (lightweight), or Jotai (atomic state). Choose based on complexity: Context for simple global state, Redux for complex state logic, newer libraries for modern alternatives.",
        "difficulty": "Advanced",
        "category": "State Management"
    },
    {
        "rank": 41,
        "question": "What is Server-Side Rendering (SSR) in React?",
        "answer": "SSR renders React components on the server and sends HTML to the browser. Benefits: better SEO, faster initial page load, improved performance on slow devices. Implemented with frameworks like Next.js. Challenges: complexity, server resources, hydration mismatches.",
        "difficulty": "Advanced",
        "category": "SSR/SSG"
    },
    {
        "rank": 42,
        "question": "What is Static Site Generation (SSG)?",
        "answer": "SSG pre-renders pages at build time, generating static HTML files. Faster than SSR, better for SEO than CSR, great for content that doesn't change often. Can combine with incremental regeneration for dynamic content. Implemented with Next.js getStaticProps/getStaticPaths.",
        "difficulty": "Advanced",
        "category": "SSR/SSG"
    },
    {
        "rank": 43,
        "question": "How do you implement routing in React?",
        "answer": "Use React Router for client-side routing. BrowserRouter for history API, Routes/Route for path matching, Link/NavLink for navigation, useNavigate for programmatic navigation, useParams for route parameters. Handle nested routes, protected routes, and 404 pages.",
        "difficulty": "Intermediate",
        "category": "Routing"
    },
    {
        "rank": 44,
        "question": "What are React Design Patterns?",
        "answer": "Common patterns: Presentational/Container (separate logic from UI), Render Props (share code via function props), HOCs (enhance components), Custom Hooks (reusable stateful logic), Compound Components (components working together), Provider Pattern (context-based state).",
        "difficulty": "Advanced",
        "category": "Advanced Patterns"
    },
    {
        "rank": 45,
        "question": "How do you handle environment variables in React?",
        "answer": "Use REACT_APP_ prefix for custom environment variables in Create React App. Access via process.env.REACT_APP_VARIABLE_NAME. Store in .env files (.env, .env.local, .env.production). Never store secrets in React apps - they're visible to users.",
        "difficulty": "Intermediate",
        "category": "Build & Deploy"
    },
    {
        "rank": 46,
        "question": "What is the difference between React and other frameworks like Angular/Vue?",
        "answer": "React: Library focused on UI, flexible, large ecosystem, JSX, unidirectional data flow. Angular: Full framework, TypeScript-first, dependency injection, two-way binding. Vue: Progressive framework, template syntax, easier learning curve, composition API. Choose based on project needs and team expertise.",
        "difficulty": "Intermediate",
        "category": "Comparison"
    },
    {
        "rank": 47,
        "question": "How do you implement authentication in React?",
        "answer": "Store auth tokens securely (httpOnly cookies preferred), implement protected routes, use Context/Redux for auth state, handle token refresh, implement login/logout flows, validate on server, use libraries like Auth0 or implement JWT-based auth with proper security practices.",
        "difficulty": "Advanced",
        "category": "Security"
    },
    {
        "rank": 48,
        "question": "What are React development tools and debugging techniques?",
        "answer": "React DevTools browser extension for component inspection, Profiler for performance analysis, console.log and debugger statements, React strict mode for development checks, Error boundaries for error handling, source maps for debugging bundled code.",
        "difficulty": "Intermediate",
        "category": "Development Tools"
    },
    {
        "rank": 49,
        "question": "How do you handle CSS in React applications?",
        "answer": "Options include: CSS Modules (scoped styles), Styled Components (CSS-in-JS), CSS frameworks (Tailwind), Sass/Less preprocessors, inline styles (limited use), CSS custom properties. Choose based on team preferences, scalability needs, and design system requirements.",
        "difficulty": "Intermediate",
        "category": "Styling"
    },
    {
        "rank": 50,
        "question": "What are the best practices for React development?",
        "answer": "Use functional components with hooks, follow naming conventions, keep components small and focused, use TypeScript for type safety, implement proper error handling, optimize performance, write tests, use linting/formatting tools, avoid prop drilling, maintain consistent code structure.",
        "difficulty": "Intermediate",
        "category": "Best Practices"
    }
]

print("Created Top 50 React Interview Questions")
print(f"Top 50 questions: {len(top_50_questions)}")