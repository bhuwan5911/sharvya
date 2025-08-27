
'use client';

interface Mentor {
  id: number;
  name: string;
  expertise: string;
  languages: string[];
  rating: number;
  sessions: number;
  image: string;
  isOnline: boolean;
}

interface MentorCardProps {
  mentor: Mentor;
}

export default function MentorCard({ mentor }: MentorCardProps) {
  const handleConnect = () => {
    // Simulate connection logic
    console.log(`Connecting to ${mentor.name}`);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            src={mentor.image}
            alt={mentor.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
            mentor.isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
          <p className="text-sm text-gray-600">{mentor.expertise}</p>
          <div className="flex items-center space-x-1 mt-1">
            <i className="ri-star-fill text-yellow-400 text-sm"></i>
            <span className="text-sm text-gray-600">{mentor.rating} ({mentor.sessions} sessions)</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Languages:</p>
        <div className="flex flex-wrap gap-1">
          {mentor.languages.map((lang, index) => (
            <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
              {lang}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleConnect}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium whitespace-nowrap cursor-pointer"
        >
          <i className="ri-phone-line mr-2"></i>
          Voice Call
        </button>
        <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm whitespace-nowrap cursor-pointer">
          <i className="ri-message-2-line"></i>
        </button>
      </div>
    </div>
  );
}
