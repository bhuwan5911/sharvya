
'use client';

interface User {
  name: string;
  location: string;
  goal: string;
  progress: number;
  badges: string[];
}

interface ProgressTrackerProps {
  user: User;
}

export default function ProgressTracker({ user }: ProgressTrackerProps) {
  const milestones = [
    { name: 'First Call', completed: true, icon: 'ri-phone-line' },
    { name: 'Week Streak', completed: true, icon: 'ri-calendar-check-line' },
    { name: 'Goal Setter', completed: true, icon: 'ri-target-line' },
    { name: 'Code Explorer', completed: false, icon: 'ri-code-line' },
    { name: 'Project Builder', completed: false, icon: 'ri-tools-line' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-medium text-indigo-600">{user.progress}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full h-3 transition-all duration-500"
            style={{ width: `${user.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Badges Earned</h4>
        <div className="grid grid-cols-3 gap-3">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-3 rounded-lg border-2 ${
                milestone.completed 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                milestone.completed 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-500'
              }`}>
                <i className={`${milestone.icon} text-sm`}></i>
              </div>
              <span className={`text-xs text-center ${
                milestone.completed ? 'text-green-700' : 'text-gray-500'
              }`}>
                {milestone.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
        <h4 className="font-semibold mb-2">Current Goal</h4>
        <p className="text-sm opacity-90">{user.goal}</p>
        <div className="mt-3 flex items-center space-x-2">
          <i className="ri-map-pin-line text-sm"></i>
          <span className="text-sm opacity-90">{user.location}</span>
        </div>
      </div>
    </div>
  );
}
