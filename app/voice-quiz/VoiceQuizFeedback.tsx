'use client';

import { useState, useRef, useEffect } from 'react';

interface VoiceQuizFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback: string;
  tips: string[];
}

export default function VoiceQuizFeedback({ isOpen, onClose }: VoiceQuizFeedbackProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [score, setScore] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: "What does HTML stand for?",
      correctAnswer: "hypertext markup language",
      userAnswer: "",
      isCorrect: false,
      feedback: "",
      tips: []
    },
    {
      id: 2,
      question: "Which programming language is used for web styling?",
      correctAnswer: "css",
      userAnswer: "",
      isCorrect: false,
      feedback: "",
      tips: []
    },
    {
      id: 3,
      question: "What does API stand for in programming?",
      correctAnswer: "application programming interface",
      userAnswer: "",
      isCorrect: false,
      feedback: "",
      tips: []
    },
    {
      id: 4,
      question: "Which symbol is used for comments in JavaScript?",
      correctAnswer: "double slash",
      userAnswer: "",
      isCorrect: false,
      feedback: "",
      tips: []
    },
    {
      id: 5,
      question: "What does responsive design mean in web development?",
      correctAnswer: "design that adapts to different screen sizes",
      userAnswer: "",
      isCorrect: false,
      feedback: "",
      tips: []
    }
  ]);

  const currentQuestion = questions[currentQuestionIndex];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Here you would typically send audio to speech-to-text service
          simulateVoiceRecognition();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const simulateVoiceRecognition = () => {
    // Simulate speech-to-text with some realistic answers
    const sampleAnswers = [
      "hypertext markup language",
      "css cascading style sheets",
      "application programming interface",
      "double slash or forward slash",
      "design that works on mobile and desktop"
    ];
    
    const answer = sampleAnswers[currentQuestionIndex] || "I'm not sure";
    setUserAnswer(answer);
    checkAnswer(answer);
  };

  const checkAnswer = (answer: string) => {
    const isCorrect = answer.toLowerCase().includes(currentQuestion.correctAnswer.toLowerCase());
    
    let feedback = "";
    let tips: string[] = [];
    
    if (isCorrect) {
      feedback = "🎉 Excellent! Your answer is correct!";
      tips = [
        "Great job! You have a solid understanding of this concept.",
        "Keep up the excellent work with your learning journey.",
        "This shows you're paying attention to the details."
      ];
    } else {
      feedback = "🤔 Not quite right, but great effort!";
      
      switch (currentQuestionIndex) {
        case 0:
          tips = [
            "HTML stands for HyperText Markup Language",
            "It's the standard language for creating web pages",
            "Think of it as the skeleton or structure of websites"
          ];
          break;
        case 1:
          tips = [
            "CSS stands for Cascading Style Sheets",
            "It's used to style and layout web pages",
            "CSS controls colors, fonts, spacing, and design"
          ];
          break;
        case 2:
          tips = [
            "API stands for Application Programming Interface",
            "It allows different software applications to communicate",
            "Think of it as a messenger between different programs"
          ];
          break;
        case 3:
          tips = [
            "JavaScript uses // for single-line comments",
            "You can also use /* */ for multi-line comments",
            "Comments help explain code to other developers"
          ];
          break;
        case 4:
          tips = [
            "Responsive design adapts to different screen sizes",
            "It ensures websites work on phones, tablets, and computers",
            "Uses flexible layouts and media queries"
          ];
          break;
      }
    }

    // Update question with user's answer and feedback
    setQuestions(prev => prev.map((q, index) => 
      index === currentQuestionIndex 
        ? { ...q, userAnswer: answer, isCorrect, feedback, tips }
        : q
    ));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowFeedback(false);
    setQuizComplete(false);
    setScore(0);
    setQuestions(prev => prev.map(q => ({
      ...q,
      userAnswer: '',
      isCorrect: false,
      feedback: '',
      tips: []
    })));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-purple-500/20 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <i className="ri-mic-line text-2xl text-white"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Voice Quiz with Instant Feedback</h2>
                <p className="text-pink-300">Speak your answers and get immediate guidance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          {!quizComplete && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Progress</span>
                <span className="text-sm text-pink-400 font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh]">
          {!quizComplete ? (
            <div className="max-w-2xl mx-auto">
              {/* Question */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{currentQuestionIndex + 1}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{currentQuestion.question}</h3>
                <p className="text-gray-400">Speak your answer clearly into the microphone</p>
              </div>

              {/* Voice Recording */}
              {!showFeedback && (
                <div className="text-center mb-8">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all transform hover:scale-110 shadow-lg cursor-pointer ${
                      isRecording
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-red-500/30 animate-pulse'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 shadow-pink-500/30'
                    }`}
                  >
                    <i className={`${isRecording ? 'ri-stop-line' : 'ri-mic-line'} text-white`}></i>
                  </button>
                  <p className={`mt-4 font-medium ${isRecording ? 'text-red-400' : 'text-gray-400'}`}>
                    {isRecording ? 'Recording... Speak now!' : 'Click to record your answer'}
                  </p>
                  {isRecording && (
                    <p className="text-sm text-gray-500 mt-2">
                      <i className="ri-volume-up-line mr-1"></i>
                      Listening for your voice...
                    </p>
                  )}
                </div>
              )}

              {/* User Answer Display */}
              {userAnswer && (
                <div className="bg-gray-700/30 rounded-2xl p-6 mb-6 border border-gray-600/30">
                  <h4 className="text-white font-semibold mb-2 flex items-center">
                    <i className="ri-chat-voice-line mr-2 text-pink-400"></i>
                    Your Answer:
                  </h4>
                  <p className="text-gray-300 text-lg">{userAnswer}</p>
                </div>
              )}

              {/* Instant Feedback */}
              {showFeedback && (
                <div className={`rounded-2xl p-6 mb-6 border ${
                  currentQuestion.isCorrect 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-yellow-500/10 border-yellow-500/30'
                }`}>
                  <h4 className={`font-bold text-xl mb-4 ${
                    currentQuestion.isCorrect ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {currentQuestion.feedback}
                  </h4>
                  
                  {!currentQuestion.isCorrect && (
                    <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                      <h5 className="text-white font-semibold mb-2">
                        <i className="ri-lightbulb-line mr-2 text-yellow-400"></i>
                        Correct Answer:
                      </h5>
                      <p className="text-gray-300 capitalize">{currentQuestion.correctAnswer}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h5 className={`font-semibold ${
                      currentQuestion.isCorrect ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      <i className="ri-star-line mr-2"></i>
                      Learning Tips:
                    </h5>
                    {currentQuestion.tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          currentQuestion.isCorrect ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        <p className="text-gray-300 text-sm">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Button */}
              {showFeedback && (
                <div className="text-center">
                  <button
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-pink-500/25 cursor-pointer"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>Next Question <i className="ri-arrow-right-line ml-2"></i></>
                    ) : (
                      <>View Results <i className="ri-trophy-line ml-2"></i></>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Complete */
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-trophy-line text-4xl text-white"></i>
              </div>
              
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
                Quiz Complete!
              </h2>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-8 mb-8 border border-pink-500/20">
                <div className="text-6xl font-bold text-pink-400 mb-2">{score}/{questions.length}</div>
                <div className="text-xl text-gray-300 mb-4">
                  {score === questions.length ? 'Perfect Score! 🎉' : 
                   score >= questions.length * 0.8 ? 'Excellent Work! 🌟' :
                   score >= questions.length * 0.6 ? 'Good Job! 👍' : 'Keep Learning! 💪'}
                </div>
                <div className="text-gray-400">
                  You got {Math.round((score / questions.length) * 100)}% correct
                </div>
              </div>

              {/* Question Review */}
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Review Your Answers:</h3>
                {questions.map((q, index) => (
                  <div key={q.id} className="bg-gray-800/50 rounded-xl p-4 text-left">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        q.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        <i className={`${q.isCorrect ? 'ri-check-line' : 'ri-close-line'} text-white`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">{q.question}</p>
                        <p className="text-gray-400 text-sm">Your answer: {q.userAnswer}</p>
                        {!q.isCorrect && (
                          <p className="text-green-400 text-sm">Correct: {q.correctAnswer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={restartQuiz}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-pink-500/25 cursor-pointer"
                >
                  <i className="ri-refresh-line mr-2"></i>
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                >
                  <i className="ri-home-line mr-2"></i>
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}