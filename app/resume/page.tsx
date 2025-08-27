'use client';

import { useState } from 'react';
import Link from 'next/link';
import VoiceResumeBuilder from './VoiceResumeBuilder';

export default function ResumePage() {
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);

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
              <Link href="/quiz" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                Quiz
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <i className="ri-file-text-line text-4xl text-white"></i>
        </div>
        
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">
          Voice Resume Builder
        </h1>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Create your professional resume using just your voice. No typing needed - just speak naturally and we'll format everything perfectly.
        </p>

        <button
          onClick={() => setShowResumeBuilder(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-xl shadow-purple-500/25 cursor-pointer"
        >
          <i className="ri-mic-line mr-2"></i>
          Start Building Resume
        </button>
      </div>

      <VoiceResumeBuilder 
        isOpen={showResumeBuilder} 
        onClose={() => setShowResumeBuilder(false)} 
      />
    </div>
  );
}