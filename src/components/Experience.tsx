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
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-cyan-500 to-blue-500/50 md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 top-0 -translate-x-1/2 w-8 h-8 rounded-2xl bg-slate-900 border-2 border-cyan-500 flex items-center justify-center z-10 group-hover:scale-110 group-hover:bg-cyan-500 transition-all duration-300">
                  <Briefcase size={14} className="text-cyan-500 group-hover:text-white transition-colors" />
                </div>

                <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                  <div className="glass-card p-6 rounded-2xl relative overflow-hidden group-hover:-translate-y-1 transition-all duration-300">
                    {/* Decorative Background Icon */}
                    <div className="absolute -top-4 -right-4 text-white/5 group-hover:text-cyan-500/10 transition-colors duration-500">
                      <Briefcase size={80} />
                    </div>

                    <div className={`flex items-center gap-2 text-cyan-400 mb-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <Calendar size={14} />
                      <span className="text-xs font-bold tracking-wider uppercase">{exp.start_date} - {exp.end_date || 'Present'}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-1">{exp.job_title}</h3>
                    <p className="text-blue-400 font-semibold mb-4">{exp.company}</p>
                    
                    <ul className={`space-y-2 text-slate-400 text-sm leading-relaxed ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {exp.description.map((item, i) => (
                        <li key={i} className="relative">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}