import React, { useState, useEffect } from 'react';
import CodeEditor from './CodeEditor';

const ChallengePlayer = ({ challenge, onComplete }) => {
  const [userCode, setUserCode] = useState(challenge.starterCode || '');
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runTests = () => {
    // Simulate running tests based on challenge requirements
    const results = challenge.testCases?.map((testCase, index) => {
      // This is a simplified test runner
      // In a real implementation, you'd have proper test execution
      const passed = Math.random() > 0.3; // Simulate some tests passing
      return {
        id: index,
        description: testCase,
        passed,
        error: passed ? null : 'Expected behavior not implemented'
      };
    }) || [];

    setTestResults(results);
    
    const allPassed = results.every(result => result.passed);
    if (allPassed && !isCompleted) {
      setIsCompleted(true);
      if (onComplete) {
        onComplete({
          challengeId: challenge.id,
          timeSpent,
          hintsUsed: currentHint,
          solutionViewed: showSolution
        });
      }
    }
  };

  const getNextHint = () => {
    if (currentHint < (challenge.hints?.length || 0)) {
      setCurrentHint(currentHint + 1);
      setShowHints(true);
    }
  };

  const resetChallenge = () => {
    setUserCode(challenge.starterCode || '');
    setShowSolution(false);
    setShowHints(false);
    setCurrentHint(0);
    setTestResults([]);
    setIsCompleted(false);
  };

  return (
    <div className="challenge-player">
      {/* Challenge Header */}
      <div className="challenge-header">
        <div className="challenge-meta">
          <span className={`difficulty-badge ${challenge.difficulty}`}>
            {challenge.difficulty}
          </span>
          <span className="time-badge">
            ⏱️ {formatTime(timeSpent)}
          </span>
          {challenge.estimatedTime && (
            <span className="estimated-time">
              Est. {challenge.estimatedTime}min
            </span>
          )}
        </div>
        <h2>{challenge.title}</h2>
        <p className="challenge-description">{challenge.description}</p>
      </div>

      {/* Requirements */}
      <div className="requirements-section">
        <h3>🎯 Requirements</h3>
        <ul className="requirements-list">
          {challenge.requirements?.map((req, index) => (
            <li key={index} className="requirement-item">
              <span className="requirement-checkbox">☐</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Code Editor */}
      <div className="code-section">
        <div className="code-header">
          <h3>💻 Your Solution</h3>
          <div className="code-actions">
            <button 
              className="btn btn-secondary"
              onClick={resetChallenge}
              disabled={userCode === challenge.starterCode}
            >
              🔄 Reset
            </button>
            <button 
              className="btn btn-primary"
              onClick={runTests}
            >
              🏃 Run Tests
            </button>
          </div>
        </div>
        
        <CodeEditor
          initialCode={userCode}
          language="jsx"
          onCodeChange={setUserCode}
          showRunButton={false}
          height="400px"
        />
      </div>

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
                <span className="test-description">{test.description}</span>
                {test.error && (
                  <div className="test-error">{test.error}</div>
                )}
              </div>
            ))}
          </div>
          
          {isCompleted && (
            <div className="completion-banner">
              🎉 Challenge Completed! Time: {formatTime(timeSpent)}
            </div>
          )}
        </div>
      )}

      {/* Hints Section */}
      <div className="hints-section">
        <div className="hints-header">
          <h3>💡 Hints</h3>
          <button 
            className="btn btn-outline"
            onClick={getNextHint}
            disabled={currentHint >= (challenge.hints?.length || 0)}
          >
            {currentHint === 0 ? 'Get Hint' : 'Next Hint'} 
            ({currentHint}/{challenge.hints?.length || 0})
          </button>
        </div>
        
        {showHints && challenge.hints && (
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

      {/* Solution Section */}
      <div className="solution-section">
        <div className="solution-header">
          <h3>📝 Solution</h3>
          <button 
            className="btn btn-warning"
            onClick={() => setShowSolution(!showSolution)}
          >
            {showSolution ? 'Hide' : 'Show'} Solution
          </button>
        </div>
        
        {showSolution && challenge.solution && (
          <div className="solution-content">
            <div className="solution-warning">
              ⚠️ Viewing the solution will affect your completion score
            </div>
            <CodeEditor
              initialCode={challenge.solution}
              language="jsx"
              readOnly={true}
              height="300px"
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .challenge-player {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
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
        }

        .difficulty-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .difficulty-badge.beginner {
          background: rgba(40, 167, 69, 0.2);
          color: #28a745;
          border: 1px solid #28a745;
        }

        .difficulty-badge.intermediate {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          border: 1px solid #ffc107;
        }

        .difficulty-badge.advanced {
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

        .challenge-header h2 {
          margin: 0 0 12px;
          font-size: 28px;
        }

        .challenge-description {
          font-size: 16px;
          margin: 0;
          opacity: 0.9;
        }

        .requirements-section,
        .code-section,
        .test-results,
        .hints-section,
        .solution-section {
          padding: 24px;
          border-bottom: 1px solid #e9ecef;
        }

        .requirements-section h3,
        .code-header h3,
        .test-results h3,
        .hints-header h3,
        .solution-header h3 {
          margin: 0 0 16px;
          color: #495057;
          display: flex;
          align-items: center;
          gap: 8px;
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
        }

        .requirement-checkbox {
          color: #6c757d;
          font-size: 16px;
          margin-top: 2px;
        }

        .code-header,
        .hints-header,
        .solution-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .code-actions {
          display: flex;
          gap: 8px;
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
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
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

        .btn-warning:hover {
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
        }

        .test-item.passed {
          background: #d4f6d4;
          border-color: #28a745;
        }

        .test-item.failed {
          background: #f8d7da;
          border-color: #dc3545;
        }

        .test-error {
          font-size: 12px;
          color: #721c24;
          margin-top: 4px;
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
          display: flex;
          gap: 8px;
        }

        .hint-number {
          font-weight: 600;
          color: #1976d2;
          min-width: 60px;
        }

        .hint-text {
          color: #495057;
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

        @media (max-width: 768px) {
          .challenge-meta {
            flex-direction: column;
            gap: 8px;
          }

          .code-header,
          .hints-header,
          .solution-header {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .code-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ChallengePlayer;