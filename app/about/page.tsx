
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const team = [
    {
      name: 'Dr. Ravi Patel',
      role: 'Founder & CEO',
      bio: 'Former Google engineer who grew up in rural Gujarat. Passionate about bridging the digital divide.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20CEO%20and%20founder%2C%20confident%20smile%2C%20wearing%20modern%20business%20casual%20attire%2C%20tech%20startup%20office%20background%2C%20visionary%20leader%20with%20rural%20roots%2C%20inspiring%20and%20authentic%20portrait%20photography&width=300&height=300&seq=team-ceo&orientation=squarish'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Product',
      bio: 'UX expert with 10 years of experience designing for accessibility and inclusion.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20product%20manager%2C%20warm%20and%20approachable%20smile%2C%20wearing%20contemporary%20business%20attire%2C%20modern%20tech%20office%20setting%2C%20expert%20in%20user%20experience%20design%2C%20confident%20and%20innovative%2C%20high%20quality%20portrait&width=300&height=300&seq=team-product&orientation=squarish'
    },
    {
      name: 'Arjun Singh',
      role: 'Head of Engineering',
      bio: 'AI specialist focused on voice recognition and natural language processing for Indian languages.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20male%20software%20engineer%2C%20intelligent%20and%20focused%20expression%2C%20wearing%20casual%20tech%20company%20attire%2C%20modern%20development%20workspace%20background%2C%20AI%20and%20voice%20technology%20expert%2C%20high%20quality%20professional%20photo&width=300&height=300&seq=team-engineer&orientation=squarish'
    },
    {
      name: 'Meera Kapoor',
      role: 'Community Manager',
      bio: 'Rural development advocate with deep understanding of challenges faced by rural youth.',
      image: 'https://readdy.ai/api/search-image?query=Professional%20Indian%20female%20community%20manager%2C%20empathetic%20and%20caring%20expression%2C%20wearing%20casual%20professional%20attire%2C%20community%20outreach%20setting%2C%20rural%20development%20advocate%2C%20warm%20and%20approachable%2C%20high%20quality%20portrait%20photography&width=300&height=300&seq=team-community&orientation=squarish'
    }
  ];

  const milestones = [
            { year: '2023', title: 'Founded Sharvya', description: 'Started with a vision to break barriers for rural youth' },
    { year: '2023', title: 'First 1,000 Users', description: 'Reached our first thousand rural students' },
    { year: '2024', title: 'Multi-language Support', description: 'Added support for 15+ Indian languages' },
    { year: '2024', title: '10,000+ Success Stories', description: 'Helped over 10,000 rural youth connect with mentors' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-pacifico text-2xl text-indigo-600">Sharvya</Link>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors">Dashboard</Link>
              <Link href="/features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-5xl font-bold text-gray-900 mb-6 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Our Mission: Breaking Barriers
          </h1>
          <p className={`text-xl text-gray-600 mb-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            We believe every young person deserves access to quality mentorship, regardless of their location, language, or economic background.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sameer's Story Inspired Us</h2>
              <p className="text-gray-600 mb-6">
                Sameer, a 17-year-old from rural Maharashtra, dreamed of becoming a coder. But language barriers, 
                poor internet, and lack of local mentors made every step forward feel like two steps back.
              </p>
              <p className="text-gray-600 mb-6">
                We realized that traditional online learning platforms weren't built for youth like Sameer. 
                They assumed fast internet, English proficiency, and typing skills that many rural students haven't had the chance to develop.
              </p>
              <p className="text-gray-600 mb-8">
                That's why we built Sharvya - a platform that meets students where they are, speaks their language, 
                and works on the devices they have access to.
              </p>
              <div className="flex space-x-4">
                <div className="bg-indigo-100 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">10,000+</div>
                  <div className="text-sm text-gray-600">Students Helped</div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">15+</div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Mentors</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=Sameer%2C%2017-year-old%20Indian%20rural%20student%2C%20determined%20expression%2C%20sitting%20with%20basic%20smartphone%2C%20traditional%20village%20home%20background%2C%20studying%20under%20lamplight%2C%20hope%20and%20determination%20in%20eyes%2C%20inspiring%20documentary%20photography%20style%2C%20warm%20lighting&width=600&height=500&seq=sameer-story&orientation=landscape"
                alt="Sameer's inspiring journey"
                className="w-full rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Passionate individuals working to democratize access to mentorship</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-heart-line text-2xl text-indigo-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessibility First</h3>
              <p className="text-gray-600">
                Every feature is designed to be accessible to users with limited resources, poor connectivity, and varying literacy levels.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-global-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cultural Respect</h3>
              <p className="text-gray-600">
                We celebrate linguistic diversity and cultural richness, ensuring our platform honors and preserves local languages and customs.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-shield-check-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safe Spaces</h3>
              <p className="text-gray-600">
                We create and maintain safe, supportive environments where young people can learn, grow, and express themselves freely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our mission to break barriers</p>
          </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">{milestone.year}</span>
                </div>
                <div className="flex-1 bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl mb-8">
            Whether you're a student seeking mentorship or a professional wanting to give back, there's a place for you in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding" className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer">
              Get Started
            </Link>
            <Link href="/mentors" className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer">
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
