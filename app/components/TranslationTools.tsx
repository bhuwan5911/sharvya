'use client';

import { useState, useRef } from 'react';

interface TranslationToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TranslationTools({ isOpen, onClose }: TranslationToolsProps) {
  const [activeTab, setActiveTab] = useState('voice-to-text');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [selectedInputLanguage, setSelectedInputLanguage] = useState('english');
  const [selectedOutputLanguage, setSelectedOutputLanguage] = useState('hindi');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'gujarati', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'marathi', name: 'Marathi', flag: '🇮🇳' },
    { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
    { code: 'bengali', name: 'Bengali', flag: '🇮🇳' },
    { code: 'telugu', name: 'Telugu', flag: '🇮🇳' },
    { code: 'punjabi', name: 'Punjabi', flag: '🇮🇳' }
  ];

  const sampleTranslations = {
    'english-hindi': 'मैं कोडिंग सीखना चाहता हूं',
    'english-gujarati': 'હું કોડિંગ શીખવા માંગુ છું',
    'english-marathi': 'मला कोडिंग शिकायचे आहे',
    'english-tamil': 'எனக்கு கோடிங் கற்க வேண்டும்',
    'english-bengali': 'আমি কোডিং শিখতে চাই',
    'english-telugu': 'నేను కోడింగ్ నేర్చుకోవాలని అనుకుంటున్నాను',
    'english-punjabi': 'ਮੈਂ ਕੋਡਿੰਗ ਸਿੱਖਣਾ ਚਾਹੁੰਦਾ ਹਾਂ',
    'hindi-english': 'I want to learn coding',
    'gujarati-english': 'I want to learn coding',
    'marathi-english': 'I want to learn coding',
    'tamil-english': 'I want to learn coding',
    'bengali-english': 'I want to learn coding',
    'telugu-english': 'I want to learn coding',
    'punjabi-english': 'I want to learn coding'
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        stopRecording();
      }, 3000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Simulate voice-to-text conversion
    const sampleTexts = [
      'Hello, I want to learn programming',
      'Can you help me with web development?',
      'I need guidance for my career',
      'How do I start learning to code?'
    ];
    
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setVoiceText(randomText);
  };

  const translateText = () => {
    const translationKey = `${selectedInputLanguage}-${selectedOutputLanguage}` as keyof typeof sampleTranslations;
    const translation = sampleTranslations[translationKey] || 'Translation not available';
    
    if (activeTab === 'voice-to-text' && voiceText) {
      setTranslatedText(translation);
    } else if (activeTab === 'text-translation' && inputText) {
      setTranslatedText(translation);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      const lang = languages.find(l => l.code === selectedOutputLanguage);
      
      if (lang) {
        utterance.lang = lang.code === 'hindi' ? 'hi-IN' : 'en-US';
      }
      
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Translation Tools</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-500"></i>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('voice-to-text')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'voice-to-text'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-mic-line mr-2"></i>
              Voice to Text
            </button>
            <button
              onClick={() => setActiveTab('text-translation')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'text-translation'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-translate-2-line mr-2"></i>
              Text Translation
            </button>
            <button
              onClick={() => setActiveTab('text-to-voice')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'text-to-voice'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="ri-volume-up-line mr-2"></i>
              Text to Voice
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Language Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">From Language</label>
              <div className="grid grid-cols-2 gap-2">
                {languages.slice(0, 4).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedInputLanguage(lang.code)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedInputLanguage === lang.code
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{lang.flag}</div>
                    <div className="text-xs font-medium">{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">To Language</label>
              <div className="grid grid-cols-2 gap-2">
                {languages.slice(0, 4).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedOutputLanguage(lang.code)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedOutputLanguage === lang.code
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{lang.flag}</div>
                    <div className="text-xs font-medium">{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Voice to Text Tab */}
          {activeTab === 'voice-to-text' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Recording</h3>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer"
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
                    <div className="text-gray-700 font-mono text-xl">
                      {formatTime(recordingTime)}
                    </div>
                  )}
                </div>
              </div>

              {voiceText && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Recognized Text:</h4>
                  <p className="text-gray-700">{voiceText}</p>
                  <button
                    onClick={translateText}
                    className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-translate-2-line mr-2"></i>
                    Translate
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Text Translation Tab */}
          {activeTab === 'text-translation' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter text to translate:</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your text here..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {inputText.length}/500 characters
                </div>
              </div>

              <button
                onClick={translateText}
                disabled={!inputText.trim()}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                <i className="ri-translate-2-line mr-2"></i>
                Translate Text
              </button>
            </div>
          )}

          {/* Text to Voice Tab */}
          {activeTab === 'text-to-voice' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter text to convert to speech:</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type text to hear it spoken..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
              </div>

              <button
                onClick={() => speakText(inputText)}
                disabled={!inputText.trim() || isPlaying}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                <i className={`${isPlaying ? 'ri-pause-line' : 'ri-volume-up-line'} mr-2`}></i>
                {isPlaying ? 'Playing...' : 'Speak Text'}
              </button>
            </div>
          )}

          {/* Translation Result */}
          {translatedText && (
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Translation Result:</h4>
                <button
                  onClick={() => speakText(translatedText)}
                  disabled={isPlaying}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className={`${isPlaying ? 'ri-pause-line' : 'ri-volume-up-line'} mr-2`}></i>
                  {isPlaying ? 'Playing' : 'Listen'}
                </button>
              </div>
              <p className="text-xl text-gray-800 mb-4">{translatedText}</p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => navigator.clipboard.writeText(translatedText)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-file-copy-line mr-2"></i>
                  Copy
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm whitespace-nowrap cursor-pointer">
                  <i className="ri-share-line mr-2"></i>
                  Share
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Quick Translation Examples:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Hello, how are you?', 'I need help with coding', 'Thank you very much', 'What time is it?'].map((text, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputText(text);
                    setTimeout(() => translateText(), 100);
                  }}
                  className="text-left p-3 bg-white rounded-lg hover:bg-gray-100 transition-colors text-sm cursor-pointer"
                >
                  "{text}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}