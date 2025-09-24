// data/content-structure.js
// Enhanced Content Structure for Interactive Learning Platform
// Browser-compatible version - no ES6 imports/exports

window.contentStructure = {
  weeks: {
    1: {
      title: 'React Fundamentals',
      description: 'Master the core concepts of React including components, JSX, state, and hooks',
      days: [
        {
          id: 'day1',
          title: 'React Fundamentals & JSX',
          theory: 'Learn about React components, JSX syntax, Virtual DOM, and the component lifecycle. Understand how React differs from vanilla JavaScript and why it\'s so popular.',
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
}`,
            hints: [
              'Use destructuring to extract user properties',
              'Use conditional rendering for optional fields',
              'Create a fallback for missing avatars'
            ],
            testCases: [
              'Component renders without crashing',
              'Displays user name and email',
              'Shows role badge when provided',
              'Handles missing avatar correctly'
            ]
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
            },
            {
              label: 'useState with Objects',
              code: `import { useState } from 'react';

function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });
  
  const updateUser = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <form>
      <input 
        value={user.name}
        onChange={(e) => updateUser('name', e.target.value)}
        placeholder="Name"
      />
      <input 
        value={user.email}
        onChange={(e) => updateUser('email', e.target.value)}
        placeholder="Email"
      />
      <input 
        type="number"
        value={user.age}
        onChange={(e) => updateUser('age', parseInt(e.target.value))}
        placeholder="Age"
      />
    </form>
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
            ],
            starterCode: `import { useState } from 'react';

function TodoList() {
  // TODO: Add state for todos
  
  return (
    <div className="todo-list">
      {/* TODO: Implement todo list UI */}
    </div>
  );
}`,
            hints: [
              'Use an array to store todos',
              'Each todo should have id, text, and completed properties',
              'Use map() to render todo items',
              'Use filter() to show different views'
            ]
          }]
        },
        {
          id: 'day3',
          title: 'Side Effects with useEffect',
          theory: 'Learn how to handle side effects in React functional components using the useEffect hook. Understand dependency arrays, cleanup functions, and common patterns.',
          codeExamples: [
            {
              label: 'Basic useEffect',
              code: `import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    // Cleanup function
    return () => clearInterval(interval);
  }, []); // Empty dependency array = mount only
  
  return <div>Timer: {seconds} seconds</div>;
}`,
              lang: 'jsx'
            },
            {
              label: 'useEffect with Dependencies',
              code: `import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (userId) {
      fetchUser();
    }
  }, [userId]); // Runs when userId changes
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}`,
              lang: 'jsx'
            }
          ],
          quizzes: [
            {
              question: 'What happens if you omit the dependency array in useEffect?',
              answer: 'The effect runs after every render',
              options: [
                'The effect never runs',
                'The effect runs after every render',
                'The effect runs only once',
                'It causes an error'
              ],
              correct: 1
            }
          ],
          checklist: [
            'Understand useEffect lifecycle',
            'Use dependency arrays correctly',
            'Implement cleanup functions',
            'Handle async operations in effects',
            'Avoid infinite render loops'
          ],
          challenges: [{
            id: 'challenge3',
            title: 'Data Fetching Component',
            description: 'Create a component that fetches and displays data from an API with loading and error states.',
            requirements: [
              'Show loading state while fetching',
              'Display fetched data when successful',
              'Show error message on fetch failure',
              'Cleanup on component unmount'
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
          id: 'day4',
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
}

// Usage
function CounterComponent() {
  const { count, increment, decrement, reset } = useCounter(10);
  
  return (
    <div>
      <p>Count: {count}</p>
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
            id: 'challenge4',
            title: 'useLocalStorage Hook',
            description: 'Create a custom hook that syncs state with localStorage and handles edge cases like JSON parsing errors.',
            requirements: [
              'Sync state with localStorage',
              'Handle JSON parsing errors gracefully',
              'Return current value and setter function',
              'Work with any data type'
            ]
          }]
        }
      ]
    },
    3: {
      title: 'Next.js Fundamentals',
      description: 'Learn Next.js framework including SSR, SSG, API routes, and deployment strategies',
      days: [
        {
          id: 'day6',
          title: 'Next.js Introduction & Routing',
          theory: 'Understand Next.js framework, file-based routing, and the differences between CSR, SSR, and SSG.',
          codeExamples: [
            {
              label: 'Next.js Page Component',
              code: `// pages/about.js
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="About our company" />
      </Head>
      <main>
        <h1>About Us</h1>
        <p>Welcome to our company!</p>
        <Link href="/">Back to Home</Link>
      </main>
    </>
  );
}`,
              lang: 'jsx'
            }
          ],
          quizzes: [
            {
              question: 'What is the main advantage of Next.js over Create React App?',
              answer: 'Built-in SSR/SSG capabilities and file-based routing',
              options: [
                'Better performance only',
                'Built-in SSR/SSG and file-based routing',
                'More components',
                'Better styling options'
              ],
              correct: 1
            }
          ],
          checklist: [
            'Set up a Next.js project',
            'Understand file-based routing',
            'Use Next.js Link and Head components',
            'Create dynamic routes with brackets'
          ],
          challenges: [{
            id: 'challenge6',
            title: 'Blog with Dynamic Routes',
            description: 'Create a blog with dynamic routing for individual blog posts.'
          }]
        }
      ]
    },
    4: {
      title: 'Full-Stack & Deployment',
      description: 'Integrate APIs, handle authentication, and deploy production-ready applications',
      days: [
        {
          id: 'day7',
          title: 'API Integration & Deployment',
          theory: 'Learn how to integrate external APIs, handle authentication, and deploy your React/Next.js applications to production.',
          codeExamples: [
            {
              label: 'API Integration with SWR',
              code: `import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(res => res.json());

function UserList() {
  const { data, error, isLoading } = useSWR('/api/users', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
              lang: 'jsx'
            }
          ],
          quizzes: [
            {
              question: 'What is the benefit of using SWR or React Query?',
              answer: 'Automatic caching, revalidation, and loading states',
              options: [
                'Better API calls only',
                'Automatic caching, revalidation, and loading states',
                'Faster network requests',
                'Built-in authentication'
              ],
              correct: 1
            }
          ],
          checklist: [
            'Integrate REST APIs in React',
            'Handle loading and error states',
            'Implement authentication flow',
            'Deploy to Vercel or Netlify'
          ],
          challenges: [{
            id: 'challenge7',
            title: 'Full-Stack Todo App',
            description: 'Build a complete todo app with backend API and authentication.'
          }]
        }
      ]
    }
  }
};

// Export individual week content if needed for compatibility
window.week1 = window.contentStructure.weeks[1];
window.week2 = window.contentStructure.weeks[2];
window.week3 = window.contentStructure.weeks[3];
window.week4 = window.contentStructure.weeks[4];