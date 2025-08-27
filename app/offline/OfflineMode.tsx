'use client';

import { useState, useEffect } from 'react';

interface OfflineModeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OfflineContent {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'exercise';
  size: string;
  duration: string;
  downloaded: boolean;
  downloading: boolean;
  progress: number;
}

export default function OfflineMode({ isOpen, onClose }: OfflineModeProps) {
  const [activeTab, setActiveTab] = useState('download');
  const [storageUsed, setStorageUsed] = useState(245); // MB
  const [storageLimit] = useState(2048); // MB
  const [isOffline, setIsOffline] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  const [offlineContent, setOfflineContent] = useState<OfflineContent[]>([
    {
      id: 'programming-basics',
      title: 'Programming Fundamentals',
      type: 'lesson',
      size: '45 MB',
      duration: '2 hours',
      downloaded: true,
      downloading: false,
      progress: 100
    },
    {
      id: 'web-dev-intro',
      title: 'Web Development Basics',
      type: 'lesson',
      size: '67 MB',
      duration: '3 hours',
      downloaded: true,
      downloading: false,
      progress: 100
    },
    {
      id: 'voice-commands',
      title: 'Voice Command Training',
      type: 'exercise',
      size: '23 MB',
      duration: '45 minutes',
      downloaded: false,
      downloading: false,
      progress: 0
    },
    {
      id: 'javascript-quiz',
      title: 'JavaScript Practice Quiz',
      type: 'quiz',
      size: '12 MB',
      duration: '30 minutes',
      downloaded: false,
      downloading: false,
      progress: 0
    },
    {
      id: 'career-guidance',
      title: 'Tech Career Roadmap',
      type: 'lesson',
      size: '89 MB',
      duration: '4 hours',
      downloaded: false,
      downloading: false,
      progress: 0
    },
    {
      id: 'hindi-coding',
      title: 'Coding in Hindi',
      type: 'lesson',
      size: '156 MB',
      duration: '5 hours',
      downloaded: false,
      downloading: false,
      progress: 0
    }
  ]);

  useEffect(() => {
    // Check if user is offline
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const downloadContent = (contentId: string) => {
    setOfflineContent(prev => prev.map(content => 
      content.id === contentId 
        ? { ...content, downloading: true, progress: 0 }
        : content
    ));

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setOfflineContent(prev => prev.map(content => 
          content.id === contentId 
            ? { ...content, downloading: false, downloaded: true, progress: 100 }
            : content
        ));
        
        // Update storage
        const content = offlineContent.find(c => c.id === contentId);
        if (content) {
          setStorageUsed(prev => prev + parseInt(content.size));
        }
      } else {
        setOfflineContent(prev => prev.map(content => 
          content.id === contentId 
            ? { ...content, progress }
            : content
        ));
      }
    }, 500);
  };

  const deleteContent = (contentId: string) => {
    const content = offlineContent.find(c => c.id === contentId);
    if (content) {
      setStorageUsed(prev => prev - parseInt(content.size));
    }
    
    setOfflineContent(prev => prev.map(content => 
      content.id === contentId 
        ? { ...content, downloaded: false, progress: 0 }
        : content
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return 'ri-book-line';
      case 'quiz': return 'ri-questionnaire-line';
      case 'exercise': return 'ri-fitness-line';
      default: return 'ri-file-line';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'from-blue-500 to-indigo-600';
      case 'quiz': return 'from-purple-500 to-pink-600';
      case 'exercise': return 'from-green-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const downloadedContent = offlineContent.filter(content => content.downloaded);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-purple-500/20 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <i className="ri-download-cloud-line text-2xl text-white"></i>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  Offline Mode
                  {isOffline && (
                    <span className="ml-3 bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm font-medium">
                      <i className="ri-wifi-off-line mr-1"></i>
                      Offline
                    </span>
                  )}
                </h2>
                <p className="text-orange-300">Learn without internet connection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          {/* Storage Info */}
          <div className="mt-6 bg-gray-800/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-300 font-medium">Storage Usage</span>
              <span className="text-orange-400 font-semibold">{storageUsed} MB / {storageLimit} MB</span>
            </div>
            <div className="bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full h-2 transition-all duration-500"
                style={{ width: `${(storageUsed / storageLimit) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {Math.round(((storageLimit - storageUsed) / storageLimit) * 100)}% space remaining
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800/30 border-b border-gray-700/50">
          <div className="flex">
            <button
              onClick={() => setActiveTab('download')}
              className={`flex-1 px-6 py-4 font-medium transition-colors cursor-pointer ${
                activeTab === 'download'
                  ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <i className="ri-download-line mr-2"></i>
              Download Content
            </button>
            <button
              onClick={() => setActiveTab('offline')}
              className={`flex-1 px-6 py-4 font-medium transition-colors cursor-pointer ${
                activeTab === 'offline'
                  ? 'text-orange-400 border-b-2 border-orange-400 bg-orange-500/10'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <i className="ri-folder-line mr-2"></i>
              My Offline Content ({downloadedContent.length})
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'download' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Available for Download</h3>
                <p className="text-gray-400">Download content to access without internet connection</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offlineContent.filter(content => !content.downloaded).map((content) => (
                  <div key={content.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(content.type)} rounded-xl flex items-center justify-center`}>
                        <i className={`${getTypeIcon(content.type)} text-xl text-white`}></i>
                      </div>
                      <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-lg text-sm capitalize">
                        {content.type}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-white mb-2">{content.title}</h4>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span><i className="ri-hard-drive-line mr-1"></i>{content.size}</span>
                      <span><i className="ri-time-line mr-1"></i>{content.duration}</span>
                    </div>

                    {content.downloading ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-orange-400">Downloading...</span>
                          <span className="text-sm text-orange-400">{Math.round(content.progress)}%</span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full h-2 transition-all duration-300"
                            style={{ width: `${content.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => downloadContent(content.id)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
                      >
                        <i className="ri-download-line mr-2"></i>
                        Download
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'offline' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Your Offline Content</h3>
                <p className="text-gray-400">Content available without internet connection</p>
              </div>

              {downloadedContent.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="ri-folder-open-line text-3xl text-gray-400"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Offline Content</h3>
                  <p className="text-gray-500 mb-6">Download content to access it offline</p>
                  <button
                    onClick={() => setActiveTab('download')}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
                  >
                    Browse Content
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {downloadedContent.map((content) => (
                    <div key={content.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(content.type)} rounded-xl flex items-center justify-center`}>
                            <i className={`${getTypeIcon(content.type)} text-xl text-white`}></i>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">{content.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span><i className="ri-hard-drive-line mr-1"></i>{content.size}</span>
                              <span><i className="ri-time-line mr-1"></i>{content.duration}</span>
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                <i className="ri-check-line mr-1"></i>Downloaded
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 cursor-pointer">
                            <i className="ri-play-line mr-2"></i>
                            Open
                          </button>
                          <button
                            onClick={() => deleteContent(content.id)}
                            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-xl font-medium hover:from-red-600 hover:to-pink-700 transition-all shadow-lg shadow-red-500/25 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line mr-2"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}