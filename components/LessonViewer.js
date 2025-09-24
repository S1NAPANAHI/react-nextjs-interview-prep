import React, { useState, useEffect } from 'react';

const LessonViewer = ({ lesson, onComplete, onProgress, isCompleted }) => {
  const [activeTab, setActiveTab] = useState('theory');
  const [completedSections, setCompletedSections] = useState(new Set());
  const [quizAnswers, setQuizAnswers] = useState({});
  const [checklistProgress, setChecklistProgress] = useState({});
  const [showCodeSolution, setShowCodeSolution] = useState({});

  const tabs = [
    { id: 'theory', label: 'Theory', icon: '📖' },
    { id: 'practice', label: 'Code Examples', icon: '💻' },
    { id: 'quiz', label: 'Quiz', icon: '❓' },
    { id: 'checklist', label: 'Checklist', icon: '✅' }
  ];

  useEffect(() => {
    // Load saved progress for this lesson
    const savedProgress = localStorage.getItem(`lesson-progress-${lesson.id}`);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setCompletedSections(new Set(parsed.completedSections || []));
        setQuizAnswers(parsed.quizAnswers || {});
        setChecklistProgress(parsed.checklistProgress || {});
      } catch (e) {
        console.error('Error loading lesson progress:', e);
      }
    }
  }, [lesson.id]);

  const saveProgress = () => {
    const progressData = {
      completedSections: Array.from(completedSections),
      quizAnswers,
      checklistProgress
    };
    localStorage.setItem(`lesson-progress-${lesson.id}`, JSON.stringify(progressData));
    
    if (onProgress) {
      const progressPercent = (completedSections.size / 4) * 100;
      onProgress(lesson.id, progressPercent);
    }
  };

  const markSectionComplete = (section) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(section);
    setCompletedSections(newCompleted);
    
    // Save progress immediately
    setTimeout(saveProgress, 100);
  };

  const renderMarkdownContent = (content) => {
    if (!content) return '';
    
    return content
      .replace(/^# (.*$)/gm, '<h1 class="content-h1">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="content-h2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="content-h3">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="inline-code">$1</code>')
      .replace(/```jsx([\s\S]*?)```/g, '<pre class="code-block language-jsx"><code>$1</code></pre>')
      .replace(/```javascript([\s\S]*?)```/g, '<pre class="code-block language-js"><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/g, '<pre class="code-block"><code>$1</code></pre>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^(.+)$/, '<p>$1</p>');
  };

  const handleQuizAnswer = (questionIndex, selectedOption) => {
    const newAnswers = { ...quizAnswers };
    newAnswers[questionIndex] = selectedOption;
    setQuizAnswers(newAnswers);
    
    // Check if all questions are answered
    const totalQuestions = lesson.quizzes?.length || 0;
    const answeredQuestions = Object.keys(newAnswers).length;
    
    if (answeredQuestions === totalQuestions) {
      markSectionComplete('quiz');
    }
  };

  const handleChecklistToggle = (index, completed) => {
    const newProgress = { ...checklistProgress };
    newProgress[index] = completed;
    setChecklistProgress(newProgress);
    
    // Check if all items are completed
    const totalItems = lesson.checklist?.length || 0;
    const completedItems = Object.values(newProgress).filter(Boolean).length;
    
    if (completedItems === totalItems) {
      markSectionComplete('checklist');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show temporary feedback
      const event = new CustomEvent('showNotification', {
        detail: { message: '📋 Code copied to clipboard!' }
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCompleteLesson = () => {
    if (onComplete) {
      onComplete(lesson.id);
    }
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'theory':
        return (
          <div className="lesson-content">
            <div className="lesson-header">
              <div className="lesson-meta">
                <span className="difficulty-badge difficulty-{lesson.difficulty || 'beginner'}">
                  {(lesson.difficulty || 'beginner').charAt(0).toUpperCase() + (lesson.difficulty || 'beginner').slice(1)}
                </span>
                {lesson.duration && (
                  <span className="duration-badge">
                    🕒 {lesson.duration} min
                  </span>
                )}
              </div>
              <h1>{lesson.title}</h1>
              {lesson.theory && (
                <p className="lesson-description">{lesson.theory.slice(0, 200)}...</p>
              )}
            </div>
            
            <div 
              className="content-body"
              dangerouslySetInnerHTML={{
                __html: renderMarkdownContent(lesson.theory || 'No theory content available for this lesson.')
              }}
            />
            
            <div className="section-actions">
              <button 
                className={`btn ${completedSections.has('theory') ? 'btn-success' : 'btn-primary'}`}
                onClick={() => markSectionComplete('theory')}
                disabled={completedSections.has('theory')}
              >
                {completedSections.has('theory') ? '✅ Theory Complete' : 'Mark Theory Complete'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveTab('practice')}
              >
                View Code Examples →
              </button>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="code-examples">
            <h2>💻 Interactive Code Examples</h2>
            <p className="section-description">Study these code examples and experiment with the concepts.</p>
            
            {lesson.codeExamples && lesson.codeExamples.length > 0 ? (
              lesson.codeExamples.map((example, index) => (
                <div key={index} className="code-example-card">
                  <div className="code-example-header">
                    <h3>{example.label}</h3>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={() => copyToClipboard(example.code)}
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="code-editor-wrapper">
                    <pre className={`code-block language-${example.lang || 'jsx'}`}>
                      <code>{example.code}</code>
                    </pre>
                  </div>
                  
                  {example.explanation && (
                    <div className="code-explanation">
                      <p>{example.explanation}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>📝 No code examples available for this lesson yet.</p>
                <p>Check back later as we continue to add more interactive content!</p>
              </div>
            )}
            
            <div className="section-actions">
              <button 
                className={`btn ${completedSections.has('practice') ? 'btn-success' : 'btn-primary'}`}
                onClick={() => markSectionComplete('practice')}
                disabled={completedSections.has('practice')}
              >
                {completedSections.has('practice') ? '✅ Practice Complete' : 'Mark Practice Complete'}
              </button>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="quiz-section">
            <h2>❓ Knowledge Check</h2>
            <p className="section-description">Test your understanding with these questions.</p>
            
            {lesson.quizzes && lesson.quizzes.length > 0 ? (
              <div className="quiz-questions">
                {lesson.quizzes.map((quiz, index) => (
                  <div key={index} className="quiz-question">
                    <h3>Question {index + 1}</h3>
                    <p className="question-text">{quiz.question}</p>
                    
                    {quiz.options ? (
                      <div className="quiz-options">
                        {quiz.options.map((option, optionIndex) => {
                          const isSelected = quizAnswers[index] === optionIndex;
                          const isCorrect = quiz.correct === optionIndex;
                          const hasAnswered = index in quizAnswers;
                          
                          return (
                            <label 
                              key={optionIndex} 
                              className={`quiz-option ${
                                hasAnswered 
                                  ? isCorrect 
                                    ? 'correct' 
                                    : isSelected 
                                    ? 'incorrect' 
                                    : ''
                                  : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${index}`}
                                value={optionIndex}
                                checked={isSelected}
                                onChange={() => handleQuizAnswer(index, optionIndex)}
                                disabled={hasAnswered}
                              />
                              <span className="option-text">{option}</span>
                              {hasAnswered && isCorrect && <span className="correct-icon">✅</span>}
                              {hasAnswered && !isCorrect && isSelected && <span className="incorrect-icon">❌</span>}
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="answer-reveal">
                        <button 
                          className="btn btn-outline"
                          onClick={() => handleQuizAnswer(index, 'revealed')}
                        >
                          Show Answer
                        </button>
                        {quizAnswers[index] === 'revealed' && (
                          <div className="revealed-answer">
                            <p><strong>Answer:</strong> {quiz.answer}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {quiz.explanation && index in quizAnswers && (
                      <div className="quiz-explanation">
                        <p><strong>Explanation:</strong> {quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>🤔 No quiz questions available for this lesson yet.</p>
                <p>Practice the concepts from the theory and code examples!</p>
              </div>
            )}
            
            {lesson.quizzes && lesson.quizzes.length > 0 && (
              <div className="quiz-progress">
                <p>
                  Progress: {Object.keys(quizAnswers).length} / {lesson.quizzes.length} questions answered
                  {completedSections.has('quiz') && ' ✅'}
                </p>
              </div>
            )}
          </div>
        );

      case 'checklist':
        return (
          <div className="checklist-section">
            <h2>✅ Learning Objectives</h2>
            <p className="section-description">Track your progress through these learning goals.</p>
            
            {lesson.checklist && lesson.checklist.length > 0 ? (
              <div className="checklist">
                {lesson.checklist.map((item, index) => {
                  const isCompleted = checklistProgress[index] || false;
                  
                  return (
                    <label key={index} className={`checklist-item ${isCompleted ? 'completed' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={(e) => handleChecklistToggle(index, e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      <span className="checklist-text">{item}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <p>📋 No checklist items available for this lesson yet.</p>
                <p>Focus on understanding the theory and practicing with the code examples!</p>
              </div>
            )}
            
            {lesson.checklist && lesson.checklist.length > 0 && (
              <div className="checklist-progress">
                <p>
                  Progress: {Object.values(checklistProgress).filter(Boolean).length} / {lesson.checklist.length} items completed
                  {completedSections.has('checklist') && ' ✅'}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  const progressPercentage = (completedSections.size / 4) * 100;
  const allSectionsComplete = completedSections.size === 4;

  return (
    <div className="lesson-viewer">
      {/* Lesson Tabs */}
      <div className="lesson-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${
              activeTab === tab.id ? 'active' : ''
            } ${
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

      {/* Progress Bar */}
      <div className="lesson-progress-bar">
        <div 
          className="progress-fill"
          style={{
            width: `${progressPercentage}%`
          }}
        />
        <div className="progress-info">
          <span className="progress-text">
            {completedSections.size} of 4 sections completed ({Math.round(progressPercentage)}%)
          </span>
          {isCompleted && <span className="completed-badge">🎉 Lesson Completed!</span>}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <TabContent />
      </div>

      {/* Lesson Completion */}
      {allSectionsComplete && !isCompleted && (
        <div className="lesson-completion">
          <div className="completion-banner">
            <h3>🎉 Great job! You've completed all sections.</h3>
            <p>Mark this lesson as complete to track your progress.</p>
            <button 
              className="btn btn-success btn-large"
              onClick={handleCompleteLesson}
            >
              ✅ Complete Lesson
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .lesson-viewer {
          max-width: 1000px;
          margin: 0 auto;
          background: var(--surface, #ffffff);
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 2rem;
        }

        .lesson-tabs {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          overflow-x: auto;
        }

        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          color: #6c757d;
          transition: all 0.2s;
          position: relative;
          min-width: 120px;
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

        .tab-button.completed.active {
          background: white;
          border-bottom-color: #28a745;
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
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #007bff, #28a745);
          transition: width 0.3s ease;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .progress-text {
          font-size: 14px;
          color: #6c757d;
        }

        .completed-badge {
          font-size: 14px;
          color: #28a745;
          font-weight: 600;
        }

        .tab-content {
          padding: 24px;
          min-height: 400px;
        }

        .lesson-header {
          margin-bottom: 32px;
        }

        .lesson-meta {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .difficulty-badge, 
        .duration-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .difficulty-beginner {
          background: #d4edda;
          color: #155724;
        }

        .difficulty-intermediate {
          background: #fff3cd;
          color: #856404;
        }

        .difficulty-advanced {
          background: #f8d7da;
          color: #721c24;
        }

        .duration-badge {
          background: #e3f2fd;
          color: #1976d2;
        }

        .lesson-description {
          color: #6c757d;
          font-size: 16px;
          margin: 12px 0 0;
        }

        .section-description {
          color: #6c757d;
          margin-bottom: 24px;
        }

        .content-body {
          line-height: 1.7;
          font-size: 16px;
          color: #333;
          margin-bottom: 32px;
        }

        .content-body :global(.content-h1) {
          color: #1a1a1a;
          margin: 32px 0 16px;
          font-size: 28px;
          font-weight: 700;
        }

        .content-body :global(.content-h2) {
          color: #2c2c2c;
          margin: 24px 0 12px;
          font-size: 22px;
          font-weight: 600;
        }

        .content-body :global(.content-h3) {
          color: #3c3c3c;
          margin: 20px 0 8px;
          font-size: 18px;
          font-weight: 600;
        }

        .content-body :global(.inline-code) {
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          color: #e83e8c;
        }

        .content-body :global(.code-block) {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.5;
        }

        .code-example-card {
          margin-bottom: 24px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
        }

        .code-example-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .code-example-header h3 {
          margin: 0;
          font-size: 16px;
          color: #495057;
        }

        .code-editor-wrapper {
          padding: 0;
        }

        .code-explanation {
          padding: 16px 20px;
          background: #e3f2fd;
          border-top: 1px solid #e9ecef;
          color: #1565c0;
        }

        .quiz-questions {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .quiz-question {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
        }

        .quiz-question h3 {
          margin: 0 0 12px;
          color: #495057;
        }

        .question-text {
          font-size: 16px;
          margin-bottom: 16px;
          color: #333;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .quiz-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .quiz-option:hover {
          background: #f8f9fa;
        }

        .quiz-option.correct {
          background: #d4f6d4;
          border-color: #28a745;
        }

        .quiz-option.incorrect {
          background: #f8d7da;
          border-color: #dc3545;
        }

        .quiz-option input {
          margin: 0;
        }

        .option-text {
          flex: 1;
        }

        .correct-icon, 
        .incorrect-icon {
          font-size: 16px;
        }

        .quiz-explanation {
          margin-top: 12px;
          padding: 12px;
          background: #e3f2fd;
          border-radius: 6px;
          color: #1565c0;
        }

        .revealed-answer {
          margin-top: 12px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .quiz-progress, 
        .checklist-progress {
          margin-top: 20px;
          padding: 12px;
          background: #e3f2fd;
          border-radius: 6px;
          color: #1565c0;
        }

        .checklist {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checklist-item:hover {
          background: #f8f9fa;
        }

        .checklist-item.completed {
          background: #d4edda;
          border-color: #28a745;
        }

        .checklist-item input {
          margin: 0;
        }

        .checklist-text {
          flex: 1;
          color: #333;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #6c757d;
        }

        .empty-state p:first-child {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .section-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e9ecef;
          flex-wrap: wrap;
        }

        .lesson-completion {
          margin-top: 24px;
          padding: 24px;
          border-top: 1px solid #e9ecef;
        }

        .completion-banner {
          text-align: center;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 32px;
          border-radius: 12px;
        }

        .completion-banner h3 {
          margin: 0 0 8px;
        }

        .completion-banner p {
          margin: 0 0 24px;
          opacity: 0.9;
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
          font-size: 14px;
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 12px;
        }

        .btn-large {
          padding: 16px 32px;
          font-size: 16px;
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

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #1e7e34;
        }

        .btn-outline {
          background: transparent;
          color: #007bff;
          border: 1px solid #007bff;
        }

        .btn-outline:hover {
          background: #007bff;
          color: white;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .lesson-tabs {
            flex-wrap: wrap;
          }

          .tab-button {
            flex: 1 1 50%;
            min-width: 100px;
          }

          .progress-info {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }

          .section-actions {
            flex-direction: column;
          }

          .code-example-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default LessonViewer;