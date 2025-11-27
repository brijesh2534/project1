import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Briefcase, Calendar } from 'lucide-react';

type ExperienceType = { id: string; job_title: string; company: string; start_date: string; end_date: string; description: string[] };

export default function Experience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);



  useEffect(() => {
    const expRef = ref(db, 'experiences');
    onValue(expRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(k => ({ id: k, ...data[k] }));
        // Combine dynamic data with static resume data
        setExperiences([...list]);
      } else {
        setExperiences([]);
      }
    });
  }, []);

  return (
    <section id="experience" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Work Experience</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-cyan-500"></div>

          {experiences.map((exp, index) => (
            <div key={exp.id} className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'}`}>
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full bg-blue-500 border-4 border-slate-800 flex items-center justify-center z-10">
                <Briefcase size={14} className="text-white" />
              </div>

              <div className={`ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                <div className="bg-slate-700 p-6 rounded-xl shadow-lg border border-slate-600">
                  <div className={`flex items-center gap-2 text-cyan-400 mb-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                    <Calendar size={16} />
                    <span className="text-sm font-semibold">{exp.start_date} - {exp.end_date || 'Present'}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{exp.job_title}</h3>
                  <p className="text-lg text-blue-300 font-medium mb-4">{exp.company}</p>
                  <ul className={`space-y-2 text-slate-300 ${index % 2 === 0 ? 'md:text-right' : 'text-left'}`}>
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}