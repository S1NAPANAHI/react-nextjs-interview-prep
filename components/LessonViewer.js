// components/LessonViewer.js
// Browser-compatible version using global React - NO ES6 imports/exports

const { useState, useEffect } = React;

function LessonViewer({ lesson, onComplete, onProgress, isCompleted }) {
  const [activeTab, setActiveTab] = useState('theory');
  const [completedSections, setCompletedSections] = useState(new Set());
  const [quizAnswers, setQuizAnswers] = useState({});
  const [checklistProgress, setChecklistProgress] = useState({});

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
      if (window.showNotification) {
        window.showNotification('📋 Code copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleCompleteLesson = () => {
    if (onComplete) {
      onComplete(lesson.id);
    }
  };

  const progressPercentage = (completedSections.size / 4) * 100;
  const allSectionsComplete = completedSections.size === 4;

  // Render different tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'theory':
        return React.createElement('div', { className: 'lesson-content' },
          React.createElement('div', { className: 'lesson-header' },
            React.createElement('div', { className: 'lesson-meta' },
              React.createElement('span', {
                className: `difficulty-badge difficulty-${lesson.difficulty || 'beginner'}`
              }, (lesson.difficulty || 'beginner').charAt(0).toUpperCase() + (lesson.difficulty || 'beginner').slice(1)),
              lesson.duration && React.createElement('span', { className: 'duration-badge' }, `🕒 ${lesson.duration} min`)
            ),
            React.createElement('h1', {}, lesson.title),
            lesson.theory && React.createElement('p', { className: 'lesson-description' }, lesson.theory.slice(0, 200) + '...')
          ),
          
          React.createElement('div', {
            className: 'content-body',
            dangerouslySetInnerHTML: {
              __html: renderMarkdownContent(lesson.theory || 'No theory content available for this lesson.')
            }
          }),
          
          React.createElement('div', { className: 'section-actions' },
            React.createElement('button', {
              className: `btn ${completedSections.has('theory') ? 'btn-success' : 'btn-primary'}`,
              onClick: () => markSectionComplete('theory'),
              disabled: completedSections.has('theory')
            }, completedSections.has('theory') ? '✅ Theory Complete' : 'Mark Theory Complete'),
            React.createElement('button', {
              className: 'btn btn-secondary',
              onClick: () => setActiveTab('practice')
            }, 'View Code Examples →')
          )
        );

      case 'practice':
        return React.createElement('div', { className: 'code-examples' },
          React.createElement('h2', {}, '💻 Interactive Code Examples'),
          React.createElement('p', { className: 'section-description' }, 'Study these code examples and experiment with the concepts.'),
          
          lesson.codeExamples && lesson.codeExamples.length > 0 ? 
            lesson.codeExamples.map((example, index) =>
              React.createElement('div', { key: index, className: 'code-example-card' },
                React.createElement('div', { className: 'code-example-header' },
                  React.createElement('h3', {}, example.label),
                  React.createElement('button', {
                    className: 'btn btn-sm btn-outline',
                    onClick: () => copyToClipboard(example.code)
                  }, '📋 Copy')
                ),
                React.createElement('div', { className: 'code-editor-wrapper' },
                  React.createElement('pre', { className: `code-block language-${example.lang || 'jsx'}` },
                    React.createElement('code', {}, example.code)
                  )
                ),
                example.explanation && React.createElement('div', { className: 'code-explanation' },
                  React.createElement('p', {}, example.explanation)
                )
              )
            ) : React.createElement('div', { className: 'empty-state' },
              React.createElement('p', {}, '📝 No code examples available for this lesson yet.'),
              React.createElement('p', {}, 'Check back later as we continue to add more interactive content!')
            ),
          
          React.createElement('div', { className: 'section-actions' },
            React.createElement('button', {
              className: `btn ${completedSections.has('practice') ? 'btn-success' : 'btn-primary'}`,
              onClick: () => markSectionComplete('practice'),
              disabled: completedSections.has('practice')
            }, completedSections.has('practice') ? '✅ Practice Complete' : 'Mark Practice Complete')
          )
        );

      case 'quiz':
        return React.createElement('div', { className: 'quiz-section' },
          React.createElement('h2', {}, '❓ Knowledge Check'),
          React.createElement('p', { className: 'section-description' }, 'Test your understanding with these questions.'),
          
          lesson.quizzes && lesson.quizzes.length > 0 ? 
            React.createElement('div', { className: 'quiz-questions' },
              lesson.quizzes.map((quiz, index) =>
                React.createElement('div', { key: index, className: 'quiz-question' },
                  React.createElement('h3', {}, `Question ${index + 1}`),
                  React.createElement('p', { className: 'question-text' }, quiz.question),
                  
                  quiz.options ? React.createElement('div', { className: 'quiz-options' },
                    quiz.options.map((option, optionIndex) => {
                      const isSelected = quizAnswers[index] === optionIndex;
                      const isCorrect = quiz.correct === optionIndex;
                      const hasAnswered = index in quizAnswers;
                      
                      return React.createElement('label', {
                        key: optionIndex,
                        className: `quiz-option ${
                          hasAnswered 
                            ? isCorrect 
                              ? 'correct' 
                              : isSelected 
                              ? 'incorrect' 
                              : ''
                            : ''
                        }`
                      },
                        React.createElement('input', {
                          type: 'radio',
                          name: `question-${index}`,
                          value: optionIndex,
                          checked: isSelected,
                          onChange: () => handleQuizAnswer(index, optionIndex),
                          disabled: hasAnswered
                        }),
                        React.createElement('span', { className: 'option-text' }, option),
                        hasAnswered && isCorrect && React.createElement('span', { className: 'correct-icon' }, '✅'),
                        hasAnswered && !isCorrect && isSelected && React.createElement('span', { className: 'incorrect-icon' }, '❌')
                      );
                    })
                  ) : React.createElement('div', { className: 'answer-reveal' },
                    React.createElement('button', {
                      className: 'btn btn-outline',
                      onClick: () => handleQuizAnswer(index, 'revealed')
                    }, 'Show Answer'),
                    quizAnswers[index] === 'revealed' && React.createElement('div', { className: 'revealed-answer' },
                      React.createElement('p', {},
                        React.createElement('strong', {}, 'Answer: '),
                        quiz.answer
                      )
                    )
                  ),
                  
                  quiz.explanation && index in quizAnswers && React.createElement('div', { className: 'quiz-explanation' },
                    React.createElement('p', {},
                      React.createElement('strong', {}, 'Explanation: '),
                      quiz.explanation
                    )
                  )
                )
              )
            ) : React.createElement('div', { className: 'empty-state' },
              React.createElement('p', {}, '🤔 No quiz questions available for this lesson yet.'),
              React.createElement('p', {}, 'Practice the concepts from the theory and code examples!')
            ),
          
          lesson.quizzes && lesson.quizzes.length > 0 && React.createElement('div', { className: 'quiz-progress' },
            React.createElement('p', {}, 
              `Progress: ${Object.keys(quizAnswers).length} / ${lesson.quizzes.length} questions answered${completedSections.has('quiz') ? ' ✅' : ''}`
            )
          )
        );

      case 'checklist':
        return React.createElement('div', { className: 'checklist-section' },
          React.createElement('h2', {}, '✅ Learning Objectives'),
          React.createElement('p', { className: 'section-description' }, 'Track your progress through these learning goals.'),
          
          lesson.checklist && lesson.checklist.length > 0 ? 
            React.createElement('div', { className: 'checklist' },
              lesson.checklist.map((item, index) => {
                const isCompleted = checklistProgress[index] || false;
                
                return React.createElement('label', {
                  key: index,
                  className: `checklist-item ${isCompleted ? 'completed' : ''}`
                },
                  React.createElement('input', {
                    type: 'checkbox',
                    checked: isCompleted,
                    onChange: (e) => handleChecklistToggle(index, e.target.checked)
                  }),
                  React.createElement('span', { className: 'checkmark' }),
                  React.createElement('span', { className: 'checklist-text' }, item)
                );
              })
            ) : React.createElement('div', { className: 'empty-state' },
              React.createElement('p', {}, '📋 No checklist items available for this lesson yet.'),
              React.createElement('p', {}, 'Focus on understanding the theory and practicing with the code examples!')
            ),
          
          lesson.checklist && lesson.checklist.length > 0 && React.createElement('div', { className: 'checklist-progress' },
            React.createElement('p', {}, 
              `Progress: ${Object.values(checklistProgress).filter(Boolean).length} / ${lesson.checklist.length} items completed${completedSections.has('checklist') ? ' ✅' : ''}`
            )
          )
        );

      default:
        return React.createElement('div', {}, 'Content not found');
    }
  };

  return React.createElement('div', { className: 'lesson-viewer' },
    // Lesson Tabs
    React.createElement('div', { className: 'lesson-tabs' },
      tabs.map(tab =>
        React.createElement('button', {
          key: tab.id,
          className: `tab-button ${
            activeTab === tab.id ? 'active' : ''
          } ${
            completedSections.has(tab.id) ? 'completed' : ''
          }`,
          onClick: () => setActiveTab(tab.id)
        },
          React.createElement('span', { className: 'tab-icon' }, tab.icon),
          React.createElement('span', { className: 'tab-label' }, tab.label),
          completedSections.has(tab.id) && React.createElement('span', { className: 'completion-badge' }, '✓')
        )
      )
    ),

    // Progress Bar
    React.createElement('div', { className: 'lesson-progress-bar' },
      React.createElement('div', {
        className: 'progress-fill',
        style: {
          width: `${progressPercentage}%`
        }
      }),
      React.createElement('div', { className: 'progress-info' },
        React.createElement('span', { className: 'progress-text' }, 
          `${completedSections.size} of 4 sections completed (${Math.round(progressPercentage)}%)`
        ),
        isCompleted && React.createElement('span', { className: 'completed-badge' }, '🎉 Lesson Completed!')
      )
    ),

    // Tab Content
    React.createElement('div', { className: 'tab-content' }, renderTabContent()),

    // Lesson Completion
    allSectionsComplete && !isCompleted && React.createElement('div', { className: 'lesson-completion' },
      React.createElement('div', { className: 'completion-banner' },
        React.createElement('h3', {}, '🎉 Great job! You\'ve completed all sections.'),
        React.createElement('p', {}, 'Mark this lesson as complete to track your progress.'),
        React.createElement('button', {
          className: 'btn btn-success btn-large',
          onClick: handleCompleteLesson
        }, '✅ Complete Lesson')
      )
    )
  );
}

// Make component globally available - NO export statement
window.LessonViewer = LessonViewer;

// Add CSS styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('lesson-viewer-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'lesson-viewer-styles';
  styleSheet.textContent = `
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
    
    .difficulty-badge, .duration-badge {
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
    
    .content-body {
      line-height: 1.7;
      font-size: 16px;
      color: #333;
      margin-bottom: 32px;
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
    
    .code-block {
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
    
    .btn-success {
      background: #28a745;
      color: white;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    @media (max-width: 768px) {
      .lesson-tabs {
        flex-wrap: wrap;
      }
      
      .tab-button {
        flex: 1 1 50%;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}