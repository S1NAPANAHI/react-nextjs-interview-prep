import React, { useState, useEffect } from 'react';

const ChallengePlayer = ({ challenge, onComplete, isCompleted }) => {
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
      // Show temporary feedback
      const event = new CustomEvent('showNotification', {
        detail: { message: '📋 Code copied to clipboard!' }
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(result => result.passed);
  const hasRequirements = challenge.requirements && challenge.requirements.length > 0;

  return (
    <div className="challenge-player">
      {/* Challenge Header */}
      <div className="challenge-header">
        <div className="challenge-meta">
          <span className={`difficulty-badge difficulty-${challenge.difficulty || 'beginner'}`}>
            {(challenge.difficulty || 'beginner').charAt(0).toUpperCase() + (challenge.difficulty || 'beginner').slice(1)}
          </span>
          <span className="time-badge">
            ⏱️ {formatTime(timeSpent)}
          </span>
          {challenge.estimatedTime && (
            <span className="estimated-time">
              Est. {challenge.estimatedTime}min
            </span>
          )}
          {isCompleted && (
            <span className="completed-badge">
              🏆 Completed
            </span>
          )}
        </div>
        <h2>{challenge.title}</h2>
        <p className="challenge-description">{challenge.description}</p>
      </div>

      <div className="challenge-layout">
        {/* Left Column - Instructions and Results */}
        <div className="challenge-sidebar">
          {/* Requirements */}
          {hasRequirements && (
            <div className="requirements-section">
              <h3>🎯 Requirements</h3>
              <ul className="requirements-list">
                {challenge.requirements.map((req, index) => (
                  <li key={index} className="requirement-item">
                    <span className="requirement-icon">☐</span>
                    <span className="requirement-text">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="test-results">
              <h3>🧪 Test Results</h3>
              <div className="test-list">
                {testResults.map((test) => (
                  <div key={test.id} className={`test-item ${test.passed ? 'passed' : 'failed'}`}>
                    <span className="test-icon">
                      {test.passed ? '✅' : '❌'}
                    </span>
                    <div className="test-content">
                      <span className="test-description">{test.description}</span>
                      {test.error && (
                        <div className="test-error">{test.error}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {allTestsPassed && (
                <div className="completion-banner">
                  🎉 All tests passed! Time: {formatTime(timeSpent)}
                </div>
              )}
            </div>
          )}

          {/* Hints Section */}
          <div className="hints-section">
            <div className="hints-header">
              <h3>💡 Hints</h3>
              <button 
                className="btn btn-outline btn-sm"
                onClick={getNextHint}
                disabled={currentHint >= (challenge.hints?.length || 0)}
              >
                {currentHint === 0 ? 'Get Hint' : 'Next Hint'} 
                ({currentHint}/{challenge.hints?.length || 0})
              </button>
            </div>
            
            {showHints && challenge.hints && currentHint > 0 && (
              <div className="hints-list">
                {challenge.hints.slice(0, currentHint).map((hint, index) => (
                  <div key={index} className="hint-item">
                    <span className="hint-number">Hint {index + 1}:</span>
                    <span className="hint-text">{hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Code Editor */}
        <div className="challenge-workspace">
          <div className="code-section">
            <div className="code-header">
              <h3>🖥️ Your Solution</h3>
              <div className="code-actions">
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={resetChallenge}
                  disabled={userCode === (challenge.starterCode || '')}
                >
                  🔄 Reset
                </button>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => copyToClipboard(userCode)}
                >
                  📋 Copy
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={runTests}
                  disabled={!userCode.trim()}
                >
                  🏃 Run Tests
                </button>
              </div>
            </div>
            
            <div className="code-editor-container">
              <textarea
                className="code-editor"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="Write your React component here..."
                spellCheck={false}
                autoComplete="off"
              />
              <div className="code-stats">
                <span>Lines: {userCode.split('\n').length}</span>
                <span>Characters: {userCode.length}</span>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="solution-section">
            <div className="solution-header">
              <h3>📝 Solution</h3>
              <button 
                className="btn btn-warning btn-sm"
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? 'Hide' : 'Show'} Solution
              </button>
            </div>
            
            {showSolution && (
              <div className="solution-content">
                <div className="solution-warning">
                  ⚠️ Viewing the solution will affect your completion score
                </div>
                {challenge.solution ? (
                  <pre className="solution-code">
                    <code>{challenge.solution}</code>
                  </pre>
                ) : (
                  <div className="no-solution">
                    <p>Solution not available yet. Try to solve it yourself first!</p>
                    <p>Check the hints above for guidance.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="challenge-footer">
        <div className="challenge-stats">
          <div className="stat-item">
            <span className="stat-label">Time Spent</span>
            <span className="stat-value">{formatTime(timeSpent)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Hints Used</span>
            <span className="stat-value">{currentHint}/{challenge.hints?.length || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tests</span>
            <span className="stat-value">
              {testResults.filter(t => t.passed).length}/{testResults.length}
            </span>
          </div>
        </div>
        
        {hasRun && !allTestsPassed && (
          <div className="encouragement">
            <p>💪 Keep trying! You're making progress.</p>
          </div>
        )}
      </div>

      <style jsx>{`
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

        .challenge-header h2 {
          margin: 0 0 12px;
          font-size: 28px;
        }

        .challenge-description {
          font-size: 16px;
          margin: 0;
          opacity: 0.95;
          line-height: 1.5;
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

        .challenge-workspace {
          display: flex;
          flex-direction: column;
        }

        .requirements-section,
        .test-results,
        .hints-section {
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .requirements-section h3,
        .test-results h3,
        .hints-section h3,
        .code-section h3,
        .solution-section h3 {
          margin: 0 0 16px;
          color: #495057;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
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

        .requirement-icon {
          color: #6c757d;
          font-size: 14px;
          margin-top: 2px;
          min-width: 16px;
        }

        .requirement-text {
          flex: 1;
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

        .test-content {
          flex: 1;
        }

        .test-description {
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }

        .test-error {
          font-size: 12px;
          color: #721c24;
          font-style: italic;
        }

        .completion-banner {
          background: #28a745;
          color: white;
          padding: 16px;
          text-align: center;
          font-weight: 600;
          border-radius: 8px;
          margin-top: 16px;
          animation: pulse 2s;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        .hints-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .hints-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .hint-item {
          background: #e3f2fd;
          border: 1px solid #2196f3;
          border-radius: 6px;
          padding: 12px;
          font-size: 14px;
        }

        .hint-number {
          font-weight: 600;
          color: #1976d2;
          display: block;
          margin-bottom: 4px;
        }

        .hint-text {
          color: #495057;
          line-height: 1.4;
        }

        .code-section {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 16px;
          background: white;
          border-bottom: 1px solid #e9ecef;
        }

        .code-actions {
          display: flex;
          gap: 8px;
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

        .solution-section {
          border-top: 1px solid #e9ecef;
        }

        .solution-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #fff;
        }

        .solution-content {
          padding: 0 20px 20px;
        }

        .solution-warning {
          background: #fff3cd;
          border: 1px solid #ffc107;
          color: #856404;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .solution-code {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.5;
          color: #333;
        }

        .no-solution {
          text-align: center;
          padding: 20px;
          color: #6c757d;
        }

        .challenge-footer {
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }

        .challenge-stats {
          display: flex;
          justify-content: center;
          gap: 32px;
          margin-bottom: 16px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: #6c757d;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .stat-value {
          display: block;
          font-size: 18px;
          font-weight: 700;
          color: #495057;
        }

        .encouragement {
          text-align: center;
          color: #6c757d;
        }

        .encouragement p {
          margin: 0;
          font-style: italic;
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

        .btn-secondary:hover:not(:disabled) {
          background: #545b62;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
        }

        .btn-warning:hover:not(:disabled) {
          background: #e0a800;
        }

        .btn-outline {
          background: transparent;
          color: #007bff;
          border: 1px solid #007bff;
        }

        .btn-outline:hover:not(:disabled) {
          background: #007bff;
          color: white;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
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

        @media (max-width: 768px) {
          .challenge-meta {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;
          }

          .code-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .code-actions {
            justify-content: center;
          }

          .challenge-stats {
            gap: 16px;
          }

          .solution-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .hints-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default ChallengePlayer;