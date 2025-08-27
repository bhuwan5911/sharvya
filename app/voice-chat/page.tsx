'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VoiceChatInterface from './VoiceChatInterface';
import LanguageSelector from './LanguageSelector';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'mentor';
  language: string;
}

interface ChatMessage {
  id: string;
  senderId: number;
  senderName: string;
  originalText: string;
  translatedText: string;
  originalLanguage: string;
  translatedLanguage: string;
  timestamp: Date;
  isVoice: boolean;
}

// Custom hook to detect poor internet
function usePoorInternet() {
  const [isPoor, setIsPoor] = useState(false);

  useEffect(() => {
    function updateStatus() {
      // Basic offline detection
      if (!navigator.onLine) {
        setIsPoor(true);
        return;
      }
      // Network Information API (optional, not supported everywhere)
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection && connection.downlink && connection.downlink < 1) {
        setIsPoor(true);
      } else if (connection && connection.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType)) {
        setIsPoor(true);
      } else {
        setIsPoor(false);
      }
    }
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateStatus);
    }
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateStatus);
      }
    };
  }, []);
  return isPoor;
}

export default function VoiceChat() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('hi'); // Default to Hindi
  const [availableLanguages] = useState([
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  ]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await import('@supabase/supabase-js').then(supabase => 
        supabase.createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_KEY!
        ).auth.getUser()
      );

      if (!authUser) {
        router.push('/login');
        return;
      }

      const profileRes = await fetch(`/api/users?email=${authUser.email}`);
      if (profileRes.ok) {
        const profiles = await profileRes.json();
        if (profiles.length > 0) {
          const profile = profiles[0];
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.profile?.expertise ? 'mentor' : 'student',
            language: selectedLanguage
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const isPoorInternet = usePoorInternet();

  // Helper to get student's first interest (study niche)
  const [studentNiche, setStudentNiche] = useState<string | null>(null);
  useEffect(() => {
    if (user && user.role === 'student') {
      fetch(`/api/users?email=${user.email}`)
        .then(res => res.json())
        .then(profiles => {
          if (profiles.length > 0) {
            const interests = profiles[0].profile?.interests ? JSON.parse(profiles[0].profile.interests) : [];
            if (interests.length > 0) setStudentNiche(interests[0]);
          }
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white mt-4">Loading voice chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-pacifico text-3xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Sharvya
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                Dashboard
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Role: <span className="text-cyan-400 font-semibold capitalize">{user?.role}</span></span>
                <LanguageSelector
                  languages={availableLanguages}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Poor Internet Banner */}
        {user && user.role === 'student' && isPoorInternet && studentNiche && (
          <div className="bg-yellow-200 border-l-4 border-yellow-500 text-yellow-900 p-4 mb-6 rounded-lg flex items-center justify-between">
            <div>
              <strong>Poor Internet Detected!</strong> You can download offline learning materials for <b>{studentNiche}</b>.
            </div>
            <div className="flex space-x-2">
              <a href={`/materials/${studentNiche.toLowerCase().replace(/ /g, '-')}/sample.pdf`} download className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Download PDF</a>
              <a href={`/materials/${studentNiche.toLowerCase().replace(/ /g, '-')}/sample.pptx`} download className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Download PPT</a>
            </div>
          </div>
        )}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Live Voice Translation Chat
          </h1>
          <p className="text-gray-300 text-lg mb-6">
            Speak in your preferred language and communicate seamlessly with mentors/students
          </p>
          
          {/* Become Mentor Button for Students */}
          {user && user.role === 'student' && (
            <div className="mb-6">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/mentors', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: user.id,
                        expertise: 'Web Development',
                        experience: '5+ years',
                        bio: 'Experienced web developer helping students learn',
                        availability: 'Weekdays 9 AM - 6 PM',
                        languages: ['en', 'hi'],
                        interests: ['React', 'Node.js', 'JavaScript']
                      })
                    });
                    
                    if (response.ok) {
                      alert('Successfully registered as mentor! Refresh the page to see changes.');
                      window.location.reload();
                    } else {
                      alert('Failed to register as mentor');
                    }
                  } catch (error) {
                    console.error('Error registering as mentor:', error);
                    alert('Error registering as mentor');
                  }
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                <i className="ri-user-star-line mr-2"></i>
                Become a Mentor (Test)
              </button>
            </div>
          )}
        </div>

        {user && (
          <VoiceChatInterface
            user={user}
            selectedLanguage={selectedLanguage}
            availableLanguages={availableLanguages}
          />
        )}
      </div>
    </div>
  );
} 