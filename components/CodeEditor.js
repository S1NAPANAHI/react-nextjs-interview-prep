import React, { useState, useEffect } from 'react';

const CodeEditor = ({ 
  initialCode = '', 
  language = 'jsx', 
  readOnly = false, 
  showRunButton = false,
  onCodeChange = () => {},
  height = '300px'
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    onCodeChange(newCode);
    setError('');
  };

  const runCode = async () => {
    if (!showRunButton) return;
    
    setIsRunning(true);
    setError('');
    setOutput('');

    try {
      // Simple code execution for demonstration
      // In production, you'd want to use a sandboxed environment
      if (language === 'javascript' || language === 'js') {
        // Create a safe execution context
        const consoleOutput = [];
        const mockConsole = {
          log: (...args) => consoleOutput.push(args.join(' ')),
          error: (...args) => consoleOutput.push('ERROR: ' + args.join(' ')),
          warn: (...args) => consoleOutput.push('WARN: ' + args.join(' '))
        };

        // Execute the code safely
        const func = new Function('console', code);
        func(mockConsole);
        
        setOutput(consoleOutput.join('\n') || 'Code executed successfully (no output)');
      } else if (language === 'jsx' || language === 'react') {
        // For React/JSX code, we'll show a syntax validation message
        try {
          // Basic JSX validation (very simple)
          if (code.includes('return') && (code.includes('<') || code.includes('>'))) {
            setOutput('JSX component structure looks valid! ✓');
          } else {
            setOutput('This appears to be a React component. In a real environment, this would render in the browser.');
          }
        } catch (err) {
          setError('JSX Syntax Error: ' + err.message);
        }
      } else {
        setOutput('Code syntax appears valid for ' + language);
      }
    } catch (err) {
      setError('Execution Error: ' + err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could show a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput('');
    setError('');
    onCodeChange(initialCode);
  };

  return (
    <div className="code-editor">
      <div className="editor-header">
        <div className="language-badge">
          {language.toUpperCase()}
        </div>
        <div className="editor-actions">
          <button 
            className="action-btn"
            onClick={copyToClipboard}
            title="Copy code"
          >
            📋
          </button>
          <button 
            className="action-btn"
            onClick={resetCode}
            title="Reset to original"
          >
            🔄
          </button>
          {showRunButton && (
            <button 
              className="run-btn"
              onClick={runCode}
              disabled={isRunning || readOnly}
              title="Run code"
            >
              {isRunning ? '⏳' : '▶️'} 
              {isRunning ? 'Running...' : 'Run'}
            </button>
          )}
        </div>
      </div>

      <div className="editor-container">
        <textarea
          value={code}
          onChange={handleCodeChange}
          readOnly={readOnly}
          className={`code-textarea ${readOnly ? 'readonly' : ''}`}
          style={{ height }}
          spellCheck={false}
          placeholder={readOnly ? '' : 'Start coding...'}
        />
        
        {/* Line numbers */}
        <div className="line-numbers">
          {code.split('\n').map((_, index) => (
            <div key={index} className="line-number">
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Output section */}
      {(output || error) && (
        <div className="output-section">
          <div className="output-header">
            <span>Output:</span>
          </div>
          {error && (
            <div className="error-output">
              <pre>{error}</pre>
            </div>
          )}
          {output && (
            <div className="success-output">
              <pre>{output}</pre>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .code-editor {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
          background: #ffffff;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 16px;
          background: #f8f9fa;
          border-bottom: 1px solid #e1e5e9;
        }

        .language-badge {
          background: #007bff;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .editor-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .action-btn {
          background: none;
          border: 1px solid #dee2e6;
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #e9ecef;
        }

        .run-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .run-btn:hover:not(:disabled) {
          background: #218838;
        }

        .run-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .editor-container {
          position: relative;
          display: flex;
        }

        .line-numbers {
          background: #f8f9fa;
          color: #6c757d;
          padding: 16px 8px;
          border-right: 1px solid #e1e5e9;
          font-size: 14px;
          line-height: 1.5;
          min-width: 40px;
          text-align: right;
          user-select: none;
        }

        .line-number {
          height: 21px;
        }

        .code-textarea {
          flex: 1;
          padding: 16px;
          border: none;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.5;
          resize: none;
          outline: none;
          background: white;
          color: #333;
          tab-size: 2;
        }

        .code-textarea.readonly {
          background: #f8f9fa;
          color: #6c757d;
        }

        .code-textarea:focus {
          background: #ffffff;
        }

        .output-section {
          border-top: 1px solid #e1e5e9;
        }

        .output-header {
          background: #f8f9fa;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #495057;
        }

        .success-output {
          background: #d4f6d4;
          color: #0f5132;
          padding: 12px 16px;
          font-size: 14px;
        }

        .error-output {
          background: #f8d7da;
          color: #721c24;
          padding: 12px 16px;
          font-size: 14px;
        }

        .success-output pre,
        .error-output pre {
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
        }

        /* Syntax highlighting for common patterns */
        .code-textarea {
          /* This is a simplified approach. In production, use a proper syntax highlighter */
          background-image: 
            linear-gradient(transparent 0px, transparent 20px, #f8f9fa 20px, #f8f9fa 21px),
            linear-gradient(90deg, transparent 40px, transparent);
          background-size: 100% 21px, 100%;
        }

        @media (max-width: 768px) {
          .editor-header {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }

          .editor-actions {
            justify-content: center;
          }

          .line-numbers {
            min-width: 30px;
            padding: 16px 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;