import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { ExternalLink, Eye } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  demo_url: string | null;
  is_featured: boolean;
  display_order: number;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert Firebase Object to Array
        const projectList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        // Sort by display_order
        projectList.sort((a, b) => a.display_order - b.display_order);
        setProjects(projectList);
      } else {
        setProjects([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse text-slate-400">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
            A selection of my recent works across web and mobile development.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No projects to display at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group glass-card rounded-[2.5rem] overflow-hidden"
                style={{
                  animation: `fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s backwards`
                }}
              >
                <div className="relative aspect-[16/10] overflow-hidden m-3 rounded-[1.8rem]">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-white/10 text-8xl font-bold italic">
                      {project.title.charAt(0)}
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white text-slate-900 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>

                  {project.is_featured && (
                    <div className="absolute top-4 left-4 bg-cyan-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-cyan-500/20">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-8 pt-4">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 mb-6 line-clamp-2 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech_stack && project.tech_stack.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack && project.tech_stack.length > 4 && (
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider self-center">+{project.tech_stack.length - 4} more</span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={project.live_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/5 text-sm font-bold"
                    >
                      <Eye size={16} />
                      Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}