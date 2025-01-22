import { createContext, useContext, useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResult {
  date: string;
  topic: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

interface QuizContextType {
  quizResults: QuizResult[];
  currentQuiz: QuizQuestion[] | null;
  setCurrentQuiz: (quiz: QuizQuestion[]) => void;
  addQuizResult: (result: QuizResult) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion[] | null>(null);

  const addQuizResult = (result: QuizResult) => {
    setQuizResults(prev => [...prev, result]);
  };

  return (
    <QuizContext.Provider value={{ quizResults, currentQuiz, setCurrentQuiz, addQuizResult }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};