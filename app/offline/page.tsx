'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Set initial state
    setIsOnline(navigator.onLine);

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-white mobile-text">Reconnecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center mobile-padding">
        {/* Offline Icon */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg shadow-red-500/25">
          <i className="ri-wifi-off-line text-3xl sm:text-4xl text-white"></i>
        </div>

        {/* Title */}
        <h1 className="mobile-heading font-bold text-white mb-4 sm:mb-6">
          You're Offline
        </h1>

        {/* Description */}
        <p className="mobile-text text-gray-300 mb-6 sm:mb-8 leading-relaxed">
          Don't worry! Sharvya works offline too. You can still access your cached content and continue learning.
        </p>

        {/* Offline Features */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl mobile-padding border border-gray-700/50 mb-6 sm:mb-8">
          <h2 className="mobile-text font-semibold text-white mb-4">Available Offline:</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-400 text-sm"></i>
              </div>
              <span className="text-gray-300 mobile-text">Cached quiz questions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-400 text-sm"></i>
              </div>
              <span className="text-gray-300 mobile-text">Your progress data</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-400 text-sm"></i>
              </div>
              <span className="text-gray-300 mobile-text">Voice recording (local)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <i className="ri-information-line text-yellow-400 text-sm"></i>
              </div>
              <span className="text-gray-300 mobile-text">Translation (limited)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full"
          >
            <i className="ri-refresh-line mr-2"></i>
            Try Again
          </button>

          <Link href="/" className="btn-ghost w-full block">
            <i className="ri-home-line mr-2"></i>
            Go to Home
          </Link>

          <button
            onClick={() => {
              if ('caches' in window) {
                caches.keys().then(names => {
                  names.forEach(name => {
                    if (name.includes('sharvya')) {
                      caches.delete(name);
                    }
                  });
                });
              }
              window.location.reload();
            }}
            className="text-gray-400 hover:text-gray-300 mobile-text transition-colors"
          >
            Clear Cache & Retry
          </button>
        </div>

        {/* Connection Status */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-700/50">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400 mobile-text">No internet connection</span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Check your Wi-Fi or mobile data connection
          </p>
        </div>

        {/* Help Section */}
        <div className="mt-6 sm:mt-8">
          <details className="text-left">
            <summary className="text-cyan-400 hover:text-cyan-300 cursor-pointer mobile-text font-medium">
              Need help?
            </summary>
            <div className="mt-3 text-gray-400 mobile-text space-y-2">
              <p>• Check your internet connection</p>
              <p>• Try refreshing the page</p>
              <p>• Clear browser cache</p>
              <p>• Contact support if the issue persists</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
} 