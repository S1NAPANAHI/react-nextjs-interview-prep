import { useState, useEffect } from 'react';
import { DataService } from '../utils/dataService';

export default function QuizViewer({ questionCount = 10 }) {
  const [questionsData, setQuestionsData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, [questionCount]);

  const loadQuestions = async () => {
    setLoading(true);
    const data = await DataService.fetchTopQuestions(questionCount);
    if (data) {
      setQuestionsData(data);
    }
    setLoading(false);
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  if (loading) return <div className="loading">Loading questions...</div>;
  if (!questionsData) return <div className="error">Failed to load questions</div>;

  const questions = questionsData.questions;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-viewer">
      <div className="quiz-header">
        <h2>{questionsData.title}</h2>
        <p>{questionsData.description}</p>
        <div className="quiz-progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {!showResults ? (
        <div className="question-container">
          <div className="question-card">
            <div className="question-header">
              <span className="difficulty-badge difficulty-{currentQuestion.difficulty?.toLowerCase()}">
                {currentQuestion.difficulty}
              </span>
              <span className="category-badge">{currentQuestion.category}</span>
            </div>
            
            <h3 className="question-text">{currentQuestion.question}</h3>
            
            <div className="answer-section">
              <textarea
                value={selectedAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
                rows={6}
              />
            </div>

            {currentQuestion.keyPoints && (
              <div className="key-points">
                <h4>Key Points to Consider:</h4>
                <ul>
                  {currentQuestion.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="question-controls">
              {currentQuestionIndex > 0 && (
                <button 
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="nav-btn secondary"
                >
                  Previous
                </button>
              )}
              
              {currentQuestionIndex < questions.length - 1 ? (
                <button 
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="nav-btn primary"
                >
                  Next
                </button>
              ) : (
                <button 
                  onClick={handleSubmitQuiz}
                  className="submit-btn primary"
                  disabled={Object.keys(selectedAnswers).length < questions.length}
                >
                  Submit Quiz
                </button>
              )}
            </div>
          </div>

          <div className="model-answer">
            <h4>Model Answer:</h4>
            <div className="answer-content">
              {currentQuestion.answer}
            </div>
          </div>
        </div>
      ) : (
        <QuizResults 
          questions={questions}
          answers={selectedAnswers}
          onReset={resetQuiz}
        />
      )}
    </div>
  );
}