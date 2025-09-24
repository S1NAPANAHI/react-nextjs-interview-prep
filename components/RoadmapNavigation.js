// components/RoadmapNavigation.js
// Browser-compatible version using global React

const { useState } = React;

function RoadmapNavigation({ contentStructure, onSelectLesson, onSelectChallenge, progress }) {
  const [currentWeek, setCurrentWeek] = useState(1);

  if (!contentStructure || !contentStructure.weeks) {
    return React.createElement('div', { className: 'roadmap-nav' },
      React.createElement('div', { className: 'loading-state' },
        React.createElement('h2', {}, 'Loading Learning Roadmap...'),
        React.createElement('p', {}, 'Please wait while we prepare your learning journey.')
      )
    );
  }

  const weeks = Object.entries(contentStructure.weeks);
  const completedLessons = progress?.completedLessons || [];
  const completedChallenges = progress?.completedChallenges || [];

  const calculateWeekProgress = (weekData) => {
    const totalLessons = weekData.days.length;
    const completedInWeek = weekData.days.filter(day => 
      completedLessons.includes(day.id)
    ).length;
    return Math.round((completedInWeek / totalLessons) * 100);
  };

  return React.createElement('div', { className: 'roadmap-nav' },
    // Header
    React.createElement('div', { className: 'roadmap-header' },
      React.createElement('h1', {}, '🚀 React & Next.js Interview Prep Roadmap'),
      React.createElement('p', {}, 'Your structured learning journey to master React and Next.js interviews'),
      
      // Progress Summary
      React.createElement('div', { className: 'progress-summary' },
        React.createElement('div', { className: 'progress-stats' },
          React.createElement('div', { className: 'stat-card' },
            React.createElement('div', { className: 'stat-number' }, completedLessons.length),
            React.createElement('div', { className: 'stat-label' }, 'Lessons Complete')
          ),
          React.createElement('div', { className: 'stat-card' },
            React.createElement('div', { className: 'stat-number' }, completedChallenges.length),
            React.createElement('div', { className: 'stat-label' }, 'Challenges Solved')
          ),
          React.createElement('div', { className: 'stat-card' },
            React.createElement('div', { className: 'stat-number' }, `${progress?.overallProgress || 0}%`),
            React.createElement('div', { className: 'stat-label' }, 'Overall Progress')
          )
        )
      )
    ),
    
    // Week Navigation
    React.createElement('div', { className: 'week-tabs' },
      weeks.map(([weekNum, weekData]) => {
        const weekProgress = calculateWeekProgress(weekData);
        const isActive = currentWeek === parseInt(weekNum);
        
        return React.createElement('button', {
          key: weekNum,
          className: `week-tab ${isActive ? 'active' : ''} ${weekProgress === 100 ? 'completed' : ''}`,
          onClick: () => setCurrentWeek(parseInt(weekNum))
        },
          React.createElement('div', { className: 'week-tab-header' },
            React.createElement('span', { className: 'week-number' }, `Week ${weekNum}`),
            weekProgress === 100 && React.createElement('span', { className: 'completion-icon' }, '✅')
          ),
          React.createElement('div', { className: 'week-tab-title' }, weekData.title),
          React.createElement('div', { className: 'week-progress-bar' },
            React.createElement('div', {
              className: 'week-progress-fill',
              style: { width: `${weekProgress}%` }
            })
          ),
          React.createElement('div', { className: 'week-progress-text' }, `${weekProgress}%`)
        );
      })
    ),
    
    // Current Week Content
    React.createElement('div', { className: 'roadmap-timeline' },
      weeks
        .filter(([weekNum]) => parseInt(weekNum) === currentWeek)
        .map(([weekNum, weekData]) =>
          React.createElement('div', { key: weekNum, className: 'week-section' },
            React.createElement('div', { className: 'week-header' },
              React.createElement('h2', {}, `Week ${weekNum}: ${weekData.title}`),
              React.createElement('p', { className: 'week-description' }, weekData.description)
            ),
            
            React.createElement('div', { className: 'days-grid' },
              weekData.days.map((day, dayIndex) => {
                const isCompleted = completedLessons.includes(day.id);
                const hasQuiz = day.quizzes && day.quizzes.length > 0;
                const hasChecklist = day.checklist && day.checklist.length > 0;
                const hasChallenges = day.challenges && day.challenges.length > 0;
                
                return React.createElement('div', {
                  key: day.id,
                  className: `day-card ${isCompleted ? 'completed' : ''}`
                },
                  React.createElement('div', { className: 'day-header' },
                    React.createElement('div', { className: 'day-number' }, `Day ${dayIndex + 1}`),
                    React.createElement('h3', { className: 'day-title' }, day.title),
                    isCompleted && React.createElement('span', { className: 'completed-badge' }, '✅')
                  ),
                  
                  React.createElement('div', { className: 'day-content' },
                    React.createElement('p', { className: 'day-summary' }, 
                      day.theory ? `${day.theory.slice(0, 120)}...` : 'Interactive lesson content'
                    ),
                    
                    React.createElement('div', { className: 'day-stats' },
                      day.codeExamples && React.createElement('span', { className: 'stat-item' }, 
                        `💻 ${day.codeExamples.length} examples`
                      ),
                      hasQuiz && React.createElement('span', { className: 'stat-item' }, 
                        `❓ ${day.quizzes.length} quizzes`
                      ),
                      hasChecklist && React.createElement('span', { className: 'stat-item' }, 
                        `✅ ${day.checklist.length} tasks`
                      )
                    )
                  ),
                  
                  React.createElement('div', { className: 'day-actions' },
                    React.createElement('button', {
                      className: `start-lesson-btn primary-btn ${isCompleted ? 'completed-btn' : ''}`,
                      onClick: () => onSelectLesson && onSelectLesson(day)
                    }, 
                      isCompleted ? '📖 Review Lesson' : '📚 Start Lesson'
                    ),
                    
                    hasChallenges && day.challenges.map(challenge => {
                      const challengeCompleted = completedChallenges.includes(challenge.id);
                      return React.createElement('button', {
                        key: challenge.id,
                        className: `challenge-btn secondary-btn ${challengeCompleted ? 'completed-btn' : ''}`,
                        onClick: () => onSelectChallenge && onSelectChallenge(challenge)
                      }, 
                        challengeCompleted ? '🏆 Review Challenge' : '🔥 ' + challenge.title
                      );
                    })
                  )
                );
              })
            )
          )
        )
    )
  );
}

// Make component globally available
window.RoadmapNavigation = RoadmapNavigation;

// Add CSS styles
if (typeof document !== 'undefined' && !document.getElementById('roadmap-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'roadmap-styles';
  styleSheet.textContent = `
    .roadmap-nav {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .roadmap-header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      color: white;
    }
    
    .roadmap-header h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    
    .roadmap-header p {
      font-size: 1.125rem;
      opacity: 0.95;
      margin-bottom: 2rem;
    }
    
    .progress-summary {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.5rem;
    }
    
    .progress-stats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }
    
    .stat-card {
      text-align: center;
    }
    
    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .stat-label {
      font-size: 0.875rem;
      text-transform: uppercase;
      font-weight: 500;
      opacity: 0.9;
    }
    
    .week-tabs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 3rem;
    }
    
    .week-tab {
      background: var(--surface, #f8fafc);
      border: 2px solid var(--border, #e2e8f0);
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }
    
    .week-tab:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }
    
    .week-tab.active {
      border-color: #3b82f6;
      background: #3b82f6;
      color: white;
    }
    
    .week-section {
      margin-bottom: 3rem;
    }
    
    .week-header h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #3b82f6;
    }
    
    .days-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    
    .day-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .day-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
    
    .day-card.completed {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.05);
    }
    
    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    
    .day-number {
      background: #3b82f6;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .day-title {
      flex: 1;
      margin: 0 1rem;
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .day-summary {
      color: #64748b;
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    
    .day-stats {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    
    .stat-item {
      font-size: 0.875rem;
      color: #64748b;
      background: rgba(0, 0, 0, 0.05);
      padding: 0.25rem 0.75rem;
      border-radius: 16px;
    }
    
    .day-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    
    .primary-btn, .secondary-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }
    
    .primary-btn {
      background: #3b82f6;
      color: white;
    }
    
    .primary-btn:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
    
    .secondary-btn {
      background: #64748b;
      color: white;
    }
    
    .secondary-btn:hover {
      background: #475569;
    }
    
    .completed-btn {
      background: #10b981 !important;
    }
    
    .loading-state {
      text-align: center;
      padding: 3rem;
      color: #64748b;
    }
    
    @media (max-width: 768px) {
      .roadmap-nav {
        padding: 1rem;
      }
      
      .roadmap-header h1 {
        font-size: 2rem;
      }
      
      .week-tabs {
        grid-template-columns: 1fr;
      }
      
      .days-grid {
        grid-template-columns: 1fr;
      }
      
      .day-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}