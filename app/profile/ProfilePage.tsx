'use client';

import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  age: number;
  location: string;
  email: string;
  phone: string;
  languages: string[];
  interests: string[];
  learningGoals: string[];
  skillLevel: string;
  joinDate: string;
  totalPoints: number;
  currentLevel: number;
  completedCourses: number;
  studyHours: number;
  badges: Badge[];
  achievements: Achievement[];
  quizzesCompleted: number; // Added for live progress
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  date: string;
  category: string;
}

interface ProfilePageProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ProfilePage({ isOpen, onClose }: ProfilePageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/users?email=${user.email}`);
      const users = await res.json();
      if (users && users.length > 0) {
        const u = users[0];
        setUserId(u.id);
        setProfileId(u.profile?.id || null);
        let learningGoals = u.profile?.goals;
        if (!Array.isArray(learningGoals)) {
          if (typeof learningGoals === 'string' && learningGoals.length > 0) {
            learningGoals = [learningGoals];
          } else {
            learningGoals = [];
          }
        }
        // Parse languages and interests from JSON strings to arrays
        let languages = [];
        if (u.profile?.languages) {
          try {
            languages = typeof u.profile.languages === 'string' ? JSON.parse(u.profile.languages) : u.profile.languages;
          } catch (e) {
            languages = [];
          }
        }
        
        let interests = [];
        if (u.profile?.interests) {
          try {
            interests = typeof u.profile.interests === 'string' ? JSON.parse(u.profile.interests) : u.profile.interests;
          } catch (e) {
            interests = [];
          }
        }
        
        setUserProfile({
          name: u.name,
          age: u.profile?.age || '',
          location: u.profile?.location || '',
          email: u.email,
          phone: u.profile?.phone || '',
          languages: languages,
          interests: interests,
          learningGoals,
          skillLevel: u.profile?.expertise || '',
          joinDate: u.profile?.createdAt || '',
          totalPoints: u.points || 0,
          currentLevel: u.level || 1,
          completedCourses: u.profile?.coursesDone || 0,
          studyHours: u.profile?.studyHours || 0,
          badges: u.badges || [],
          achievements: u.achievements || [],
          quizzesCompleted: u.quizzesCompleted || 0
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'learning': return 'text-blue-400 bg-blue-500/20';
      case 'consistency': return 'text-green-400 bg-green-500/20';
      case 'engagement': return 'text-purple-400 bg-purple-500/20';
      case 'progress': return 'text-yellow-400 bg-yellow-500/20';
      case 'community': return 'text-pink-400 bg-pink-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const handleProfileUpdate = async () => {
    setIsEditing(false);
    if (!userId || !profileId || !userProfile) return;
    // Update user basic info
    await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userProfile.name, email: userProfile.email })
    });
    // Update profile info
    await fetch(`/api/profiles/${profileId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: userProfile.phone,
        location: userProfile.location,
        languages: JSON.stringify(userProfile.languages),
        age: userProfile.age,
        interests: JSON.stringify(userProfile.interests),
        goals: userProfile.learningGoals[0] || '',
        expertise: userProfile.skillLevel,
      })
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[40vh]"><span className="text-gray-500 text-lg">Loading profile...</span></div>;
  }
  if (!userProfile) {
    return <div className="flex justify-center items-center min-h-[40vh]"><span className="text-red-500 text-lg">No profile data found.</span></div>;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-8 px-2 flex justify-center">
      <div className="w-full max-w-6xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-3xl shadow-2xl border border-purple-500/20 overflow-hidden">
        {/* Back Button */}
        <div className="px-6 pt-6 pb-0">
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-colors flex items-center gap-2"
          >
            <i className="ri-arrow-left-line mr-2"></i> Back
          </button>
        </div>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600/40 to-blue-600/40 p-6 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{userProfile.name.charAt(0)}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <i className="ri-check-line text-white text-xs"></i>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{userProfile.name}</h2>
                <p className="text-purple-300 text-lg">Level {userProfile.currentLevel} Learner</p>
                <p className="text-gray-400">{userProfile.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
              >
                <i className={`${isEditing ? 'ri-save-line' : 'ri-edit-line'} mr-2`}></i>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800/30 border-b border-gray-700/50">
          <div className="flex">
            {['overview', 'resume', 'chat', 'achievements', 'badges', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-medium transition-colors cursor-pointer capitalize ${
                  activeTab === tab
                    ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <i className={`${
                  tab === 'overview' ? 'ri-user-line' :
                  tab === 'resume' ? 'ri-file-text-line' :
                  tab === 'chat' ? 'ri-chat-3-line' :
                  tab === 'achievements' ? 'ri-trophy-line' :
                  tab === 'badges' ? 'ri-medal-line' :
                  'ri-settings-line'
                } mr-2`}></i>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Stats Cards */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-purple-700/60 to-pink-600/60 rounded-2xl p-4 border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-200 mb-1">{userProfile.totalPoints}</div>
                    <div className="text-gray-300 text-sm">Total Points</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-700/60 to-cyan-600/60 rounded-2xl p-4 border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-200 mb-1">{userProfile.currentLevel}</div>
                    <div className="text-gray-300 text-sm">Current Level</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-700/60 to-emerald-600/60 rounded-2xl p-4 border border-green-500/30">
                    <div className="text-2xl font-bold text-green-200 mb-1">{userProfile.completedCourses}</div>
                    <div className="text-gray-300 text-sm">Courses Done</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-600/60 to-orange-500/60 rounded-2xl p-4 border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-200 mb-1">{userProfile.studyHours}h</div>
                    <div className="text-gray-300 text-sm">Study Hours</div>
                  </div>
                </div>

                {/* Learning Progress */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl p-6 border border-purple-500/20 shadow-lg mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Learning Progress</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-200">Programming Fundamentals</span>
                        <span className="text-green-400 font-semibold">{userProfile?.quizzesCompleted > 0 ? 'Completed' : '0%'}</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div className={`rounded-full h-2 transition-all duration-500 ${userProfile?.quizzesCompleted > 0 ? 'bg-green-400 w-full' : 'bg-gray-500 w-0'}`}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-200">Web Development</span>
                        <span className="text-blue-400 font-semibold">0%</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-400 rounded-full h-2 w-0 transition-all duration-500"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-200">Mobile App Development</span>
                        <span className="text-yellow-400 font-semibold">0%</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-400 rounded-full h-2 w-0 transition-all duration-500"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-300">Completed "Advanced JavaScript" quiz</span>
                      <span className="text-gray-500 text-sm ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300">Started voice session with mentor</span>
                      <span className="text-gray-500 text-sm ml-auto">1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-300">Earned "Translation Pro" badge</span>
                      <span className="text-gray-500 text-sm ml-auto">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">Full Name</label>
                      <div className="text-white">{userProfile.name}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Age</label>
                      <div className="text-white">{userProfile.age} years</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Location</label>
                      <div className="text-white">{userProfile.location}</div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Member Since</label>
                      <div className="text-white">{new Date(userProfile.joinDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(userProfile.languages) ? userProfile.languages : []).map((language, index) => (
                      <span key={index} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold text-white mb-4">Learning Goals</h3>
                  <div className="space-y-2">
                    {(userProfile.learningGoals || []).map((goal, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <i className="ri-target-line text-purple-400 text-sm mt-1"></i>
                        <span className="text-gray-300 text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resume' && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Your Resume</h3>
                <p className="text-gray-400">Create and manage your professional resume</p>
              </div>

              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-file-text-line text-3xl text-white"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Voice Resume Builder</h4>
                  <p className="text-gray-400 mb-6">Create your professional resume using voice commands</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/resume-builder')}
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg shadow-orange-500/25"
                    >
                      <i className="ri-mic-line mr-2"></i>
                      Create Resume
                    </button>
                    <button
                      onClick={() => router.push('/resume-builder')}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg shadow-blue-500/25"
                    >
                      <i className="ri-edit-line mr-2"></i>
                      Edit Resume
                    </button>
                  </div>
                  
                  <div className="mt-6 text-sm text-gray-400">
                    <p>• Answer questions with your voice</p>
                    <p>• Live preview as you build</p>
                    <p>• Download as PDF when complete</p>
                    <p>• Save progress and edit later</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Live Voice Translation Chat</h3>
                <p className="text-gray-400">Connect with mentors and students with real-time voice translation</p>
              </div>

              <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-chat-3-line text-3xl text-white"></i>
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">Multi-Language Voice Chat</h4>
                  <p className="text-gray-400 mb-6">Speak in your preferred language and communicate seamlessly</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/voice-chat')}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25"
                    >
                      <i className="ri-chat-3-line mr-2"></i>
                      Start Chat
                    </button>
                  </div>
                  
                  <div className="mt-6 text-sm text-gray-400">
                    <p>• Real-time voice translation</p>
                    <p>• Support for 10+ Indian languages</p>
                    <p>• Connect with mentors and students</p>
                    <p>• See both original and translated text</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Your Achievements</h3>
                <p className="text-gray-400">Milestones you've reached on your learning journey</p>
              </div>

              <div className="space-y-4">
                {userProfile.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                          <i className="ri-trophy-line text-xl text-white"></i>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{achievement.title}</h4>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                              {achievement.category}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(achievement.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">+{achievement.points}</div>
                        <div className="text-gray-400 text-sm">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Badge Collection</h3>
                <p className="text-gray-400">Special recognition for your learning milestones</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProfile.badges.map((badge) => (
                  <div key={badge.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${badge.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <i className={`${badge.icon} text-2xl text-white`}></i>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{badge.name}</h4>
                    <p className="text-gray-400 text-sm mb-3">{badge.description}</p>
                    <p className="text-gray-500 text-xs">
                      Earned on {new Date(badge.earnedDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Profile Settings</h3>
                <p className="text-gray-400">Customize your learning experience</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-4">Contact Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                        <input
                          type="email"
                          value={userProfile.email}
                          className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                          readOnly={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={userProfile.phone}
                          className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                          readOnly={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl p-6 border border-gray-700/50">
                    <h4 className="text-lg font-semibold text-white mb-4">Learning Preferences</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Preferred Study Time</label>
                        <select className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none pr-8">
                          <option>Morning (6AM - 12PM)</option>
                          <option>Afternoon (12PM - 6PM)</option>
                          <option>Evening (6PM - 10PM)</option>
                          <option>Night (10PM - 12AM)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-2">Daily Study Goal</label>
                        <select className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none pr-8">
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>2 hours</option>
                          <option>3+ hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remove Notification and Privacy Settings sections */}
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProfileUpdate}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}