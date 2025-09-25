// Fixed React Interview Wiki with Proper Layout Integration
// Loads JSON data while maintaining the original beautiful layout

const { useState, useEffect, useCallback, useMemo } = React;
const { createRoot } = ReactDOM;

// Question data loader that works with your existing structure
class QuestionDataLoader {
  constructor() {
    this.dataFiles = [
      'data/top-10-questions.json',
      'data/top-20-questions.json', 
      'data/top-50-questions.json',
      'data/top-100-questions.json',
      'data/flashcards.json',
      'data/challenges.json',
      'data/enhanced-questions.json',
      'data/react-interview-questions-complete.json'
    ];
  }

  async loadAllQuestions() {
    const loadedData = {};
    
    for (const file of this.dataFiles) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          const data = await response.json();
          const fileName = file.split('/')[1].replace('.json', '');
          loadedData[fileName] = data;
        }
      } catch (error) {
        console.warn(`Failed to load ${file}:`, error);
      }
    }
    
    return this.organizeQuestions(loadedData);
  }

  organizeQuestions(loadedData) {
    const organized = {
      'react-fundamentals': {
        title: 'React Fundamentals',
        description: 'Core React concepts and principles',
        questions: []
      },
      'react-hooks': {
        title: 'React Hooks',
        description: 'useState, useEffect, and custom hooks',
        questions: []
      },
      'state-management': {
        title: 'State Management',
        description: 'Managing state in React applications',
        questions: []
      },
      'performance': {
        title: 'Performance',
        description: 'Optimization and performance best practices',
        questions: []
      },
      'advanced-patterns': {
        title: 'Advanced Patterns',
        description: 'Higher-order components and advanced techniques',
        questions: []
      },
      'top-questions': {
        title: 'Top Interview Questions',
        description: 'Most frequently asked questions',
        questions: []
      }
    };

    // Process each data file
    Object.entries(loadedData).forEach(([fileName, data]) => {
      if (!data || !data.questions) return;
      
      data.questions.forEach(question => {
        const category = this.categorizeQuestion(question, fileName);
        if (organized[category]) {
          organized[category].questions.push({
            ...question,
            source: fileName,
            sourceTitle: data.title || fileName
          });
        }
      });
    });

    return organized;
  }

  categorizeQuestion(question, fileName) {
    const questionText = (question.question + ' ' + (question.answer || '') + ' ' + (question.category || '')).toLowerCase();
    
    if (questionText.includes('hook') || questionText.includes('usestate') || questionText.includes('useeffect')) {
      return 'react-hooks';
    }
    if (questionText.includes('performance') || questionText.includes('optimization') || questionText.includes('memo')) {
      return 'performance';
    }
    if (questionText.includes('redux') || questionText.includes('context') || questionText.includes('state management')) {
      return 'state-management';
    }
    if (questionText.includes('hoc') || questionText.includes('render prop') || questionText.includes('higher order') || questionText.includes('advanced')) {
      return 'advanced-patterns';
    }
    if (fileName.includes('top-')) {
      return 'top-questions';
    }
    
    return 'react-fundamentals';
  }
}

// Custom hooks (keeping your existing ones)
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

// Fixed components with proper layout
function LoadingScreen() {
  return React.createElement('div', { className: 'loading-screen' },
    React.createElement('div', { className: 'loading-spinner' }),
    React.createElement('div', { className: 'loading-text' },
      React.createElement('h3', {}, 'Loading Interview Questions'),
      React.createElement('p', {}, 'Fetching questions from your data files...')
    )
  );
}

function Header({ currentPage, onNavigate, theme, toggleTheme, totalQuestions }) {
  return React.createElement('header', { className: 'header' },
    React.createElement('div', { className: 'header-content' },
      React.createElement('a', {
        href: '#',
        className: 'logo',
        onClick: (e) => { e.preventDefault(); onNavigate('react-fundamentals'); }
      },
        React.createElement('i', { className: 'fab fa-react logo-icon' }),
        React.createElement('span', {}, 'React Interview Prep')
      ),
      
      React.createElement('nav', { className: 'nav' },
        React.createElement('a', {
          href: '#',
          className: 'nav-link' + (currentPage === 'react-fundamentals' ? ' active' : ''),
          onClick: (e) => { e.preventDefault(); onNavigate('react-fundamentals'); }
        },
          React.createElement('i', { className: 'fas fa-cube' }),
          React.createElement('span', {}, 'Fundamentals')
        ),
        React.createElement('a', {
          href: '#',
          className: 'nav-link' + (currentPage === 'react-hooks' ? ' active' : ''),
          onClick: (e) => { e.preventDefault(); onNavigate('react-hooks'); }
        },
          React.createElement('i', { className: 'fas fa-link' }),
          React.createElement('span', {}, 'Hooks')
        ),
        React.createElement('a', {
          href: '#',
          className: 'nav-link' + (currentPage === 'top-questions' ? ' active' : ''),
          onClick: (e) => { e.preventDefault(); onNavigate('top-questions'); }
        },
          React.createElement('i', { className: 'fas fa-star' }),
          React.createElement('span', {}, 'Top Questions')
        )
      ),
      
      React.createElement('div', { className: 'header-actions' },
        totalQuestions > 0 && React.createElement('div', { className: 'stats-badge' },
          React.createElement('i', { className: 'fas fa-question-circle' }),
          React.createElement('span', {}, `${totalQuestions} Questions`)
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

function Sidebar({ currentPage, onNavigate, categories }) {
  const navigation = [
    {
      title: 'Essential Topics',
      items: [
        { id: 'react-fundamentals', title: 'React Fundamentals', icon: 'fas fa-cube', count: categories['react-fundamentals']?.questions?.length || 0 },
        { id: 'react-hooks', title: 'React Hooks', icon: 'fas fa-link', count: categories['react-hooks']?.questions?.length || 0 }
      ]
    },
    {
      title: 'Advanced Topics',
      items: [
        { id: 'state-management', title: 'State Management', icon: 'fas fa-database', count: categories['state-management']?.questions?.length || 0 },
        { id: 'performance', title: 'Performance', icon: 'fas fa-tachometer-alt', count: categories['performance']?.questions?.length || 0 },
        { id: 'advanced-patterns', title: 'Advanced Patterns', icon: 'fas fa-cogs', count: categories['advanced-patterns']?.questions?.length || 0 }
      ]
    },
    {
      title: 'Practice & Review',
      items: [
        { id: 'top-questions', title: 'Top Questions', icon: 'fas fa-star', count: categories['top-questions']?.questions?.length || 0 }
      ]
    }
  ];

  return React.createElement('aside', { className: 'sidebar' },
    React.createElement('div', { className: 'sidebar-content' },
      navigation.map(section =>
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
                  React.createElement('span', { className: 'nav-text' }, item.title),
                  item.count > 0 && React.createElement('span', { className: 'question-count' }, item.count)
                )
              )
            )
          )
        )
      )
    )
  );
}

function QuestionCard({ question, expanded, onToggle, questionIndex }) {
  const [answered, setAnswered] = useLocalStorage(`answered-${question.id}`, false);
  const [userAnswer, setUserAnswer] = useLocalStorage(`user-answer-${question.id}`, '');
  
  return React.createElement('div', {
    className: 'question-card' + (expanded ? ' expanded' : '') + (answered ? ' answered' : '')
  },
    React.createElement('div', {
      className: 'question-header',
      onClick: onToggle
    },
      React.createElement('div', { className: 'question-meta' },
        React.createElement('div', { className: 'question-number' }, `Q${questionIndex + 1}`),
        React.createElement('div', {
          className: `difficulty-badge difficulty-${question.difficulty?.toLowerCase() || 'beginner'}`
        }, question.difficulty || 'Beginner'),
        question.category && React.createElement('div', { className: 'category-badge' }, question.category)
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
      React.createElement('div', { className: 'practice-area' },
        React.createElement('h4', {}, '📝 Your Answer:'),
        React.createElement('textarea', {
          className: 'user-answer-input',
          placeholder: 'Type your answer here to practice...',
          value: userAnswer,
          onChange: (e) => setUserAnswer(e.target.value),
          rows: 3
        }),
        React.createElement('button', {
          className: 'mark-answered-btn' + (answered ? ' answered' : ''),
          onClick: (e) => { e.stopPropagation(); setAnswered(!answered); }
        },
          React.createElement('i', { className: answered ? 'fas fa-check' : 'fas fa-circle' }),
          React.createElement('span', {}, answered ? 'Answered' : 'Mark as Answered')
        )
      ),
      
      React.createElement('div', { className: 'content-card info' },
        React.createElement('h4', {}, '🎩 Expert Answer:'),
        React.createElement('div', {
          dangerouslySetInnerHTML: {
            __html: (question.answer || 'Answer not available').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }
        })
      ),
      
      question.codeExample && React.createElement('div', { className: 'code-section' },
        React.createElement('h4', {}, '💻 Code Example:'),
        React.createElement('pre', { className: 'line-numbers' },
          React.createElement('code', { className: 'language-javascript' },
            typeof question.codeExample === 'object' ? question.codeExample.code : question.codeExample
          )
        )
      ),
      
      question.keyPoints && question.keyPoints.length > 0 && React.createElement('div', { className: 'key-points' },
        React.createElement('h4', {}, '🔑 Key Points:'),
        React.createElement('ul', {},
          question.keyPoints.map((point, index) =>
            React.createElement('li', { key: index }, point)
          )
        )
      ),
      
      question.followUpQuestions && question.followUpQuestions.length > 0 && React.createElement('div', { className: 'follow-up' },
        React.createElement('h4', {}, '🤔 Follow-up Questions:'),
        React.createElement('ul', {},
          question.followUpQuestions.map((followUp, index) =>
            React.createElement('li', { key: index }, followUp)
          )
        )
      ),
      
      question.source && React.createElement('div', { className: 'question-source' },
        React.createElement('small', {},
          React.createElement('i', { className: 'fas fa-tag' }),
          ` Source: ${question.sourceTitle || question.source}`
        )
      )
    )
  );
}

function CategoryPage({ category, questions, expandedQuestions, onToggleQuestion }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    if (filter !== 'all') {
      filtered = filtered.filter(q => q.difficulty?.toLowerCase() === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.answer && q.answer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [questions, filter, searchTerm]);

  // Syntax highlighting effect
  useEffect(() => {
    if (window.Prism) {
      setTimeout(() => window.Prism.highlightAll(), 100);
    }
  }, [expandedQuestions]);

  return React.createElement('main', { className: 'content fade-in' },
    React.createElement('div', { className: 'content-header' },
      React.createElement('h1', { className: 'page-title' }, category.title),
      React.createElement('p', { className: 'page-description' }, category.description),
      React.createElement('div', { className: 'category-stats' },
        React.createElement('span', { className: 'stat' },
          React.createElement('i', { className: 'fas fa-question' }),
          ` ${questions.length} Questions Available`
        )
      )
    ),

        questions.length > 5 && React.createElement('div', { className: 'content-controls' },
          React.createElement('div', { className: 'search-box' },
            React.createElement('i', { className: 'fas fa-search' }),
            React.createElement('input', {
              type: 'text',
              placeholder: 'Search questions...',
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            })
          ),
          React.createElement('div', { className: 'filter-buttons' },
            ['all', 'beginner', 'intermediate', 'advanced'].map(level =>
              React.createElement('button', {
                key: level,
                className: 'filter-btn' + (filter === level ? ' active' : ''),
                onClick: () => setFilter(level)
              }, level.charAt(0).toUpperCase() + level.slice(1)))
          ),
    React.createElement('div', { className: 'questions-container' },
      filteredQuestions.length === 0 ?
        React.createElement('div', { className: 'no-questions' },
          React.createElement('i', { className: 'fas fa-search' }),
          React.createElement('p', {}, 'No questions found matching your criteria.')
        ) :
        filteredQuestions.map((question, index) =>
          React.createElement(QuestionCard, {
            key: question.id || index,
            question: question,
            questionIndex: index,
            expanded: expandedQuestions[question.id || index] || false,
            onToggle: () => onToggleQuestion(question.id || index)
          })
        )
    )
  );
}
function App() {
  const [currentPage, setCurrentPage] = useLocalStorage('wiki-current-page', 'react-fundamentals');
  const [expandedQuestions, setExpandedQuestions] = useLocalStorage('wiki-expanded-questions', {});
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme, toggleTheme } = useTheme();
  
  // Load questions data
  useEffect(() => {
    const loader = new QuestionDataLoader();
    
    loader.loadAllQuestions()
      .then(organizedQuestions => {
        setCategories(organizedQuestions);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading questions:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);
  
  const totalQuestions = useMemo(() => {
    return Object.values(categories).reduce((sum, category) => sum + (category.questions?.length || 0), 0);
  }, [categories]);
  
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
  
  if (error) {
    return React.createElement('div', { className: 'error-state' },
      React.createElement('h1', {}, 'Error Loading Questions'),
      React.createElement('p', {}, 'There was an issue loading the interview questions. Please refresh the page.'),
      React.createElement('button', { 
        onClick: () => window.location.reload(),
        className: 'btn-primary'
      }, 'Refresh Page')
    );
  }
  
  const currentCategory = categories[currentPage] || categories['react-fundamentals'];
  
  return React.createElement('div', { className: 'app' },
    React.createElement(Header, {
      currentPage: currentPage,
      onNavigate: handleNavigate,
      theme: theme,
      toggleTheme: toggleTheme,
      totalQuestions: totalQuestions
    }),
    React.createElement('div', { className: 'main-layout' },
      React.createElement(Sidebar, {
        currentPage: currentPage,
        onNavigate: handleNavigate,
        categories: categories
      }),
      currentCategory && React.createElement(CategoryPage, {
        category: currentCategory,
        questions: currentCategory.questions || [],
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
  }, 1500);
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
  module.exports = { App, WIKI_CONTENT };