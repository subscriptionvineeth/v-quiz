// Rename the file to gemini.ts since we're using Google's Gemini AI
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Update environment variable name to be more specific
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY;

// Initialize Gemini AI with safety settings
const genAI = new GoogleGenerativeAI(API_KEY);
const generationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// Sample summaries for different types of content
const SAMPLE_SUMMARIES = [
  {
    title: "Introduction to Machine Learning",
    content: `Machine Learning (ML) is a subset of artificial intelligence that enables systems to learn and improve from experience without explicit programming. Key concepts include:

1. Types of Learning:
   - Supervised Learning: Training with labeled data
   - Unsupervised Learning: Finding patterns in unlabeled data
   - Reinforcement Learning: Learning through reward-based feedback

2. Core Components:
   - Data Collection and Preprocessing
   - Feature Selection and Engineering
   - Model Training and Validation
   - Performance Evaluation

3. Common Applications:
   - Image and Speech Recognition
   - Natural Language Processing
   - Recommendation Systems
   - Predictive Analytics

The field continues to evolve with advances in deep learning and neural networks, making it increasingly important in modern technology.`
  },
  {
    title: "Web Development Fundamentals",
    content: `Web development encompasses the essential technologies and practices for building websites and web applications. Key aspects include:

1. Frontend Development:
   - HTML5 for structure
   - CSS3 for styling and layout
   - JavaScript for interactivity
   - Modern frameworks like React and Vue.js

2. Backend Development:
   - Server-side programming (Node.js, Python, etc.)
   - Database management
   - API development
   - Security considerations

3. Best Practices:
   - Responsive design
   - Performance optimization
   - Cross-browser compatibility
   - Accessibility standards

Modern web development emphasizes user experience, performance, and maintainable code structures.`
  },
  {
    title: "Environmental Science Basics",
    content: `Environmental Science studies the interaction between living organisms and their environment. Key areas include:

1. Earth's Systems:
   - Atmosphere and climate
   - Hydrosphere (water systems)
   - Biosphere (living organisms)
   - Lithosphere (earth's crust)

2. Environmental Challenges:
   - Climate change and global warming
   - Pollution and waste management
   - Biodiversity loss
   - Resource depletion

3. Sustainable Solutions:
   - Renewable energy
   - Conservation practices
   - Ecosystem management
   - Green technologies

Understanding these concepts is crucial for addressing current environmental challenges and promoting sustainability.`
  }
];

// Mock response function with realistic summaries
const getMockSummary = (text: string) => {
  // Select a random summary from the samples
  const randomSummary = SAMPLE_SUMMARIES[Math.floor(Math.random() * SAMPLE_SUMMARIES.length)];
  
  return Promise.resolve({
    content: randomSummary.content
  });
};

// Sample quiz questions for each summary
const SAMPLE_QUIZZES = {
  "Machine Learning": [
    {
      question: "What is the main characteristic of supervised learning?",
      options: [
        "Training with labeled data",
        "Finding patterns without labels",
        "Learning through rewards",
        "Random data processing"
      ],
      correctAnswer: 0
    },
    {
      question: "Which of these is NOT a core component of machine learning?",
      options: [
        "Data Collection",
        "Feature Engineering",
        "Social Media Marketing",
        "Model Training"
      ],
      correctAnswer: 2
    },
    {
      question: "What is a common application of machine learning?",
      options: [
        "Cooking recipes",
        "Image recognition",
        "Physical exercise",
        "Furniture design"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the primary goal of machine learning?",
      options: [
        "To replace human intelligence",
        "To enable systems to learn from data",
        "To create complex algorithms",
        "To design computer hardware"
      ],
      correctAnswer: 1
    },
    {
      question: "Which technique helps prevent overfitting in machine learning?",
      options: [
        "Adding more complex features",
        "Increasing training data",
        "Cross-validation",
        "Using more layers in neural networks"
      ],
      correctAnswer: 2
    }
  ],
  "Web Development": [
    {
      question: "Which technology is used for styling web pages?",
      options: [
        "HTML",
        "JavaScript",
        "CSS",
        "Python"
      ],
      correctAnswer: 2
    },
    {
      question: "What is a key consideration in modern web development?",
      options: [
        "Responsive design",
        "Print layout",
        "Television broadcasting",
        "Radio frequencies"
      ],
      correctAnswer: 0
    },
    {
      question: "Which is a popular frontend framework?",
      options: [
        "MySQL",
        "Apache",
        "React",
        "MongoDB"
      ],
      correctAnswer: 2
    },
    {
      question: "What does HTTP stand for?",
      options: [
        "High Transfer Text Protocol",
        "Hypertext Transfer Protocol",
        "Hyper Transmission Text Protocol",
        "High Text Transfer Protocol"
      ],
      correctAnswer: 1
    },
    {
      question: "Which programming language is commonly used for backend development?",
      options: [
        "HTML",
        "CSS",
        "JavaScript",
        "Python"
      ],
      correctAnswer: 3
    }
  ],
  "Environmental Science": [
    {
      question: "Which is NOT one of Earth's major systems?",
      options: [
        "Atmosphere",
        "Technosphere",
        "Hydrosphere",
        "Biosphere"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a key environmental challenge mentioned?",
      options: [
        "Social media addiction",
        "Climate change",
        "Video game design",
        "Fashion trends"
      ],
      correctAnswer: 1
    },
    {
      question: "Which is an example of a sustainable solution?",
      options: [
        "Coal mining",
        "Oil drilling",
        "Renewable energy",
        "Deforestation"
      ],
      correctAnswer: 2
    },
    {
      question: "What is biodiversity?",
      options: [
        "Number of buildings in an area",
        "Variety of life in a particular habitat",
        "Types of rocks in a region",
        "Population of a single species"
      ],
      correctAnswer: 1
    },
    {
      question: "Which gas is primarily responsible for global warming?",
      options: [
        "Oxygen",
        "Nitrogen",
        "Carbon dioxide",
        "Hydrogen"
      ],
      correctAnswer: 2
    }
  ]
};

// Mock quiz generation with realistic questions
const getMockQuiz = (summary: string) => {
  // Determine which quiz set to use based on the summary content
  let quizSet;
  if (summary.toLowerCase().includes("machine learning")) {
    quizSet = SAMPLE_QUIZZES["Machine Learning"];
  } else if (summary.toLowerCase().includes("web development")) {
    quizSet = SAMPLE_QUIZZES["Web Development"];
  } else {
    quizSet = SAMPLE_QUIZZES["Environmental Science"];
  }

  if (!quizSet) {
    // Default to Machine Learning if no match found
    quizSet = SAMPLE_QUIZZES["Machine Learning"];
  }

  return Promise.resolve({
    questions: quizSet
  });
};

// Set this to true to use mock response
const USE_MOCK = true;

export async function generateSummary(text: string) {
  if (USE_MOCK) {
    return getMockSummary(text);
  }

  try {
    if (!API_KEY) {
      throw new Error('API key is not configured. Please add VITE_GOOGLE_API_KEY to your environment variables.');
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig,
      safetySettings,
    });

    const prompt = `Please provide a comprehensive summary of the following text, highlighting key points, important definitions, dates, and main concepts. Make the summary clear and well-structured:\n\n${text}`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      if (!summary) {
        throw new Error('Empty response from API');
      }

      return { content: summary };
    } catch (genError) {
      console.error('Generation Error:', genError);
      throw new Error('Failed to generate summary. The text might be too long or contain unsupported content.');
    }
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      throw new Error(`API connection error: ${error.message}`);
    }
    throw new Error('API connection error. Please try again or contact support.');
  }
}

export async function generateQuiz(summary: string) {
  if (USE_MOCK) {
    return getMockQuiz(summary);
  }

  try {
    if (!API_KEY) {
      throw new Error('API key is not configured. Please add VITE_GOOGLE_API_KEY to your environment variables.');
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig,
      safetySettings,
    });

    const prompt = `Generate 5 multiple-choice questions based on this summary. Each question should have 4 options with only one correct answer. Format your response EXACTLY as a JSON array of objects. Each object should have these exact keys: "question" (string), "options" (array of 4 strings), and "correctAnswer" (number 0-3 indicating the correct option index). Here's the summary:\n\n${summary}\n\nRemember to respond ONLY with the JSON array, no additional text.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const quizText = response.text();

      // Parse the response as JSON
      try {
        const quizData = JSON.parse(quizText);
        if (!Array.isArray(quizData)) {
          throw new Error('Invalid quiz format: expected an array');
        }
        return { questions: quizData };
      } catch (parseError) {
        console.error('Failed to parse quiz response:', parseError);
        console.error('Raw response:', quizText);
        throw new Error('Failed to generate quiz: Invalid response format');
      }
    } catch (genError) {
      console.error('Generation Error:', genError);
      throw new Error('Failed to generate quiz. Please try again with a different or shorter summary.');
    }
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      throw new Error(`API connection error: ${error.message}`);
    }
    throw new Error('API connection error. Please try again or contact support.');
  }
}

// Add types for better TypeScript support
export interface SummaryResponse {
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}