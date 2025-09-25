// React Interview Wiki with Full JSON Integration
// Loads all interview questions from JSON files in the data directory

const { useState, useEffect, useCallback, useMemo } = React;
const { createRoot } = ReactDOM;

// Question data loader
class QuestionDataLoader {
  constructor() {
    this.cache = new Map();
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
    const loadPromises = this.dataFiles.map(async (file) => {
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
    });

    await Promise.all(loadPromises);
    return loadedData;
  }

  organizeQuestions(loadedData) {
    const organized = {
      'react-fundamentals': { title: 'React Fundamentals', questions: [], description: 'Core React concepts and principles' },
      'react-hooks': { title: 'React Hooks', questions: [], description: 'useState, useEffect, and custom hooks' },
      'state-management': { title: 'State Management', questions: [], description: 'Managing state in React applications' },
      'performance': { title: 'Performance', questions: [], description: 'Optimization and performance best practices' },
      'advanced-patterns': { title: 'Advanced Patterns', questions: [], description: 'Higher-order components, render props, and more' },
      'testing': { title: 'Testing', questions: [], description: 'Testing React applications' },
      'top-questions': { title: 'Top Interview Questions', questions: [], description: 'Most frequently asked questions' }
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

    // Remove empty categories
    Object.keys(organized).forEach(key => {
      if (organized[key].questions.length === 0) {
        delete organized[key];
      }
    });

    return organized;
  }

  categorizeQuestion(question, fileName) {
    const questionText = (question.question + ' ' + (question.answer || '') + ' ' + (question.category || '')).toLowerCase();
    
    // Check for specific patterns
    if (questionText.includes('hook') || questionText.includes('usestate') || questionText.includes('useeffect') || questionText.includes('usememo')) {
      return 'react-hooks';
    }
    if (questionText.includes('performance') || questionText.includes('optimization') || questionText.includes('memo') || questionText.includes('lazy')) {
      return 'performance';
    }
    if (questionText.includes('test') || questionText.includes('jest') || questionText.includes('enzyme') || questionText.includes('testing')) {
      return 'testing';
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

// Navigation structure builder
function buildNavigation(categories) {
  return [
    {
      title: 'Essential Topics',
      items: [
        { id: 'react-fundamentals', title: categories['react-fundamentals']?.title || 'React Fundamentals', icon: 'fas fa-cube', count: categories['react-fundamentals']?.questions?.length || 0 },
        { id: 'react-hooks', title: categories['react-hooks']?.title || 'React Hooks', icon: 'fas fa-link', count: categories['react-hooks']?.questions?.length || 0 }
      ]
    },
    {
      title: 'Advanced Topics', 
      items: [
        { id: 'state-management', title: categories['state-management']?.title || 'State Management', icon: 'fas fa-database', count: categories['state-management']?.questions?.length || 0 },
        { id: 'performance', title: categories['performance']?.title || 'Performance', icon: 'fas fa-tachometer-alt', count: categories['performance']?.questions?.length || 0 },
        { id: 'advanced-patterns', title: categories['advanced-patterns']?.title || 'Advanced Patterns', icon: 'fas fa-cogs', count: categories['advanced-patterns']?.questions?.length || 0 }
      ]
    },
    {
      title: 'Practice & Review',
      items: [
        { id: 'top-questions', title: categories['top-questions']?.title || 'Top Questions', icon: 'fas fa-star', count: categories['top-questions']?.questions?.length || 0 },
        { id: 'testing', title: categories['testing']?.title || 'Testing', icon: 'fas fa-vial', count: categories['testing']?.questions?.length || 0 }
      ]
    }
  ];
}

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

function useQuestionData() {
  const [questions, setQuestions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loader = new QuestionDataLoader();
    
    loader.loadAllQuestions()
      .then(loadedData => {
        const organized = loader.organizeQuestions(loadedData);
        setQuestions(organized);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading questions:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { questions, loading, error };
}

// Components
function LoadingScreen() {
  return React.createElement('div', { className: 'loading-screen' },
    React.createElement('div', { className: 'loading-spinner' }),
    React.createElement('div', { className: 'loading-text' },
      React.createElement('h3', {}, 'Loading Interview Questions'),
      React.createElement('p', {}, 'Fetching questions from your data files...')
    )
  );
}

function Header({ currentPage, onNavigate, theme, toggleTheme, questionStats }) {
  const totalQuestions = Object.values(questionStats).reduce((sum, count) => sum + count, 0);
  
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
        React.createElement('div', { className: 'nav-stats' },
          React.createElement('span', { className: 'stats-badge' },
            React.createElement('i', { className: 'fas fa-question-circle' }),
            React.createElement('span', {}, `${totalQuestions} Questions`)
          )
        )
      ),
      
      React.createElement('div', { className: 'header-actions' },
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

function Sidebar({ currentPage, onNavigate, navigation }) {
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
                  React.createElement('span', { className: 'question-count' }, item.count || 0)
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
        question.category && React.createElement('div', { className: 'category-badge' }, question.category),
        answered && React.createElement('div', { className: 'answered-badge' },
          React.createElement('i', { className: 'fas fa-check' }),
          React.createElement('span', {}, 'Answered')
        )
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
        React.createElement('h4', {}, 'Your Answer:'),
        React.createElement('textarea', {
          className: 'user-answer-input',
          placeholder: 'Type your answer here to practice...',
          value: userAnswer,
          onChange: (e) => setUserAnswer(e.target.value),
          rows: 4
        }),
        React.createElement('button', {
          className: 'mark-answered-btn' + (answered ? ' answered' : ''),
          onClick: () => setAnswered(!answered)
        },
          React.createElement('i', { className: answered ? 'fas fa-undo' : 'fas fa-check' }),
          React.createElement('span', {}, answered ? 'Mark as Unanswered' : 'Mark as Answered')
        )
      ),
      
      React.createElement('div', { className: 'content-card info' },
        React.createElement('h4', {}, 'Expert Answer:'),
        React.createElement('p', {
          dangerouslySetInnerHTML: {
            __html: question.answer?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || 'Answer not available'
          }
        })
      ),
      
      question.codeExample && React.createElement('div', { className: 'code-section' },
        React.createElement('h4', {}, 'Code Example:'),
        React.createElement('pre', {},
          React.createElement('code', { className: 'language-javascript' },
            question.codeExample.code || question.codeExample
          )
        )
      ),
      
      question.keyPoints && question.keyPoints.length > 0 && React.createElement('div', { className: 'key-points' },
        React.createElement('h4', {}, 'Key Points:'),
        React.createElement('ul', {},
          question.keyPoints.map((point, index) =>
            React.createElement('li', { key: index }, point)
          )
        )
      ),
      
      question.followUpQuestions && question.followUpQuestions.length > 0 && React.createElement('div', { className: 'follow-up' },
        React.createElement('h4', {}, 'Follow-up Questions:'),
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
    
    // Filter by difficulty
    if (filter !== 'all') {
      filtered = filtered.filter(q => q.difficulty?.toLowerCase() === filter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [questions, filter, searchTerm]);
  
  return React.createElement('main', { className: 'content fade-in' },
    React.createElement('div', { className: 'content-header' },
      React.createElement('h1', { className: 'page-title' }, category.title),
      React.createElement('p', { className: 'page-description' }, category.description),
      React.createElement('div', { className: 'category-stats' },
        React.createElement('span', { className: 'stat' },
          React.createElement('i', { className: 'fas fa-question' }),
          ` ${questions.length} Questions`
        )
      )
    ),
    
    React.createElement('div', { className: 'content-controls' },
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
          }, level.charAt(0).toUpperCase() + level.slice(1))
        )
      )
    ),
    
    React.createElement('div', { className: 'questions-grid' },
      filteredQuestions.length === 0 ?
        React.createElement('div', { className: 'no-questions' },
          React.createElement('i', { className: 'fas fa-search' }),
          React.createElement('p', {}, 'No questions found matching your criteria.')
        ) :
        filteredQuestions.map((question, index) =>
          React.createElement(QuestionCard, {
            key: question.id,
            question: question,
            questionIndex: index,
            expanded: expandedQuestions[question.id] || false,
            onToggle: () => onToggleQuestion(question.id)
          })
        )
    )
  );
}

function App() {
  const [currentPage, setCurrentPage] = useLocalStorage('wiki-current-page', 'react-fundamentals');
  const [expandedQuestions, setExpandedQuestions] = useLocalStorage('wiki-expanded-questions', {});
  const { questions, loading, error } = useQuestionData();
  const { theme, toggleTheme } = useTheme();
  
  const navigation = useMemo(() => buildNavigation(questions), [questions]);
  
  const questionStats = useMemo(() => {
    const stats = {};
    Object.entries(questions).forEach(([key, category]) => {
      stats[key] = category.questions?.length || 0;
    });
    return stats;
  }, [questions]);
  
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
      React.createElement('p', {}, error)
    );
  }
  
  const currentCategory = questions[currentPage] || Object.values(questions)[0];
  
  return React.createElement('div', { className: 'app' },
    React.createElement(Header, {
      currentPage: currentPage,
      onNavigate: handleNavigate,
      theme: theme,
      toggleTheme: toggleTheme,
      questionStats: questionStats
    }),
    React.createElement('div', { className: 'main-layout' },
      React.createElement(Sidebar, {
        currentPage: currentPage,
        onNavigate: handleNavigate,
        navigation: navigation
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
  module.exports = { App, QuestionDataLoader };
}