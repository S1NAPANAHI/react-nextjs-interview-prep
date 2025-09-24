// App.js - Main React Application Component (Browser-compatible)
// Using global React instead of imports for browser compatibility

const { useState, useEffect } = React;

// Progress management hook
const useProgress = () => {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('learning-progress');
      return saved ? JSON.parse(saved) : {
        completedLessons: [],
        completedChallenges: [],
        lessonProgress: {},
        overallProgress: 0
      };
    } catch {
      return {
        completedLessons: [],
        completedChallenges: [],
        lessonProgress: {},
        overallProgress: 0
      };
    }
  });

  const saveProgress = (newProgress) => {
    setProgress(newProgress);
    localStorage.setItem('learning-progress', JSON.stringify(newProgress));
  };

  const markLessonComplete = (lessonId) => {
    const newProgress = {
      ...progress,
      completedLessons: [...new Set([...progress.completedLessons, lessonId])]
    };
    
    // Calculate overall progress
    const totalLessons = getTotalLessons();
    newProgress.overallProgress = Math.round((newProgress.completedLessons.length / totalLessons) * 100);
    
    saveProgress(newProgress);
  };

  const markChallengeComplete = (challengeId, challengeData = {}) => {
    const newProgress = {
      ...progress,
      completedChallenges: [...new Set([...progress.completedChallenges, challengeId])]
    };
    
    saveProgress(newProgress);
  };

  const updateLessonProgress = (lessonId, progressPercent) => {
    const newProgress = {
      ...progress,
      lessonProgress: {
        ...progress.lessonProgress,
        [lessonId]: progressPercent
      }
    };
    
    saveProgress(newProgress);
  };

  const getTotalLessons = () => {
    let total = 0;
    if (window.contentStructure && window.contentStructure.weeks) {
      Object.values(window.contentStructure.weeks).forEach(week => {
        total += week.days.length;
      });
    }
    return total;
  };

  return {
    progress,
    markLessonComplete,
    markChallengeComplete,
    updateLessonProgress,
    getTotalLessons
  };
};

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('roadmap');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const {
    progress,
    markLessonComplete,
    markChallengeComplete,
    updateLessonProgress,
    getTotalLessons
  } = useProgress();

  // Apply theme on mount and when changed
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lesson');
  };

  const handleSelectChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setCurrentView('challenge');
  };

  const handleLessonComplete = (lessonId) => {
    markLessonComplete(lessonId);
    // Show success message
    if (window.showNotification) {
      window.showNotification('🎉 Lesson completed! Great job on your learning journey.');
    }
    // Return to roadmap after a delay
    setTimeout(() => {
      setCurrentView('roadmap');
    }, 2000);
  };

  const handleChallengeComplete = (challengeData) => {
    markChallengeComplete(challengeData.challengeId, challengeData);
    if (window.showNotification) {
      window.showNotification('🏆 Challenge completed! You\'re making excellent progress.');
    }
    setTimeout(() => {
      setCurrentView('roadmap');
    }, 2000);
  };

  const goBackToRoadmap = () => {
    setCurrentView('roadmap');
    setSelectedLesson(null);
    setSelectedChallenge(null);
  };

  return React.createElement('div', {
    className: 'app',
    'data-theme': theme
  }, 
    // Header
    React.createElement('header', { className: 'app-header' },
      React.createElement('div', { className: 'header-container' },
        React.createElement('div', { className: 'header-left' },
          React.createElement('h1', { className: 'app-title' }, '⚛️ React & Next.js Interview Prep'),
          currentView !== 'roadmap' && React.createElement('button', {
            className: 'back-btn',
            onClick: goBackToRoadmap
          }, '← Back to Roadmap')
        ),
        React.createElement('div', { className: 'header-right' },
          React.createElement('div', { className: 'progress-info' },
            React.createElement('span', { className: 'progress-label' }, 'Overall Progress'),
            React.createElement('div', { className: 'progress-bar-small' },
              React.createElement('div', {
                className: 'progress-fill',
                style: { width: `${progress.overallProgress}%` }
              })
            ),
            React.createElement('span', { className: 'progress-percent' }, `${progress.overallProgress}%`)
          ),
          React.createElement('button', {
            className: 'theme-toggle',
            onClick: toggleTheme,
            'aria-label': 'Toggle theme'
          }, theme === 'light' ? '🌙' : '☀️')
        )
      )
    ),
    
    // Main Content
    React.createElement('main', { className: 'app-main' },
      currentView === 'roadmap' && window.RoadmapNavigation && React.createElement(window.RoadmapNavigation, {
        contentStructure: window.contentStructure,
        onSelectLesson: handleSelectLesson,
        onSelectChallenge: handleSelectChallenge,
        progress: progress
      }),
      
      currentView === 'lesson' && selectedLesson && window.LessonViewer && React.createElement('div', { className: 'lesson-container' },
        React.createElement(window.LessonViewer, {
          lesson: selectedLesson,
          onComplete: handleLessonComplete,
          onProgress: updateLessonProgress,
          isCompleted: progress.completedLessons.includes(selectedLesson.id)
        })
      ),
      
      currentView === 'challenge' && selectedChallenge && window.ChallengePlayer && React.createElement('div', { className: 'challenge-container' },
        React.createElement(window.ChallengePlayer, {
          challenge: selectedChallenge,
          onComplete: handleChallengeComplete,
          isCompleted: progress.completedChallenges.includes(selectedChallenge.id)
        })
      )
    ),
    
    // Footer
    React.createElement('footer', { className: 'app-footer' },
      React.createElement('div', { className: 'footer-container' },
        React.createElement('div', { className: 'footer-stats' },
          React.createElement('div', { className: 'stat-item' },
            React.createElement('span', { className: 'stat-number' }, progress.completedLessons.length),
            React.createElement('span', { className: 'stat-label' }, 'Lessons Completed')
          ),
          React.createElement('div', { className: 'stat-item' },
            React.createElement('span', { className: 'stat-number' }, progress.completedChallenges.length),
            React.createElement('span', { className: 'stat-label' }, 'Challenges Solved')
          ),
          React.createElement('div', { className: 'stat-item' },
            React.createElement('span', { className: 'stat-number' }, getTotalLessons()),
            React.createElement('span', { className: 'stat-label' }, 'Total Lessons')
          )
        ),
        React.createElement('div', { className: 'footer-info' },
          React.createElement('p', {}, '🚀 Interactive React & Next.js Interview Preparation Platform'),
          React.createElement('p', {}, 'Build your skills with hands-on lessons, coding challenges, and real-world examples')
        )
      )
    )
  );
}

// Make App component globally available
window.App = App;