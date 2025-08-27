'use client';

import { useState, useEffect } from 'react';

interface Badge {
  id: number;
  userId: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: string;
  earnedAt: string;
  metadata?: any;
}

interface Certificate {
  id: string;
  title: string;
  description: string;
  level: number;
  dateEarned: string;
  imageUrl: string;
}

interface RewardSystemProps {
  isOpen: boolean;
  onClose: () => void;
  userLevel: number;
  totalPoints: number;
  userId?: number;
}

export default function RewardSystem({ isOpen, onClose, userLevel, totalPoints, userId }: RewardSystemProps) {
  const [activeTab, setActiveTab] = useState('badges');
  const [showCelebration, setShowCelebration] = useState(false);
  const [newReward, setNewReward] = useState<Badge | null>(null);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch user badges when component opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchUserBadges();
    }
  }, [isOpen, userId]);

  const fetchUserBadges = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/badges?userId=${userId}`);
      if (response.ok) {
        const badges = await response.json();
        setUserBadges(badges);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const certificates: Certificate[] = [
    {
      id: 'basic-programming',
      title: 'Basic Programming Fundamentals',
      description: 'Successfully completed introduction to programming concepts',
      level: 5,
      dateEarned: '2024-02-01',
      imageUrl: 'https://readdy.ai/api/search-image?query=Modern%20certificate%20template%20with%20dark%20background%2C%20neon%20blue%20and%20purple%20accents%2C%20programming%20symbols%2C%20professional%20digital%20certificate%20design%2C%20high%20quality%20graphic%20design&width=400&height=300&seq=cert-1&orientation=landscape'
    },
    {
      id: 'web-development',
      title: 'Web Development Basics',
      description: 'Mastered HTML, CSS, and JavaScript fundamentals',
      level: 8,
      dateEarned: '2024-02-15',
      imageUrl: 'https://readdy.ai/api/search-image?query=Professional%20web%20development%20certificate%20with%20dark%20theme%2C%20cyan%20and%20green%20neon%20colors%2C%20web%20development%20icons%2C%20modern%20digital%20award%20design%2C%20high%20quality%20certificate%20template&width=400&height=300&seq=cert-2&orientation=landscape'
    }
  ];

  const voiceBadges = [
    { name: 'Clear Speaker', icon: 'ri-volume-up-line', earned: true },
    { name: 'Fast Learner', icon: 'ri-speed-up-line', earned: true },
    { name: 'Question Master', icon: 'ri-question-answer-line', earned: false },
    { name: 'Voice Assistant', icon: 'ri-customer-service-2-line', earned: false }
  ];

  const getNextLevelReward = () => {
    const allBadges = [
      { name: 'Rising Star', level: 5, icon: 'ri-arrow-up-line', color: 'from-blue-400 to-indigo-500', description: 'Reach Level 5' },
      { name: 'Knowledge Seeker', level: 10, icon: 'ri-book-open-line', color: 'from-green-400 to-emerald-500', description: 'Reach Level 10' },
      { name: 'Expert Learner', level: 20, icon: 'ri-award-line', color: 'from-purple-400 to-pink-500', description: 'Reach Level 20' },
      { name: 'Master Coder', level: 50, icon: 'ri-crown-line', color: 'from-yellow-400 via-orange-500 to-red-500', description: 'Reach Level 50' }
    ];
    
    return allBadges.find(badge => badge.level > userLevel);
  };

  const getLevelProgress = () => {
    const pointsPerLevel = 100;
    const currentLevelPoints = totalPoints % pointsPerLevel;
    const progressPercentage = (currentLevelPoints / pointsPerLevel) * 100;
    return Math.min(progressPercentage, 100);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 shadow-2xl">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">My Achievements</h2>
                <div className="flex items-center space-x-4">
                  <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-lg text-sm font-medium">
                    Level {userLevel}
                  </span>
                  <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg text-sm font-medium">
                    {totalPoints} Points
                  </span>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-medium">
                    {userBadges.length} Badges
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-700">
            <div className="flex space-x-1 p-6">
              {[
                { id: 'badges', name: 'Badges', icon: 'ri-medal-line' },
                { id: 'certificates', name: 'Certificates', icon: 'ri-award-line' },
                { id: 'progress', name: 'Progress', icon: 'ri-bar-chart-line' },
                { id: 'voice-rewards', name: 'Voice Rewards', icon: 'ri-mic-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading badges...</p>
                  </div>
                ) : userBadges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userBadges.map((badge) => (
                    <div
                      key={badge.id}
                        className="p-6 rounded-2xl border-2 border-purple-500/30 bg-gradient-to-br from-gray-700/50 to-gray-800/50 shadow-lg shadow-purple-500/10 transition-all transform hover:scale-105"
                    >
                      <div className="text-center">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-r ${badge.color} shadow-lg`}>
                          <i className={`${badge.icon} text-2xl text-white`}></i>
                        </div>
                          <h3 className="font-bold mb-2 text-white">
                          {badge.name}
                        </h3>
                          <p className="text-sm mb-3 text-gray-300">
                          {badge.description}
                        </p>
                          <div className="space-y-2">
                            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-xs font-medium">
                              <i className="ri-check-line mr-1"></i>
                              Earned
                            </div>
                              <div className="text-xs text-gray-400">
                              {new Date(badge.earnedAt).toLocaleDateString()}
                              </div>
                          </div>
                          </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-medal-line text-2xl text-gray-400"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Badges Yet</h3>
                    <p className="text-gray-500">Complete quizzes and reach milestones to earn badges</p>
                </div>
                )}
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="space-y-6">
                {certificates.filter(cert => userLevel >= cert.level).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates
                      .filter(cert => userLevel >= cert.level)
                      .map((certificate) => (
                        <div
                          key={certificate.id}
                          className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-green-500/30 shadow-lg shadow-green-500/10"
                        >
                          <img
                            src={certificate.imageUrl}
                            alt={certificate.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <h3 className="text-xl font-bold text-white mb-2">{certificate.title}</h3>
                          <p className="text-gray-300 text-sm mb-4">{certificate.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              Earned: {new Date(certificate.dateEarned).toLocaleDateString()}
                            </span>
                            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:from-blue-600 hover:to-indigo-700 transition-all whitespace-nowrap cursor-pointer">
                              <i className="ri-download-line mr-2"></i>
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-award-line text-2xl text-gray-400"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No Certificates Yet</h3>
                    <p className="text-gray-500">Complete more levels to earn certificates</p>
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-8">
                {/* Current Level Progress */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">Level Progress</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl font-bold text-purple-400">Level {userLevel}</div>
                    <div className="flex-1">
                      <div className="bg-gray-700 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${getLevelProgress()}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {Math.round(getLevelProgress())}% to next level
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Reward Preview */}
                {(() => {
                  const nextReward = getNextLevelReward();
                  return nextReward ? (
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20">
                      <h3 className="text-xl font-bold text-white mb-4">Next Reward</h3>
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${nextReward.color} rounded-full flex items-center justify-center`}>
                          <i className={`${nextReward.icon} text-xl text-white`}></i>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{nextReward.name}</h4>
                          <p className="text-sm text-gray-300">{nextReward.description}</p>
                          <span className="text-xs text-cyan-400">Unlock at Level {nextReward.level}</span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{userBadges.length}</div>
                    <div className="text-sm text-gray-400">Badges Earned</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{totalPoints}</div>
                    <div className="text-sm text-gray-400">Total Points</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{userLevel}</div>
                    <div className="text-sm text-gray-400">Current Level</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{certificates.filter(c => userLevel >= c.level).length}</div>
                    <div className="text-sm text-gray-400">Certificates</div>
                  </div>
                </div>
              </div>
            )}

            {/* Voice Rewards Tab */}
            {activeTab === 'voice-rewards' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {voiceBadges.map((badge, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl border transition-all ${
                        badge.earned
                          ? 'border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10'
                          : 'border-gray-600 bg-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          badge.earned ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          <i className={`${badge.icon} text-xl text-white`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${badge.earned ? 'text-white' : 'text-gray-400'}`}>
                            {badge.name}
                          </h3>
                          <p className={`text-sm ${badge.earned ? 'text-green-400' : 'text-gray-500'}`}>
                            {badge.earned ? 'Unlocked!' : 'Keep practicing to unlock'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-500/20">
                  <h3 className="text-xl font-bold text-white mb-4">Voice Achievements</h3>
                  <p className="text-gray-300 mb-4">
                    Special rewards for mastering voice interactions and helping others in the community.
                  </p>
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all whitespace-nowrap cursor-pointer">
                    <i className="ri-mic-line mr-2"></i>
                    Record Your Journey
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && newReward && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl animate-bounce">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <i className={`${newReward.icon} text-4xl text-yellow-500`}></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">🎉 New Badge Earned!</h2>
            <h3 className="text-xl font-semibold text-white mb-2">{newReward.name}</h3>
            <p className="text-white/90 mb-6">{newReward.description}</p>
            <div className="space-y-3">
              <button className="w-full bg-white text-yellow-600 py-3 px-6 rounded-xl font-bold hover:bg-gray-100 transition-colors whitespace-nowrap cursor-pointer">
                <i className="ri-share-line mr-2"></i>
                Share Achievement
              </button>
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-transparent border-2 border-white text-white py-3 px-6 rounded-xl font-semibold hover:bg-white hover:text-yellow-600 transition-all whitespace-nowrap cursor-pointer"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}