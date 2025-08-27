
'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

// Desktop optimization hooks - simplified for now
const useDesktopPerformance = () => ({ isHighEndDesktop: false, gpuAcceleration: false });
const useDesktopAnimations = () => ({ animationClass: '', transitionClass: '' });
const useDesktopHover = () => ({ hoverClass: '', transitionClass: '', glowClass: '' });
const useDesktopShortcuts = () => {};

// Memoized components for better performance
const LoginModal = memo(({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) console.error('Sign in error:', error);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Sign Up / Login</h2>
        <p className="mb-6 text-gray-600">Please sign in to continue with Sharvya</p>
        <button
          onClick={signInWithGoogle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full flex items-center justify-center gap-3"
        >
          <span className="bg-white rounded-full p-1 flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.46 7.82 2.68l5.8-5.8C34.64 3.13 29.74 1 24 1 14.82 1 6.7 6.82 2.7 15.1l6.7 5.2C11.7 13.82 17.3 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.74H24v9.04h12.4c-.54 2.9-2.18 5.36-4.64 7.04l7.2 5.6C43.3 37.18 46.1 31.36 46.1 24.5z"/>
                <path fill="#FBBC05" d="M9.4 28.3c-1.1-2.1-1.7-4.5-1.7-7.1s.6-5 1.7-7.1l-6.7-5.2C1.1 13.18 0 18.64 0 24.5s1.1 11.32 2.7 15.1l6.7-5.2z"/>
                <path fill="#EA4335" d="M24 46c6.48 0 11.92-2.14 15.9-5.82l-7.2-5.6c-2.02 1.36-4.6 2.16-8.7 2.16-6.7 0-12.3-4.32-14.6-10.1l-6.7 5.2C6.7 41.18 14.82 46 24 46z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
          </span>
          Sign in with Google
        </button>
        <button
          onClick={onClose}
          className="mt-6 text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

LoginModal.displayName = 'LoginModal';

const ProfileDropdown = memo(({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [open, setOpen] = useState(false);
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 focus:outline-none"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full border-2 border-blue-400" />
        ) : (
          <span className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-blue-400">
            {initials}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-4 z-50 border border-gray-200">
          <div className="px-4 pb-2 flex flex-col items-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-16 h-16 rounded-full mb-2 border-2 border-blue-400" />
            ) : (
              <span className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl mb-2 border-2 border-blue-400">
                {initials}
              </span>
            )}
            <div className="font-semibold text-gray-900">{user.user_metadata?.full_name || user.email}</div>
            <div className="text-gray-500 text-sm mb-2">{user.email}</div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
});

ProfileDropdown.displayName = 'ProfileDropdown';

// Memoized feature card component
const FeatureCard = memo(({ feature, index, handleProtectedClick }: { 
  feature: any, 
  index: number, 
  handleProtectedClick: (url: string) => void 
}) => {
  const baseClasses = "bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:transform hover:scale-105";
  
  if (feature.href) {
    return (
      <Link href={feature.href} className={baseClasses}>
        <div className="mb-4">
          {feature.icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
      </Link>
    );
  }
  
  return (
    <div className={baseClasses}>
      <div className="mb-4">
        {feature.icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Desktop optimizations
  const { isHighEndDesktop } = useDesktopPerformance();
  const { animationClass } = useDesktopAnimations();
  useDesktopShortcuts();

  // Optimized user check with error handling
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
        setUser(user);
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      setUser(session?.user || null);
      if (session?.user) setShowLogin(false);
    });
    
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleProtectedClick = useCallback((url: string) => {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      router.push(url);
    }
  }, [isLoggedIn, router]);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsLoggedIn(false);
      setShowLogin(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a40] via-[#3a1c71] to-[#5f2c82] flex items-center justify-center">
        <div className="loading-spinner w-16 h-16"></div>
      </div>
    );
  }

  const features = [
    {
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
          <i className="ri-mic-line text-xl text-white"></i>
        </div>
      ),
      title: 'Voice-First Communication',
      description: 'Speak naturally in your native language. AI handles the rest.',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
          <i className="ri-translate-2 text-xl text-white"></i>
        </div>
      ),
      title: 'Smart Translation',
      description: 'Real-time translation between 15+ Indian languages.',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
          <i className="ri-trophy-line text-xl text-white"></i>
        </div>
      ),
      title: 'Gamified Learning',
      description: 'Earn badges, points, and certificates as you progress.',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <i className="ri-group-line text-xl text-white"></i>
        </div>
      ),
      title: 'Expert Mentors',
      description: 'Connect with industry professionals who understand your journey.',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <i className="ri-questionnaire-line text-xl text-white"></i>
        </div>
      ),
      title: 'Interactive Quizzes',
      description: 'Voice-based quizzes with real-time feedback and progress tracking.',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
          <i className="ri-file-text-line text-xl text-white"></i>
        </div>
      ),
      title: 'Voice Resume Builder',
      description: 'Create professional resumes using voice commands and download as PDF.',
      href: '/resume-builder',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <i className="ri-chat-3-line text-xl text-white"></i>
        </div>
      ),
      title: 'Live Voice Translation Chat',
      description: 'Real-time voice translation between mentors and students in multiple languages.',
      href: '/voice-chat',
    },
    {
      icon: (
        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
          <i className="ri-smartphone-line text-xl text-white"></i>
        </div>
      ),
      title: 'Works Everywhere',
      description: 'Optimized for basic smartphones and poor internet.',
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a40] via-[#3a1c71] to-[#5f2c82] flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-transparent">
        <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Sharvya</span>
        <div className="flex items-center gap-6">
          <Link href="/features" className="text-white font-medium hover:text-cyan-300 transition-colors">Features</Link>
          <Link href="/about" className="text-white font-medium hover:text-cyan-300 transition-colors">About</Link>
          <button
            onClick={() => handleProtectedClick('/voice-chat')}
            className="text-white font-medium hover:text-cyan-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            Voice Chat
          </button>
          <button
            onClick={() => handleProtectedClick('/dashboard')}
            className="text-white font-medium hover:text-cyan-300 transition-colors bg-transparent border-none cursor-pointer"
          >
            Dashboard
          </button>
          {isLoggedIn && user ? (
            <ProfileDropdown user={user} onLogout={handleLogout} />
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Sign Up / Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 leading-tight">
                Break Language Barriers with Voice
              </h1>
              <p className="text-xl text-white mb-8 leading-relaxed">
                Connect rural youth with global opportunities through AI-powered voice translation and expert mentorship. Learn coding, build skills, and transform your future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleProtectedClick('/voice-chat')}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <i className="ri-mic-line mr-3 text-xl"></i>
                  Start Voice Chat
                </button>
                <button
                  onClick={() => handleProtectedClick('/onboarding')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <i className="ri-rocket-line mr-3 text-xl"></i>
                  Start Your Journey
                </button>
                <button
                  onClick={() => handleProtectedClick('/quiz')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <i className="ri-trophy-line mr-3 text-xl"></i>
                  Take Quiz Challenge
                </button>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/25">
                      <i className="ri-mic-line text-2xl text-white"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Voice-First Learning</h3>
                    <p className="text-gray-300 text-lg">Speak naturally in your language</p>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 rounded-xl p-4 border border-cyan-500/20">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-semibold">Live Translation</span>
                      </div>
                      <p className="text-white text-lg mb-1">"मुझे कोडिंग सीखना है"</p>
                      <p className="text-cyan-400 text-lg">→ "I want to learn coding"</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-purple-500/20 rounded-xl p-4 text-center border border-purple-500/30">
                        <div className="text-2xl font-bold text-purple-400 mb-1">15+</div>
                        <div className="text-gray-300">Languages</div>
                      </div>
                      <div className="bg-cyan-500/20 rounded-xl p-4 text-center border border-cyan-500/30">
                        <div className="text-2xl font-bold text-cyan-400 mb-1">500+</div>
                        <div className="text-gray-300">Mentors</div>
                      </div>
                      <div className="bg-pink-500/20 rounded-xl p-4 text-center border border-pink-500/30">
                        <div className="text-2xl font-bold text-pink-400 mb-1">95%</div>
                        <div className="text-gray-300">Success</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Mentoring Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Live Voice Mentoring
            </h2>
            <p className="text-xl text-white">Connect with expert mentors through real-time voice translation</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Voice Chat Card */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 shadow-xl shadow-green-500/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg shadow-green-500/25">
                  <i className="ri-chat-3-line text-3xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Live Voice Translation Chat</h3>
                  <p className="text-gray-400 text-lg">Real-time multilingual communication</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Speak in your native language and communicate seamlessly with mentors and students. 
                AI-powered translation works in real-time across 10+ Indian languages.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg font-medium">Hindi ↔ English</span>
                <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg font-medium">Voice Recognition</span>
                <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg font-medium">Real-time</span>
              </div>
              <button
                onClick={() => handleProtectedClick('/voice-chat')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
              >
                <i className="ri-mic-line mr-3 text-xl"></i>
                Start Voice Chat
              </button>
            </div>

            {/* Mentor Connection Card */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-xl shadow-cyan-500/20">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg shadow-cyan-500/25">
                  <i className="ri-user-star-line text-3xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Expert Mentors</h3>
                  <p className="text-gray-400 text-lg">Connect with industry professionals</p>
                </div>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Find mentors who understand your language and learning style. 
                Get personalized guidance for your coding journey from experienced developers.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg font-medium">500+ Mentors</span>
                <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg font-medium">Multi-language</span>
                <span className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-lg font-medium">Personalized</span>
              </div>
              <button
                onClick={() => handleProtectedClick('/dashboard')}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
              >
                <i className="ri-user-add-line mr-3 text-xl"></i>
                Find Mentors
              </button>
            </div>
          </div>

          {/* Voice Features Showcase */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Voice-Powered Features</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-mic-line text-2xl text-white"></i>
                </div>
                <p className="text-gray-300 text-lg font-medium">Voice Quizzes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-file-text-line text-2xl text-white"></i>
                </div>
                <p className="text-gray-300 text-lg font-medium">Voice Resume</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-translate-2 text-2xl text-white"></i>
                </div>
                <p className="text-gray-300 text-lg font-medium">Live Translation</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="ri-group-line text-2xl text-white"></i>
                </div>
                <p className="text-gray-300 text-lg font-medium">Peer Learning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              Powerful Features for Rural Youth
            </h2>
            <p className="text-xl text-white">Everything you need to transform your career</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
                handleProtectedClick={handleProtectedClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Challenge Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/25">
              <i className="ri-trophy-line text-3xl text-white"></i>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Test Your Knowledge
            </h2>
            <p className="text-xl text-white mb-8 leading-relaxed">
              Challenge yourself with interactive voice quizzes. Earn points, unlock badges, and level up your skills!
            </p>
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/60 rounded-xl p-6 border border-cyan-500/20">
                <div className="text-2xl font-bold text-cyan-400 mb-2">Voice</div>
                <div className="text-white text-lg">Interactive Quizzes</div>
              </div>
              <div className="bg-gray-800/60 rounded-xl p-6 border border-purple-500/20">
                <div className="text-2xl font-bold text-purple-400 mb-2">Rewards</div>
                <div className="text-white text-lg">Badges & Certificates</div>
              </div>
              <div className="bg-gray-800/60 rounded-xl p-6 border border-pink-500/20">
                <div className="text-2xl font-bold text-pink-400 mb-2">Progress</div>
                <div className="text-white text-lg">Level Up System</div>
              </div>
            </div>
            <button
              onClick={() => handleProtectedClick('/quiz')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center mx-auto"
            >
              <i className="ri-play-line mr-3 text-xl"></i>
              Start Quiz Challenge
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Your Tech Career Starts Here
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Join thousands of rural youth already transforming their futures with Sharvya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleProtectedClick('/onboarding')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center"
            >
              <i className="ri-user-add-line mr-3 text-xl"></i>
              Join Now - Free
            </button>
            <Link href="/features" className="bg-transparent border-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center">
              <i className="ri-eye-line mr-3 text-xl"></i>
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
