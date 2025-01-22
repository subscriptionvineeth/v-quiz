import { useState, useRef, DragEvent } from 'react'
import './TextbookSummarizer.css'
import { generateSummary as generateAPISummary, generateQuiz, QuizQuestion } from '../api/anthropic'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

const TextbookSummarizer = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [loadingStatus, setLoadingStatus] = useState<string>('')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizLoading, setQuizLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setCurrentQuiz } = useQuiz()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    setError('')
    
    if (uploadedFile) {
      if (uploadedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        return
      }
      setFile(uploadedFile)
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    setError('')

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        return
      }
      setFile(droppedFile)
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const generateSummary = async () => {
    if (!file) return
    setLoading(true)
    setError('')

    try {
      setLoadingStatus('Processing your document...')
      const data = await generateAPISummary('mock_text')
      
      if (!data.content) {
        throw new Error('Unexpected API response format')
      }
      
      setSummary(data.content)
      setLoading(false)
      setLoadingStatus('')
    } catch (error) {
      console.error('Error generating summary:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while generating the summary')
      setLoading(false)
      setLoadingStatus('')
    }
  }

  const handleGenerateQuiz = async () => {
    if (!summary) return
    
    setQuizLoading(true)
    setError('')

    try {
      const data = await generateQuiz(summary)
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid quiz data received')
      }
      
      setQuiz(data.questions)
      setCurrentQuiz(data.questions)
      setShowQuiz(true)
      setQuizLoading(false)
      navigate('/quiz')
    } catch (error) {
      console.error('Error generating quiz:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while generating the quiz')
      setQuizLoading(false)
    }
  }

  return (
    <div className="summarizer-container">
      <h2>Textbook Summarizer</h2>
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="file-input"
          style={{ display: 'none' }}
        />
        <div className="upload-content">
          <svg
            className="upload-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="upload-text">
            {file 
              ? file.name 
              : 'Drag & drop your PDF here or click to browse'}
          </p>
          <p className="upload-hint">Maximum file size: 5MB</p>
        </div>
      </div>

      {file && (
        <button 
          onClick={generateSummary}
          disabled={loading}
          className="generate-button"
        >
          {loading ? 'Generating...' : 'Generate Summary'}
        </button>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-indicator">
          <p>{loadingStatus}</p>
        </div>
      )}

      {summary && (
        <div className="summary-section">
          <h3>Summary</h3>
          <div className="summary-content">
            {summary.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="summary-actions">
            <button
              onClick={() => {
                navigator.clipboard.writeText(summary)
              }}
              className="action-button"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={handleGenerateQuiz}
              disabled={quizLoading}
              className="action-button quiz-button"
            >
              {quizLoading ? 'Generating Quiz...' : 'Generate Quiz'}
            </button>
          </div>
        </div>
      )}

      {showQuiz && quiz.length > 0 && (
        <div className="quiz-section">
          <h3>Quiz</h3>
          {quiz.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <p className="question">{question.question}</p>
              <div className="options">
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="option">
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      id={`q${qIndex}-o${oIndex}`}
                    />
                    <label htmlFor={`q${qIndex}-o${oIndex}`}>{option}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TextbookSummarizer