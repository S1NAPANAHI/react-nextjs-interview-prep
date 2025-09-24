# Create comprehensive React interview questions organized into Top 10, Top 20, Top 50, and Top 100
# Based on the research gathered from multiple sources

import csv
import json

# Top 10 Must-Know Questions (Foundation level)
top_10_questions = [
    {
        "rank": 1,
        "question": "What is React and why would you use it?",
        "answer": "React is a JavaScript library developed by Facebook for building user interfaces, particularly single-page applications. It uses a component-based architecture, Virtual DOM for efficient updates, and follows a declarative programming paradigm. Key benefits include reusable components, better performance through Virtual DOM, strong community support, and excellent developer tools.",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    },
    {
        "rank": 2,
        "question": "What is JSX and how does it work?",
        "answer": "JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. It makes React components more readable and easier to write. JSX gets transpiled by tools like Babel into React.createElement() calls. Example: <div>Hello World</div> becomes React.createElement('div', null, 'Hello World').",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    },
    {
        "rank": 3,
        "question": "What is the Virtual DOM?",
        "answer": "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React creates a virtual copy, compares it with the previous version when changes occur (diffing), and updates only the changed parts in the real DOM (reconciliation). This makes updates much faster than manipulating the DOM directly.",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    },
    {
        "rank": 4,
        "question": "What's the difference between props and state?",
        "answer": "Props (properties) are immutable data passed from parent to child components - they're read-only. State is mutable data owned by a component that can change over time, typically in response to user actions or network responses. Props enable data flow down the component tree, while state manages local component data.",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    },
    {
        "rank": 5,
        "question": "What are React components? Functional vs Class components?",
        "answer": "Components are reusable, self-contained pieces of UI. Functional components are JavaScript functions that return JSX and use hooks for state/lifecycle. Class components extend React.Component and use lifecycle methods and this.state. Functional components are now preferred due to hooks, cleaner syntax, and better performance.",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    },
    {
        "rank": 6,
        "question": "Why are keys important in React lists?",
        "answer": "Keys help React identify which items have changed, been added, or removed in lists. They provide stable identity for each element, enabling efficient updates and preventing rendering bugs. Keys should be unique and stable - avoid using array indexes when list items can change order.",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    },
    {
        "rank": 7,
        "question": "What is useEffect and when do you use it?",
        "answer": "useEffect is a Hook that lets you perform side effects in functional components (data fetching, subscriptions, DOM manipulation). It runs after render and can optionally clean up. The dependency array controls when it runs: [] runs once, [value] runs when value changes, no array runs every render.",
        "difficulty": "Beginner",
        "category": "React Hooks"
    },
    {
        "rank": 8,
        "question": "What are controlled vs uncontrolled components?",
        "answer": "Controlled components have their value controlled by React state - the component's value comes from state and updates through event handlers. Uncontrolled components manage their own state internally and are accessed via refs. Controlled components are recommended for predictable data flow and easier validation.",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    },
    {
        "rank": 9,
        "question": "What are React Hooks and name the common ones?",
        "answer": "Hooks are functions that let you use state and other React features in functional components. Common hooks include: useState (state management), useEffect (side effects), useContext (context consumption), useRef (DOM access), useMemo (memoization), useCallback (function memoization), useReducer (complex state logic).",
        "difficulty": "Intermediate",
        "category": "React Hooks"
    },
    {
        "rank": 10,
        "question": "How do you handle events in React?",
        "answer": "React uses SyntheticEvents, which are wrappers around native DOM events providing consistent behavior across browsers. Event handlers are named using camelCase (onClick, not onclick) and are passed as functions. Events are automatically bound in functional components, but need binding in class components.",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    }
]

# Top 20 Questions (Building on the foundation)
top_20_questions = top_10_questions + [
    {
        "rank": 11,
        "question": "What is the Context API and when should you use it?",
        "answer": "Context API provides a way to pass data through the component tree without prop drilling. Create a context with React.createContext(), provide values with Provider, and consume with useContext hook or Consumer. Use for truly global data like themes, authentication, or language settings - avoid overuse as it can make components harder to test.",
        "difficulty": "Intermediate",
        "category": "State Management"
    },
    {
        "rank": 12,
        "question": "What is prop drilling and how can you avoid it?",
        "answer": "Prop drilling is passing props through multiple component levels just to reach a deeply nested child. It makes code harder to maintain. Avoid it using: Context API for global state, custom hooks for shared logic, state management libraries like Redux, or component composition patterns.",
        "difficulty": "Intermediate",
        "category": "State Management"
    },
    {
        "rank": 13,
        "question": "Explain useState hook with examples",
        "answer": "useState adds state to functional components. Returns an array: [currentValue, setterFunction]. Example: const [count, setCount] = useState(0). State updates are asynchronous and merge (objects) or replace (primitives). For state dependent on previous value, use functional updates: setCount(prev => prev + 1).",
        "difficulty": "Beginner",
        "category": "React Hooks"
    },
    {
        "rank": 14,
        "question": "What is useRef and when do you use it?",
        "answer": "useRef returns a mutable ref object whose .current property persists across renders without causing re-renders. Used for: accessing DOM elements directly, storing mutable values that don't trigger re-renders, keeping references to timers/intervals, or storing previous state/props values.",
        "difficulty": "Intermediate",
        "category": "React Hooks"
    },
    {
        "rank": 15,
        "question": "How do you optimize React component performance?",
        "answer": "Use React.memo for functional components to prevent unnecessary re-renders, implement useMemo for expensive calculations, useCallback for stable function references, lazy loading with React.lazy and Suspense, proper key props in lists, avoid inline objects/functions as props, and use React DevTools Profiler to identify bottlenecks.",
        "difficulty": "Intermediate",
        "category": "Performance"
    },
    {
        "rank": 16,
        "question": "What are React Fragments and why use them?",
        "answer": "Fragments let you group multiple children without adding extra DOM nodes. Use <React.Fragment> or shorthand <> </>. Helpful when a component needs to return multiple elements but you don't want wrapper divs cluttering the DOM structure or affecting CSS styling.",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    },
    {
        "rank": 17,
        "question": "How do you handle forms in React?",
        "answer": "Use controlled components where form data is handled by React state. Each input has a value prop from state and onChange handler to update state. For complex forms, consider useReducer or libraries like Formik/React Hook Form. Always validate input and handle submission properly with preventDefault().",
        "difficulty": "Intermediate",
        "category": "Forms"
    },
    {
        "rank": 18,
        "question": "What is lifting state up?",
        "answer": "Moving state from child components to their closest common ancestor so multiple components can share the same state. The parent manages state and passes it down as props along with update functions. This ensures single source of truth and synchronized data across components.",
        "difficulty": "Intermediate",
        "category": "State Management"
    },
    {
        "rank": 19,
        "question": "How do you implement conditional rendering?",
        "answer": "Use JavaScript expressions within JSX: ternary operator {condition ? <ComponentA /> : <ComponentB />}, logical AND {condition && <Component />}, if-else statements before return, or early returns. Choose based on readability and complexity of conditions.",
        "difficulty": "Beginner",
        "category": "React Fundamentals"
    },
    {
        "rank": 20,
        "question": "What are the rules of hooks?",
        "answer": "1. Only call hooks at the top level of React functions, never inside loops, conditions, or nested functions. 2. Only call hooks from React function components or custom hooks. 3. Always call hooks in the same order. These rules ensure hooks work correctly with React's internal state management.",
        "difficulty": "Intermediate",
        "category": "React Hooks"
    }
]

print("Created Top 10 and Top 20 React Interview Questions")
print(f"Top 10 questions: {len(top_10_questions)}")
print(f"Top 20 questions: {len(top_20_questions)}")