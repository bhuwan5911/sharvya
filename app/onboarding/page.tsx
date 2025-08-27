
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TranslationTools from '../components/TranslationTools';

export default function Onboarding() {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    languages: [] as string[],
    // Student specific
    age: '',
    education: '',
    interests: [] as string[],
    goals: '',
    // Mentor specific
    expertise: '',
    experience: '',
    bio: '',
    availability: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTranslationTools, setShowTranslationTools] = useState(false);

  const router = useRouter(); // Initialize useRouter

  const availableLanguages = ['Hindi', 'English', 'Gujarati', 'Marathi', 'Tamil', 'Bengali', 'Telugu', 'Punjabi'];
  const studentInterests = ['Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cybersecurity', 'UI/UX Design', 'DevOps', 'Game Development'];
  const mentorExpertise = ['Web Development', 'Mobile Development', 'Data Science', 'AI/ML', 'Cybersecurity', 'UI/UX Design', 'DevOps', 'Product Management'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get current user from session
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!
      );
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Structure the data properly for the API
      const userData = {
        email: user.email,
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        languages: formData.languages,
        age: formData.age,
        education: formData.education,
        interests: formData.interests,
        goals: formData.goals,
        expertise: formData.expertise,
        experience: formData.experience,
        bio: formData.bio,
        availability: formData.availability
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }
    
    setIsSubmitting(false);
      router.push('/features');
    } catch (err) {
      console.error('Form submission error:', err);
      alert('There was an error submitting the form. Please try again.');
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  if (isSubmitted) {
    return null; // Remove the confirmation UI
  }

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
              <button
                onClick={() => setShowTranslationTools(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
              >
                <i className="ri-translate-2-line mr-2"></i>
                Translation Tools
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!userType ? (
          // User Type Selection
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Sharvya</h1>
            <p className="text-xl text-gray-600 mb-12">Choose how you'd like to get started</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div 
                onClick={() => setUserType('student')}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border-4 border-transparent hover:border-indigo-200"
              >
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-graduation-cap-line text-3xl text-indigo-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Student</h3>
                <p className="text-gray-600 mb-6">
                  Looking to learn new skills and connect with experienced mentors who can guide me in my journey.
                </p>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-800 font-medium">Perfect for:</p>
                  <ul className="text-sm text-indigo-700 mt-2 space-y-1">
                    <li>• Rural youth seeking career guidance</li>
                    <li>• Students wanting to learn coding</li>
                    <li>• Anyone looking for mentorship</li>
                  </ul>
                </div>
              </div>

              <div 
                onClick={() => setUserType('mentor')}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border-4 border-transparent hover:border-green-200"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-user-star-line text-3xl text-green-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">I'm a Mentor</h3>
                <p className="text-gray-600 mb-6">
                  Experienced professional ready to share knowledge and help students achieve their career goals.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">Perfect for:</p>
                  <ul className="text-sm text-green-700 mt-2 space-y-1">
                    <li>• Industry professionals</li>
                    <li>• Experienced developers</li>
                    <li>• Anyone wanting to give back</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Registration Form
          <form id="onboarding-form" onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {userType === 'student' ? 'Student Registration' : 'Mentor Registration'}
                </h2>
                <button 
                  type="button"
                  onClick={() => setUserType('')}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i className="ri-arrow-left-line text-xl"></i>
                </button>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center space-x-4 mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      currentStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, State"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages You Speak *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableLanguages.map((language) => (
                      <label key={language} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={(e) => handleArrayChange('languages', language, e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Specific Information */}
            {currentStep === 2 && userType === 'student' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Student Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      min="14"
                      max="30"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education Level *</label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-8"
                      required
                    >
                      <option value="">Select Education</option>
                      <option value="high-school">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="diploma">Diploma</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {studentInterests.map((interest) => (
                      <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={(e) => handleArrayChange('interests', interest, e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Mentor Information */}
            {currentStep === 2 && userType === 'mentor' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Expertise *</label>
                    <select
                      name="expertise"
                      value={formData.expertise}
                      onChange={(e) => handleInputChange('expertise', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-8"
                      required
                    >
                      <option value="">Select Expertise</option>
                      {mentorExpertise.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-8"
                      required
                    >
                      <option value="">Select Experience</option>
                      <option value="1-2">1-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio *</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about your background, experience, and what you're passionate about..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    required
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
                </div>
              </div>
            )}

            {/* Step 3: Final Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Final Details</h3>
                
                {userType === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals *</label>
                    <textarea
                      name="goals"
                      value={formData.goals}
                      onChange={(e) => handleInputChange('goals', e.target.value)}
                      placeholder="What do you hope to achieve through mentorship? What specific skills do you want to learn?"
                      rows={4}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      required
                    ></textarea>
                    <p className="text-sm text-gray-500 mt-1">{formData.goals.length}/500 characters</p>
                  </div>
                )}

                {userType === 'mentor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability *</label>
                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-8"
                      required
                    >
                      <option value="">Select Availability</option>
                      <option value="weekdays">Weekdays only</option>
                      <option value="weekends">Weekends only</option>
                      <option value="flexible">Flexible schedule</option>
                      <option value="limited">Limited availability</option>
                    </select>
                  </div>
                )}

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {userType === 'student' ? (
                      <>
                        <li>• We'll review your profile and match you with suitable mentors</li>
                        <li>• You'll receive mentor recommendations within 24 hours</li>
                        <li>• Start your first voice session when you're ready</li>
                      </>
                    ) : (
                      <>
                        <li>• Our team will review your mentor application</li>
                        <li>• You'll be notified of approval status within 48 hours</li>
                        <li>• Once approved, students can connect with you</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Previous
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Submitting...
                      </>
                    ) : (
                      'Complete Registration'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Translation Tools Modal */}
      <TranslationTools 
        isOpen={showTranslationTools} 
        onClose={() => setShowTranslationTools(false)} 
      />
    </div>
  );
}

