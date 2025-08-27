'use client';

import { useState } from 'react';
import { translateText } from '@/lib/translationService';

export default function TestTranslationPage() {
  const [inputText, setInputText] = useState('');
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    try {
      const result = await translateText(inputText, fromLang, toLang);
      setTranslatedText(result);
      console.log('Translation result:', { input: inputText, output: result });
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('Translation failed: ' + error);
    } finally {
      setIsTranslating(false);
    }
  };

  const testCases = [
    { text: "Hello, I want to learn web development", from: 'en', to: 'hi' },
    { text: "नमस्ते मैं वेब डेवलपमेंट सीखना चाहता हूं", from: 'hi', to: 'en' },
    { text: "Thank you for helping me", from: 'en', to: 'hi' },
    { text: "धन्यवाद मेरी मदद करने के लिए", from: 'hi', to: 'en' }
  ];

  const runTestCases = async () => {
    for (const testCase of testCases) {
      console.log(`Testing: ${testCase.text} (${testCase.from} -> ${testCase.to})`);
      try {
        const result = await translateText(testCase.text, testCase.from, testCase.to);
        console.log(`Result: ${result}`);
      } catch (error) {
        console.error(`Failed: ${error}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Translation Test Page
        </h1>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">From Language</label>
              <select 
                value={fromLang} 
                onChange={(e) => setFromLang(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">To Language</label>
              <select 
                value={toLang} 
                onChange={(e) => setToLang(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white"
              >
                <option value="hi">Hindi</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">Input Text</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400"
              rows={3}
            />
          </div>
          
          <button
            onClick={handleTranslate}
            disabled={isTranslating || !inputText.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
          
          {translatedText && (
            <div className="mt-4 p-4 bg-gray-700/30 rounded-lg">
              <label className="block text-white text-sm font-medium mb-2">Translated Text</label>
              <div className="text-white">{translatedText}</div>
            </div>
          )}
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Test Cases</h2>
          <button
            onClick={runTestCases}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all"
          >
            Run All Test Cases
          </button>
          
          <div className="mt-4 space-y-2">
            {testCases.map((testCase, index) => (
              <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                <div className="text-white text-sm">
                  <strong>Test {index + 1}:</strong> {testCase.text}
                </div>
                <div className="text-gray-300 text-xs">
                  {testCase.from} → {testCase.to}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 