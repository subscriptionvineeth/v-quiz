import { useState, useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const { currentQuiz, addQuizResult } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeStarted] = useState(new Date());

  useEffect(() => {
    if (!currentQuiz) {
      navigate('/');
    }
  }, [currentQuiz, navigate]);

  if (!currentQuiz) {
    return null;
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      const timeSpent = Math.floor((new Date().getTime() - timeStarted.getTime()) / 1000);
      const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
        return count + (answer === currentQuiz.questions[index].correctAnswer ? 1 : 0);
      }, 0);
      
      addQuizResult({
        date: new Date().toISOString(),
        topic: currentQuiz.topic,
        score: correctAnswers,
        totalQuestions: currentQuiz.questions.length,
        timeSpent
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  if (showResults) {
    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
      return count + (answer === currentQuiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    return (
      <div className="quiz-container">
        <h2>Quiz Results</h2>
        <div className="results-container">
          <p>Topic: {currentQuiz.topic}</p>
          <p>Score: {correctAnswers} out of {currentQuiz.questions.length}</p>
          <p>Percentage: {Math.round((correctAnswers / currentQuiz.questions.length) * 100)}%</p>
          <button onClick={() => navigate('/')} className="return-button">
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Quiz: {currentQuiz.topic}</h2>
        <p>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</p>
      </div>

      <div className="question-container">
        <h3>{currentQuestion.question}</h3>
        <div className="options-container">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`option ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <input
                type="radio"
                name="answer"
                checked={selectedAnswers[currentQuestionIndex] === index}
                onChange={() => handleAnswerSelect(index)}
                id={`option-${index}`}
              />
              <label htmlFor={`option-${index}`}>{option}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="nav-button"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestionIndex] === undefined}
          className="nav-button"
        >
          {currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
