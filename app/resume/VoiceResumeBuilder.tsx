'use client';

import { useState, useRef, useEffect } from 'react';

interface ResumeSection {
  id: string;
  title: string;
  content: string;
  isRecording: boolean;
  isComplete: boolean;
}

interface VoiceResumeBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceResumeBuilder({ isOpen, onClose }: VoiceResumeBuilderProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [resumeProgress, setResumeProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [resumeSections, setResumeSections] = useState<ResumeSection[]>([
    {
      id: 'personal',
      title: 'Personal Information',
      content: '',
      isRecording: false,
      isComplete: false
    },
    {
      id: 'summary',
      title: 'Professional Summary',
      content: '',
      isRecording: false,
      isComplete: false
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      content: '',
      isRecording: false,
      isComplete: false
    },
    {
      id: 'experience',
      title: 'Work Experience',
      content: '',
      isRecording: false,
      isComplete: false
    },
    {
      id: 'education',
      title: 'Education',
      content: '',
      isRecording: false,
      isComplete: false
    },
    {
      id: 'achievements',
      title: 'Achievements',
      content: '',
      isRecording: false,
      isComplete: false
    }
  ]);

  const sectionPrompts = {
    personal: "Tell me your full name, phone number, email, and location. Speak clearly.",
    summary: "Describe yourself professionally. What kind of work do you want to do? What are your main strengths?",
    skills: "List all your technical skills, programming languages, tools you know, or any digital skills you have.",
    experience: "Describe any work experience, internships, or projects you've worked on. Include what you did and what you learned.",
    education: "Tell me about your education - school, college, any courses you've completed, or certifications.",
    achievements: "Share any achievements, awards, competitions you've won, or special recognition you've received."
  };

  useEffect(() => {
    const completed = resumeSections.filter(section => section.isComplete).length;
    setResumeProgress((completed / resumeSections.length) * 100);
  }, [resumeSections]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        // Here you would typically send the audio to a speech-to-text service
        simulateTranscription();
      };

      mediaRecorder.start(1000);
      setIsRecording(true);

      // Update section recording state
      setResumeSections(prev => prev.map((section, index) => 
        index === currentSection 
          ? { ...section, isRecording: true }
          : section
      ));

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);

      // Update section recording state
      setResumeSections(prev => prev.map((section, index) => 
        index === currentSection 
          ? { ...section, isRecording: false }
          : section
      ));
    }
  };

  const simulateTranscription = () => {
    // Simulate speech-to-text conversion with realistic content
    const sampleContent = {
      personal: "Sameer Kumar, Phone: +91 9876543210, Email: sameer@email.com, Location: Rural Maharashtra, India",
      summary: "I am a passionate learner interested in web development and programming. I want to build websites and mobile applications to help my community. I am hardworking, eager to learn, and committed to improving my technical skills.",
      skills: "HTML, CSS, JavaScript, Basic Python, Computer Basics, Internet Usage, Mobile App Usage, Voice Communication, Hindi, English, Marathi",
      experience: "Helped local shopkeeper create social media presence, Assisted in village computer training program, Built simple website for local NGO using HTML and CSS, Participated in online coding bootcamp",
      education: "12th Grade completed from Government Higher Secondary School, Basic Computer Course from local training center, Online courses in web development, Self-taught programming through YouTube tutorials",
      achievements: "Won inter-school coding competition, Helped 50+ villagers learn basic computer skills, Created website for local festival that got 1000+ views, Completed 30-day coding challenge"
    };

    const content = sampleContent[resumeSections[currentSection].id as keyof typeof sampleContent] || "Sample content generated from voice input.";
    
    setTranscript(content);
    
    // Update the current section with transcribed content
    setResumeSections(prev => prev.map((section, index) => 
      index === currentSection 
        ? { ...section, content: content, isComplete: true }
        : section
    ));
  };

  const nextSection = () => {
    if (currentSection < resumeSections.length - 1) {
      setCurrentSection(currentSection + 1);
      setTranscript('');
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setTranscript(resumeSections[currentSection - 1].content);
    }
  };

  const generateResume = () => {
    const resumeData = resumeSections.reduce((acc, section) => {
      acc[section.id] = section.content;
      return acc;
    }, {} as Record<string, string>);

    // Create downloadable resume
    const resumeHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume - Sharvya</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #6366f1; border-bottom: 2px solid #6366f1; padding-bottom: 5px; }
          .content { margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Professional Resume</h1>
          <p>Created with Sharvya Voice Resume Builder</p>
        </div>
        ${resumeSections.map(section => `
          <div class="section">
            <h3>${section.title}</h3>
            <div class="content">${section.content}</div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([resumeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-voice-resume.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-purple-500/20 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <i className="ri-file-text-line text-2xl text-white"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Voice Resume Builder</h2>
                <p className="text-purple-300">Create your professional resume using voice</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">Resume Progress</span>
              <span className="text-sm text-purple-400 font-semibold">{Math.round(resumeProgress)}% Complete</span>
            </div>
            <div className="bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${resumeProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Section Navigation */}
          <div className="w-1/3 bg-gray-800/50 p-6 border-r border-gray-700/50 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Resume Sections</h3>
            <div className="space-y-2">
              {resumeSections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentSection(index);
                    setTranscript(section.content);
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all cursor-pointer ${
                    currentSection === index
                      ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/30'
                      : 'bg-gray-700/30 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${currentSection === index ? 'text-white' : 'text-gray-300'}`}>
                      {section.title}
                    </span>
                    <div className="flex items-center space-x-2">
                      {section.isRecording && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      )}
                      {section.isComplete && (
                        <i className="ri-check-line text-green-400 text-sm"></i>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-2">
                {resumeSections[currentSection].title}
              </h3>
              
              {/* Voice Prompt */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-6 border border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="ri-lightbulb-line text-white text-sm"></i>
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">What to say:</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {sectionPrompts[resumeSections[currentSection].id as keyof typeof sectionPrompts]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recording Controls */}
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all transform hover:scale-110 shadow-lg cursor-pointer ${
                    isRecording
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-red-500/30 animate-pulse'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-purple-500/30'
                  }`}
                >
                  <i className={`${isRecording ? 'ri-stop-line' : 'ri-mic-line'} text-white`}></i>
                </button>
                <div className="text-center">
                  <div className={`text-sm font-medium ${isRecording ? 'text-red-400' : 'text-gray-400'}`}>
                    {isRecording ? 'Recording...' : 'Click to record'}
                  </div>
                  {isRecording && (
                    <div className="text-xs text-gray-500 mt-1">Speak clearly into your microphone</div>
                  )}
                </div>
              </div>

              {/* Transcript Display */}
              {transcript && (
                <div className="bg-gray-700/30 rounded-2xl p-6 mb-6 border border-gray-600/30">
                  <h4 className="text-white font-semibold mb-3 flex items-center">
                    <i className="ri-file-text-line mr-2 text-purple-400"></i>
                    Generated Content
                  </h4>
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-300 leading-relaxed">{transcript}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-400">Content automatically generated from your voice</span>
                    <button
                      onClick={() => setTranscript('')}
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                    >
                      <i className="ri-refresh-line mr-1"></i>
                      Re-record
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevSection}
                  disabled={currentSection === 0}
                  className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                    currentSection === 0
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-500 hover:to-gray-600'
                  }`}
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  Previous
                </button>

                {currentSection === resumeSections.length - 1 ? (
                  <button
                    onClick={generateResume}
                    disabled={resumeProgress < 100}
                    className={`px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg cursor-pointer ${
                      resumeProgress === 100
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/25'
                        : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <i className="ri-download-line mr-2"></i>
                    Download Resume
                  </button>
                ) : (
                  <button
                    onClick={nextSection}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 cursor-pointer"
                  >
                    Next
                    <i className="ri-arrow-right-line ml-2"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}