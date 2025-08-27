'use client';

interface ResumeData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  degree: string;
  field: string;
  university: string;
  graduationYear: string;
  skills: string[];
  achievements: string[];
  projects: Array<{ title: string; description: string }>;
  certifications: string[];
}

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-4xl mx-auto" style={{ minHeight: '600px' }}>
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {data.fullName || 'YOUR NAME'}
        </h1>
        <h2 className="text-lg text-gray-600">
          {data.title || 'Professional Title'}
        </h2>
      </div>

      <hr className="border-gray-300 mb-6" />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Education */}
          {data.degree && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">EDUCATION</h3>
              <div className="text-sm text-gray-700">
                <p>{data.degree}</p>
                {data.field && <p>in {data.field}</p>}
                {data.university && <p>{data.university}</p>}
                {data.graduationYear && <p>{data.graduationYear}</p>}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">SKILLS</h3>
              <p className="text-sm text-gray-700">
                {data.skills.join(' • ')}
              </p>
            </div>
          )}

          {/* Achievements */}
          {data.achievements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">ACHIEVEMENTS</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.achievements.map((achievement, index) => (
                  <li key={index}>• {achievement}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">CERTIFICATIONS</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {data.certifications.map((cert, index) => (
                  <li key={index}>• {cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contact Information */}
          {(data.email || data.phone || data.location) && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">CONTACT</h3>
              <div className="text-sm text-gray-700 space-y-1">
                {data.email && <p>{data.email}</p>}
                {data.phone && <p>{data.phone}</p>}
                {data.location && <p>{data.location}</p>}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">PROJECTS</h3>
              <div className="space-y-3">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {project.title}
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">
                      • {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Placeholder text when no data */}
      {!data.fullName && !data.title && !data.email && (
        <div className="text-center text-gray-500 mt-8">
          <p>Your resume will appear here as you answer questions</p>
        </div>
      )}
    </div>
  );
} 