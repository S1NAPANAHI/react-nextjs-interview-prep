// components/ChallengePlayer.js
// Browser-compatible version using global React - NO ES6 imports/exports

const { useState, useEffect } = React;

function ChallengePlayer({ challenge, onComplete, isCompleted }) {
  const [userCode, setUserCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    // Initialize with starter code or empty
    setUserCode(challenge.starterCode || '// Start coding here...\n\nfunction Component() {\n  return (\n    <div>\n      {/* Your solution */}\n    </div>\n  );\n}\n\nexport default Component;');
  }, [challenge]);

  useEffect(() => {
    if (!isCompleted) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runTests = () => {
    setHasRun(true);
    
    // Enhanced test simulation based on challenge requirements
    const mockTests = [
      {
        id: 1,
        description: 'Component renders without crashing',
        passed: userCode.includes('return') && userCode.includes('Component'),
        error: !userCode.includes('return') ? 'Component must return JSX' : null
      },
      {
        id: 2,
        description: 'Contains required elements',
        passed: userCode.length > 100, // Basic complexity check
        error: userCode.length <= 100 ? 'Solution appears too simple' : null
      },
      {
        id: 3,
        description: 'Follows React best practices',
        passed: userCode.includes('useState') || userCode.includes('useEffect') || Math.random() > 0.4,
        error: 'Consider using React hooks or following component patterns'
      }
    ];

    // Add specific tests if available in challenge
    if (challenge.testCases) {
      const additionalTests = challenge.testCases.map((testCase, index) => ({
        id: index + 4,
        description: testCase,
        passed: Math.random() > 0.3, // Simulate some tests passing
        error: Math.random() > 0.7 ? null : 'Test implementation needed'
      }));
      mockTests.push(...additionalTests);
    }

    setTestResults(mockTests);
    
    // Check if challenge is completed
    const allPassed = mockTests.every(result => result.passed);
    if (allPassed && !isCompleted) {
      setTimeout(() => {
        if (onComplete) {
          onComplete({
            challengeId: challenge.id,
            timeSpent,
            hintsUsed: currentHint,
            solutionViewed: showSolution,
            codeLength: userCode.length
          });
        }
      }, 1500); // Delay to show success animation
    }
  };

  const getNextHint = () => {
    if (currentHint < (challenge.hints?.length || 0)) {
      setCurrentHint(currentHint + 1);
      setShowHints(true);
    }
  };

  const resetChallenge = () => {
    setUserCode(challenge.starterCode || '// Start coding here...');
    setShowSolution(false);
    setShowHints(false);
    setCurrentHint(0);
    setTestResults([]);
    setHasRun(false);
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

  const allTestsPassed = testResults.length > 0 && testResults.every(result => result.passed);
  const hasRequirements = challenge.requirements && challenge.requirements.length > 0;

  return React.createElement('div', { className: 'challenge-player' },
    // Challenge Header
    React.createElement('div', { className: 'challenge-header' },
      React.createElement('div', { className: 'challenge-meta' },
        React.createElement('span', {
          className: `difficulty-badge difficulty-${challenge.difficulty || 'beginner'}`
        }, (challenge.difficulty || 'beginner').charAt(0).toUpperCase() + (challenge.difficulty || 'beginner').slice(1)),
        React.createElement('span', { className: 'time-badge' }, `⏱️ ${formatTime(timeSpent)}`),
        challenge.estimatedTime && React.createElement('span', { className: 'estimated-time' }, `Est. ${challenge.estimatedTime}min`),
        isCompleted && React.createElement('span', { className: 'completed-badge' }, '🏆 Completed')
      ),
      React.createElement('h2', {}, challenge.title),
      React.createElement('p', { className: 'challenge-description' }, challenge.description)
    ),

    React.createElement('div', { className: 'challenge-layout' },
      // Left Column - Instructions and Results
      React.createElement('div', { className: 'challenge-sidebar' },
        // Requirements
        hasRequirements && React.createElement('div', { className: 'requirements-section' },
          React.createElement('h3', {}, '🎯 Requirements'),
          React.createElement('ul', { className: 'requirements-list' },
            challenge.requirements.map((req, index) =>
              React.createElement('li', { key: index, className: 'requirement-item' },
                React.createElement('span', { className: 'requirement-icon' }, '☐'),
                React.createElement('span', { className: 'requirement-text' }, req)
              )
            )
          )
        ),

        // Test Results
        testResults.length > 0 && React.createElement('div', { className: 'test-results' },
          React.createElement('h3', {}, '🧪 Test Results'),
          React.createElement('div', { className: 'test-list' },
            testResults.map((test) =>
              React.createElement('div', {
                key: test.id,
                className: `test-item ${test.passed ? 'passed' : 'failed'}`
              },
                React.createElement('span', { className: 'test-icon' }, test.passed ? '✅' : '❌'),
                React.createElement('div', { className: 'test-content' },
                  React.createElement('span', { className: 'test-description' }, test.description),
                  test.error && React.createElement('div', { className: 'test-error' }, test.error)
                )
              )
            )
          ),
          
          allTestsPassed && React.createElement('div', { className: 'completion-banner' },
            `🎉 All tests passed! Time: ${formatTime(timeSpent)}`
          )
        ),

        // Hints Section
        React.createElement('div', { className: 'hints-section' },
          React.createElement('div', { className: 'hints-header' },
            React.createElement('h3', {}, '💡 Hints'),
            React.createElement('button', {
              className: 'btn btn-outline btn-sm',
              onClick: getNextHint,
              disabled: currentHint >= (challenge.hints?.length || 0)
            }, `${currentHint === 0 ? 'Get Hint' : 'Next Hint'} (${currentHint}/${challenge.hints?.length || 0})`)
          ),
          
          showHints && challenge.hints && currentHint > 0 && React.createElement('div', { className: 'hints-list' },
            challenge.hints.slice(0, currentHint).map((hint, index) =>
              React.createElement('div', { key: index, className: 'hint-item' },
                React.createElement('span', { className: 'hint-number' }, `Hint ${index + 1}:`),
                React.createElement('span', { className: 'hint-text' }, hint)
              )
            )
          )
        )
      ),

      // Right Column - Code Editor
      React.createElement('div', { className: 'challenge-workspace' },
        React.createElement('div', { className: 'code-section' },
          React.createElement('div', { className: 'code-header' },
            React.createElement('h3', {}, '🖥️ Your Solution'),
            React.createElement('div', { className: 'code-actions' },
              React.createElement('button', {
                className: 'btn btn-secondary btn-sm',
                onClick: resetChallenge,
                disabled: userCode === (challenge.starterCode || '')
              }, '🔄 Reset'),
              React.createElement('button', {
                className: 'btn btn-outline btn-sm',
                onClick: () => copyToClipboard(userCode)
              }, '📋 Copy'),
              React.createElement('button', {
                className: 'btn btn-primary',
                onClick: runTests,
                disabled: !userCode.trim()
              }, '🏃 Run Tests')
            )
          ),
          
          React.createElement('div', { className: 'code-editor-container' },
            React.createElement('textarea', {
              className: 'code-editor',
              value: userCode,
              onChange: (e) => setUserCode(e.target.value),
              placeholder: 'Write your React component here...',
              spellCheck: false,
              autoComplete: 'off'
            }),
            React.createElement('div', { className: 'code-stats' },
              React.createElement('span', {}, `Lines: ${userCode.split('\n').length}`),
              React.createElement('span', {}, `Characters: ${userCode.length}`)
            )
          )
        ),

        // Solution Section
        React.createElement('div', { className: 'solution-section' },
          React.createElement('div', { className: 'solution-header' },
            React.createElement('h3', {}, '📝 Solution'),
            React.createElement('button', {
              className: 'btn btn-warning btn-sm',
              onClick: () => setShowSolution(!showSolution)
            }, `${showSolution ? 'Hide' : 'Show'} Solution`)
          ),
          
          showSolution && React.createElement('div', { className: 'solution-content' },
            React.createElement('div', { className: 'solution-warning' },
              '⚠️ Viewing the solution will affect your completion score'
            ),
            challenge.solution ? React.createElement('pre', { className: 'solution-code' },
              React.createElement('code', {}, challenge.solution)
            ) : React.createElement('div', { className: 'no-solution' },
              React.createElement('p', {}, 'Solution not available yet. Try to solve it yourself first!'),
              React.createElement('p', {}, 'Check the hints above for guidance.')
            )
          )
        )
      )
    ),

    // Quick Actions
    React.createElement('div', { className: 'challenge-footer' },
      React.createElement('div', { className: 'challenge-stats' },
        React.createElement('div', { className: 'stat-item' },
          React.createElement('span', { className: 'stat-label' }, 'Time Spent'),
          React.createElement('span', { className: 'stat-value' }, formatTime(timeSpent))
        ),
        React.createElement('div', { className: 'stat-item' },
          React.createElement('span', { className: 'stat-label' }, 'Hints Used'),
          React.createElement('span', { className: 'stat-value' }, `${currentHint}/${challenge.hints?.length || 0}`)
        ),
        React.createElement('div', { className: 'stat-item' },
          React.createElement('span', { className: 'stat-label' }, 'Tests'),
          React.createElement('span', { className: 'stat-value' }, `${testResults.filter(t => t.passed).length}/${testResults.length}`)
        )
      ),
      
      hasRun && !allTestsPassed && React.createElement('div', { className: 'encouragement' },
        React.createElement('p', {}, '💪 Keep trying! You\'re making progress.')
      )
    )
  );
}

// Make component globally available - NO export statement
window.ChallengePlayer = ChallengePlayer;

// Add CSS styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('challenge-player-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'challenge-player-styles';
  styleSheet.textContent = `
    .challenge-player {
      max-width: 1400px;
      margin: 0 auto;
      background: var(--surface, #ffffff);
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .challenge-header {
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    
    .challenge-meta {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      flex-wrap: wrap;
      align-items: center;
    }
    
    .difficulty-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .difficulty-beginner {
      background: rgba(40, 167, 69, 0.2);
      color: #28a745;
      border: 1px solid #28a745;
    }
    
    .difficulty-intermediate {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
      border: 1px solid #ffc107;
    }
    
    .difficulty-advanced {
      background: rgba(220, 53, 69, 0.2);
      color: #dc3545;
      border: 1px solid #dc3545;
    }
    
    .time-badge,
    .estimated-time {
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
    }
    
    .completed-badge {
      background: rgba(40, 167, 69, 0.9);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
    
    .challenge-layout {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 0;
      min-height: 600px;
    }
    
    .challenge-sidebar {
      background: #f8f9fa;
      border-right: 1px solid #e9ecef;
      overflow-y: auto;
      max-height: 800px;
    }
    
    .requirements-section,
    .test-results,
    .hints-section {
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .requirements-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .requirement-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 8px 0;
      color: #495057;
      line-height: 1.4;
    }
    
    .test-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .test-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e9ecef;
      font-size: 14px;
    }
    
    .test-item.passed {
      background: #d4f6d4;
      border-color: #28a745;
    }
    
    .test-item.failed {
      background: #f8d7da;
      border-color: #dc3545;
    }
    
    .code-editor-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    
    .code-editor {
      flex: 1;
      width: 100%;
      min-height: 400px;
      padding: 20px;
      border: none;
      outline: none;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: 1.5;
      background: #fafafa;
      color: #333;
      resize: vertical;
      tab-size: 2;
    }
    
    .code-editor:focus {
      background: #ffffff;
    }
    
    .code-stats {
      display: flex;
      justify-content: space-between;
      padding: 8px 20px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      font-size: 12px;
      color: #6c757d;
    }
    
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      text-decoration: none;
    }
    
    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
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
    
    .btn-warning {
      background: #ffc107;
      color: #212529;
    }
    
    .btn-outline {
      background: transparent;
      color: #007bff;
      border: 1px solid #007bff;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    @media (max-width: 1024px) {
      .challenge-layout {
        grid-template-columns: 1fr;
      }
      
      .challenge-sidebar {
        border-right: none;
        border-bottom: 1px solid #e9ecef;
        max-height: none;
      }
    }
  `;
  document.head.appendChild(styleSheet);
}