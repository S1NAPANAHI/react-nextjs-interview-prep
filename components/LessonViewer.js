import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';
import Quiz from './Quiz';
import Checklist from './Checklist';

const LessonViewer = ({ lesson, onProgress }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [completedSections, setCompletedSections] = useState(new Set());
  const [showSolution, setShowSolution] = useState(false);

  const tabs = [
    { id: 'content', label: 'Lesson', icon: '📚' },
    { id: 'code', label: 'Code Examples', icon: '💻' },
    { id: 'quiz', label: 'Quiz', icon: '❓' },
    { id: 'checklist', label: 'Checklist', icon: '✅' }
  ];

  const markSectionComplete = (section) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(section);
    setCompletedSections(newCompleted);
    
    if (onProgress) {
      const progressPercent = (newCompleted.size / 4) * 100;
      onProgress(lesson.id, progressPercent);
    }
  };

  const renderMarkdownContent = (content) => {
    // Simple markdown to HTML conversion (in production, use a proper markdown parser)
    return content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```jsx([\s\S]*?)```/g, '<pre class="code-block language-jsx"><code>$1</code></pre>')
      .replace(/```javascript([\s\S]*?)```/g, '<pre class="code-block language-js"><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
      .replace(/\n/g, '<br>');
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'content':
        return (
          <div className="lesson-content">
            <div className="lesson-header">
              <div className="lesson-meta">
                <span className="week-day">Week {lesson.week}, Day {lesson.day}</span>
                <span className="difficulty badge badge-{lesson.difficulty}">
                  {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                </span>
                <span className="duration">{lesson.duration} min</span>
              </div>
              <h1>{lesson.title}</h1>
            </div>
            
            <div 
              className="content-body"
              dangerouslySetInnerHTML={{
                __html: renderMarkdownContent(lesson.content)
              }}
            />
            
            <div className="lesson-actions">
              <button 
                className="btn btn-primary"
                onClick={() => markSectionComplete('content')}
                disabled={completedSections.has('content')}
              >
                {completedSections.has('content') ? '✅ Completed' : 'Mark as Complete'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveTab('code')}
              >
                View Code Examples →
              </button>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="code-examples">
            <h2>Interactive Code Examples</h2>
            {lesson.codeExamples?.map((example, index) => (
              <div key={index} className="code-example-card">
                <h3>{example.label}</h3>
                <CodeEditor 
                  initialCode={example.code}
                  language={example.language || 'jsx'}
                  readOnly={false}
                  showRunButton={true}
                />
              </div>
            )) || <p>No code examples available for this lesson.</p>}
            
            <div className="section-actions">
              <button 
                className="btn btn-primary"
                onClick={() => markSectionComplete('code')}
                disabled={completedSections.has('code')}
              >
                {completedSections.has('code') ? '✅ Completed' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="quiz-section">
            <h2>Knowledge Check</h2>
            {lesson.quiz && lesson.quiz.length > 0 ? (
              <Quiz 
                questions={lesson.quiz}
                onComplete={() => markSectionComplete('quiz')}
                completed={completedSections.has('quiz')}
              />
            ) : (
              <p>No quiz available for this lesson.</p>
            )}
          </div>
        );

      case 'checklist':
        return (
          <div className="checklist-section">
            <h2>Learning Objectives</h2>
            {lesson.checklistItems ? (
              <Checklist 
                items={lesson.checklistItems.map((item, index) => ({
                  id: `${lesson.id}-item-${index}`,
                  text: item,
                  completed: completedSections.has(`checklist-${index}`)
                }))}
                onToggle={(itemId, completed) => {
                  const sectionId = `checklist-${itemId.split('-').pop()}`;
                  if (completed) {
                    markSectionComplete(sectionId);
                  } else {
                    const newCompleted = new Set(completedSections);
                    newCompleted.delete(sectionId);
                    setCompletedSections(newCompleted);
                  }
                }}
                onAllComplete={() => markSectionComplete('checklist')}
              />
            ) : (
              <p>No checklist available for this lesson.</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="lesson-viewer">
      <div className="lesson-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${
              completedSections.has(tab.id) ? 'completed' : ''
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {completedSections.has(tab.id) && (
              <span className="completion-badge">✓</span>
            )}
          </button>
        ))}
      </div>

      <div className="lesson-progress-bar">
        <div 
          className="progress-fill"
          style={{
            width: `${(completedSections.size / 4) * 100}%`
          }}
        />
        <span className="progress-text">
          {completedSections.size} of 4 sections completed
        </span>
      </div>

      <div className="tab-content">
        <TabContent />
      </div>

      <style jsx>{`
        .lesson-viewer {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .lesson-tabs {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.2s;
          position: relative;
        }

        .tab-button:hover {
          background: #e9ecef;
          color: #495057;
        }

        .tab-button.active {
          background: white;
          color: #007bff;
          border-bottom: 3px solid #007bff;
        }

        .tab-button.completed {
          background: #d4edda;
          color: #155724;
        }

        .completion-badge {
          position: absolute;
          top: 4px;
          right: 8px;
          background: #28a745;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lesson-progress-bar {
          position: relative;
          height: 4px;
          background: #e9ecef;
          margin-bottom: 24px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #007bff, #28a745);
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          top: 8px;
          right: 16px;
          font-size: 12px;
          color: #6c757d;
        }

        .tab-content {
          padding: 24px;
        }

        .lesson-header {
          margin-bottom: 32px;
        }

        .lesson-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .week-day {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-beginner {
          background: #d4edda;
          color: #155724;
        }

        .badge-intermediate {
          background: #fff3cd;
          color: #856404;
        }

        .badge-advanced {
          background: #f8d7da;
          color: #721c24;
        }

        .duration {
          background: #f8f9fa;
          color: #495057;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
        }

        .content-body {
          line-height: 1.7;
          font-size: 16px;
          color: #333;
        }

        .content-body h1 {
          color: #1a1a1a;
          margin: 32px 0 16px;
          font-size: 28px;
        }

        .content-body h2 {
          color: #2c2c2c;
          margin: 24px 0 12px;
          font-size: 22px;
        }

        .content-body h3 {
          color: #3c3c3c;
          margin: 20px 0 8px;
          font-size: 18px;
        }

        .content-body code {
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          color: #e83e8c;
        }

        .content-body .code-block {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          overflow-x: auto;
        }

        .content-body .code-block code {
          background: none;
          padding: 0;
          color: #333;
        }

        .lesson-actions,
        .section-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e9ecef;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #545b62;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .code-example-card {
          margin-bottom: 32px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
        }

        .code-example-card h3 {
          margin: 0;
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          font-size: 16px;
          color: #495057;
        }
      `}</style>
    </div>
  );
};

export default LessonViewer;