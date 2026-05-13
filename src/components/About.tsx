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
    <section id="about" className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-lg text-slate-400 leading-relaxed">
            <div className="glass-card p-8 rounded-3xl border-white/5">
              <p className="mb-6">
                I am a <span className="text-white font-semibold">Full Stack Developer</span> with strong expertise in MERN stack, Laravel, and Flutter. I have built multiple real-world applications including real-time chat systems, healthcare platforms, and industrial solutions.
              </p>
              <p className="mb-6">
                Alongside development, I currently work as an <span className="text-cyan-400 font-semibold">Assistant Professor</span> where I teach web development, programming, and databases. This unique perspective helps me write cleaner, more maintainable code.
              </p>
              
              <div className="mt-8 pt-8 border-t border-white/5">
                <h3 className="text-2xl font-bold text-white mb-6">Expertise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Full Stack Web (MERN, Laravel)",
                    "Real-Time Chat Systems",
                    "Scalable Backend Architectures",
                    "Teaching & Mentorship"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-300">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                        <span className="text-xs">✔</span>
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
             <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative p-3 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm">
                  <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-800">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Profile" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Users size={64} />
                      </div>
                    )}
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-2xl shadow-2xl border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Education</div>
                      <div className="text-sm font-bold text-white">MSc IT Student</div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}