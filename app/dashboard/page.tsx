
'use client';

import { useEffect, useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';
import ProgressTracker from './ProgressTracker';
import MentorCard from './MentorCard';
import VoiceRecorder from './VoiceRecorder';
import Link from 'next/link';
import RewardSystem from '../achievements/RewardSystem';

// Add type definitions for profile and quizzes
interface UserProfile {
  avatarUrl?: string;
  location?: string;
  goals?: string;
}

interface Achievement {
  title: string;
}

interface Profile {
  id: number;
  name: string;
  email: string;
  profile?: UserProfile | null;
  achievements?: Achievement[];
}

interface Quiz {
  id: number;
  question: string;
  createdAt: string;
  correctAnswers?: number;
  totalAnswers?: number;
}

// Memoized loading component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
    <div className="text-center">
      <div className="loading-spinner w-12 h-12 mx-auto"></div>
      <p className="text-white mt-4 mobile-text">Loading dashboard...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized profile completion component
const ProfileCompletion = memo(({ onComplete }: { onComplete: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto mobile-padding">
      <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="ri-user-settings-line text-2xl sm:text-3xl text-white"></i>
      </div>
      <h2 className="mobile-heading font-bold text-white mb-4">Complete Your Profile</h2>
      <p className="text-gray-300 mb-6 mobile-text">
        To access the dashboard and start taking quizzes, please complete your profile setup.
      </p>
      <button
        onClick={onComplete}
        className="btn-primary"
      >
        <i className="ri-arrow-right-line mr-2"></i>
        Complete Profile
      </button>
    </div>
  </div>
));

ProfileCompletion.displayName = 'ProfileCompletion';

// Memoized stats card component
const StatsCard = memo(({ title, value, color, icon }: { 
  title: string; 
  value: string | number; 
  color: string; 
  icon: string; 
}) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl mobile-padding border border-opacity-30 flex flex-col items-center`}>
    <div className={`text-2xl sm:text-3xl font-bold mb-1`}>{value}</div>
    <div className="text-gray-300 text-xs sm:text-sm">{title}</div>
  </div>
));

StatsCard.displayName = 'StatsCard';

// Memoized quick action button component
const QuickActionButton = memo(({ 
  onClick, 
  icon, 
  text, 
  color 
}: { 
  onClick: () => void; 
  icon: string; 
  text: string; 
  color: string; 
}) => (
  <button 
    onClick={onClick} 
    className={`${color} text-white mobile-button font-semibold transition-colors flex items-center gap-2`}
  >
    <i className={icon}></i> 
    <span className="hidden sm:inline">{text}</span>
  </button>
));

QuickActionButton.displayName = 'QuickActionButton';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [points, setPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [showRewards, setShowRewards] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Optimized data fetching with error handling
  const fetchUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch profile from backend
      const res = await fetch(`/api/users?email=${user.email}`);
      const users = await res.json();
      
      if (users && users.length > 0) {
        setProfile(users[0]);
        
        // Fetch quizzes for this user
        const quizRes = await fetch(`/api/quizzes?userId=${users[0].id}`);
        const userQuizzes = await quizRes.json();
        setQuizzes(userQuizzes);
        
        // Calculate points and level
        const quizCount = userQuizzes.length;
        setPoints(quizCount * 10);
        setLevel(Math.floor(quizCount / 5) + 1);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  const handleResetProgress = useCallback(async () => {
    if (!profile?.id) return;
    try {
      await fetch(`/api/quizzes?userId=${profile.id}`, { method: 'DELETE' });
      window.location.reload();
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  }, [profile?.id]);

  // Show loading while fetching user data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If user is logged in but has no profile, show completion message
  if (user && profile === null) {
    return <ProfileCompletion onComplete={() => router.push('/onboarding')} />;
  }

  // If profile is still loading (undefined), show loading
  if (profile === undefined) {
    return <LoadingSpinner />;
  }

  // Example recommended mentors (replace with real data if available)
  const recommendedMentors = [
    {
      id: 1,
      name: 'Priya Sharma',
      expertise: 'Web Development',
      languages: ['Hindi', 'English'],
      rating: 4.8,
      sessions: 150,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20software%20developer%20mentor%2C%20friendly%20smile%2C%20wearing%20casual%20business%20attire%2C%20modern%20office%20background%2C%20confident%20and%20approachable%2C%20high%20quality%20portrait%20photography&width=200&height=200&seq=mentor-1&orientation=squarish',
      isOnline: true
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      expertise: 'Mobile Development',
      languages: ['Hindi', 'Gujarati', 'English'],
      rating: 4.9,
      sessions: 200,
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20software%20developer%20mentor%2C%20warm%20smile%2C%20wearing%20casual%20shirt%2C%20modern%20tech%20workspace%2C%20experienced%20and%20friendly%2C%20high%20quality%20portrait%20photography&width=200&height=200&seq=mentor-2&orientation=squarish',
      isOnline: false
    }
  ];

  // Real quiz data
  const quizzesCompleted = quizzes.length;
  const pointsEarned = points;
  const currentLevel = level || 1;
  
  // Live accuracy calculation
  const totalCorrect = quizzes.reduce((sum, q) => sum + (q.correctAnswers || 0), 0);
  const totalAnswered = quizzes.reduce((sum, q) => sum + (q.totalAnswers || 0), 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // User progress data
  const userProgress = {
    name: profile?.name || 'Bhuwan',
    level: currentLevel,
    totalPoints: pointsEarned,
    quizzesCompleted: quizzesCompleted,
    accuracy: accuracy
  };

  const quickActions = [
    { icon: 'ri-play-line', text: 'Start New Quiz', color: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700', action: () => router.push('/quiz') },
    { icon: 'ri-user-settings-line', text: 'Edit Profile', color: 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700', action: () => router.push('/profile') },
    { icon: 'ri-mic-line', text: 'Upload Voice', color: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700', action: () => router.push('/voice-upload') },
    { icon: 'ri-file-text-line', text: 'Voice Resume Builder', color: 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700', action: () => router.push('/resume-builder') },
    { icon: 'ri-chat-3-line', text: 'Live Voice Chat', color: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700', action: () => router.push('/voice-chat') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex flex-col">
      {/* Navigation */}
      <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-500/20 mobile-padding flex items-center justify-between">
        <div className="flex items-center mobile-gap">
          <button
            onClick={() => router.push('/')} 
            className="btn-primary"
          >
            <i className="ri-arrow-left-line mr-2"></i> 
            <span className="hidden sm:inline">Back</span>
          </button>
          <button
            onClick={() => setShowRewards(true)}
            className="btn-secondary"
          >
            <i className="ri-trophy-line mr-2"></i> 
            <span className="hidden sm:inline">My Rewards</span>
          </button>
          <span className="font-pacifico mobile-heading bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Sharvya</span>
        </div>
        <button
          onClick={handleLogout}
          className="btn-ghost"
        >
          <span className="hidden sm:inline">Logout</span>
          <i className="ri-logout-box-line sm:hidden"></i>
        </button>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto mobile-padding flex flex-col gap-6 sm:gap-8">
        {/* Quiz Stats Row */}
        <div className="mobile-grid gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatsCard 
            title="Current Level" 
            value={currentLevel} 
            color="from-blue-900/60 to-cyan-900/60 border-blue-500/30" 
            icon="ri-arrow-up-line"
          />
          <StatsCard 
            title="Total Points" 
            value={pointsEarned} 
            color="from-purple-900/60 to-pink-900/60 border-purple-500/30" 
            icon="ri-coins-line"
          />
          <StatsCard 
            title="Quizzes Done" 
            value={quizzesCompleted} 
            color="from-green-900/60 to-emerald-900/60 border-green-500/30" 
            icon="ri-questionnaire-line"
          />
          <StatsCard 
            title="Accuracy" 
            value={`${accuracy}%`} 
            color="from-yellow-900/60 to-orange-900/60 border-yellow-500/30" 
            icon="ri-target-line"
          />
        </div>

        {/* Reset Progress Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleResetProgress}
            className="btn-ghost bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
          >
            <i className="ri-refresh-line mr-2"></i> 
            <span className="hidden sm:inline">Reset Progress</span>
          </button>
        </div>

        {/* Profile Summary & Quick Actions */}
        <div className="mobile-flex gap-6 sm:gap-8 items-start">
          <div className="card-mobile flex flex-col gap-4 sm:gap-6 flex-1">
            <h1 className="mobile-heading font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Welcome back, {userProgress.name}!
            </h1>
            <p className="text-gray-300 mb-4 mobile-text">Ready to continue your coding journey?</p>
            <VoiceRecorder onRecordingChange={() => {}} />
            
            {/* Quick Actions */}
            <div className="mobile-grid gap-3 sm:gap-4 mt-4">
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  onClick={action.action}
                  icon={action.icon}
                  text={action.text}
                  color={action.color}
                />
              ))}
            </div>
          </div>

          {/* Profile Summary */}
          <div className="card-mobile flex flex-col items-center gap-4 w-full sm:w-auto">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl sm:text-4xl text-white font-bold mb-2">
              {profile && profile.profile && profile.profile.avatarUrl ? (
                <img src={profile.profile.avatarUrl} alt="avatar" className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover" />
              ) : (
                profile ? profile.name[0] : ''
              )}
            </div>
            <div className="text-white mobile-text font-semibold">{profile ? profile.name : ''}</div>
            <div className="text-gray-300 text-sm">{profile ? profile.email : ''}</div>
            <div className="text-gray-400 text-sm">{profile && profile.profile && profile.profile.location ? profile.profile.location : 'Unknown'}</div>
            <Link href="/profile" className="mt-2 text-cyan-400 hover:underline mobile-text">View Full Profile</Link>
          </div>
        </div>

        {/* Progress & Activity */}
        <div className="mobile-flex gap-6 sm:gap-8 items-start">
          <div className="flex-1 flex flex-col gap-6 sm:gap-8">
            {/* Quiz Challenge Card */}
            <div className="card-mobile flex flex-col gap-6 sm:gap-8">
              <div className="mobile-flex items-center justify-between gap-4 mb-4 sm:mb-6">
                <div>
                  <h2 className="mobile-heading font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">Test Your Knowledge</h2>
                  <p className="text-gray-300 mobile-text">Challenge yourself and earn rewards</p>
                </div>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25">
                  <i className="ri-trophy-line text-xl sm:text-2xl text-white"></i>
                </div>
              </div>
              
              <div className="mobile-grid gap-4 mb-6">
                <div className="bg-gray-800/50 rounded-xl mobile-padding border border-cyan-500/20 flex flex-col items-center">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2">{quizzesCompleted}</div>
                  <div className="text-gray-400 mobile-text">Quizzes Completed</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl mobile-padding border border-purple-500/20 flex flex-col items-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">{pointsEarned}</div>
                  <div className="text-gray-400 mobile-text">Points Earned</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl mobile-padding border border-green-500/20 flex flex-col items-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">Level {currentLevel}</div>
                  <div className="text-gray-400 mobile-text">Current Level</div>
                </div>
              </div>
              
              <button
                className="btn-secondary"
                onClick={() => router.push('/quiz')}
              >
                <i className="ri-play-line mr-2"></i>
                Start New Quiz
              </button>
            </div>

            {/* Recent Activity */}
            <div className="card-mobile">
              <h2 className="mobile-text font-bold text-white mb-4">Recent Activity</h2>
              <ul className="divide-y divide-gray-700">
                {quizzes.slice(0, 5).map((quiz, idx) => (
                  <li key={quiz.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-gray-200 mobile-text">
                      Quiz: <span className="font-semibold text-cyan-400">{quiz.question}</span>
                    </span>
                    <span className="text-gray-400 text-xs sm:text-sm">
                      {new Date(quiz.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
                {quizzes.length === 0 && (
                  <li className="py-3 text-gray-400 mobile-text">No recent quizzes yet.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="card-mobile flex flex-col items-center gap-4 w-full sm:w-auto">
            <h2 className="mobile-text font-bold text-white mb-4">Progress Chart</h2>
            <div className="w-full h-32 sm:h-40 flex items-center justify-center text-gray-400 bg-gray-900/40 rounded-xl mobile-padding">
              <p className="mobile-text text-center">Coming soon: Visualize your quiz progress!</p>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-gradient-to-r from-green-600/80 to-teal-700/80 backdrop-blur-sm mobile-padding rounded-3xl text-white border border-green-500/30 shadow-lg shadow-green-500/20 flex flex-col gap-6">
          <ProgressTracker user={{
            ...userProgress,
            progress: quizzesCompleted * 20,
            badges: profile?.achievements?.map(a => a.title) || [],
            goal: profile && profile.profile && profile.profile.goals ? profile.profile.goals : 'No goal set',
            location: profile && profile.profile && profile.profile.location ? profile.profile.location : 'Unknown',
          }} />
        </div>

        {/* Rewards System Modal */}
        <RewardSystem
          isOpen={showRewards}
          onClose={() => setShowRewards(false)}
          userLevel={userProgress.level}
          totalPoints={userProgress.totalPoints}
          userId={profile?.id}
        />
      </main>
    </div>
  );
}
