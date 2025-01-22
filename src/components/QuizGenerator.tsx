import { useState } from 'react'
import './QuizGenerator.css'
import { useQuiz } from '../context/QuizContext'
import { useNavigate } from 'react-router-dom'

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const QuizGenerator = () => {
  const { currentQuiz, addQuizResult } = useQuiz()
  const navigate = useNavigate()
  
  console.log('QuizGenerator rendered, currentQuiz:', currentQuiz); // Add this log

  const [userAnswers, setUserAnswers] = useState<number[]>(() => {
    console.log('Initializing userAnswers, currentQuiz:', currentQuiz); // Add this log
    return currentQuiz ? new Array(currentQuiz.length).fill(-1) : [];
  })
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [startTime] = useState<number>(Date.now())

  console.log('Current Quiz:', currentQuiz) // Debug log

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleSubmit = () => {
    if (!currentQuiz) return

    const newScore = userAnswers.reduce((acc, answer, index) => {
      return acc + (currentQuiz[index].correctAnswer === answer ? 1 : 0)
    }, 0)

    setScore(newScore)
    setShowResults(true)

    addQuizResult({
      date: new Date().toISOString(),
      topic: 'Summary Quiz',
      score: newScore,
      totalQuestions: currentQuiz.length,
      timeSpent: Math.floor((Date.now() - startTime) / 1000)
    })
  }

  if (!currentQuiz) {
    return (
      <div className="quiz-container">
        <div className="no-quiz-message">
          <h2>No quiz available</h2>
          <p>Generate a quiz from the summarizer first.</p>
          <button onClick={() => navigate('/')} className="return-button">
            Go to Summarizer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <h2>Quiz Questions</h2>
      <div className="quiz-content">
        {currentQuiz.map((question: QuizQuestion, qIndex: number) => (
          <div key={qIndex} className="question-card">
            <p className="question">{qIndex + 1}. {question.question}</p>
            <div className="options">
              {question.options.map((option, oIndex) => (
                <div 
                  key={oIndex} 
                  className={`option ${
                    showResults 
                      ? oIndex === question.correctAnswer 
                        ? 'correct' 
                        : userAnswers[qIndex] === oIndex 
                          ? 'incorrect' 
                          : ''
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    id={`q${qIndex}-o${oIndex}`}
                    checked={userAnswers[qIndex] === oIndex}
                    onChange={() => handleAnswerSelect(qIndex, oIndex)}
                    disabled={showResults}
                  />
                  <label htmlFor={`q${qIndex}-o${oIndex}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {!showResults ? (
          <button 
            className="submit-button"
            onClick={handleSubmit}
            disabled={userAnswers.includes(-1)}
          >
            Submit Quiz
          </button>
        ) : (
          <div className="results-section">
            <h3>Quiz Results</h3>
            <p className="score">Your score: {score} out of {currentQuiz.length}</p>
            <div className="button-group">
              <button 
                className="retry-button"
                onClick={() => {
                  setUserAnswers(new Array(currentQuiz.length).fill(-1))
                  setShowResults(false)
                  setScore(0)
                }}
              >
                Try Again
              </button>
              <button 
                className="view-progress-btn"
                onClick={() => navigate('/progress')}
              >
                View Progress
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizGenerator 