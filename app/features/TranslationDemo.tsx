'use client';

import { useState } from 'react';

interface TranslationDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TranslationDemo({ isOpen, onClose }: TranslationDemoProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [currentStep, setCurrentStep] = useState(0);

  const languages = [
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'gujarati', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'marathi', name: 'Marathi', flag: '🇮🇳' },
    { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
    { code: 'bengali', name: 'Bengali', flag: '🇮🇳' }
  ];

  const translations = {
    hindi: {
      text: 'मैं कोडिंग सीखना चाहता हूं',
      english: 'I want to learn coding',
      audio: 'mai coding seekhna chahta hun'
    },
    gujarati: {
      text: 'હું કોડિંગ શીખવા માંગુ છું',
      english: 'I want to learn coding',
      audio: 'hun coding shikhva mangu chu'
    },
    marathi: {
      text: 'मला कोडिंग शिकायचे आहे',
      english: 'I want to learn coding',
      audio: 'mala coding shikayche ahe'
    },
    tamil: {
      text: 'எனக்கு கோடிங் கற்க வேண்டும்',
      english: 'I want to learn coding',
      audio: 'enakku coding karka vendum'
    },
    bengali: {
      text: 'আমি কোডিং শিখতে চাই',
      english: 'I want to learn coding',
      audio: 'ami coding shikhte chai'
    }
  };

  const steps = [
    'Speak in your language',
    'AI processes your voice',
    'Instant translation appears',
    'Mentor receives in English'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Live Translation Demo</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-500"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Language Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Language</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedLanguage === lang.code
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-sm font-medium">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Translation Demo */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">See Translation in Action</h3>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <i className="ri-mic-line text-green-600"></i>
                    <span className="text-sm font-medium text-gray-700">You speak in {languages.find(l => l.code === selectedLanguage)?.name}</span>
                  </div>
                  <div className="text-2xl mb-2">{translations[selectedLanguage as keyof typeof translations].text}</div>
                  <div className="text-sm text-gray-500 italic">"{translations[selectedLanguage as keyof typeof translations].audio}"</div>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <i className="ri-translate-2-line text-blue-600"></i>
                    <span className="text-sm font-medium text-gray-700">Mentor receives in English</span>
                  </div>
                  <div className="text-2xl mb-2">{translations[selectedLanguage as keyof typeof translations].english}</div>
                  <div className="text-sm text-green-600 font-medium">✓ Translated instantly</div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap cursor-pointer">
              <i className="ri-mic-line mr-2"></i>
              Try Voice Translation
            </button>
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap cursor-pointer">
              <i className="ri-phone-line mr-2"></i>
              Connect with Mentor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}