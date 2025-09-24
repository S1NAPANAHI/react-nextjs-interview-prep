-- Migration 005: Sample Data Population
-- Populate tables with comprehensive interview preparation content

-- Insert categories
INSERT INTO public.categories (name, description, icon, color, sort_order) VALUES
('React Fundamentals', 'Core React concepts, components, and patterns', '⚛️', '#61DAFB', 1),
('React Hooks', 'useState, useEffect, custom hooks, and optimization', '🎣', '#61DAFB', 2),
('Next.js', 'SSR, SSG, API routes, and full-stack development', '▲', '#000000', 3),
('JavaScript Core', 'ES6+, async programming, and language fundamentals', '🟨', '#F7DF1E', 4),
('System Design', 'Architecture, scalability, and best practices', '🏗️', '#FF6B6B', 5),
('Interview Questions', 'Common technical interview questions and answers', '❓', '#4ECDC4', 6);

-- Insert comprehensive flashcards
WITH category_mapping AS (
  SELECT id, name FROM public.categories
)
INSERT INTO public.flashcards (category_id, front, back, difficulty, tags, code_example) 
SELECT 
  cm.id,
  'What is the Virtual DOM and how does it work?',
  'The Virtual DOM is a JavaScript representation of the actual DOM. React creates a virtual copy of the real DOM in memory. When state changes, React compares the new virtual DOM with the previous virtual DOM (diffing), identifies what changed, and updates only those parts in the real DOM (reconciliation). This makes updates faster than manipulating the real DOM directly.',
  'beginner',
  ARRAY['virtual-dom', 'performance', 'react-core'],
  'const virtualDOM = React.createElement("div", {className: "container"}, "Hello World");'
FROM category_mapping cm WHERE cm.name = 'React Fundamentals'

UNION ALL

SELECT 
  cm.id,
  'What''s the difference between props and state?',
  '**Props**: Data passed from parent to child component, read-only, immutable from child''s perspective. **State**: Internal data managed by component itself, mutable, triggers re-render when changed. Props flow down, state is local to component.',
  'beginner',
  ARRAY['props', 'state', 'data-flow'],
  'const Component = ({name}) => { const [count, setCount] = useState(0); return <div>{name}: {count}</div>; };'
FROM category_mapping cm WHERE cm.name = 'React Fundamentals'

UNION ALL

SELECT 
  cm.id,
  'Explain the component lifecycle in functional components',
  'Functional components use hooks to mimic lifecycle:\n- **Mount**: useEffect with empty dependency array []\n- **Update**: useEffect with dependencies [dep1, dep2]\n- **Unmount**: useEffect cleanup function (return statement)\n- **Every render**: useEffect with no dependency array',
  'intermediate',
  ARRAY['lifecycle', 'hooks', 'useeffect'],
  'useEffect(() => {\n  // Mount/Update\n  return () => {\n    // Cleanup/Unmount\n  };\n}, []); // Dependencies'
FROM category_mapping cm WHERE cm.name = 'React Fundamentals'

UNION ALL

SELECT 
  cm.id,
  'What is prop drilling and how can you avoid it?',
  'Prop drilling is passing props through multiple component levels even when intermediate components don''t need them. Solutions:\n1. **Context API** - Create context to share data across component tree\n2. **State management** - Redux, Zustand, Jotai\n3. **Component composition** - Render props, children props\n4. **Custom hooks** - Share stateful logic',
  'intermediate',
  ARRAY['prop-drilling', 'context', 'state-management'],
  'const ThemeContext = createContext();\nconst useTheme = () => useContext(ThemeContext);'
FROM category_mapping cm WHERE cm.name = 'React Fundamentals'

UNION ALL

SELECT 
  cm.id,
  'When should you use a key prop in React?',
  'Use keys when rendering lists to help React identify which items have changed, added, or removed. Keys should be:\n- **Unique** among siblings\n- **Stable** (don''t use array index if list can reorder)\n- **Predictable** (same key for same item across renders)\nHelps React optimize re-rendering and maintain component state correctly.',
  'beginner',
  ARRAY['keys', 'lists', 'performance', 'reconciliation'],
  'items.map(item => <li key={item.id}>{item.name}</li>)'
FROM category_mapping cm WHERE cm.name = 'React Fundamentals'

UNION ALL

-- React Hooks Cards
SELECT 
  cm.id,
  'What are the rules of hooks?',
  '1. **Only call hooks at the top level** - Never inside loops, conditions, or nested functions\n2. **Only call hooks from React functions** - React function components or custom hooks\n3. **Custom hooks must start with ''use''** - Naming convention for linting\nThese rules ensure hooks are called in the same order every time the component renders.',
  'intermediate',
  ARRAY['hooks', 'rules', 'best-practices'],
  '// ✅ Correct\nfunction MyComponent() {\n  const [state, setState] = useState(0);\n  useEffect(() => {});\n  return <div>{state}</div>;\n}'
FROM category_mapping cm WHERE cm.name = 'React Hooks'

UNION ALL

SELECT 
  cm.id,
  'What''s the difference between useCallback and useMemo?',
  '**useCallback**: Memoizes a function reference, prevents recreation on every render\n```jsx\nconst memoizedCallback = useCallback(() => { /* function */ }, [deps])\n```\n**useMemo**: Memoizes a computed value, prevents expensive calculations\n```jsx\nconst memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])\n```\nBoth help with performance optimization by preventing unnecessary work.',
  'advanced',
  ARRAY['usecallback', 'usememo', 'performance', 'memoization'],
  'const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);\nconst memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);'
FROM category_mapping cm WHERE cm.name = 'React Hooks'

UNION ALL

SELECT 
  cm.id,
  'When should you use useReducer over useState?',
  'Use useReducer when:\n- **Complex state logic** with multiple sub-values\n- **Next state depends on previous** state\n- **Multiple actions** can update the state\n- **State updates are predictable** and you want centralized logic\n- **Testing** - reducers are pure functions, easier to test\n\nExample: Form with validation, shopping cart, game state',
  'advanced',
  ARRAY['usereducer', 'usestate', 'state-management'],
  'const [state, dispatch] = useReducer(reducer, initialState);\ndispatch({type: "INCREMENT", payload: 1});'
FROM category_mapping cm WHERE cm.name = 'React Hooks'

UNION ALL

-- Next.js Cards
SELECT 
  cm.id,
  'What''s the difference between SSR, SSG, and ISR in Next.js?',
  '**SSR (Server-Side Rendering)**: HTML generated on each request using getServerSideProps\n**SSG (Static Site Generation)**: HTML generated at build time using getStaticProps\n**ISR (Incremental Static Regeneration)**: SSG + periodic regeneration using revalidate option\n\nSSG is fastest, SSR is most dynamic, ISR balances both.',
  'advanced',
  ARRAY['ssr', 'ssg', 'isr', 'rendering'],
  'export async function getStaticProps() {\n  return {\n    props: { data },\n    revalidate: 60 // ISR\n  };\n}'
FROM category_mapping cm WHERE cm.name = 'Next.js'

UNION ALL

SELECT 
  cm.id,
  'When should you use getStaticProps vs getServerSideProps?',
  '**Use getStaticProps when**:\n- Data available at build time\n- Data doesn''t change often\n- Page can be cached by CDN\n- SEO important and fast loading needed\n\n**Use getServerSideProps when**:\n- Data changes frequently\n- Need request-time data (user, cookies)\n- Cannot pre-render the page\n- Personalized content required',
  'intermediate',
  ARRAY['getstaticprops', 'getserversideprops', 'data-fetching'],
  'export async function getServerSideProps(context) {\n  const { req, res, params } = context;\n  return { props: { data } };\n}'
FROM category_mapping cm WHERE cm.name = 'Next.js'

UNION ALL

-- JavaScript Core Cards
SELECT 
  cm.id,
  'Explain closures in JavaScript with an example',
  'A closure is when a function has access to variables from its outer (enclosing) scope even after the outer function has finished executing.\n\n```jsx\nfunction outerFunction(x) {\n  // This is the outer scope\n  return function innerFunction(y) {\n    // This inner function has access to x\n    console.log(x + y); // x is from outer scope\n  };\n}\n\nconst addFive = outerFunction(5);\naddFive(3); // Prints 8\n```\n\nThe inner function ''closes over'' the variable x from its outer scope.',
  'intermediate',
  ARRAY['closures', 'scope', 'javascript'],
  'function createCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = createCounter();'
FROM category_mapping cm WHERE cm.name = 'JavaScript Core'

UNION ALL

SELECT 
  cm.id,
  'What''s the difference between var, let, and const?',
  '**var**: Function-scoped, hoisted, can be redeclared, undefined when accessed before declaration\n**let**: Block-scoped, hoisted but not accessible (temporal dead zone), cannot be redeclared\n**const**: Block-scoped, hoisted but not accessible, cannot be redeclared or reassigned, must be initialized\n\n```jsx\nvar x = 1; // Function scoped\nlet y = 2; // Block scoped\nconst z = 3; // Block scoped, immutable binding\n```',
  'beginner',
  ARRAY['var', 'let', 'const', 'scope'],
  'if (true) {\n  var x = 1; // Function scoped\n  let y = 2; // Block scoped\n  const z = 3; // Block scoped\n}'
FROM category_mapping cm WHERE cm.name = 'JavaScript Core';

-- Insert coding challenges
INSERT INTO public.challenges (title, description, difficulty, category, requirements, solution_approach, code_skeleton, solution_code, test_cases, expected_questions)
VALUES 
(
  'Counter Component with Hooks',
  'Build a counter that increments/decrements and resets to zero',
  'easy',
  'React Fundamentals',
  ARRAY['Use useState hook', 'Three buttons: increment, decrement, reset', 'Display current count', 'Handle negative numbers'],
  ARRAY['Initialize state with useState(0)', 'Create handler functions for each action', 'Use functional updates for state', 'Add conditional styling for negative numbers'],
  'import React, { useState } from ''react'';\n\nconst Counter = () => {\n  // TODO: Initialize count state\n\n  // TODO: Create increment handler\n\n  // TODO: Create decrement handler\n\n  // TODO: Create reset handler\n\n  return (\n    <div>\n      {/* TODO: Display count with conditional styling */}\n      {/* TODO: Add three buttons */}\n    </div>\n  );\n};\n\nexport default Counter;',
  'import React, { useState } from ''react'';\n\nconst Counter = () => {\n  const [count, setCount] = useState(0);\n\n  const increment = () => setCount(prev => prev + 1);\n  const decrement = () => setCount(prev => prev - 1);\n  const reset = () => setCount(0);\n\n  return (\n    <div style={{ textAlign: ''center'', padding: ''20px'' }}>\n      <h2 style={{ color: count < 0 ? ''red'' : ''black'' }}>\n        Count: {count}\n      </h2>\n      <button onClick={increment}>+</button>\n      <button onClick={decrement}>-</button>\n      <button onClick={reset}>Reset</button>\n    </div>\n  );\n};\n\nexport default Counter;',
  '[{"input": "Click increment 3 times", "expected": "Count: 3"}, {"input": "Click decrement from 0", "expected": "Count: -1, red color"}]',
  ARRAY['Why use functional updates in setState?', 'How would you add animation to the counter?', 'What if we need to persist the count across page reloads?']
),
(
  'Todo List Application',
  'Create a todo list with add, delete, and toggle functionality',
  'medium',
  'React Fundamentals',
  ARRAY['Add new todos with input field', 'Mark todos as complete/incomplete', 'Delete individual todos', 'Filter todos (all, active, completed)', 'Show todo count'],
  ARRAY['Use array of objects for todos state', 'Each todo has: id, text, completed', 'Use filter for different views', 'Generate unique IDs (Date.now() or uuid)'],
  'import React, { useState } from ''react'';\n\nconst TodoApp = () => {\n  const [todos, setTodos] = useState([]);\n  const [filter, setFilter] = useState(''all'');\n  const [inputValue, setInputValue] = useState('''');\n\n  const addTodo = () => {\n    // TODO: Implement\n  };\n\n  const toggleTodo = (id) => {\n    // TODO: Implement\n  };\n\n  const deleteTodo = (id) => {\n    // TODO: Implement\n  };\n\n  return (\n    <div>\n      {/* TODO: Input and Add button */}\n      {/* TODO: Filter buttons */}\n      {/* TODO: Todo list display */}\n    </div>\n  );\n};',
  'import React, { useState } from ''react'';\n\nconst TodoApp = () => {\n  const [todos, setTodos] = useState([]);\n  const [filter, setFilter] = useState(''all'');\n  const [inputValue, setInputValue] = useState('''');\n\n  const addTodo = () => {\n    if (inputValue.trim()) {\n      setTodos([...todos, {\n        id: Date.now(),\n        text: inputValue,\n        completed: false\n      }]);\n      setInputValue('''');\n    }\n  };\n\n  const toggleTodo = (id) => {\n    setTodos(todos.map(todo =>\n      todo.id === id ? { ...todo, completed: !todo.completed } : todo\n    ));\n  };\n\n  const deleteTodo = (id) => {\n    setTodos(todos.filter(todo => todo.id !== id));\n  };\n\n  const filteredTodos = todos.filter(todo => {\n    if (filter === ''active'') return !todo.completed;\n    if (filter === ''completed'') return todo.completed;\n    return true;\n  });\n\n  return (\n    <div>\n      <input\n        value={inputValue}\n        onChange={(e) => setInputValue(e.target.value)}\n        onKeyPress={(e) => e.key === ''Enter'' && addTodo()}\n      />\n      <button onClick={addTodo}>Add</button>\n      \n      <div>\n        <button onClick={() => setFilter(''all'')}>All</button>\n        <button onClick={() => setFilter(''active'')}>Active</button>\n        <button onClick={() => setFilter(''completed'')}>Completed</button>\n      </div>\n      \n      <ul>\n        {filteredTodos.map(todo => (\n          <li key={todo.id}>\n            <input\n              type="checkbox"\n              checked={todo.completed}\n              onChange={() => toggleTodo(todo.id)}\n            />\n            <span style={{\n              textDecoration: todo.completed ? ''line-through'' : ''none''\n            }}>\n              {todo.text}\n            </span>\n            <button onClick={() => deleteTodo(todo.id)}>Delete</button>\n          </li>\n        ))}\n      </ul>\n    </div>\n  );\n};\n\nexport default TodoApp;',
  '[{"input": "Add todo ''Learn React''", "expected": "Todo added to list"}, {"input": "Toggle first todo", "expected": "Todo marked as completed with strikethrough"}]',
  ARRAY['How would you optimize re-renders?', 'What if we need to persist todos to localStorage?', 'How would you implement drag-and-drop reordering?']
);

-- Insert checklist items
INSERT INTO public.checklist_items (week_number, title, description, estimated_time, difficulty, sort_order) VALUES
(1, 'Understand React Virtual DOM and reconciliation', 'Deep dive into how React updates the DOM efficiently', 90, 'medium', 1),
(1, 'Master useState, useEffect, useContext hooks', 'Practice with the most commonly used React hooks', 120, 'medium', 2),
(1, 'Implement custom hooks for reusable logic', 'Learn to extract component logic into reusable hooks', 90, 'hard', 3),
(1, 'Practice with Context API and state management', 'Understand when and how to use React Context', 60, 'medium', 4),
(1, 'Build error boundaries and handle edge cases', 'Learn error handling patterns in React applications', 45, 'hard', 5),
(1, 'Write tests for React components', 'Practice testing with React Testing Library', 90, 'hard', 6),
(1, 'Complete Todo List project with full functionality', 'Build a complete todo app with all CRUD operations', 180, 'medium', 7),

-- Week 2-4 checklist items
(2, 'Set up Next.js project with both routing systems', 'Learn App Router and Pages Router differences', 60, 'easy', 1),
(2, 'Understand difference between SSG, SSR, and ISR', 'Master Next.js rendering strategies', 90, 'hard', 2),
(2, 'Build API routes with proper error handling', 'Create serverless functions with Next.js', 120, 'medium', 3),
(2, 'Implement authentication with JWT', 'Build secure authentication system', 150, 'hard', 4),
(2, 'Optimize images and implement SEO best practices', 'Use next/image and next/head effectively', 90, 'medium', 5),
(2, 'Deploy application to Vercel with environment variables', 'Learn production deployment workflow', 60, 'easy', 6),
(2, 'Create a blog with dynamic routes and static generation', 'Build a real-world Next.js project', 240, 'hard', 7),

(3, 'Review JavaScript closures, scope, and hoisting', 'Strengthen JavaScript fundamentals', 90, 'medium', 1),
(3, 'Master Promises, async/await, and error handling', 'Handle asynchronous operations effectively', 120, 'hard', 2),
(3, 'Practice algorithm challenges (arrays, strings)', 'Solve common coding interview problems', 180, 'hard', 3),
(3, 'Design component architecture for large applications', 'Learn scalable React patterns', 150, 'hard', 4),
(3, 'Study system design principles and patterns', 'Understand scalability and architecture', 120, 'hard', 5),
(3, 'Practice whiteboarding and technical communication', 'Develop interview communication skills', 90, 'medium', 6),

(4, 'Build and deploy portfolio with Next.js', 'Create impressive portfolio project', 300, 'hard', 1),
(4, 'Practice system design interviews', 'Design scalable applications', 180, 'hard', 2),
(4, 'Prepare STAR method stories for behavioral questions', 'Practice behavioral interview techniques', 120, 'easy', 3),
(4, 'Conduct mock interviews with peers', 'Practice technical communication skills', 180, 'medium', 4),
(4, 'Review and practice all flashcards', 'Final review of all concepts', 240, 'medium', 5),
(4, 'Prepare questions to ask interviewers', 'Show engagement and interest', 60, 'easy', 6);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flashcards_category ON public.flashcards(category_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_difficulty ON public.flashcards(difficulty);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_flashcard_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_flashcard ON public.user_flashcard_progress(flashcard_id);
CREATE INDEX IF NOT EXISTS idx_challenges_difficulty ON public.challenges(difficulty);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, session_date);
CREATE INDEX IF NOT EXISTS idx_spaced_repetition_next_review ON public.spaced_repetition_data(next_review);
CREATE INDEX IF NOT EXISTS idx_checklist_week ON public.checklist_items(week_number);