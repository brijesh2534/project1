import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, get } from 'firebase/database';
import { MapPin, GraduationCap, Code, Users } from 'lucide-react';

export default function About() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Updated to use Realtime Database reference
        const settingsRef = ref(db, 'settings/profile');
        const snapshot = await get(settingsRef);
        if (snapshot.exists()) {
          setPhotoUrl(snapshot.val().photoUrl);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const highlights = [
    { icon: <Code size={24} />, title: 'Tech Stack', description: 'Laravel, CodeIgniter, MERN Stack, PHP' },
    { icon: <MapPin size={24} />, title: 'Location', description: 'Rajkot, India' },
    { icon: <GraduationCap size={24} />, title: 'Education', description: 'MSc IT Student' },
    { icon: <Users size={24} />, title: 'Collaboration', description: 'Team Player & Problem Solver' }
  ];

  return (
    <section id="about" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Me</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 lg:order-1 text-lg text-slate-300 leading-relaxed">
            <p>
              I am a passionate <span className="font-semibold text-cyan-400">Full Stack Developer</span> with deep expertise in 
              <span className="text-white"> PHP, Laravel, CodeIgniter</span>, and the <span className="text-white">MERN Stack</span>.
            </p>
            <p>
              Currently pursuing my MSc in IT, I combine academic knowledge with practical experience to build robust web solutions. 
              Whether it's crafting a complex backend API in Laravel or building a dynamic frontend with React, I love solving code challenges.
            </p>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
             <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative bg-slate-800 rounded-2xl p-2 overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Profile" className="w-full h-auto rounded-xl object-cover aspect-square" />
                  ) : (
                    <div className="w-full aspect-square bg-slate-700 rounded-xl flex items-center justify-center text-slate-500">No Photo</div>
                  )}
                </div>
             </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {highlights.map((item, i) => (
                <div key={i} className="p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-all">
                    <div className="text-cyan-400 mb-3">{item.icon}</div>
                    <h3 className="text-white font-bold">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}