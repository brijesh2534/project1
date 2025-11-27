import { GraduationCap, Award } from 'lucide-react';

export default function Education() {
  const education = [
    {
      degree: 'Master of Science in Information Technology (MSc IT)',
      institution: 'Geetanjali Group of Colleges',
      location: 'Rajkot, India',
      status: 'Currently Pursuing',
      icon: <GraduationCap size={24} />
    },
    {
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'Geetanjali Group of Colleges',
      location: 'Rajkot, India',
      status: 'Graduated: March 2024',
      icon: <Award size={24} />
    }
  ];

  return (
    <section id="education" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Education
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((edu, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-2 p-8 border border-slate-700"
              style={{
                animation: `fade-in-up 0.6s ease-out ${index * 0.2}s backwards`
              }}
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 text-white">
                {edu.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                {edu.degree}
              </h3>

              <p className="text-lg text-cyan-400 font-semibold mb-2">
                {edu.institution}
              </p>

              <p className="text-slate-300 mb-3">
                {edu.location}
              </p>

              <div className="inline-block px-4 py-2 bg-slate-700 text-cyan-400 rounded-lg font-medium border border-slate-600">
                {edu.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
