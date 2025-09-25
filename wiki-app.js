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

// Sidebar navigation structure
const NAVIGATION = [
  {
    title: 'Getting Started',
    items: [
      { id: 'quick-start', title: 'Quick Start', icon: 'fas fa-rocket' },
      { id: 'react-fundamentals', title: 'React Fundamentals', icon: 'fas fa-cube' }
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { id: 'hooks', title: 'Hooks', icon: 'fas fa-link' },
      { id: 'advanced-patterns', title: 'Advanced Patterns', icon: 'fas fa-cogs' }
    ]
  }
];

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

// Components
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

function Sidebar({ currentPage, onNavigate }) {
  return React.createElement('aside', { className: 'sidebar' },
    React.createElement('div', { className: 'sidebar-content' },
      NAVIGATION.map(section =>
        React.createElement('div', {
          key: section.title,
          className: 'sidebar-section'
        },
          React.createElement('h3', { className: 'sidebar-title' }, section.title),
          React.createElement('ul', { className: 'sidebar-nav' },
            section.items.map(item =>
              React.createElement('li', {
                key: item.id,
                className: 'sidebar-nav-item'
              },
                React.createElement('a', {
                  href: '#',
                  className: 'sidebar-nav-link' + (currentPage === item.id ? ' active' : ''),
                  onClick: (e) => { e.preventDefault(); onNavigate(item.id); }
                },
                  React.createElement('i', { className: item.icon }),
                  React.createElement('span', {}, item.title)
                )
              )
            )
          )
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
  return React.createElement('div', {
    className: 'question-card' + (expanded ? ' expanded' : '')
  },
    React.createElement('div', {
      className: 'question-header',
      onClick: onToggle
    },
      React.createElement('div', { className: 'question-meta' },
        React.createElement('div', { className: 'question-number' }, 'Q'),
        React.createElement('div', {
          className: `difficulty-badge difficulty-${question.difficulty}`
        }, question.difficulty),
        React.createElement('div', { className: 'category-badge' }, question.category)
      ),
      React.createElement('div', { className: 'question-content-area' },
        React.createElement('h3', { className: 'question-title' }, question.question),
        React.createElement('div', { className: 'question-actions' },
          React.createElement('button', { className: 'expand-btn' },
            React.createElement('i', {
              className: expanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'
            }),
            React.createElement('span', {}, expanded ? 'Collapse' : 'Expand')
          )
        )
      )
    ),
    expanded && React.createElement('div', { className: 'question-content' },
      React.createElement('div', { className: 'content-card info' },
        React.createElement('p', {
          dangerouslySetInnerHTML: {
            __html: question.answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }
        })
      ),
      question.keyPoints && React.createElement('div', {},
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

function PageContent({ page, expandedQuestions, onToggleQuestion }) {
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
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
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
      React.createElement(Sidebar, {
        currentPage: currentPage,
        onNavigate: handleNavigate
      }),
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