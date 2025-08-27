'use client';

import { useState, useEffect } from 'react';

interface DeviceCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeviceChecker({ isOpen, onClose }: DeviceCheckerProps) {
  const [deviceInfo, setDeviceInfo] = useState({
    type: 'Unknown',
    browser: 'Unknown',
    os: 'Unknown',
    connection: 'Unknown',
    compatibility: 0
  });

  useEffect(() => {
    if (isOpen) {
      // Simulate device detection
      const userAgent = navigator.userAgent;
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      setDeviceInfo({
        type: /Mobi|Android/i.test(userAgent) ? 'Mobile' : 'Desktop',
        browser: /Chrome/i.test(userAgent) ? 'Chrome' : /Firefox/i.test(userAgent) ? 'Firefox' : /Safari/i.test(userAgent) ? 'Safari' : 'Other',
        os: /Android/i.test(userAgent) ? 'Android' : /iPhone|iPad/i.test(userAgent) ? 'iOS' : /Windows/i.test(userAgent) ? 'Windows' : 'Other',
        connection: connection ? connection.effectiveType || 'Unknown' : 'Unknown',
        compatibility: Math.floor(Math.random() * 20) + 80 // Simulate 80-100% compatibility
      });
    }
  }, [isOpen]);

  const compatibilityFeatures = [
    { name: 'Voice Recording', status: 'excellent', icon: 'ri-mic-line' },
    { name: 'Audio Playback', status: 'excellent', icon: 'ri-volume-up-line' },
    { name: 'Low Bandwidth Mode', status: 'excellent', icon: 'ri-wifi-line' },
    { name: 'Offline Features', status: 'good', icon: 'ri-download-line' },
    { name: 'Push Notifications', status: deviceInfo.type === 'Mobile' ? 'excellent' : 'good', icon: 'ri-notification-line' },
    { name: 'Background Sync', status: 'good', icon: 'ri-refresh-line' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-yellow-600 bg-yellow-100';
      case 'fair': return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return 'ri-check-double-line';
      case 'good': return 'ri-check-line';
      case 'fair': return 'ri-error-warning-line';
      default: return 'ri-close-line';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Device Compatibility Check</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-500"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overall Compatibility Score */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="8"
                  strokeDasharray={`${deviceInfo.compatibility * 3.14} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{deviceInfo.compatibility}%</div>
                  <div className="text-sm text-gray-600">Compatible</div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Great! Your device works perfectly with Sharvya</h3>
            <p className="text-gray-600">All core features are fully supported on your device</p>
          </div>

          {/* Device Information */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Device Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <i className="ri-smartphone-line text-blue-600"></i>
                <div>
                  <div className="text-sm text-gray-500">Device Type</div>
                  <div className="font-medium">{deviceInfo.type}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-global-line text-blue-600"></i>
                <div>
                  <div className="text-sm text-gray-500">Browser</div>
                  <div className="font-medium">{deviceInfo.browser}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-computer-line text-blue-600"></i>
                <div>
                  <div className="text-sm text-gray-500">Operating System</div>
                  <div className="font-medium">{deviceInfo.os}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <i className="ri-wifi-line text-blue-600"></i>
                <div>
                  <div className="text-sm text-gray-500">Connection</div>
                  <div className="font-medium">{deviceInfo.connection}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Compatibility */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Compatibility</h3>
            <div className="space-y-3">
              {compatibilityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className={`${feature.icon} text-gray-600`}></i>
                    <span className="font-medium text-gray-900">{feature.name}</span>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(feature.status)}`}>
                    <i className={getStatusIcon(feature.status)}></i>
                    <span className="capitalize">{feature.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optimization Tips */}
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Optimization Tips</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <i className="ri-check-line text-green-600 mt-1"></i>
                <span className="text-gray-700">Enable microphone permissions for best voice experience</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="ri-check-line text-green-600 mt-1"></i>
                <span className="text-gray-700">Use Wi-Fi when available to save mobile data</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="ri-check-line text-green-600 mt-1"></i>
                <span className="text-gray-700">Keep your browser updated for latest features</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button 
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap cursor-pointer"
          >
            Start Using Sharvya
          </button>
        </div>
      </div>
    </div>
  );
}