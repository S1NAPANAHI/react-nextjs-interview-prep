// React Interview Wiki Application
// Documentation-style interface inspired by react.dev

const { useState, useEffect, useCallback, useMemo } = React;
const { createRoot } = ReactDOM;

// Content structure for wiki pages
const WIKI_CONTENT = {
  'quick-start': {
    title: 'Quick Start',
    description: 'Learn React fundamentals in 15 minutes',
    content: {
      sections: [
        {
          id: 'components',
          title: 'Creating and nesting components',
          content: `React apps are made out of **components**. A component is a piece of the UI (user interface) that has its own logic and appearance. A component can be as small as a button, or as large as an entire page.

React components are JavaScript functions that return markup:`,
          codeExample: {
            title: 'Basic Component',
            language: 'jsx',
            code: `function MyButton() {
  return (
    <button>I'm a button</button>
  );
}`
          },
          questions: [
            {
              id: 'q1',
              question: 'What is a React component?',
              difficulty: 'beginner',
              category: 'Components',
              answer: 'A React component is a JavaScript function that returns JSX markup representing a piece of the user interface. Components can be as simple as a button or as complex as an entire page.',
              keyPoints: [
                'Components are reusable pieces of UI',
                'They are JavaScript functions that return JSX',
                'Component names must start with a capital letter',
                'Components can be nested inside other components'
              ]
            }
          ]
        },
        {
          id: 'jsx',
          title: 'Writing markup with JSX',
          content: `The markup syntax you've seen above is called **JSX**. It is optional, but most React projects use JSX for its convenience. JSX is stricter than HTML.`,
          codeExample: {
            title: 'JSX Example',
            language: 'jsx',
            code: `function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}`
          },
          questions: [
            {
              id: 'q2',
              question: 'What is JSX and why is it used?',
              difficulty: 'beginner',
              category: 'JSX',
              answer: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like markup inside JavaScript files. It makes React components more readable and easier to write.',
              keyPoints: [
                'JSX stands for JavaScript XML',
                'It allows HTML-like syntax in JavaScript',
                'JSX is transpiled to React.createElement() calls',
                'You must close all tags in JSX'
              ]
            }
          ]
        }
      ]
    }
  },
  'react-fundamentals': {
    title: 'React Fundamentals',
    description: 'Core concepts every React developer should know',
    content: {
      sections: [
        {
          id: 'virtual-dom',
          title: 'Virtual DOM',
          content: `The Virtual DOM is a programming concept where a "virtual" representation of the UI is kept in memory and synced with the "real" DOM.`,
          questions: [
            {
              id: 'q3',
              question: 'What is the Virtual DOM and how does it work?',
              difficulty: 'intermediate',
              category: 'Virtual DOM',
              answer: 'The Virtual DOM is a JavaScript representation of the actual DOM. React creates a virtual copy of the real DOM in memory. When state changes, React compares the new virtual DOM with the previous virtual DOM (diffing), identifies what changed, and updates only those parts in the real DOM (reconciliation). This makes updates faster than manipulating the real DOM directly.',
              keyPoints: [
                'Virtual DOM is a JavaScript representation of the real DOM',
                'React uses diffing to compare virtual DOM trees',
                'Only changed elements are updated in the real DOM',
                'This process is called reconciliation'
              ]
            }
          ]
        },
        {
          id: 'props-state',
          title: 'Props vs State',
          content: `Understanding the difference between props and state is fundamental to React development.`,
          codeExample: {
            title: 'Props Example',
            language: 'jsx',
            code: `function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Welcome name="Sara" />`
          },
          questions: [
            {
              id: 'q4',
              question: "What's the difference between props and state?",
              difficulty: 'beginner',
              category: 'Props & State',
              answer: '**Props**: Data passed from parent to child component, read-only, immutable from child\'s perspective. **State**: Internal data managed by component itself, mutable, triggers re-render when changed. Props flow down, state is local to component.',
              keyPoints: [
                'Props are passed from parent to child',
                'Props are read-only in the receiving component',
                'State is internal to a component',
                'State changes trigger re-renders'
              ]
            }
          ]
        }
      ]
    }
  },
  'hooks': {
    title: 'React Hooks',
    description: 'State and lifecycle methods in functional components',
    content: {
      sections: [
        {
          id: 'usestate',
          title: 'useState Hook',
          content: `The useState Hook lets you add state to functional components.`,
          codeExample: {
            title: 'useState Example',
            language: 'jsx',
            code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`
          },
          questions: [
            {
              id: 'q5',
              question: 'How does the useState hook work?',
              difficulty: 'beginner',
              category: 'Hooks',
              answer: 'useState is a Hook that lets you add React state to functional components. It returns an array with two elements: the current state value and a function that lets you update it. The state will be preserved between re-renders.',
              keyPoints: [
                'Returns array with [state, setState]',
                'State is preserved between re-renders',
                'Initial state is passed as argument',
                'setState can take a value or function'
              ]
            }
          ]
        },
        {
          id: 'useeffect',
          title: 'useEffect Hook',
          content: `The useEffect Hook lets you perform side effects in functional components.`,
          codeExample: {
            title: 'useEffect Example',
            language: 'jsx',
            code: `import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`
          },
          questions: [
            {
              id: 'q6',
              question: 'What is useEffect and when should you use it?',
              difficulty: 'intermediate',
              category: 'Hooks',
              answer: 'useEffect is a Hook that lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined. Use it for data fetching, subscriptions, or manually changing the DOM.',
              keyPoints: [
                'Runs after every completed render',
                'Can return cleanup function',
                'Dependencies array controls when it runs',
                'Replaces lifecycle methods in functional components'
              ]
            }
          ]
        }
      ]
    }
  },
  'advanced-patterns': {
    title: 'Advanced Patterns',
    description: 'Advanced React patterns and best practices',
    content: {
      sections: [
        {
          id: 'context',
          title: 'Context API',
          content: `Context provides a way to pass data through the component tree without having to pass props down manually at every level.`,
          codeExample: {
            title: 'Context Example',
            language: 'jsx',
            code: `const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Button</button>;
}`
          },
          questions: [
            {
              id: 'q7',
              question: 'What is the Context API and when should you use it?',
              difficulty: 'advanced',
              category: 'Context',
              answer: 'The Context API provides a way to share values between components without explicitly passing props through every level of the tree. Use it for truly global data like authentication, themes, or language preferences. Avoid overusing it as it can make components less reusable.',
              keyPoints: [
                'Avoids prop drilling for global data',
                'Creates Provider and Consumer components',
                'Use useContext hook to consume context',
                'Should be used sparingly for truly global data'
              ]
            }
          ]
        }
      ]
    }
  }
};



// Custom hooks
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue];
}

function useTheme() {
  const [theme, setTheme] = useLocalStorage('wiki-theme', 'light');
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);
  
  return { theme, toggleTheme };
}

// Utility methods
const formatSetName = (setName) => {
    return setName.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

const formatCategoryName = (category) => {
    return category.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Components

function EnhancedSidebarComponent({ onNavigate, onQuestionSetLoad, onQuestionsByCategoryLoad }) {
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [questionCounts, setQuestionCounts] = useState({});
    const [completedQuestions, setCompletedQuestions] = useLocalStorage('interviewProgress_completedQuestions', []);

    // Initialize sidebar and load counts
    useEffect(() => {
        const fetchInitialCounts = async () => {
            const counts = {};
            const sets = ['top-10-questions', 'top-20-questions', 'top-50-questions', 'top-100-questions'];
            for (const setName of sets) {
                try {
                    const response = await fetch(`data/${setName}.json`);
                    const data = await response.json();
                    counts[setName] = (data.questions || data).length;
                } catch (error) {
                    console.warn(`Could not load count for ${setName}:`, error);
                }
            }
            setQuestionCounts(counts);
        };
        fetchInitialCounts();
    }, []);

    // Update progress display
    useEffect(() => {
        const total = Object.values(questionCounts).reduce((a, b) => a + b, 0);
        const percentage = total > 0 ? (completedQuestions.length / total) * 100 : 0;

        const completedElement = document.getElementById('completed-count');
        const totalElement = document.getElementById('total-count');
        const progressFill = document.getElementById('progress-fill');

        if (completedElement) completedElement.textContent = completedQuestions.length;
        if (totalElement) totalElement.textContent = total;
        if (progressFill) progressFill.style.width = `${percentage}%`;
    }, [questionCounts, completedQuestions]);

    const toggleCategory = useCallback((categoryId) => {
        setActiveCategory(prev => (prev === categoryId ? null : categoryId));
    }, []);

    const handleSearch = useCallback((query) => {
        setSearchTerm(query);
        // Implement filtering logic here based on query
        // This will involve filtering the displayed topic items
    }, []);

    const loadQuestionSet = useCallback((setName) => {
        onQuestionSetLoad(setName); // Callback to parent App component
    }, [onQuestionSetLoad]);

    const loadQuestionsByCategory = useCallback((categoryName) => {
        onQuestionsByCategoryLoad(categoryName); // Callback to parent App component
    }, [onQuestionsByCategoryLoad]);

    return React.createElement('nav', { className: 'sidebar' },
        React.createElement('div', { className: 'sidebar-header' },
            React.createElement('h2', {}, '📚 Interview Prep'),
            React.createElement('div', { className: 'search-container' },
                React.createElement('input', {
                    type: 'text',
                    id: 'topic-search',
                    placeholder: 'Search topics...',
                    value: searchTerm,
                    onChange: (e) => handleSearch(e.target.value)
                }),
                React.createElement('span', { className: 'search-icon' }, '🔍')
            )
        ),
        React.createElement('div', { className: 'sidebar-content' },
            React.createElement('div', { className: 'progress-section' },
                React.createElement('h3', {}, '📊 Your Progress'),
                React.createElement('div', { className: 'progress-stats' },
                    React.createElement('div', { className: 'stat-item' },
                        React.createElement('span', { className: 'stat-number', id: 'completed-count' }, completedQuestions.length),
                        React.createElement('span', { className: 'stat-label' }, 'Completed')
                    ),
                    React.createElement('div', { className: 'stat-item' },
                        React.createElement('span', { className: 'stat-number', id: 'total-count' }, Object.values(questionCounts).reduce((a, b) => a + b, 0)),
                        React.createElement('span', { className: 'stat-label' }, 'Total')
                    )
                ),
                React.createElement('div', { className: 'progress-bar' },
                    React.createElement('div', { className: 'progress-fill', id: 'progress-fill', style: { width: `${Object.values(questionCounts).reduce((a, b) => a + b, 0) > 0 ? (completedQuestions.length / Object.values(questionCounts).reduce((a, b) => a + b, 0)) * 100 : 0}%` } })
                )
            ),
            React.createElement('div', { className: 'topic-sections' },
                // Quick Start
                React.createElement('div', { className: 'topic-category' },
                    React.createElement('div', { className: `category-header ${activeCategory === 'quick-start' ? 'expanded' : ''}`, onClick: () => toggleCategory('quick-start') },
                        React.createElement('span', { className: 'category-icon' }, '🚀'),
                        React.createElement('span', { className: 'category-title' }, 'Quick Start'),
                        React.createElement('span', { className: 'expand-icon' }, activeCategory === 'quick-start' ? '▲' : '▼')
                    ),
                    React.createElement('div', { className: `category-content ${activeCategory === 'quick-start' ? 'expanded' : ''}`, id: 'quick-start', style: { maxHeight: activeCategory === 'quick-start' ? '500px' : '0' } },
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionSet('top-10-questions') },
                            React.createElement('span', { className: 'topic-icon' }, '⭐'),
                            React.createElement('span', { className: 'topic-name' }, 'Top 10 Questions'),
                            React.createElement('span', { className: 'question-count' }, questionCounts['top-10-questions'] || 0)
                        ),
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionSet('top-20-questions') },
                            React.createElement('span', { className: 'topic-icon' }, '🔥'),
                            React.createElement('span', { className: 'topic-name' }, 'Top 20 Questions'),
                            React.createElement('span', { className: 'question-count' }, questionCounts['top-20-questions'] || 0)
                        )
                    )
                ),
                // React Fundamentals
                React.createElement('div', { className: 'topic-category' },
                    React.createElement('div', { className: `category-header ${activeCategory === 'react-fundamentals' ? 'expanded' : ''}`, onClick: () => toggleCategory('react-fundamentals') },
                        React.createElement('span', { className: 'category-icon' }, '⚛️'),
                        React.createElement('span', { className: 'category-title' }, 'React Fundamentals'),
                        React.createElement('span', { className: 'expand-icon' }, activeCategory === 'react-fundamentals' ? '▲' : '▼')
                    ),
                    React.createElement('div', { className: `category-content ${activeCategory === 'react-fundamentals' ? 'expanded' : ''}`, id: 'react-fundamentals', style: { maxHeight: activeCategory === 'react-fundamentals' ? '500px' : '0' } },
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('components') },
                            React.createElement('span', { className: 'topic-icon' }, '🧩'),
                            React.createElement('span', { className: 'topic-name' }, 'Components & JSX'),
                            React.createElement('span', { className: 'question-count' }, '15') // Placeholder, will need to calculate dynamically
                        ),
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('props-state') },
                            React.createElement('span', { className: 'topic-icon' }, '📦'),
                            React.createElement('span', { className: 'topic-name' }, 'Props & State'),
                            React.createElement('span', { className: 'question-count' }, '12') // Placeholder
                        ),
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('lifecycle') },
                            React.createElement('span', { className: 'topic-icon' }, '🔄'),
                            React.createElement('span', { className: 'topic-name' }, 'Lifecycle Methods'),
                            React.createElement('span', { className: 'question-count' }, '8') // Placeholder
                        )
                    )
                ),
                // React Hooks
                React.createElement('div', { className: 'topic-category' },
                    React.createElement('div', { className: `category-header ${activeCategory === 'react-hooks' ? 'expanded' : ''}`, onClick: () => toggleCategory('react-hooks') },
                        React.createElement('span', { className: 'category-icon' }, '🪝'),
                        React.createElement('span', { className: 'category-title' }, 'React Hooks'),
                        React.createElement('span', { className: 'expand-icon' }, activeCategory === 'react-hooks' ? '▲' : '▼')
                    ),
                    React.createElement('div', { className: `category-content ${activeCategory === 'react-hooks' ? 'expanded' : ''}`, id: 'react-hooks', style: { maxHeight: activeCategory === 'react-hooks' ? '500px' : '0' } },
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('basic-hooks') },
                            React.createElement('span', { className: 'topic-icon' }, '🎣'),
                            React.createElement('span', { className: 'topic-name' }, 'useState & useEffect'),
                            React.createElement('span', { className: 'question-count' }, '18') // Placeholder
                        ),
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('advanced-hooks') },
                            React.createElement('span', { className: 'topic-icon' }, '🔥'),
                            React.createElement('span', { className: 'topic-name' }, 'Custom Hooks'),
                            React.createElement('span', { className: 'question-count' }, '10') // Placeholder
                        ),
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('context-hooks') },
                            React.createElement('span', { className: 'topic-icon' }, '🌐'),
                            React.createElement('span', { className: 'topic-name' }, 'useContext & useReducer'),
                            React.createElement('span', { className: 'question-count' }, '8') // Placeholder
                        )
                    )
                ),
                // State Management
                React.createElement('div', { className: 'topic-category' },
                    React.createElement('div', { className: `category-header ${activeCategory === 'state-management' ? 'expanded' : ''}`, onClick: () => toggleCategory('state-management') },
                        React.createElement('span', { className: 'category-icon' }, '🗄️'),
                        React.createElement('span', { className: 'category-title' }, 'State Management'),
                        React.createElement('span', { className: 'expand-icon' }, activeCategory === 'state-management' ? '▲' : '▼')
                    ),
                    React.createElement('div', { className: `category-content ${activeCategory === 'state-management' ? 'expanded' : ''}`, id: 'state-management', style: { maxHeight: activeCategory === 'state-management' ? '500px' : '0' } },
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('redux') },
                            React.createElement('span', { className: 'topic-icon' }, '🔴'),
                            React.createElement('span', { className: 'topic-name' }, 'Redux & RTK'),
                            React.createElement('span', { className: 'question-count' }, '15') // Placeholder
                        ),
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('context-api') },
                            React.createElement('span', { className: 'topic-icon' }, '🌍'),
                            React.createElement('span', { className: 'topic-name' }, 'Context API'),
                            React.createElement('span', { className: 'question-count' }, '8') // Placeholder
                        ),
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('zustand') },
                            React.createElement('span', { className: 'topic-icon' }, '🐻'),
                            React.createElement('span', { className: 'topic-name' }, 'Zustand & Others'),
                            React.createElement('span', { className: 'question-count' }, '6') // Placeholder
                        )
                    )
                ),
                // Performance
                React.createElement('div', { className: 'topic-category' },
                    React.createElement('div', { className: `category-header ${activeCategory === 'performance' ? 'expanded' : ''}`, onClick: () => toggleCategory('performance') },
                        React.createElement('span', { className: 'category-icon' }, '⚡'),
                        React.createElement('span', { className: 'category-title' }, 'Performance'),
                        React.createElement('span', { className: 'expand-icon' }, activeCategory === 'performance' ? '▲' : '▼')
                    ),
                    React.createElement('div', { className: `category-content ${activeCategory === 'performance' ? 'expanded' : ''}`, id: 'performance', style: { maxHeight: activeCategory === 'performance' ? '500px' : '0' } },
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('optimization') },
                            React.createElement('span', { className: 'topic-icon' }, '🚀'),
                            React.createElement('span', { className: 'topic-name' }, 'Optimization'),
                            React.createElement('span', { className: 'question-count' }, '12') // Placeholder
                        ),
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionsByCategory('memoization') },
                            React.createElement('span', { className: 'topic-icon' }, '💾'),
                            React.createElement('span', { className: 'topic-name' }, 'Memoization'),
                            React.createElement('span', { className: 'question-count' }, '8') // Placeholder
                        )
                    )
                ),
                // Complete Collections
                React.createElement('div', { className: 'topic-category' },
                    React.createElement('div', { className: `category-header ${activeCategory === 'complete-sets' ? 'expanded' : ''}`, onClick: () => toggleCategory('complete-sets') },
                        React.createElement('span', { className: 'category-icon' }, '📚'),
                        React.createElement('span', { className: 'category-title' }, 'Complete Sets'),
                        React.createElement('span', { className: 'expand-icon' }, activeCategory === 'complete-sets' ? '▲' : '▼')
                    ),
                    React.createElement('div', { className: `category-content ${activeCategory === 'complete-sets' ? 'expanded' : ''}`, id: 'complete-sets', style: { maxHeight: activeCategory === 'complete-sets' ? '500px' : '0' } },
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionSet('top-50-questions') },
                            React.createElement('span', { className: 'topic-icon' }, '🎯'),
                            React.createElement('span', { className: 'topic-name' }, 'Top 50 Questions'),
                            React.createElement('span', { className: 'question-count' }, questionCounts['top-50-questions'] || 0)
                        ),
                        React.createElement('div', { className: 'topic-item', onClick: () => loadQuestionSet('top-100-questions') },
                            React.createElement('span', { className: 'topic-icon' }, '💯'),
                            React.createElement('span', { className: 'topic-name' }, 'Top 100 Questions'),
                            React.createElement('span', { className: 'question-count' }, questionCounts['top-100-questions'] || 0)
                        )
                    )
                )
            ),
            React.createElement('div', { className: 'practice-section' },
                React.createElement('h3', {}, '🏋️ Practice Modes'),
                React.createElement('div', { className: 'practice-item', onClick: () => console.log('Starting random quiz...') },
                    React.createElement('span', { className: 'practice-icon' }, '🎲'),
                    React.createElement('span', { className: 'practice-name' }, 'Random Quiz')
                ),
                React.createElement('div', { className: 'practice-item', onClick: () => console.log('Starting flashcards...') },
                    React.createElement('span', { className: 'practice-icon' }, '⚡'),
                    React.createElement('span', { className: 'practice-name' }, 'Flashcards')
                ),
                React.createElement('div', { className: 'practice-item', onClick: () => console.log('Starting timed practice...') },
                    React.createElement('span', { className: 'practice-icon' }, '⏱️'),
                    React.createElement('span', { className: 'practice-name' }, 'Timed Practice')
                )
            )
        )
    );
}

function LoadingScreen() {
  return React.createElement('div', { className: 'loading-screen' },
    React.createElement('div', { className: 'loading-spinner' }),
    React.createElement('div', { className: 'loading-text' },
      React.createElement('h3', {}, 'Loading React Interview Wiki'),
      React.createElement('p', {}, 'Preparing your documentation experience...')
    )
  );
}

function Header({ currentPage, onNavigate, theme, toggleTheme }) {
  const [searchOpen, setSearchOpen] = useState(false);
  
  return React.createElement('header', { className: 'header' },
    React.createElement('div', { className: 'header-content' },
      React.createElement('a', {
        href: '#',
        className: 'logo',
        onClick: (e) => { e.preventDefault(); onNavigate('quick-start'); }
      },
        React.createElement('i', { className: 'fab fa-react logo-icon' }),
        React.createElement('span', {}, 'React Interview Wiki')
      ),
      
      React.createElement('nav', { className: 'nav' },
        React.createElement('a', {
          href: '#',
          className: 'nav-link' + (currentPage === 'quick-start' ? ' active' : ''),
          onClick: (e) => { e.preventDefault(); onNavigate('quick-start'); }
        },
          React.createElement('i', { className: 'fas fa-play' }),
          React.createElement('span', {}, 'Learn')
        ),
        React.createElement('a', {
          href: '#',
          className: 'nav-link' + (currentPage === 'react-fundamentals' ? ' active' : ''),
          onClick: (e) => { e.preventDefault(); onNavigate('react-fundamentals'); }
        },
          React.createElement('i', { className: 'fas fa-book' }),
          React.createElement('span', {}, 'Reference')
        ),
        React.createElement('a', {
          href: '#',
          className: 'nav-link',
          onClick: (e) => { e.preventDefault(); }
        },
          React.createElement('i', { className: 'fas fa-users' }),
          React.createElement('span', {}, 'Community')
        )
      ),
      
      React.createElement('div', { className: 'header-actions' },
        React.createElement('div', {
          className: 'search-trigger',
          onClick: () => setSearchOpen(!searchOpen)
        },
          React.createElement('i', { className: 'fas fa-search' }),
          React.createElement('span', {}, 'Search')
        ),
        React.createElement('button', {
          className: 'theme-toggle',
          onClick: toggleTheme,
          title: 'Toggle theme'
        },
          React.createElement('i', {
            className: theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'
          })
        )
      )
    )
  );
}



function CodeBlock({ title, language, code, showCopy = true }) {
  const [copied, setCopied] = useState(false);
  
  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);
  
  useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  });
  
  return React.createElement('div', { className: 'code-block' },
    title && React.createElement('div', { className: 'code-header' },
      React.createElement('div', { className: 'code-title' },
        React.createElement('span', { className: 'code-language' }, language.toUpperCase()),
        React.createElement('span', {}, title)
      ),
      showCopy && React.createElement('button', {
        className: 'copy-button' + (copied ? ' copied' : ''),
        onClick: copyCode
      },
        React.createElement('i', {
          className: copied ? 'fas fa-check' : 'fas fa-copy'
        }),
        React.createElement('span', {}, copied ? 'Copied!' : 'Copy')
      )
    ),
    React.createElement('pre', { className: 'line-numbers' },
      React.createElement('code', {
        className: `language-${language}`
      }, code)
    )
  );
}

function QuestionCard({ question, expanded, onToggle }) {
    // Ensure question.id is a string or number for direct use, or generate a unique one if not present
    const questionId = question.id || `q-${Math.random().toString(36).substr(2, 9)}`;

    return React.createElement('div', { className: 'question-item', 'data-question-id': questionId },
        React.createElement('div', { className: 'question-header' },
            React.createElement('div', { className: 'question-number' }, `Q${questionId}`),
            React.createElement('h3', { className: 'question-title' }, question.question),
            React.createElement('div', { className: 'question-meta' },
                React.createElement('span', { className: `difficulty ${question.difficulty?.toLowerCase() || 'beginner'}` }, question.difficulty || 'BEGINNER'),
                React.createElement('span', { className: 'category' }, question.category || 'React Fundamentals')
            )
        ),
        React.createElement('div', { className: 'question-actions' },
            React.createElement('button', {
                className: 'expand-btn',
                id: `expand-btn-${questionId}`,
                onClick: () => onToggle(questionId)
            },
                expanded ? '▲ Collapse' : '▼ Expand'
            )
        ),
        React.createElement('div', {
            className: 'answer-content',
            id: `answer-${questionId}`,
            style: { display: expanded ? 'block' : 'none' }
        },
            React.createElement('div', { className: 'answer-text' },
                React.createElement('p', {
                    dangerouslySetInnerHTML: {
                        __html: question.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }
                })
            ),
            question.code && React.createElement('div', { className: 'code-example' },
                React.createElement('pre', {},
                    React.createElement('code', { className: 'language-javascript' }, question.code)
                )
            ),
            question.keyPoints && React.createElement('div', { className: 'key-points' },
                React.createElement('h4', {}, 'Key Points:'),
                React.createElement('ul', {},
                    question.keyPoints.map((point, index) =>
                        React.createElement('li', { key: index }, point)
                    )
                )
            )
        )
    );
}

function ContentSection({ section, expandedQuestions, onToggleQuestion }) {
  return React.createElement('section', { className: 'content-section' },
    React.createElement('h2', {}, section.title),
    React.createElement('div', {
      dangerouslySetInnerHTML: {
        __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      }
    }),
    section.codeExample && React.createElement(CodeBlock, {
      title: section.codeExample.title,
      language: section.codeExample.language,
      code: section.codeExample.code
    }),
    section.questions && React.createElement('div', { className: 'questions-section' },
      React.createElement('h3', {}, 'Practice Questions'),
      section.questions.map(question =>
        React.createElement(QuestionCard, {
          key: question.id,
          question: question,
          expanded: expandedQuestions[question.id] || false,
          onToggle: () => onToggleQuestion(question.id)
        })
      )
    )
  );
}

function PageContent({ page, customQuestions, customTitle, expandedQuestions, onToggleQuestion }) {
  if (page === 'custom-questions') {
    return React.createElement('main', { className: 'content fade-in' },
      React.createElement('div', { className: 'content-header' },
        React.createElement('h1', { className: 'page-title' }, customTitle || 'Questions'),
        React.createElement('p', { className: 'page-description' }, `Displaying ${customQuestions.length} questions.`)
      ),
      customQuestions.length > 0 ?
        customQuestions.map((question, index) =>
          React.createElement(QuestionCard, {
            key: question.id || index, // Use question.id if available, otherwise index
            question: question,
            expanded: expandedQuestions[question.id] || false,
            onToggle: onToggleQuestion
          })
        ) :
        React.createElement('p', {}, 'No questions found for this selection.')
    );
  }

  const content = WIKI_CONTENT[page];

  if (!content) {
    return React.createElement('div', { className: 'content' },
      React.createElement('h1', {}, 'Page Not Found'),
      React.createElement('p', {}, 'The requested page could not be found.')
    );
  }

  return React.createElement('main', { className: 'content fade-in' },
    React.createElement('div', { className: 'content-header' },
      React.createElement('h1', { className: 'page-title' }, content.title),
      React.createElement('p', { className: 'page-description' }, content.description)
    ),

    content.content.sections.length > 1 && React.createElement('div', { className: 'toc' },
      React.createElement('h3', { className: 'toc-title' }, 'In this article'),
      React.createElement('ul', { className: 'toc-list' },
        content.content.sections.map(section =>
          React.createElement('li', { key: section.id, className: 'toc-item' },
            React.createElement('a', {
              href: `#${section.id}`,
              className: 'toc-link'
            }, section.title)
          )
        )
      )
    ),

    content.content.sections.map(section =>
      React.createElement(ContentSection, {
        key: section.id,
        section: section,
        expandedQuestions: expandedQuestions,
        onToggleQuestion: onToggleQuestion
      })
    )
  );
}

function App() {
  const [currentPage, setCurrentPage] = useLocalStorage('wiki-current-page', 'quick-start');
  const [expandedQuestions, setExpandedQuestions] = useLocalStorage('wiki-expanded-questions', {});
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const [currentQuestions, setCurrentQuestions] = useState([]); // New state for questions
  const [currentContentTitle, setCurrentContentTitle] = useState(''); // New state for content title

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Need to move filterQuestionsByCategory out of EnhancedSidebarComponent.prototype
  // or make it a utility function. For now, I'll define it here.
  const filterQuestionsByCategory = (questions, category) => {
    return questions.filter(question => {
      const text = (question.question + ' ' + (question.answer || '')).toLowerCase();

      switch (category) {
        case 'components':
          return text.includes('component') || text.includes('jsx') || text.includes('render');
        case 'props-state':
          return text.includes('props') || text.includes('state') && !text.includes('redux');
        case 'lifecycle':
          return text.includes('lifecycle') || text.includes('componentdid') || text.includes('mount');
        case 'basic-hooks':
          return text.includes('usestate') || text.includes('useeffect');
        case 'advanced-hooks':
          return text.includes('custom hook') || text.includes('usememo') || text.includes('usecallback');
        case 'context-hooks':
          return text.includes('usecontext') || text.includes('usereducer');
        case 'redux':
          return text.includes('redux') || text.includes('store') || text.includes('action');
        case 'context-api':
          return text.includes('context') && !text.includes('redux');
        case 'optimization':
          return text.includes('performance') || text.includes('optimization') || text.includes('lazy');
        case 'memoization':
          return text.includes('memo') || text.includes('memoiz') || text.includes('cache');
        default:
          return true;
      }
    });
  };

  // Function to load questions from a set (e.g., top-10-questions.json)
  const loadQuestionSet = useCallback(async (setName) => {
    try {
      const response = await fetch(`data/${setName}.json`);
      const data = await response.json();
      setCurrentQuestions(data.questions || data);
      setCurrentContentTitle(formatSetName(setName)); // Use formatSetName from the component
      setCurrentPage('custom-questions'); // Set a custom page to indicate dynamic content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(`Error loading ${setName}:`, error);
      setCurrentQuestions([]);
      setCurrentContentTitle('Error loading questions');
    }
  }, [setCurrentPage]);

  // Function to load questions by category
  const loadQuestionsByCategory = useCallback(async (categoryName) => {
    try {
      const allQuestions = [];
      const questionSets = ['top-10-questions', 'top-20-questions', 'top-50-questions', 'top-100-questions']; // Define which sets to search
      for (const setName of questionSets) {
        const response = await fetch(`data/${setName}.json`);
        const data = await response.json();
        allQuestions.push(...(data.questions || data).map(q => ({ ...q, source: setName })));
      }

      const filteredQuestions = filterQuestionsByCategory(allQuestions, categoryName); // Use the local filter function
      setCurrentQuestions(filteredQuestions);
      setCurrentContentTitle(formatCategoryName(categoryName)); // Use formatCategoryName
      setCurrentPage('custom-questions'); // Set a custom page to indicate dynamic content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(`Error loading questions by category ${categoryName}:`, error);
      setCurrentQuestions([]);
      setCurrentContentTitle('Error loading questions');
    }
  }, [setCurrentPage]);

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    setCurrentQuestions([]); // Clear custom questions when navigating to a wiki page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage]);

  const handleToggleQuestion = useCallback((questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  }, [setExpandedQuestions]);

  if (loading) {
    return React.createElement(LoadingScreen);
  }

  return React.createElement('div', { className: 'app' },
    React.createElement(Header, {
      currentPage: currentPage,
      onNavigate: handleNavigate,
      theme: theme,
      toggleTheme: toggleTheme
    }),
    React.createElement('div', { className: 'main-layout' },
      React.createElement(EnhancedSidebarComponent, {
        onNavigate: handleNavigate,
        onQuestionSetLoad: loadQuestionSet,
        onQuestionsByCategoryLoad: loadQuestionsByCategory
      }),
      currentPage === 'custom-questions' ?
        React.createElement(PageContent, {
          page: 'custom-questions', // A dummy page to render custom questions
          customQuestions: currentQuestions,
          customTitle: currentContentTitle,
          expandedQuestions: expandedQuestions,
          onToggleQuestion: handleToggleQuestion
        }) :
        React.createElement(PageContent, {
          page: currentPage,
          expandedQuestions: expandedQuestions,
          onToggleQuestion: handleToggleQuestion
        })
    )
  );
}

// Initialize the application
function initializeApp() {
  const loadingScreen = document.getElementById('loading-screen');
  const root = createRoot(document.getElementById('root'));
  
  root.render(React.createElement(App));
  
  // Hide loading screen after initialization
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  }, 1200);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, WIKI_CONTENT, NAVIGATION };
}