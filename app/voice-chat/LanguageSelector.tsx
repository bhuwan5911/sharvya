'use client';

import { useState } from 'react';

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

export default function LanguageSelector({ languages, selectedLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLang = languages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-700/50 hover:bg-gray-600/50 text-white px-4 py-2 rounded-lg border border-gray-600 transition-colors"
      >
        <span className="text-lg">{selectedLang?.flag}</span>
        <span className="font-medium">{selectedLang?.name}</span>
        <i className={`ri-arrow-down-s-line transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl z-50">
          <div className="py-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700/50 transition-colors ${
                  selectedLanguage === language.code ? 'bg-cyan-500/20 text-cyan-400' : 'text-white'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {selectedLanguage === language.code && (
                  <i className="ri-check-line ml-auto text-cyan-400"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
} 