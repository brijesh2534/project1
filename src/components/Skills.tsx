import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Code, Database, Shield, Zap } from 'lucide-react';

type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  display_order: number;
};

const categoryIcons: Record<string, JSX.Element> = {
  'Programming & Development': <Code size={24} />,
  'Frameworks': <Zap size={24} />,
  'Database Management': <Database size={24} />,
  'Best Practices': <Shield size={24} />,
  'Additional Expertise': <Code size={24} />
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const skillsRef = ref(db, 'skills');
    const unsubscribe = onValue(skillsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const skillList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Sort by display order
        skillList.sort((a, b) => a.display_order - b.display_order);
        setSkills(skillList);
      } else {
        setSkills([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse text-slate-400">Loading skills...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </div>

        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
            <div
              key={category}
              className="animate-fade-in-up"
              style={{ animationDelay: `${catIndex * 0.1}s` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  {categoryIcons[category] || <Code size={24} />}
                </div>
                <h3 className="text-2xl font-bold text-white">{category}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categorySkills.map((skill, skillIndex) => (
                  <div
                    key={skill.id}
                    className="p-6 bg-slate-700 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 border border-slate-600"
                    style={{ animationDelay: `${(catIndex * 0.1) + (skillIndex * 0.05)}s` }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-semibold text-white">{skill.name}</span>
                      <span className="text-sm font-bold text-cyan-400">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${skill.proficiency}%`,
                          animation: `skill-bar 1.5s ease-out ${(catIndex * 0.1) + (skillIndex * 0.05)}s backwards`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}