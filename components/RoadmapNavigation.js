// components/RoadmapNavigation.js
import React from 'react';

export default function RoadmapNavigation({ contentStructure, onSelectLesson, onSelectChallenge }) {
  if (!contentStructure || !contentStructure.weeks) {
    return (
      <div className="roadmap-nav">
        <div className="loading-state">
          <h3>Loading roadmap...</h3>
          <p>Preparing your learning journey</p>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-nav">
      <div className="roadmap-header">
        <h1>🚀 React & Next.js Interview Prep Roadmap</h1>
        <p>Your structured 4-week journey to master React and Next.js interviews</p>
      </div>
      
      <div className="roadmap-timeline">
        {Object.entries(contentStructure.weeks).map(([weekNum, weekData]) => (
          <div key={weekNum} className="week-section">
            <div className="week-header">
              <div className="week-number">Week {weekNum}</div>
              <h3 className="week-title">{weekData.title}</h3>
              <p className="week-description">{weekData.description || `Master ${weekData.title} in week ${weekNum}`}</p>
            </div>
            
            <div className="days-grid">
              {weekData.days.map((day, dayIndex) => (
                <div key={day.id} className="day-card">
                  <div className="day-header">
                    <div className="day-number">Day {dayIndex + 1}</div>
                    <h4 className="day-title">{day.title}</h4>
                  </div>
                  
                  <div className="day-content">
                    {day.theory && (
                      <p className="day-summary">{day.theory.slice(0, 100)}...</p>
                    )}
                    
                    <div className="day-stats">
                      {day.codeExamples && (
                        <span className="stat-item">
                          💻 {day.codeExamples.length} examples
                        </span>
                      )}
                      {day.quizzes && (
                        <span className="stat-item">
                          ❓ {day.quizzes.length} quizzes
                        </span>
                      )}
                      {day.checklist && (
                        <span className="stat-item">
                          ✅ {day.checklist.length} tasks
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="day-actions">
                    <button 
                      className="start-lesson-btn primary-btn"
                      onClick={() => onSelectLesson(day)}
                    >
                      📚 Start Lesson
                    </button>
                    
                    {day.challenges && day.challenges.map(challenge => (
                      <button 
                        key={challenge.id}
                        className="challenge-btn secondary-btn"
                        onClick={() => onSelectChallenge(challenge)}
                      >
                        🔥 {challenge.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="roadmap-footer">
        <div className="progress-summary">
          <h3>📊 Your Progress</h3>
          <div className="progress-stats">
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Lessons Complete</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0</div>
              <div className="stat-label">Challenges Solved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">0%</div>
              <div className="stat-label">Overall Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS styles for the roadmap component
const roadmapStyles = `
.roadmap-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.roadmap-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.roadmap-header h1 {
  margin: 0 0 16px 0;
  font-size: 2.5em;
  font-weight: 700;
}

.roadmap-header p {
  margin: 0;
  font-size: 1.2em;
  opacity: 0.9;
}

.week-section {
  margin-bottom: 60px;
}

.week-header {
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 5px solid #3b82f6;
}

.week-number {
  display: inline-block;
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
  margin-bottom: 8px;
}

.week-title {
  margin: 8px 0 4px 0;
  font-size: 1.8em;
  color: #1e293b;
}

.week-description {
  margin: 0;
  color: #64748b;
  font-size: 1.1em;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.day-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.day-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.day-header {
  margin-bottom: 16px;
}

.day-number {
  display: inline-block;
  background: #10b981;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 600;
  margin-bottom: 8px;
}

.day-title {
  margin: 8px 0 0 0;
  font-size: 1.3em;
  color: #1e293b;
  line-height: 1.3;
}

.day-content {
  margin-bottom: 20px;
}

.day-summary {
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12px;
}

.day-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-item {
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85em;
  color: #475569;
}

.day-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.primary-btn, .secondary-btn {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  text-align: left;
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
  background: #f59e0b;
  color: white;
  font-size: 0.9em;
}

.secondary-btn:hover {
  background: #d97706;
  transform: translateY(-1px);
}

.roadmap-footer {
  margin-top: 60px;
  padding: 32px;
  background: #f8fafc;
  border-radius: 12px;
  text-align: center;
}

.progress-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  min-width: 120px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2em;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 4px;
}

.stat-label {
  color: #64748b;
  font-size: 0.9em;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
}

@media (max-width: 768px) {
  .days-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-stats {
    flex-direction: column;
    align-items: center;
  }
  
  .roadmap-header h1 {
    font-size: 2em;
  }
}
`;

// Inject styles if not already present
if (typeof window !== 'undefined' && !document.getElementById('roadmap-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'roadmap-styles';
  styleSheet.textContent = roadmapStyles;
  document.head.appendChild(styleSheet);
}