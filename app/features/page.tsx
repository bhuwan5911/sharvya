
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TranslationDemo from './TranslationDemo';
import DeviceChecker from './DeviceChecker';
import ProgressShowcase from './ProgressShowcase';

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showTranslationDemo, setShowTranslationDemo] = useState(false);
  const [showDeviceChecker, setShowDeviceChecker] = useState(false);
  const [showProgressShowcase, setShowProgressShowcase] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: 'Voice-First Communication',
      description: 'Speak naturally in your native language. No typing barriers, no reading requirements.',
      icon: 'ri-mic-2-line',
      color: 'indigo',
      details: [
        'Real-time voice recognition',
        'Natural conversation flow',
        'Works with any accent',
        'Low bandwidth optimization'
      ]
    },
    {
      title: 'Smart Language Translation',
      description: 'AI-powered translation breaks down language barriers instantly and accurately.',
      icon: 'ri-exchange-line',
      color: 'green',
      details: [
        'Real-time translation',
        'Support for 10+ Indian languages',
        'Context-aware translations',
        'Cultural nuance preservation'
      ]
    },
    {
      title: 'Interactive Quiz System',
      description: 'Gamified learning with voice-based quizzes, badges, and reward systems.',
      icon: 'ri-questionnaire-line',
      color: 'purple',
      details: [
        'Voice-based questions',
        'Multiple quiz formats',
        'Achievement badges',
        'Level progression system'
      ]
    },
    {
      title: 'Voice Resume Builder',
      description: 'Create professional resumes using voice commands and download as PDF.',
      icon: 'ri-file-text-line',
      color: 'orange',
      details: [
        'Voice-to-text input',
        'Live resume preview',
        'Professional templates',
        'PDF download option'
      ],
      href: '/resume-builder'
    },
    {
      title: 'Live Voice Translation Chat',
      description: 'Real-time voice translation between mentors and students in multiple languages.',
      icon: 'ri-chat-3-line',
      color: 'emerald',
      details: [
        'Real-time translation',
        'Voice and text chat',
        'Multiple languages',
        'Mentor-student communication'
      ],
      href: '/voice-chat'
    },
    {
      title: 'Intelligent Mentor Matching',
      description: 'AI algorithms match you with the perfect mentor based on your goals and preferences.',
      icon: 'ri-user-star-line',
      color: 'cyan',
      details: [
        'Personality compatibility',
        'Skill level matching',
        'Language preference',
        'Learning style alignment'
      ]
    },
    {
      title: 'Works on Any Device',
      description: 'Optimized for basic smartphones with poor internet connectivity.',
      icon: 'ri-smartphone-line',
      color: 'blue',
      details: [
        'Low-end device support',
        'Offline capabilities',
        'Data-efficient design',
        'Battery optimization'
      ]
    },
    {
      title: 'Progress Tracking',
      description: 'Visual progress tracking with motivational rewards and milestone celebrations.',
      icon: 'ri-trophy-line',
      color: 'yellow',
      details: [
        'Learning milestones',
        'Achievement badges',
        'Progress visualization',
        'Motivation reminders'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      indigo: 'from-indigo-500 to-purple-600',
      green: 'from-green-500 to-emerald-600',
      purple: 'from-purple-500 to-pink-600',
      cyan: 'from-cyan-500 to-blue-600',
      blue: 'from-blue-500 to-indigo-600',
      yellow: 'from-yellow-500 to-orange-600',
      orange: 'from-orange-500 to-red-600',
      emerald: 'from-green-500 to-emerald-600'
    };
    return colors[color as keyof typeof colors] || colors.indigo;
  };

  const getShadowColor = (color: string) => {
    const shadows = {
      indigo: 'shadow-indigo-500/20',
      green: 'shadow-green-500/20',
      purple: 'shadow-purple-500/20',
      cyan: 'shadow-cyan-500/20',
      blue: 'shadow-blue-500/20',
      yellow: 'shadow-yellow-500/20',
      orange: 'shadow-orange-500/20',
      emerald: 'shadow-green-500/20'
    };
    return shadows[color as keyof typeof shadows] || shadows.indigo;
  };

  const handleFeatureAction = (index: number) => {
    const feature = features[index];
    
    // Check if feature has a direct href
    if (feature.href) {
      window.location.href = feature.href;
      return;
    }
    
    switch (index) {
      case 1: // Translation feature
        setShowTranslationDemo(true);
        break;
      case 2: // Quiz feature
        window.location.href = '/quiz';
        break;
      case 6: // Device compatibility feature (updated index)
        setShowDeviceChecker(true);
        break;
      case 7: // Progress tracking feature (updated index)
        setShowProgressShowcase(true);
        break;
      default:
        // For other features, redirect to dashboard
        window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-pacifico text-3xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Sharvya</Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Dashboard</Link>
              <Link href="/quiz" className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg shadow-pink-500/25 whitespace-nowrap cursor-pointer">
                <i className="ri-questionnaire-line mr-2"></i>
                Take Quiz
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">About</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Powerful Features for Rural Youth
          </h1>
          <p className={`text-xl text-gray-300 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Every feature designed to break barriers and create opportunities
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      activeFeature === index 
                        ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-purple-500/50 shadow-xl shadow-purple-500/20' 
                        : 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600/50'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer bg-gradient-to-r ${getColorClasses(feature.color)} shadow-lg ${getShadowColor(feature.color)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFeatureAction(index);
                        }}
                      >
                        <i className={`${feature.icon} text-xl text-white`}></i>
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold mb-2 ${activeFeature === index ? 'text-white' : 'text-gray-300'}`}>
                          {feature.title}
                        </h3>
                        <p className={`${activeFeature === index ? 'text-gray-300' : 'text-gray-400'}`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:sticky lg:top-8">
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50">
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-r ${getColorClasses(features[activeFeature].color)} shadow-lg ${getShadowColor(features[activeFeature].color)}`}>
                    <i className={`${features[activeFeature].icon} text-2xl text-white`}></i>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-gray-300 mb-6 text-lg">
                    {features[activeFeature].description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {features[activeFeature].details.map((detail, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getColorClasses(features[activeFeature].color)}`}></div>
                        <span className="text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleFeatureAction(activeFeature)}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer bg-gradient-to-r ${getColorClasses(features[activeFeature].color)} text-white hover:shadow-xl ${getShadowColor(features[activeFeature].color)}`}
                  >
                    <i className="ri-arrow-right-line mr-2"></i>
                    Try This Feature
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">Making Real Impact</h2>
            <p className="text-xl text-gray-300">Numbers that show we're breaking barriers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
              <div className="text-4xl font-bold text-indigo-400 mb-2">10,000+</div>
              <div className="text-gray-300">Rural Youth Connected</div>
            </div>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-green-500/20 shadow-lg shadow-green-500/10">
              <div className="text-4xl font-bold text-green-400 mb-2">15+</div>
              <div className="text-gray-300">Indian Languages Supported</div>
            </div>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-purple-500/20 shadow-lg shadow-purple-500/10">
              <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
              <div className="text-gray-300">Expert Mentors</div>
            </div>
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-2xl p-8 text-center border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
              <div className="text-4xl font-bold text-cyan-400 mb-2">95%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">Ready to Experience These Features?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of rural youth already transforming their futures</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/25 whitespace-nowrap cursor-pointer">
              <i className="ri-rocket-line mr-2"></i>
              Start Your Journey
            </Link>
            <Link href="/quiz" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl shadow-pink-500/25 whitespace-nowrap cursor-pointer">
              <i className="ri-trophy-line mr-2"></i>
              Take Quiz Challenge
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <TranslationDemo isOpen={showTranslationDemo} onClose={() => setShowTranslationDemo(false)} />
      <DeviceChecker isOpen={showDeviceChecker} onClose={() => setShowDeviceChecker(false)} />
      <ProgressShowcase isOpen={showProgressShowcase} onClose={() => setShowProgressShowcase(false)} />
    </div>
  );
}
