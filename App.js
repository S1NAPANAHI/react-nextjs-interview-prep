// App.js - Main React Application Component
import React, { useState, useEffect } from 'react';
import LessonViewer from './components/LessonViewer';
import ChallengePlayer from './components/ChallengePlayer';
import RoadmapNavigation from './components/RoadmapNavigation';
import { contentStructure } from './data/content-structure';

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
    Object.values(contentStructure.weeks).forEach(week => {
      total += week.days.length;
    });
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
    showNotification('🎉 Lesson completed! Great job on your learning journey.');
    // Return to roadmap after a delay
    setTimeout(() => {
      setCurrentView('roadmap');
    }, 2000);
  };

  const handleChallengeComplete = (challengeData) => {
    markChallengeComplete(challengeData.challengeId, challengeData);
    showNotification('🏆 Challenge completed! You\'re making excellent progress.');
    setTimeout(() => {
      setCurrentView('roadmap');
    }, 2000);
  };

  const showNotification = (message) => {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  const goBackToRoadmap = () => {
    setCurrentView('roadmap');
    setSelectedLesson(null);
    setSelectedChallenge(null);
  };

  return (
    <div className="app" data-theme={theme}>
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-left">
            <h1 className="app-title">
              ⚛️ React & Next.js Interview Prep
            </h1>
            {currentView !== 'roadmap' && (
              <button 
                className="back-btn"
                onClick={goBackToRoadmap}
              >
                ← Back to Roadmap
              </button>
            )}
          </div>
          
          <div className="header-right">
            <div className="progress-info">
              <span className="progress-label">Overall Progress</span>
              <div className="progress-bar-small">
                <div 
                  className="progress-fill"
                  style={{width: `${progress.overallProgress}%`}}
                />
              </div>
              <span className="progress-percent">{progress.overallProgress}%</span>
            </div>
            
            <button 
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {currentView === 'roadmap' && (
          <RoadmapNavigation
            contentStructure={contentStructure}
            onSelectLesson={handleSelectLesson}
            onSelectChallenge={handleSelectChallenge}
            progress={progress}
          />
        )}
        
        {currentView === 'lesson' && selectedLesson && (
          <div className="lesson-container">
            <LessonViewer
              lesson={selectedLesson}
              onComplete={handleLessonComplete}
              onProgress={updateLessonProgress}
              isCompleted={progress.completedLessons.includes(selectedLesson.id)}
            />
          </div>
        )}
        
        {currentView === 'challenge' && selectedChallenge && (
          <div className="challenge-container">
            <ChallengePlayer
              challenge={selectedChallenge}
              onComplete={handleChallengeComplete}
              isCompleted={progress.completedChallenges.includes(selectedChallenge.id)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-stats">
            <div className="stat-item">
              <span className="stat-number">{progress.completedLessons.length}</span>
              <span className="stat-label">Lessons Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{progress.completedChallenges.length}</span>
              <span className="stat-label">Challenges Solved</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{getTotalLessons()}</span>
              <span className="stat-label">Total Lessons</span>
            </div>
          </div>
          
          <div className="footer-info">
            <p>🚀 Interactive React & Next.js Interview Preparation Platform</p>
            <p>Build your skills with hands-on lessons, coding challenges, and real-world examples</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        /* Global Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary-color: #3b82f6;
          --primary-hover: #2563eb;
          --secondary-color: #64748b;
          --success-color: #10b981;
          --warning-color: #f59e0b;
          --error-color: #ef4444;
          --background: #ffffff;
          --surface: #f8fafc;
          --text-primary: #1e293b;
          --text-secondary: #64748b;
          --border: #e2e8f0;
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          --radius: 8px;
          --transition: all 0.2s ease;
        }

        [data-theme="dark"] {
          --primary-color: #60a5fa;
          --primary-hover: #3b82f6;
          --background: #0f172a;
          --surface: #1e293b;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --border: #334155;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: var(--background);
          color: var(--text-primary);
          line-height: 1.6;
          transition: var(--transition);
        }

        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header Styles */
        .app-header {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .app-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin: 0;
        }

        .back-btn {
          background: var(--secondary-color);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--radius);
          cursor: pointer;
          transition: var(--transition);
          font-weight: 500;
        }

        .back-btn:hover {
          background: #475569;
          transform: translateX(-2px);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .progress-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .progress-label {
          color: var(--text-secondary);
        }

        .progress-bar-small {
          width: 100px;
          height: 6px;
          background: var(--border);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), var(--success-color));
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .progress-percent {
          font-weight: 600;
          color: var(--primary-color);
          min-width: 35px;
        }

        .theme-toggle {
          background: none;
          border: 1px solid var(--border);
          padding: 0.5rem;
          border-radius: var(--radius);
          cursor: pointer;
          font-size: 1.25rem;
          transition: var(--transition);
        }

        .theme-toggle:hover {
          background: var(--surface);
          transform: scale(1.1);
        }

        /* Main Content */
        .app-main {
          flex: 1;
          padding: 2rem 0;
          background: var(--background);
        }

        .lesson-container,
        .challenge-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Footer */
        .app-footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 2rem 0;
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          text-align: center;
        }

        .footer-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 500;
        }

        .footer-info {
          color: var(--text-secondary);
        }

        .footer-info p {
          margin: 0.25rem 0;
        }

        .footer-info p:first-child {
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Notification Styles */
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--success-color);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          transform: translateX(400px);
          transition: transform 0.3s ease;
          z-index: 1000;
          max-width: 400px;
        }

        .notification.show {
          transform: translateX(0);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            text-align: center;
          }

          .header-left {
            flex-direction: column;
            gap: 1rem;
          }

          .app-title {
            font-size: 1.25rem;
          }

          .footer-stats {
            gap: 1.5rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .progress-info {
            flex-direction: column;
            gap: 0.25rem;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .app-main {
            padding: 1rem 0;
          }

          .footer-stats {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;