import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Code, Database, Smartphone, Wrench, Globe, Layout, Shield, Zap } from 'lucide-react';

type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency?: number;
  display_order: number;
};

const categoryIcons: Record<string, JSX.Element> = {
  'Frontend': <Globe size={24} />,
  'Backend': <Code size={24} />,
  'Database': <Database size={24} />,
  'Mobile': <Smartphone size={24} />,
  'Tools': <Wrench size={24} />,
  'Frameworks & Stacks': <Layout size={24} />,
  'Mobile Development': <Smartphone size={24} />,
  'Databases': <Database size={24} />,
  'Core Skills': <Shield size={24} />,
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
    <section id="skills" className="py-24 bg-slate-800/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Skills & <span className="text-gradient">Expertise</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
            <div
              key={category}
              className="glass-card p-8 rounded-[2rem] animate-fade-in-up"
              style={{ animationDelay: `${catIndex * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                  {categoryIcons[category] || <Zap size={28} />}
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{category}</h3>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill, index) => (
                  <div 
                    key={index}
                    className="px-4 py-2 bg-slate-900/50 text-slate-300 rounded-xl text-sm font-semibold border border-white/5 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-300 cursor-default"
                  >
                    {skill.name}
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