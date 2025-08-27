'use client';

import { useState, useEffect } from 'react';

interface Peer {
  id: string;
  name: string;
  age: number;
  location: string;
  interests: string[];
  level: string;
  languages: string[];
  isOnline: boolean;
  profileImage: string;
  studyGoals: string[];
  personality: string;
  timezone: string;
}

interface PeerPairingModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PeerPairingMode({ isOpen, onClose }: PeerPairingModeProps) {
  const [activeTab, setActiveTab] = useState('find');
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [currentUser] = useState({
    name: 'Sameer',
    interests: ['Programming', 'Web Development', 'Mobile Apps'],
    level: 'Beginner',
    languages: ['Hindi', 'Marathi', 'English']
  });

  const [availablePeers, setAvailablePeers] = useState<Peer[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      age: 19,
      location: 'Rural Gujarat',
      interests: ['Web Development', 'UI Design', 'React'],
      level: 'Intermediate',
      languages: ['Hindi', 'Gujarati', 'English'],
      isOnline: true,
      profileImage: 'https://readdy.ai/api/search-image?query=Young%20Indian%20female%20student%20smiling%20confidently%2C%20wearing%20casual%20modern%20clothes%2C%20bright%20natural%20lighting%2C%20friendly%20approachable%20expression%2C%20educational%20background&width=150&height=150&seq=peer-1&orientation=squarish',
      studyGoals: ['Build portfolio website', 'Learn JavaScript frameworks', 'Get internship'],
      personality: 'Friendly and collaborative',
      timezone: 'IST'
    },
    {
      id: '2',
      name: 'Raj Patel',
      age: 20,
      location: 'Rural Rajasthan',
      interests: ['Programming', 'Data Science', 'Python'],
      level: 'Beginner',
      languages: ['Hindi', 'Rajasthani', 'English'],
      isOnline: true,
      profileImage: 'https://readdy.ai/api/search-image?query=Young%20Indian%20male%20student%20with%20genuine%20smile%2C%20wearing%20casual%20shirt%2C%20natural%20outdoor%20lighting%2C%20confident%20and%20motivated%20expression%2C%20study-focused%20environment&width=150&height=150&seq=peer-2&orientation=squarish',
      studyGoals: ['Master Python basics', 'Build first project', 'Join coding community'],
      personality: 'Motivated and patient',
      timezone: 'IST'
    },
    {
      id: '3',
      name: 'Anita Singh',
      age: 18,
      location: 'Rural Uttar Pradesh',
      interests: ['Mobile Apps', 'Programming', 'Design'],
      level: 'Beginner',
      languages: ['Hindi', 'English'],
      isOnline: false,
      profileImage: 'https://readdy.ai/api/search-image?query=Young%20Indian%20female%20student%20with%20bright%20enthusiastic%20smile%2C%20wearing%20colorful%20traditional-modern%20outfit%2C%20natural%20lighting%2C%20creative%20and%20determined%20expression%2C%20learning%20environment%20background&width=150&height=150&seq=peer-3&orientation=squarish',
      studyGoals: ['Create mobile app', 'Learn app design', 'Help village businesses'],
      personality: 'Creative and enthusiastic',
      timezone: 'IST'
    },
    {
      id: '4',
      name: 'Karan Mehta',
      age: 21,
      location: 'Rural Maharashtra',
      interests: ['Web Development', 'Backend', 'Databases'],
      level: 'Intermediate',
      languages: ['Hindi', 'Marathi', 'English'],
      isOnline: true,
      profileImage: 'https://readdy.ai/api/search-image?query=Young%20Indian%20male%20student%20with%20warm%20friendly%20smile%2C%20wearing%20simple%20t-shirt%2C%20soft%20natural%20lighting%2C%20helpful%20and%20supportive%20expression%2C%20tech%20workspace%20background&width=150&height=150&seq=peer-4&orientation=squarish',
      studyGoals: ['Build full-stack apps', 'Learn databases', 'Teach others'],
      personality: 'Helpful and supportive',
      timezone: 'IST'
    }
  ]);

  const [myConnections] = useState<Peer[]>([
    availablePeers[0], // Priya is already connected
    availablePeers[3]  // Karan is already connected
  ]);

  const calculateCompatibility = (peer: Peer) => {
    let score = 0;
    
    // Interest matching
    const commonInterests = peer.interests.filter(interest => 
      currentUser.interests.includes(interest)
    ).length;
    score += (commonInterests / Math.max(peer.interests.length, currentUser.interests.length)) * 40;
    
    // Level matching
    if (peer.level === currentUser.level) score += 30;
    else if (
      (peer.level === 'Intermediate' && currentUser.level === 'Beginner') ||
      (peer.level === 'Beginner' && currentUser.level === 'Intermediate')
    ) score += 20;
    
    // Language matching
    const commonLanguages = peer.languages.filter(lang => 
      currentUser.languages.includes(lang)
    ).length;
    score += (commonLanguages / peer.languages.length) * 30;
    
    return Math.min(Math.round(score), 98); // Cap at 98% for realism
  };

  const connectWithPeer = (peer: Peer) => {
    setSelectedPeer(peer);
    setShowMatchDetails(true);
  };

  const sendConnectionRequest = () => {
    // Simulate sending connection request
    setShowMatchDetails(false);
    setSelectedPeer(null);
    // In real app, this would update the peer's status
  };

  const startVoiceChat = (peerId: string) => {
    // Simulate starting voice chat
    console.log(`Starting voice chat with peer ${peerId}`);
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-purple-500/20 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <i className="ri-team-line text-2xl text-white"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Peer Learning Mode</h2>
                <p className="text-cyan-300">Connect with fellow learners from rural India</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800/30 border-b border-gray-700/50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('find')}
              className={`flex-1 px-6 py-4 font-medium transition-colors cursor-pointer ${
                activeTab === 'find'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <i className="ri-search-line mr-2"></i>
              Find Study Partners
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 px-6 py-4 font-medium transition-colors cursor-pointer ${
                activeTab === 'connections'
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <i className="ri-user-heart-line mr-2"></i>
              My Connections ({myConnections.length})
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'find' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Recommended Study Partners</h3>
                <p className="text-gray-400">AI-matched based on your interests, level, and language preferences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availablePeers.filter(peer => !myConnections.find(conn => conn.id === peer.id)).map((peer) => {
                  const compatibility = calculateCompatibility(peer);
                  return (
                    <div key={peer.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="relative">
                          <img
                            src={peer.profileImage}
                            alt={peer.name}
                            className="w-16 h-16 rounded-2xl object-cover object-top"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-800 ${
                            peer.isOnline ? 'bg-green-500' : 'bg-gray-500'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-lg font-semibold text-white">{peer.name}</h4>
                            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 px-3 py-1 rounded-lg text-sm font-semibold">
                              {compatibility}% Match
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{peer.age} years • {peer.location}</p>
                          <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getLevelColor(peer.level)}`}>
                            {peer.level}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="text-white font-medium mb-2">Interests:</h5>
                        <div className="flex flex-wrap gap-2">
                          {peer.interests.map((interest, index) => (
                            <span key={index} className={`px-3 py-1 rounded-lg text-sm ${
                              currentUser.interests.includes(interest)
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-gray-700/50 text-gray-400'
                            }`}>
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h5 className="text-white font-medium mb-2">Languages:</h5>
                        <div className="flex flex-wrap gap-2">
                          {peer.languages.map((language, index) => (
                            <span key={index} className={`px-2 py-1 rounded text-xs ${
                              currentUser.languages.includes(language)
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-700/50 text-gray-400'
                            }`}>
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => connectWithPeer(peer)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
                      >
                        <i className="ri-user-add-line mr-2"></i>
                        Connect & Learn Together
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'connections' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Your Study Partners</h3>
                <p className="text-gray-400">Start voice chats and learn together</p>
              </div>

              {myConnections.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="ri-team-line text-3xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Connections Yet</h3>
                  <p className="text-gray-500 mb-6">Find study partners to start learning together</p>
                  <button
                    onClick={() => setActiveTab('find')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
                  >
                    Find Study Partners
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myConnections.map((peer) => (
                    <div key={peer.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={peer.profileImage}
                              alt={peer.name}
                              className="w-14 h-14 rounded-2xl object-cover object-top"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                              peer.isOnline ? 'bg-green-500' : 'bg-gray-500'
                            }`}></div>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">{peer.name}</h4>
                            <p className="text-gray-400 text-sm">{peer.location}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(peer.level)}`}>
                                {peer.level}
                              </span>
                              <span className={`text-xs ${peer.isOnline ? 'text-green-400' : 'text-gray-500'}`}>
                                {peer.isOnline ? 'Online now' : 'Last seen 2h ago'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => startVoiceChat(peer.id)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all shadow-lg cursor-pointer ${
                              peer.isOnline
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-green-500/25'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!peer.isOnline}
                          >
                            <i className="ri-mic-line mr-2"></i>
                            {peer.isOnline ? 'Voice Chat' : 'Offline'}
                          </button>
                          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 cursor-pointer">
                            <i className="ri-message-line mr-2"></i>
                            Message
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-400">Common interests:</span>
                            <div className="flex gap-2">
                              {peer.interests.filter(interest => currentUser.interests.includes(interest)).map((interest, index) => (
                                <span key={index} className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-gray-500">Connected 3 days ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Match Details Modal */}
        {showMatchDetails && selectedPeer && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-2xl p-8 max-w-lg w-full border border-cyan-500/20">
              <div className="text-center mb-6">
                <img
                  src={selectedPeer.profileImage}
                  alt={selectedPeer.name}
                  className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover object-top"
                />
                <h3 className="text-2xl font-bold text-white mb-2">{selectedPeer.name}</h3>
                <p className="text-gray-400">{selectedPeer.personality}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Study Goals:</h4>
                  <div className="space-y-1">
                    {selectedPeer.studyGoals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <i className="ri-target-line text-cyan-400 text-sm"></i>
                        <span className="text-gray-300 text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Why you're compatible:</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <i className="ri-heart-line text-green-400 text-sm"></i>
                      <span className="text-gray-300 text-sm">Similar learning interests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-global-line text-blue-400 text-sm"></i>
                      <span className="text-gray-300 text-sm">Common languages</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <i className="ri-graduation-cap-line text-purple-400 text-sm"></i>
                      <span className="text-gray-300 text-sm">Complementary skill levels</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowMatchDetails(false)}
                  className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  Maybe Later
                </button>
                <button
                  onClick={sendConnectionRequest}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}