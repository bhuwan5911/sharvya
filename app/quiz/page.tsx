'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuizEngine from './QuizEngine';
import RewardSystem from '../achievements/RewardSystem';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  expertise: string;
  languages: string[];
}

interface QuizStats {
  level: number;
  totalPoints: number;
  quizzesCompleted: number;
  accuracy: number;
}

// Memoized loading component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
    <div className="text-center">
      <div className="loading-spinner w-12 h-12 mx-auto"></div>
      <p className="text-white mt-4 mobile-text">Loading quiz data...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized category card component
const CategoryCard = memo(({ 
  category, 
  onStartQuiz 
}: { 
  category: any; 
  onStartQuiz: (categoryId: string) => void; 
}) => (
  <div className="card-mobile mobile-optimized">
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
        <i className={`${category.icon} text-xl sm:text-2xl text-white`}></i>
      </div>
    </div>
    
    <h3 className="mobile-text font-bold text-white mb-3">{category.title}</h3>
    <p className="text-gray-300 mb-4 sm:mb-6 mobile-text">{category.description}</p>
    
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <span className="text-gray-400 text-xs sm:text-sm">{category.questions} questions</span>
    </div>
    
    <button
      onClick={() => onStartQuiz(category.id)}
      className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer bg-gradient-to-r ${category.color} text-white hover:shadow-xl mobile-button`}
      style={{
        boxShadow: `0 10px 30px ${category.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' : category.color.includes('green') ? 'rgba(16, 185, 129, 0.3)' : category.color.includes('purple') ? 'rgba(147, 51, 234, 0.3)' : category.color.includes('cyan') ? 'rgba(6, 182, 212, 0.3)' : category.color.includes('orange') ? 'rgba(249, 115, 22, 0.3)' : 'rgba(147, 51, 234, 0.3)'}`
      }}
    >
      <i className="ri-play-line mr-2"></i>
      Start Quiz
    </button>
  </div>
));

CategoryCard.displayName = 'CategoryCard';

// Memoized stats card component
const StatsCard = memo(({ title, value, color }: { 
  title: string; 
  value: string | number; 
  color: string; 
}) => (
  <div className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl mobile-padding border ${color} shadow-lg`}>
    <div className={`text-2xl sm:text-3xl font-bold mb-2`}>{value}</div>
    <div className="text-gray-400 text-xs sm:text-sm">{title}</div>
  </div>
));

StatsCard.displayName = 'StatsCard';

export default function QuizPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<QuizStats>({
    level: 1,
    totalPoints: 0,
    quizzesCompleted: 0,
    accuracy: 0
  });
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(true);

  // Optimized data fetching with error handling
  const fetchUserData = useCallback(async () => {
    try {
      // Get user from session
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

      // Fetch user profile and stats with better error handling
      try {
        // First get user profile
        const profileRes = await fetch(`/api/users?email=${user.email}`);
        
        if (profileRes.ok) {
          const profiles = await profileRes.json();
          if (profiles.length > 0) {
            const profile = profiles[0];
            setUserProfile(profile);
            
            // Now get quizzes using the database user ID
            const quizzesRes = await fetch(`/api/quizzes?userId=${profile.id}`);
            
            // Calculate stats from quizzes
            if (quizzesRes.ok) {
              const quizzes = await quizzesRes.json();
              const totalCorrect = quizzes.reduce((sum: number, q: any) => sum + (q.correctAnswers || 0), 0);
              const totalAnswered = quizzes.reduce((sum: number, q: any) => sum + (q.totalAnswers || 0), 0);
              const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
              const totalPoints = quizzes.reduce((sum: number, q: any) => sum + (q.points || 0), 0);
              const level = Math.floor(totalPoints / 100) + 1;
              
              setUserStats({
                level,
                totalPoints,
                quizzesCompleted: quizzes.length,
                accuracy
              });
            }
          } else {
            // User is logged in but no profile - redirect to dashboard instead of onboarding
            router.push('/dashboard');
            return;
          }
        } else {
          // Handle API error gracefully
          console.warn('Failed to fetch user profile, using default stats');
          setDbConnected(false);
          setUserStats({
            level: 1,
            totalPoints: 0,
            quizzesCompleted: 0,
            accuracy: 0
          });
        }
      } catch (apiError) {
        // Handle network/database errors gracefully
        console.warn('Database connection issue, using default stats:', apiError);
        setDbConnected(false);
        setUserStats({
          level: 1,
          totalPoints: 0,
          quizzesCompleted: 0,
          accuracy: 0
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set default stats on error
      setUserStats({
        level: 1,
        totalPoints: 0,
        quizzesCompleted: 0,
        accuracy: 0
      });
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const quizCategories = [
    {
      id: 'programming-basics',
      title: 'Programming Basics',
      description: 'Test your understanding of fundamental programming concepts',
      icon: 'ri-code-s-slash-line',
      color: 'from-blue-500 to-indigo-600',
      questions: 10
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'HTML, CSS, and JavaScript fundamentals',
      icon: 'ri-html5-line',
      color: 'from-green-500 to-emerald-600',
      questions: 10
    },
    {
      id: 'voice-interaction',
      title: 'Voice Interaction',
      description: 'Master voice commands and speech recognition',
      icon: 'ri-mic-2-line',
      color: 'from-purple-500 to-pink-600',
      questions: 10
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      description: 'Arrays, objects, and data manipulation',
      icon: 'ri-stack-line',
      color: 'from-cyan-500 to-blue-600',
      questions: 10
    },
    {
      id: 'problem-solving',
      title: 'Problem Solving',
      description: 'Logic and algorithmic thinking challenges',
      icon: 'ri-lightbulb-line',
      color: 'from-orange-500 to-red-600',
      questions: 10
    },
    {
      id: 'career-guidance',
      title: 'Career Guidance',
      description: 'Tech career paths and industry knowledge',
      icon: 'ri-user-star-line',
      color: 'from-indigo-500 to-purple-600',
      questions: 10
    }
  ];

  const startQuiz = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowQuiz(true);
  }, []);

  const handleQuizComplete = useCallback(async (score: number, totalQuestions: number, correctAnswers: number) => {
    if (!userProfile) return;

    try {
      // Save quiz results to database
      const quizData = {
        userId: userProfile.id,
        question: `Quiz completed for ${selectedCategory}`,
        answer: `Score: ${score}/${totalQuestions * 20}`,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        language: selectedLanguage,
        options: [],
        type: 'quiz',
        points: score,
        correctAnswers: correctAnswers,
        totalAnswers: totalQuestions
      };

      try {
        await fetch('/api/quizzes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quizData)
        });

        // Fetch updated quiz data to check for badges
        const updatedQuizzesRes = await fetch(`/api/quizzes?userId=${userProfile.id}`);
        if (updatedQuizzesRes.ok) {
          const updatedQuizzes = await updatedQuizzesRes.json();

          // Import and use badge service
          const { calculateUserStats, checkAndAwardBadges } = await import('@/lib/badgeService');
          const userStats = calculateUserStats(updatedQuizzes, userProfile.id);
          const newBadges = await checkAndAwardBadges(userStats);

          // Update local stats
          const newPoints = userStats.totalPoints;
          const newLevel = userStats.level;
          
          setUserStats({
            level: newLevel,
            totalPoints: newPoints,
            quizzesCompleted: userStats.quizzesCompleted,
            accuracy: userStats.accuracy
          });
          
          // Show celebration for new badges or level up
          if (newBadges.length > 0 || newLevel > userStats.level) {
            setTimeout(() => setShowRewards(true), 1000);
          }
        }
      } catch (apiError) {
        console.warn('Failed to save quiz results to database:', apiError);
        // Still update local stats even if database save fails
        const newPoints = userStats.totalPoints + score;
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        setUserStats(prev => ({
          level: newLevel,
          totalPoints: newPoints,
          quizzesCompleted: prev.quizzesCompleted + 1,
          accuracy: prev.accuracy // Keep existing accuracy
        }));
      }
    
      setShowQuiz(false);
    } catch (error) {
      console.error('Error in quiz completion:', error);
      // Still close quiz even if there's an error
      setShowQuiz(false);
    }
  }, [userProfile, selectedCategory, selectedDifficulty, selectedLanguage, userStats]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!userProfile) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto mobile-padding">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-pacifico mobile-heading bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Sharvya
            </Link>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium mobile-text">
                Dashboard
              </Link>
              <button
                onClick={() => setShowRewards(true)}
                className="btn-secondary"
              >
                <i className="ri-trophy-line mr-2"></i>
                <span className="hidden sm:inline">My Rewards</span>
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs sm:text-sm font-bold">{userProfile.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-white font-semibold mobile-text">{userProfile.name}</div>
                  <div className="text-purple-400 text-xs sm:text-sm">Level {userStats.level}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto mobile-padding">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="mobile-heading font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4 sm:mb-6">
            Test Your Knowledge
          </h1>
          <p className="mobile-text text-gray-300 mb-6 sm:mb-8">Challenge yourself with interactive voice quizzes and earn amazing rewards</p>
          
          {/* Database Connectivity Warning */}
          {!dbConnected && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl mobile-padding mb-6 sm:mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <i className="ri-wifi-off-line text-yellow-400 text-lg sm:text-xl"></i>
                <div className="text-center">
                  <p className="text-yellow-300 font-semibold mobile-text">Database Connection Issue</p>
                  <p className="text-yellow-200/80 text-xs sm:text-sm">Your progress will be saved locally. Please check your internet connection.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Stats Cards */}
          <div className="mobile-grid gap-4 sm:gap-6 max-w-4xl mx-auto">
            <StatsCard 
              title="Current Level" 
              value={userStats.level} 
              color="border-cyan-500/20 shadow-cyan-500/10" 
            />
            <StatsCard 
              title="Total Points" 
              value={userStats.totalPoints} 
              color="border-purple-500/20 shadow-purple-500/10" 
            />
            <StatsCard 
              title="Quizzes Done" 
              value={userStats.quizzesCompleted} 
              color="border-green-500/20 shadow-green-500/10" 
            />
            <StatsCard 
              title="Accuracy" 
              value={`${userStats.accuracy}%`} 
              color="border-yellow-500/20 shadow-yellow-500/10" 
            />
          </div>
        </div>

        {/* Quiz Categories */}
        <div className="mobile-grid gap-6 sm:gap-8">
          {quizCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onStartQuiz={startQuiz}
            />
          ))}
        </div>

        {/* Quick Challenge Section */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-3xl mobile-padding border border-purple-500/20 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="mobile-heading font-bold text-white mb-4">Daily Challenge</h2>
            <p className="mobile-text text-gray-300 mb-6">Complete today's special quiz for bonus rewards!</p>
            
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-2xl mobile-padding mb-6 border border-yellow-500/30">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <i className="ri-fire-line text-lg sm:text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="mobile-text font-bold text-yellow-400">Voice Master Challenge</h3>
                  <p className="text-yellow-300/80 mobile-text">Perfect your pronunciation skills</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
                <span className="text-yellow-400">⚡ 2x Points</span>
                <span className="text-yellow-400">🏆 Special Badge</span>
                <span className="text-yellow-400">⏰ 24h Only</span>
              </div>
            </div>
            
            <button
              onClick={() => startQuiz('voice-interaction')}
              className="btn-secondary bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              <i className="ri-zap-line mr-2"></i>
              Accept Challenge
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Engine Modal */}
      {showQuiz && selectedCategory && (
        <QuizEngine
          category={selectedCategory}
          difficulty={selectedDifficulty}
          language={selectedLanguage}
          onQuizComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Rewards System Modal */}
      <RewardSystem
        isOpen={showRewards}
        onClose={() => setShowRewards(false)}
        userLevel={userStats.level}
        totalPoints={userStats.totalPoints}
        userId={userProfile?.id}
      />
    </div>
  );
}