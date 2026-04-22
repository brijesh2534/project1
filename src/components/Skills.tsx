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
    <section id="skills" className="py-20 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Skills & Expertise
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
            <div
              key={category}
              className="bg-slate-700 p-6 rounded-xl border border-slate-600 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${catIndex * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                  {categoryIcons[category] || <Zap size={24} />}
                </div>
                <h3 className="text-2xl font-bold text-white">{category}</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {categorySkills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-slate-800 text-cyan-400 rounded-full text-sm font-medium border border-slate-600"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}