import QuizViewer from '../components/QuizViewer';

export default function QuizPage() {
  return (
    <div className="page-container">
      <h1>Practice Quiz</h1>
      <QuizViewer questionCount={10} />
    </div>
  );
}