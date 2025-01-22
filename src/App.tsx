import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import TextbookSummarizer from './components/TextbookSummarizer'
import QuizGenerator from './components/QuizGenerator'
import ProgressTracker from './components/ProgressTracker'
import { QuizProvider } from './context/QuizContext'
import './App.css'

function App() {
  return (
    <QuizProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<TextbookSummarizer />} />
              <Route path="/quiz" element={<QuizGenerator />} />
              <Route path="/progress" element={<ProgressTracker />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QuizProvider>
  )
}

export default App