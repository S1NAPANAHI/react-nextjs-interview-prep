/**
 * Enhanced Content Structure for Interactive Learning Platform
 * Based on the 4-week React + Next.js Interview Roadmap
 */

// Schema definitions for all content types
export const ContentTypes = {
  LESSON: 'lesson',
  CHALLENGE: 'challenge',
  CHECKLIST: 'checklist',
  SYSTEM_DESIGN: 'system_design',
  BEHAVIORAL: 'behavioral',
  PROJECT: 'project'
};

export const DifficultyLevels = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// Week 1: React Fundamentals & Advanced Concepts
export const week1Content = {
  week: 1,
  title: "React.js Fundamentals & Advanced Concepts",
  focus: "Core React concepts, hooks, and advanced patterns",
  lessons: [
    {
      id: "w1d1-react-fundamentals",
      title: "React Fundamentals Review",
      day: 1,
      week: 1,
      type: ContentTypes.LESSON,
      category: "react",
      difficulty: DifficultyLevels.BEGINNER,
      duration: 120, // minutes
      content: `
# React Fundamentals Deep Dive

## What is React?
React is a **declarative, efficient, and flexible JavaScript library** for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called "components."

### Key Concepts:

#### 1. Virtual DOM
- React creates a virtual representation of the DOM in memory
- When state changes, React compares (diffs) the new virtual DOM with the previous version
- Only the actual changes are applied to the real DOM (reconciliation)

\`\`\`jsx
// Before React (Direct DOM manipulation)
document.getElementById('counter').innerHTML = count;

// With React (Declarative)
function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>; // React handles DOM updates
}
\`\`\`

#### 2. JSX (JavaScript XML)
- Syntax extension that allows writing HTML-like code in JavaScript
- Gets transpiled to React.createElement() calls

\`\`\`jsx
// JSX
const element = <h1 className="greeting">Hello, world!</h1>;

// Transpiled to:
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
\`\`\`

#### 3. Components
Two types of components:
- **Functional Components**: Simple JavaScript functions
- **Class Components**: ES6 classes (legacy, but still used)

\`\`\`jsx
// Functional Component (Modern)
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Class Component (Legacy)
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
\`\`\`

#### 4. Props vs State
- **Props**: Read-only data passed from parent to child
- **State**: Mutable data that belongs to the component

\`\`\`jsx
function UserProfile({ name, email }) { // Props
  const [isOnline, setIsOnline] = useState(false); // State
  
  return (
    <div>
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
}
\`\`\`

## Common Interview Questions:
1. **What is React and why use it?**
2. **Explain the Virtual DOM and its benefits**
3. **What's the difference between props and state?**
4. **When would you use a class component vs functional component?**

## Key Takeaways:
- React promotes **component-based architecture**
- **One-way data flow** makes applications predictable
- **Virtual DOM** optimizes performance
- **JSX** makes components readable and maintainable
      `,
      codeExamples: [
        {
          label: "Basic Functional Component",
          code: `function Greeting({ name }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      <p>Welcome to React!</p>
    </div>
  );
}

export default Greeting;`,
          language: "jsx"
        },
        {
          label: "Component with Props and State",
          code: `import { useState } from 'react';

function UserCard({ user }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {isExpanded && (
        <div className="details">
          <p>Role: {user.role}</p>
          <p>Joined: {user.joinDate}</p>
        </div>
      )}
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
}`,
          language: "jsx"
        }
      ],
      quiz: [
        {
          question: "What is the Virtual DOM?",
          type: "multiple-choice",
          options: [
            "A copy of the real DOM stored in memory",
            "A faster version of the DOM",
            "A virtual representation used for efficient updates",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "The Virtual DOM is a virtual representation of the real DOM kept in memory and synced with the real DOM through reconciliation."
        }
      ],
      checklistItems: [
        "Understand React Virtual DOM and reconciliation",
        "Know the difference between props and state",
        "Can create functional and class components",
        "Understand JSX syntax and transpilation"
      ]
    },
    {
      id: "w1d2-react-hooks",
      title: "React Hooks Deep Dive",
      day: 2,
      week: 1,
      type: ContentTypes.LESSON,
      category: "react",
      difficulty: DifficultyLevels.INTERMEDIATE,
      duration: 150,
      content: `
# React Hooks Mastery

React Hooks allow you to **use state and other React features** without writing class components. Introduced in React 16.8, they revolutionized how we write React applications.

## Core Hooks

### 1. useState Hook
Manages local component state in functional components.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // Functional updates for complex state logic
  const increment = () => setCount(prev => prev + 1);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Enter name"
      />
    </div>
  );
}
\`\`\`

### 2. useEffect Hook
Handles side effects: API calls, subscriptions, DOM manipulation.

\`\`\`jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Effect runs after render
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (userId) {
      fetchUser();
    }
    
    // Cleanup function (optional)
    return () => {
      // Cancel pending requests, clear timers, etc.
    };
  }, [userId]); // Dependency array
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
\`\`\`

### 3. useContext Hook
Consumes context values without nesting.

\`\`\`jsx
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consumer component
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button 
      className={\`btn btn-\${theme}\`}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      Toggle Theme ({theme})
    </button>
  );
}
\`\`\`

## Advanced Hooks

### 4. useReducer Hook
For complex state logic, similar to Redux.

\`\`\`jsx
import { useReducer } from 'react';

const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };
    case 'decrement':
      return { ...state, count: state.count - state.step };
    case 'set_step':
      return { ...state, step: action.step };
    case 'reset':
      return initialState;
    default:
      throw new Error('Unknown action type');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <input 
        type="number" 
        value={state.step}
        onChange={(e) => dispatch({ 
          type: 'set_step', 
          step: parseInt(e.target.value) || 1 
        })}
      />
    </div>
  );
}
\`\`\`

### 5. Custom Hooks
Extract component logic into reusable functions.

\`\`\`jsx
// Custom hook for API calls
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserList() {
  const { data: users, loading, error } = useApi('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

## Hook Rules
1. **Only call hooks at the top level** - not inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - components or custom hooks

## Common Interview Questions:
1. **What are React Hooks and why were they introduced?**
2. **Explain the difference between useState and useReducer**
3. **When would you use useEffect and what is the cleanup function for?**
4. **How do you create and use custom hooks?**
5. **What are the rules of hooks?**
      `,
      codeExamples: [
        {
          label: "Custom Hook Example - useLocalStorage",
          code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(\`Error reading localStorage key "\${key}":, error\`);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(\`Error setting localStorage key "\${key}":, error\`);
    }
  };

  return [storedValue, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}`,
          language: "jsx"
        }
      ]
    }
  ],
  challenges: [
    {
      id: "w1-counter-challenge",
      title: "Advanced Counter with Hooks",
      type: ContentTypes.CHALLENGE,
      difficulty: DifficultyLevels.BEGINNER,
      estimatedTime: 30,
      description: "Build a counter component with multiple features using React hooks",
      requirements: [
        "Use useState for count state",
        "Implement increment, decrement, and reset functions",
        "Add step size control",
        "Display negative numbers with different styling",
        "Add keyboard shortcuts (space = increment, backspace = decrement)"
      ],
      starterCode: `import React, { useState } from 'react';
import './Counter.css';

function Counter() {
  // TODO: Initialize state
  
  // TODO: Create handler functions
  
  // TODO: Add keyboard event listeners
  
  return (
    <div className="counter-container">
      <h2>Advanced Counter</h2>
      {/* TODO: Implement UI */}
    </div>
  );
}

export default Counter;`,
      solution: `import React, { useState, useEffect } from 'react';
import './Counter.css';

function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(0);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        increment();
      } else if (event.code === 'Backspace') {
        event.preventDefault();
        decrement();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step]);

  return (
    <div className="counter-container">
      <h2>Advanced Counter</h2>
      <div className={\`count-display \${count < 0 ? 'negative' : 'positive'}\`}>
        {count}
      </div>
      <div className="controls">
        <button onClick={decrement} className="btn btn-decrement">
          -
        </button>
        <button onClick={increment} className="btn btn-increment">
          +
        </button>
        <button onClick={reset} className="btn btn-reset">
          Reset
        </button>
      </div>
      <div className="step-control">
        <label>
          Step: 
          <input 
            type="number" 
            value={step} 
            onChange={(e) => setStep(parseInt(e.target.value) || 1)}
            min="1"
          />
        </label>
      </div>
      <div className="keyboard-hints">
        <small>Shortcuts: Space (+), Backspace (-)</small>
      </div>
    </div>
  );
}

export default Counter;`,
      testCases: [
        "Counter initializes to 0",
        "Increment button increases count by step value",
        "Decrement button decreases count by step value",
        "Reset button sets count to 0",
        "Step size can be changed",
        "Negative numbers display with different styling",
        "Keyboard shortcuts work correctly"
      ],
      hints: [
        "Use useState for both count and step state",
        "useEffect with empty dependency array for keyboard listeners",
        "Don't forget to clean up event listeners",
        "Use conditional className for negative styling"
      ]
    }
  ],
  checklist: {
    id: "week-1-checklist",
    title: "Week 1 Mastery Checklist",
    items: [
      { id: "w1c1", text: "Understand React Virtual DOM and reconciliation", completed: false },
      { id: "w1c2", text: "Master useState, useEffect, useContext hooks", completed: false },
      { id: "w1c3", text: "Implement custom hooks for reusable logic", completed: false },
      { id: "w1c4", text: "Practice with Context API and state management", completed: false },
      { id: "w1c5", text: "Build error boundaries and handle edge cases", completed: false },
      { id: "w1c6", text: "Write tests for React components", completed: false },
      { id: "w1c7", text: "Complete Todo List project with full functionality", completed: false }
    ]
  }
};

export default week1Content;