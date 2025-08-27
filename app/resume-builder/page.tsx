'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ResumePreview from './ResumePreview';
import VoiceInput from './VoiceInput';
import { generateResumePDF } from '@/lib/pdfGenerator';

interface ResumeData {
  id?: number;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  degree: string;
  field: string;
  university: string;
  graduationYear: string;
  skills: string[];
  achievements: string[];
  projects: Array<{ title: string; description: string }>;
  certifications: string[];
  isComplete: boolean;
}

interface Question {
  id: string;
  question: string;
  field: keyof ResumeData;
  type: 'text' | 'array' | 'project';
  placeholder?: string;
  required: boolean;
}

const questions: Question[] = [
  {
    id: 'fullName',
    question: 'What is your full name?',
    field: 'fullName',
    type: 'text',
    placeholder: 'e.g., John Doe',
    required: true
  },
  {
    id: 'title',
    question: 'What is your professional title?',
    field: 'title',
    type: 'text',
    placeholder: 'e.g., Software Engineer',
    required: true
  },
  {
    id: 'email',
    question: 'What is your email address?',
    field: 'email',
    type: 'text',
    placeholder: 'e.g., john.doe@example.com',
    required: true
  },
  {
    id: 'phone',
    question: 'What is your phone number?',
    field: 'phone',
    type: 'text',
    placeholder: 'e.g., +1-123-456-7890',
    required: false
  },
  {
    id: 'location',
    question: 'Where are you located?',
    field: 'location',
    type: 'text',
    placeholder: 'e.g., San Francisco, CA',
    required: false
  },
  {
    id: 'degree',
    question: 'What is your degree?',
    field: 'degree',
    type: 'text',
    placeholder: 'e.g., Bachelor of Science',
    required: false
  },
  {
    id: 'field',
    question: 'What field did you study?',
    field: 'field',
    type: 'text',
    placeholder: 'e.g., Computer Science',
    required: false
  },
  {
    id: 'university',
    question: 'Which university did you attend?',
    field: 'university',
    type: 'text',
    placeholder: 'e.g., University of California, Berkeley',
    required: false
  },
  {
    id: 'graduationYear',
    question: 'When did you graduate?',
    field: 'graduationYear',
    type: 'text',
    placeholder: 'e.g., 2018-2022',
    required: false
  },
  {
    id: 'skills',
    question: 'What are your skills? (Separate with commas)',
    field: 'skills',
    type: 'array',
    placeholder: 'e.g., Python, Java, JavaScript, React',
    required: false
  },
  {
    id: 'achievements',
    question: 'What are your achievements? (Separate with commas)',
    field: 'achievements',
    type: 'array',
    placeholder: 'e.g., Dean\'s List, Hackathon Winner',
    required: false
  },
  {
    id: 'certifications',
    question: 'What certifications do you have? (Separate with commas)',
    field: 'certifications',
    type: 'array',
    placeholder: 'e.g., AWS Certified Developer, Oracle Java Programmer',
    required: false
  }
];

export default function ResumeBuilder() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    degree: '',
    field: '',
    university: '',
    graduationYear: '',
    skills: [],
    achievements: [],
    projects: [],
    certifications: [],
    isComplete: false
  });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [inputMethod, setInputMethod] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await import('@supabase/supabase-js').then(supabase => 
        supabase.createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_KEY!
        ).auth.getUser()
      );

      if (!user) {
        router.push('/login');
        return;
      }

      const profileRes = await fetch(`/api/users?email=${user.email}`);
      if (profileRes.ok) {
        const profiles = await profileRes.json();
        if (profiles.length > 0) {
          setUserProfile(profiles[0]);
          
          // Fetch existing resume data
          const resumeRes = await fetch(`/api/resumes?userId=${profiles[0].id}`);
          if (resumeRes.ok) {
            const existingResume = await resumeRes.json();
            if (existingResume) {
              setResumeData(existingResume);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion.type === 'array') {
      const arrayValue = answer.split(',').map(item => item.trim()).filter(item => item);
      setResumeData(prev => ({
        ...prev,
        [currentQuestion.field]: arrayValue
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        [currentQuestion.field]: answer
      }));
    }

    setTranscription('');
    
    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Add projects section
      handleAddProject();
    }
  };

  const handleAddProject = () => {
    setShowProjectForm(true);
  };

  const addProject = () => {
    if (projectTitle.trim() && projectDescription.trim()) {
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, { title: projectTitle.trim(), description: projectDescription.trim() }]
      }));
      setProjectTitle('');
      setProjectDescription('');
      setShowProjectForm(false);
    }
  };

  const finishResume = () => {
    setShowProjectForm(false);
    finishResumeProcess();
  };

  const finishResumeProcess = async () => {
    setSaving(true);
    try {
      const finalResumeData = {
        ...resumeData,
        isComplete: true
      };

      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...finalResumeData,
          userId: userProfile.id
        })
      });

      if (response.ok) {
        setResumeData(prev => ({ ...prev, isComplete: true }));
        // Success - the download button will appear automatically
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save resume');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      // Show a more user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Error saving resume. Please try again.';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const saveProgress = async () => {
    if (!userProfile) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resumeData,
          userId: userProfile.id
        })
      });
      
      if (response.ok) {
        // Show success feedback
        const saveButton = document.querySelector('[data-save-progress]');
        if (saveButton) {
          const originalText = saveButton.innerHTML;
          saveButton.innerHTML = '<i class="ri-check-line mr-2"></i>Saved!';
          saveButton.className = 'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-green-500/25';
          setTimeout(() => {
            saveButton.innerHTML = '<i class="ri-save-line mr-2"></i>Save Progress';
            saveButton.className = 'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25';
          }, 2000);
        }
      } else {
        throw new Error('Failed to save progress');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Error saving progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4">Loading resume builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-pacifico text-3xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Sharvya
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                Dashboard
              </Link>
              <button
                onClick={saveProgress}
                disabled={saving}
                data-save-progress
                className={`px-4 py-2 rounded-xl transition-all shadow-lg ${
                  saving 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/25'
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line mr-2"></i>
                    Save Progress
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Section */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                Voice Resume Builder
              </h1>
              <p className="text-gray-300 mb-6">Answer questions with your voice to build your professional resume</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            {currentQuestion && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {currentQuestion.question}
                </h2>
                
                {/* Input Method Toggle */}
                <div className="mb-6">
                  <div className="flex justify-center space-x-2 mb-4">
                    <button
                      onClick={() => setInputMethod('voice')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        inputMethod === 'voice'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <i className="ri-mic-line mr-2"></i>
                      Voice Input
                    </button>
                    <button
                      onClick={() => setInputMethod('text')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        inputMethod === 'text'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <i className="ri-keyboard-line mr-2"></i>
                      Text Input
                    </button>
                  </div>
                </div>

                {/* Voice Input */}
                {inputMethod === 'voice' && (
                  <>
                    <VoiceInput
                      onTranscription={setTranscription}
                      isRecording={isRecording}
                      setIsRecording={setIsRecording}
                    />

                    {transcription && (
                      <div className="mt-6">
                        <p className="text-gray-300 mb-4">You said:</p>
                        <p className="text-cyan-400 font-medium mb-4">{transcription}</p>
                        <div className="flex justify-center space-x-4">
                          <button
                            onClick={() => setTranscription('')}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <i className="ri-refresh-line mr-2"></i>
                            Try Again
                          </button>
                          <button
                            onClick={() => handleAnswer(transcription)}
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
                          >
                            <i className="ri-check-line mr-2"></i>
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Text Input */}
                {inputMethod === 'text' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder={currentQuestion.placeholder || 'Type your answer here...'}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && textInput.trim()) {
                            handleAnswer(textInput.trim());
                            setTextInput('');
                          }
                        }}
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setTextInput('')}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <i className="ri-refresh-line mr-2"></i>
                        Clear
                      </button>
                      <button
                        onClick={() => {
                          if (textInput.trim()) {
                            handleAnswer(textInput.trim());
                            setTextInput('');
                          }
                        }}
                        disabled={!textInput.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="ri-check-line mr-2"></i>
                        Submit
                      </button>
                    </div>
                  </div>
                )}

                {currentQuestion.placeholder && (
                  <p className="text-sm text-gray-400 mt-4">
                    Example: {currentQuestion.placeholder}
                  </p>
                )}
              </div>
            )}

            {/* Project Form */}
            {showProjectForm && (
              <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="text-xl font-bold text-white mb-4 text-center">Add Project</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Project Title</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="e.g., E-commerce Website"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Project Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your project..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setShowProjectForm(false)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addProject}
                      disabled={!projectTitle.trim() || !projectDescription.trim()}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Project
                    </button>
                    <button
                      onClick={finishResume}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                      Finish Resume
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(resumeData.isComplete || currentQuestionIndex >= questions.length - 1) && (
              <div className="mt-8 text-center">
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-8 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-check-line text-2xl text-white"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 mb-3">Resume Complete!</h3>
                  <p className="text-gray-300 mb-6 text-lg">Your resume has been saved successfully. You can now download it as a PDF.</p>
                  
                  <div className="space-y-4">
                    {/* Debug Info - Remove in production */}
                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-left">
                      <p className="text-sm text-gray-400 mb-2">Debug Info:</p>
                      <p className="text-xs text-gray-500">Question: {currentQuestionIndex + 1}/{questions.length}</p>
                      <p className="text-xs text-gray-500">Is Complete: {resumeData.isComplete ? 'Yes' : 'No'}</p>
                      <p className="text-xs text-gray-500">Name: {resumeData.fullName || 'Not set'}</p>
                      <p className="text-xs text-gray-500">Email: {resumeData.email || 'Not set'}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        try {
                          generateResumePDF(resumeData);
                          // Show success feedback
                          const downloadButton = document.querySelector('[data-download-resume]');
                          if (downloadButton) {
                            const originalText = downloadButton.innerHTML;
                            downloadButton.innerHTML = '<i class="ri-check-line mr-2"></i>Downloaded!';
                            downloadButton.className = 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 text-lg';
                            setTimeout(() => {
                              downloadButton.innerHTML = '<i class="ri-download-line mr-2"></i>Download PDF Resume';
                              downloadButton.className = 'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 text-lg';
                            }, 2000);
                          }
                        } catch (error) {
                          console.error('Error generating PDF:', error);
                          alert('Error generating PDF. Please try again.');
                        }
                      }}
                      data-download-resume
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 text-lg"
                    >
                      <i className="ri-download-line mr-2"></i>
                      Download PDF Resume
                    </button>
                    
                    {!resumeData.isComplete && (
                      <button
                        onClick={finishResumeProcess}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="ri-save-line mr-2"></i>
                            Mark as Complete
                          </>
                        )}
                      </button>
                    )}
                    
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => {
                          setResumeData(prev => ({ ...prev, isComplete: false }));
                          setCurrentQuestionIndex(0);
                        }}
                        className="bg-gray-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all"
                      >
                        <i className="ri-edit-line mr-2"></i>
                        Edit Resume
                      </button>
                      
                      <button
                        onClick={() => {
                          // Reset all data
                          setResumeData({
                            fullName: '',
                            title: '',
                            email: '',
                            phone: '',
                            location: '',
                            degree: '',
                            field: '',
                            university: '',
                            graduationYear: '',
                            skills: [],
                            achievements: [],
                            projects: [],
                            certifications: [],
                            isComplete: false
                          });
                          setCurrentQuestionIndex(0);
                        }}
                        className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-all"
                      >
                        <i className="ri-refresh-line mr-2"></i>
                        Start New Resume
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Live Preview</h2>
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
} 