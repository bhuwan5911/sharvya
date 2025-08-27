'use client';

import { useState, useEffect } from 'react';

interface ProgressShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgressShowcase({ isOpen, onClose }: ProgressShowcaseProps) {
  const [currentView, setCurrentView] = useState('overview');
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setAnimatedProgress(75);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const achievements = [
    { name: 'First Call', description: 'Completed your first mentor session', icon: 'ri-phone-line', unlocked: true, color: 'bg-green-500' },
    { name: 'Week Streak', description: '7 consecutive days of learning', icon: 'ri-calendar-check-line', unlocked: true, color: 'bg-blue-500' },
    { name: 'Goal Setter', description: 'Set your learning objectives', icon: 'ri-target-line', unlocked: true, color: 'bg-purple-500' },
    { name: 'Code Explorer', description: 'Completed 10 coding exercises', icon: 'ri-code-line', unlocked: false, color: 'bg-orange-500' },
    { name: 'Project Builder', description: 'Built your first project', icon: 'ri-tools-line', unlocked: false, color: 'bg-red-500' },
    { name: 'Mentor Helper', description: 'Helped another student', icon: 'ri-heart-line', unlocked: false, color: 'bg-pink-500' }
  ];

  const skills = [
    { name: 'JavaScript Basics', progress: 80, color: 'bg-yellow-500' },
    { name: 'HTML & CSS', progress: 95, color: 'bg-blue-500' },
    { name: 'React Fundamentals', progress: 60, color: 'bg-cyan-500' },
    { name: 'Problem Solving', progress: 70, color: 'bg-green-500' },
    { name: 'Communication', progress: 85, color: 'bg-purple-500' }
  ];

  const milestones = [
            { date: '2024-01-15', title: 'Started Learning Journey', description: 'Joined Sharvya and set goals', completed: true },
    { date: '2024-01-20', title: 'First Mentor Session', description: 'Connected with Priya for JavaScript basics', completed: true },
    { date: '2024-02-01', title: 'Built First Project', description: 'Created a simple calculator app', completed: true },
    { date: '2024-02-15', title: 'Intermediate Level', description: 'Advanced to React fundamentals', completed: false },
    { date: '2024-03-01', title: 'Job Ready', description: 'Complete portfolio and apply for jobs', completed: false }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Progress Tracking Demo</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <i className="ri-close-line text-xl text-gray-500"></i>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: 'ri-dashboard-line' },
              { id: 'achievements', name: 'Achievements', icon: 'ri-trophy-line' },
              { id: 'skills', name: 'Skills', icon: 'ri-bar-chart-line' },
              { id: 'timeline', name: 'Timeline', icon: 'ri-time-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  currentView === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className={tab.icon}></i>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {currentView === 'overview' && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto mb-6 relative">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#e5e7eb" strokeWidth="12"/>
                    <circle 
                      cx="80" 
                      cy="80" 
                      r="70" 
                      fill="none" 
                      stroke="#8b5cf6" 
                      strokeWidth="12"
                      strokeDasharray={`${animatedProgress * 4.4} 440`}
                      strokeLinecap="round"
                      className="transition-all duration-2000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600">{animatedProgress}%</div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Amazing Progress, Sameer!</h3>
                <p className="text-gray-600">You're on track to achieve your coding goals</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white">
                  <div className="text-3xl font-bold mb-2">45</div>
                  <div className="text-sm opacity-90">Hours Learned</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white">
                  <div className="text-3xl font-bold mb-2">12</div>
                  <div className="text-sm opacity-90">Mentor Sessions</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
                  <div className="text-3xl font-bold mb-2">3</div>
                  <div className="text-sm opacity-90">Projects Built</div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {currentView === 'achievements' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 ${
                      achievement.unlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.unlocked ? achievement.color : 'bg-gray-300'
                      }`}>
                        <i className={`${achievement.icon} text-xl text-white`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{achievement.name}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        {achievement.unlocked && (
                          <div className="mt-2 flex items-center space-x-1 text-green-600">
                            <i className="ri-check-line text-sm"></i>
                            <span className="text-sm font-medium">Unlocked!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {currentView === 'skills' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Skill Development</h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className="text-sm font-medium text-gray-600">{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${skill.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {currentView === 'timeline' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Learning Journey</h3>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-4 h-4 rounded-full mt-2 ${
                      milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        {milestone.completed && (
                          <i className="ri-check-line text-green-500"></i>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{milestone.description}</p>
                      <p className="text-xs text-gray-500">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap cursor-pointer"
            >
              <i className="ri-trophy-line mr-2"></i>
              Start Tracking Your Progress
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}