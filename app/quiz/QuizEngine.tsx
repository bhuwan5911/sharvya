'use client';

import { useState, useRef, useEffect } from 'react';

interface QuizQuestion {
  id: number;
  type: 'voice-mcq' | 'open-voice' | 'repeat-after-me' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  audioUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  translations?: {
    [lang: string]: {
      question: string;
      options?: string[];
    }
  };
}

interface QuizEngineProps {
  category: string;
  difficulty: string;
  language: string;
  onQuizComplete: (score: number, totalQuestions: number, correctAnswers: number) => void;
  onClose: () => void;
}



const getBaseQuestions = (category: string): Omit<QuizQuestion, 'id' | 'difficulty' | 'points' | 'translations'>[] => {
  const questionSets = {
    'programming-basics': [
      {
        type: 'voice-mcq' as const,
        question: 'What is a variable in programming?',
        options: ['A storage location', 'A function', 'A loop', 'A condition'],
        correctAnswer: 'A storage location',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Explain what a function does in programming.',
        correctAnswer: 'A function performs a specific task or calculation',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Programming is problem solving with code"',
        correctAnswer: 'Programming is problem solving with code',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'A _____ is a sequence of instructions that repeats.',
        correctAnswer: 'loop',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'What is the purpose of comments in code?',
        options: ['To explain code', 'To run programs', 'To create variables', 'To handle errors'],
        correctAnswer: 'To explain code',
        audioUrl: undefined
      }
    ],
    'web-development': [
      {
        type: 'voice-mcq' as const,
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Code Style Standards'],
        correctAnswer: 'Cascading Style Sheets',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Describe the purpose of JavaScript in web development.',
        correctAnswer: 'JavaScript adds interactivity',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "React is a JavaScript library for building user interfaces"',
        correctAnswer: 'React is a JavaScript library for building user interfaces',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'HTML stands for HyperText _____ Language.',
        correctAnswer: 'Markup',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'Which of these is a CSS framework?',
        options: ['Bootstrap', 'jQuery', 'Node.js', 'MongoDB'],
        correctAnswer: 'Bootstrap',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'What is responsive web design?',
        correctAnswer: 'Design that adapts to different screen sizes',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "DOM stands for Document Object Model"',
        correctAnswer: 'DOM stands for Document Object Model',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'A _____ is a reusable component in React.',
        correctAnswer: 'component',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'What is the purpose of localStorage in web browsers?',
        options: ['Store data permanently', 'Store data temporarily', 'Send HTTP requests', 'Handle user events'],
        correctAnswer: 'Store data permanently',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Explain the difference between GET and POST HTTP methods.',
        correctAnswer: 'GET retrieves data, POST sends data',
        audioUrl: undefined
      }
    ],
    'voice-interaction': [
      {
        type: 'voice-mcq' as const,
        question: 'What is the primary purpose of voice recognition technology?',
        options: ['To play music', 'To convert speech to text', 'To record videos', 'To send emails'],
        correctAnswer: 'To convert speech to text',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Describe how voice assistants like Siri work.',
        correctAnswer: 'Voice assistants use speech recognition to understand commands and respond with actions or information',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Voice commands make technology more accessible"',
        correctAnswer: 'Voice commands make technology more accessible',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'Text-to-speech converts _____ to spoken words.',
        correctAnswer: 'text',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'Which technology enables computers to understand human speech?',
        options: ['Voice Recognition', 'Image Processing', 'Data Mining', 'Network Security'],
        correctAnswer: 'Voice Recognition',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'What are the benefits of voice interaction in applications?',
        correctAnswer: 'Voice interaction improves accessibility, hands-free operation, and natural communication',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Voice biometrics can identify users by their voice"',
        correctAnswer: 'Voice biometrics can identify users by their voice',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'Speech _____ converts spoken words to text.',
        correctAnswer: 'recognition',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'What is the main advantage of voice-controlled interfaces?',
        options: ['They are cheaper', 'They improve accessibility for disabled users', 'They use less battery', 'They are faster to type'],
        correctAnswer: 'They improve accessibility for disabled users',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'How can voice technology improve accessibility?',
        correctAnswer: 'Voice technology helps people with disabilities interact with devices and access information more easily',
        audioUrl: undefined
      }
    ],
    'data-structures': [
      {
        type: 'voice-mcq' as const,
        question: 'What is an array in programming?',
        options: ['A collection of similar data types', 'A function', 'A variable', 'A loop'],
        correctAnswer: 'A collection of similar data types',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Explain the difference between an array and an object.',
        correctAnswer: 'Arrays store ordered data with numeric indices, objects store key-value pairs',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Data structures organize and store data efficiently"',
        correctAnswer: 'Data structures organize and store data efficiently',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'A _____ is a data structure that stores key-value pairs.',
        correctAnswer: 'object',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'Which data structure uses LIFO (Last In, First Out)?',
        options: ['Queue', 'Stack', 'Array', 'Object'],
        correctAnswer: 'Stack',
        audioUrl: undefined
      }
    ],
    'problem-solving': [
      {
        type: 'voice-mcq' as const,
        question: 'What is the first step in problem solving?',
        options: ['Write code', 'Understand the problem', 'Test the solution', 'Debug errors'],
        correctAnswer: 'Understand the problem',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Describe the process of breaking down a complex problem.',
        correctAnswer: 'Breaking down involves dividing a complex problem into smaller, manageable sub-problems',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Algorithm design is systematic problem solving"',
        correctAnswer: 'Algorithm design is systematic problem solving',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'A _____ is a step-by-step solution to a problem.',
        correctAnswer: 'algorithm',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'What is the purpose of pseudocode?',
        options: ['To write final code', 'To plan algorithms in plain language', 'To debug programs', 'To optimize performance'],
        correctAnswer: 'To plan algorithms in plain language',
        audioUrl: undefined
      }
    ],
    'career-guidance': [
      {
        type: 'voice-mcq' as const,
        question: 'What is a common entry-level role in tech?',
        options: ['CEO', 'Junior Developer', 'CTO', 'Senior Architect'],
        correctAnswer: 'Junior Developer',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Describe the skills needed for a frontend developer role.',
        correctAnswer: 'Frontend developers need HTML, CSS, JavaScript, and knowledge of frameworks like React',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Continuous learning is essential in tech careers"',
        correctAnswer: 'Continuous learning is essential in tech careers',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'A _____ is a collection of your best work for job applications.',
        correctAnswer: 'portfolio',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'Which is most important for career growth in tech?',
        options: ['Having a degree', 'Building projects', 'Networking', 'All of the above'],
        correctAnswer: 'All of the above',
        audioUrl: undefined
      }
    ],
    'voice-interaction': [
      {
        type: 'voice-mcq' as const,
        question: 'What is the primary purpose of voice recognition technology?',
        options: ['To play music', 'To convert speech to text', 'To record videos', 'To send emails'],
        correctAnswer: 'To convert speech to text',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Describe how voice assistants like Siri work.',
        correctAnswer: 'Voice assistants use speech recognition to understand commands and respond with actions or information',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Voice commands make technology more accessible"',
        correctAnswer: 'Voice commands make technology more accessible',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'Text-to-speech converts _____ to spoken words.',
        correctAnswer: 'text',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'Which technology enables computers to understand human speech?',
        options: ['Voice Recognition', 'Image Processing', 'Data Mining', 'Network Security'],
        correctAnswer: 'Voice Recognition',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'What are the benefits of voice interaction in applications?',
        correctAnswer: 'Voice interaction improves accessibility, hands-free operation, and natural communication',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Voice biometrics can identify users by their voice"',
        correctAnswer: 'Voice biometrics can identify users by their voice',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'Speech _____ converts spoken words to text.',
        correctAnswer: 'recognition',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'What is the main advantage of voice-controlled interfaces?',
        options: ['They are cheaper', 'They improve accessibility for disabled users', 'They use less battery', 'They are faster to type'],
        correctAnswer: 'They improve accessibility for disabled users',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'How can voice technology improve accessibility?',
        correctAnswer: 'Voice technology helps people with disabilities interact with devices and access information more easily',
        audioUrl: undefined
      }
    ],
    'data-structures': [
      {
        type: 'voice-mcq' as const,
        question: 'What is an array in programming?',
        options: ['A collection of similar data types', 'A function', 'A variable', 'A loop'],
        correctAnswer: 'A collection of similar data types',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Explain the difference between an array and an object.',
        correctAnswer: 'Arrays store ordered data with numeric indices, objects store key-value pairs',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Data structures organize and store data efficiently"',
        correctAnswer: 'Data structures organize and store data efficiently',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'A _____ is a data structure that stores key-value pairs.',
        correctAnswer: 'object',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'Which data structure uses LIFO (Last In, First Out)?',
        options: ['Queue', 'Stack', 'Array', 'Object'],
        correctAnswer: 'Stack',
        audioUrl: undefined
      }
    ],
    'problem-solving': [
      {
        type: 'voice-mcq' as const,
        question: 'What is the first step in problem solving?',
        options: ['Write code', 'Understand the problem', 'Test the solution', 'Debug errors'],
        correctAnswer: 'Understand the problem',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Describe the process of breaking down a complex problem.',
        correctAnswer: 'Breaking down involves dividing a complex problem into smaller, manageable sub-problems',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Algorithm design is systematic problem solving"',
        correctAnswer: 'Algorithm design is systematic problem solving',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'A _____ is a step-by-step solution to a problem.',
        correctAnswer: 'algorithm',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'What is the purpose of pseudocode?',
        options: ['To write final code', 'To plan algorithms in plain language', 'To debug programs', 'To optimize performance'],
        correctAnswer: 'To plan algorithms in plain language',
        audioUrl: undefined
      }
    ],
    'career-guidance': [
      {
        type: 'voice-mcq' as const,
        question: 'What is a common entry-level role in tech?',
        options: ['CEO', 'Junior Developer', 'CTO', 'Senior Architect'],
        correctAnswer: 'Junior Developer',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Describe the skills needed for a frontend developer role.',
        correctAnswer: 'Frontend developers need HTML, CSS, JavaScript, and knowledge of frameworks like React',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Continuous learning is essential in tech careers"',
        correctAnswer: 'Continuous learning is essential in tech careers',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'A _____ is a collection of your best work for job applications.',
        correctAnswer: 'portfolio',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'Which is most important for career growth in tech?',
        options: ['Having a degree', 'Building projects', 'Networking', 'All of the above'],
        correctAnswer: 'All of the above',
        audioUrl: undefined
      }
    ],
    'voice-interaction': [
      {
        type: 'voice-mcq' as const,
        question: 'What is the primary purpose of voice recognition technology?',
        options: ['To play music', 'To convert speech to text', 'To record videos', 'To send emails'],
        correctAnswer: 'To convert speech to text',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'Describe how voice assistants like Siri work.',
        correctAnswer: 'Voice assistants use speech recognition to understand commands and respond with actions or information',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Voice commands make technology more accessible"',
        correctAnswer: 'Voice commands make technology more accessible',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'Text-to-speech converts _____ to spoken words.',
        correctAnswer: 'text',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'Which technology enables computers to understand human speech?',
        options: ['Voice Recognition', 'Image Processing', 'Data Mining', 'Network Security'],
        correctAnswer: 'Voice Recognition',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'What are the benefits of voice interaction in applications?',
        correctAnswer: 'Voice interaction improves accessibility, hands-free operation, and natural communication',
        audioUrl: undefined
      },
      {
        type: 'repeat-after-me' as const,
        question: 'Repeat this: "Voice biometrics can identify users by their voice"',
        correctAnswer: 'Voice biometrics can identify users by their voice',
        audioUrl: undefined
      },
      {
        type: 'fill-blank' as const,
        question: 'Speech _____ converts spoken words to text.',
        correctAnswer: 'recognition',
        audioUrl: undefined
      },
      {
        type: 'voice-mcq' as const,
        question: 'What is the main advantage of voice-controlled interfaces?',
        options: ['They are cheaper', 'They improve accessibility for disabled users', 'They use less battery', 'They are faster to type'],
        correctAnswer: 'They improve accessibility for disabled users',
        audioUrl: undefined
      },
      {
        type: 'open-voice' as const,
        question: 'How can voice technology improve accessibility?',
        correctAnswer: 'Voice technology helps people with disabilities interact with devices and access information more easily',
        audioUrl: undefined
      }
    ]
  };

  return questionSets[category as keyof typeof questionSets] || [];
};



export default function QuizEngine({ category, difficulty, language, onQuizComplete, onClose }: QuizEngineProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [showSetup, setShowSetup] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper function for translations - must be defined before generateQuestions
  const getTranslations = (question: any, lang: string) => {
    // Simple translation mapping - in a real app, you'd use a translation service
    const translations: { [key: string]: any } = {
      'es': {
        'What is HTML primarily used for?': '¿Para qué se usa principalmente HTML?',
        'Creating web page structure': 'Crear estructura de páginas web',
        'Programming logic': 'Lógica de programación',
        'Database management': 'Gestión de bases de datos',
        'Mobile app development': 'Desarrollo de aplicaciones móviles'
      },
      'hi': {
        'What is HTML primarily used for?': 'HTML मुख्य रूप से किसके लिए उपयोग किया जाता है?',
        'Creating web page structure': 'वेब पेज संरचना बनाना',
        'Programming logic': 'प्रोग्रामिंग लॉजिक',
        'Database management': 'डेटाबेस प्रबंधन',
        'Mobile app development': 'मोबाइल ऐप विकास'
      }
    };

    return translations[lang] || {};
  };

  // Generate questions based on category, difficulty, and language
  const generateQuestions = (): QuizQuestion[] => {
    const baseQuestions = getBaseQuestions(category);
    return baseQuestions.map((q, index) => ({
      ...q,
      id: index + 1,
      difficulty: selectedDifficulty as 'easy' | 'medium' | 'hard',
      points: selectedDifficulty === 'easy' ? 10 : selectedDifficulty === 'medium' ? 15 : 20,
      translations: getTranslations(q, selectedLanguage)
    }));
  };

  const questions = generateQuestions();
  const currentQ = questions[currentQuestion];

  const difficulties = [
    { id: 'easy', name: 'Easy', color: 'from-green-500 to-emerald-600', points: 10 },
    { id: 'medium', name: 'Medium', color: 'from-yellow-500 to-orange-600', points: 15 },
    { id: 'hard', name: 'Hard', color: 'from-red-500 to-pink-600', points: 20 }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  // Helper to get translated question/options
  const getTranslated = (q: QuizQuestion) => {
    if (selectedLanguage !== 'en' && q.translations && q.translations[selectedLanguage]) {
      return {
        question: q.translations[selectedLanguage].question,
        options: q.translations[selectedLanguage].options || q.options
      };
    }
    return { question: q.question, options: q.options };
  };

  const { question, options } = getTranslated(currentQ || { question: '', options: [] });

  useEffect(() => {
    if (quizStarted && currentQ?.audioUrl) {
      playQuestionAudio();
    }
  }, [currentQuestion, quizStarted]);

  const playQuestionAudio = () => {
    try {
      if (currentQ?.audioUrl) {
      const audio = new Audio(currentQ.audioUrl);
        audio.play().catch(error => {
          console.warn('Error playing audio:', error);
        });
      } else if (currentQ?.question) {
      // Use speech synthesis for text-to-speech
      const utterance = new SpeechSynthesisUtterance(currentQ.question);
        utterance.lang = selectedLanguage;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.warn('Error in playQuestionAudio:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      setIsRecording(true);
      setRecordingTime(0);
      setTranscription('');
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      mediaRecorder.start();
      
      // Simulate speech recognition
      setTimeout(() => {
        stopRecording();
      }, 5000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Simulate transcription
      setTimeout(() => {
        const sampleAnswers = {
          'voice-mcq': ['B', 'A markup language', 'Option B'],
          'open-voice': ['Variables store data values', 'HTML is a markup language', 'JavaScript is programming'],
          'repeat-after-me': ['A loop repeats code', 'Functions execute tasks', 'Arrays store multiple values'],
          'fill-blank': ['Variable', 'Function', 'Array']
        };
        
        const answers = sampleAnswers[currentQ.type] || ['Sample answer'];
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        setTranscription(randomAnswer);
      }, 1500);
    }
  };

  const handleMCQAnswer = (option: string) => {
    setSelectedOption(option);
    setTranscription(option);
    setTimeout(() => {
      submitAnswer(option);
    }, 500);
  };

  const submitAnswer = (answer: string) => {
    try {
      if (!currentQ) {
        console.warn('No current question available');
        return;
      }

    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);
    
    // Check if answer is correct
    let isCorrect = false;
    if (currentQ.type === 'voice-mcq' || currentQ.type === 'fill-blank') {
      isCorrect = answer.toLowerCase().includes(currentQ.correctAnswer.toLowerCase());
    } else if (currentQ.type === 'repeat-after-me') {
      isCorrect = answer.toLowerCase().includes(currentQ.correctAnswer.toLowerCase());
    } else {
      // For open-voice, give points for any reasonable answer
      isCorrect = answer.length > 10;
    }
    
    if (isCorrect) {
        setScore(prev => prev + (currentQ.points || 0));
    }
    
    // Move to next question or finish quiz
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setTranscription('');
        setSelectedOption(null);
      }, 2000);
    } else {
      setTimeout(() => {
        setShowResult(true);
          const correctAnswers = newAnswers.filter((ans, idx) => {
            const q = questions[idx];
            if (!q) return false;
            if (q.type === 'voice-mcq' || q.type === 'fill-blank') {
              return ans.toLowerCase().includes(q.correctAnswer.toLowerCase());
            } else if (q.type === 'repeat-after-me') {
              return ans.toLowerCase().includes(q.correctAnswer.toLowerCase());
            } else {
              return ans.length > 10;
            }
          }).length;
          onQuizComplete(score + (isCorrect ? (currentQ.points || 0) : 0), questions.length, correctAnswers);
      }, 2000);
      }
    } catch (error) {
      console.error('Error in submitAnswer:', error);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (showSetup) {
    return (
      <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-2xl w-full p-8 border border-cyan-500/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-400/25">
              <i className="ri-settings-3-line text-3xl text-white"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Quiz Setup</h2>
            <p className="text-gray-300">Choose your difficulty level and preferred language</p>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Select Difficulty</h3>
            <div className="grid grid-cols-3 gap-4">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDifficulty === diff.id
                      ? `bg-gradient-to-r ${diff.color} border-transparent text-white`
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">{diff.name}</div>
                  <div className="text-sm opacity-80">{diff.points} points per question</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Select Language</h3>
            <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedLanguage === lang.code
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 border-transparent text-white'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-purple-500/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-xs">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>
            
          {/* Quiz Info */}
          <div className="bg-gray-700/50 rounded-xl p-4 mb-8">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                <div className="text-2xl font-bold text-cyan-400">10</div>
                  <div className="text-xs text-gray-400">Questions</div>
                </div>
                <div>
                <div className="text-2xl font-bold text-purple-400">
                  {difficulties.find(d => d.id === selectedDifficulty)?.points * 10 || 100}
                </div>
                  <div className="text-xs text-gray-400">Max Points</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
              onClick={() => {
                setShowSetup(false);
                setQuizStarted(true);
              }}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-play-line mr-2"></i>
                Start Quiz
              </button>
              <button
                onClick={onClose}
                className="w-full bg-gray-700 text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-colors whitespace-nowrap cursor-pointer"
              >
              Cancel
              </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return null;
  }

  if (showResult) {
    const percentage = Math.round((score / questions.reduce((sum, q) => sum + q.points, 0)) * 100);
    
    return (
      <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-md w-full p-8 border border-green-500/20 shadow-2xl">
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
              percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-green-400/25' :
              percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-yellow-400/25' :
              'bg-gradient-to-r from-red-400 to-pink-500 shadow-red-400/25'
            }`}>
              <i className={`text-4xl text-white ${
                percentage >= 80 ? 'ri-trophy-line' :
                percentage >= 60 ? 'ri-medal-line' :
                'ri-emotion-line'
              }`}></i>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-2">
              {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Learning!'}
            </h2>
            <p className="text-gray-300 mb-6">You scored {score} out of {questions.reduce((sum, q) => sum + q.points, 0)} points</p>
            
            <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-white mb-2">{percentage}%</div>
              <div className="w-full bg-gray-600 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    'bg-gradient-to-r from-red-400 to-pink-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              {percentage >= 80 && (
                <div className="text-green-400 font-medium">
                  <i className="ri-star-line mr-2"></i>
                  New Badge Earned!
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-arrow-right-line mr-2"></i>
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg text-sm font-medium">
                Score: {score}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <i className="ri-questionnaire-line text-white"></i>
              </div>
              <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-lg text-sm font-medium capitalize">
                {currentQ.type.replace('-', ' ')} • {currentQ.points} pts
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">{question}</h3>
            
            <button
              onClick={playQuestionAudio}
              className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
            >
              <i className="ri-volume-up-line mr-2"></i>
              Play Audio
            </button>
          </div>

          {/* MCQ Options */}
          {currentQ.type === 'voice-mcq' && options && (
            <div className="space-y-3 mb-6">
              <p className="text-gray-300 text-sm mb-4">Choose the correct answer:</p>
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMCQAnswer(option)}
                  className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-[1.02] border whitespace-nowrap cursor-pointer ${
                    selectedOption === option
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/25'
                      : 'bg-gray-700/50 text-white hover:bg-gray-600/50 border-gray-600 hover:border-cyan-500/50'
                  }`}
                >
                  <span className={`font-medium mr-3 ${
                    selectedOption === option ? 'text-white' : 'text-cyan-400'
                  }`}>
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Voice Recording Section */}
          {(currentQ.type !== 'voice-mcq' || !options) && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-300 mb-6">
                  {currentQ.type === 'open-voice' && 'Share your thoughts in your own words'}
                  {currentQ.type === 'repeat-after-me' && 'Listen and repeat exactly what you heard'}
                  {currentQ.type === 'fill-blank' && 'Say the missing word to complete the sentence'}
                </p>
                
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center hover:from-red-600 hover:to-pink-700 transition-all transform hover:scale-110 shadow-lg shadow-red-500/25 cursor-pointer"
                    >
                      <i className="ri-mic-line text-3xl text-white"></i>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors animate-pulse cursor-pointer"
                    >
                      <i className="ri-stop-line text-3xl text-white"></i>
                    </button>
                  )}
                  
                  {isRecording && (
                    <div className="text-red-400 font-mono text-xl">
                      {formatTime(recordingTime)}
                    </div>
                  )}
                </div>
              </div>
              
              {transcription && (
                <div className="bg-gray-700/50 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="ri-file-text-line text-green-400"></i>
                    <span className="text-green-400 font-medium">Your Answer:</span>
                  </div>
                  <p className="text-white">{transcription}</p>
                  <button
                    onClick={() => submitAnswer(transcription)}
                    className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-medium whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Submit Answer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}