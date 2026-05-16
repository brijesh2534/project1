import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';
import { ExternalLink, Eye, X, Github } from 'lucide-react';

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedProject]);

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
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech_stack && project.tech_stack.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 text-slate-300 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack && project.tech_stack.length > 3 && (
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider self-center">+{project.tech_stack.length - 3} more</span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/5 text-sm font-bold"
                    >
                      <Eye size={16} />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedProject(null)}>
          <div 
            className="bg-slate-900 border border-white/10 w-full max-w-3xl rounded-[2.5rem] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-20 p-2 bg-slate-800/50 hover:bg-slate-800 text-white rounded-full transition-colors backdrop-blur-md border border-white/10"
            >
              <X size={20} />
            </button>
            
            <div className="overflow-y-auto">
              {selectedProject.image_url ? (
                <div className="aspect-[16/9] w-full">
                  <img src={selectedProject.image_url} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-white/10 text-9xl font-bold italic">
                  {selectedProject.title.charAt(0)}
                </div>
              )}
              
              <div className="p-8 sm:p-12">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">{selectedProject.title}</h3>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="text-cyan-400 font-bold mb-4 uppercase tracking-widest text-xs">About the Project</h4>
                    <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                      {selectedProject.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-cyan-400 font-bold mb-4 uppercase tracking-widest text-xs">Tech Stack</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.tech_stack.map((tech, i) => (
                        <span key={i} className="px-4 py-2 bg-white/5 text-slate-300 rounded-xl text-xs font-bold border border-white/5 uppercase tracking-wider">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {selectedProject.live_url && (
                      <a 
                        href={selectedProject.live_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20"
                      >
                        <ExternalLink size={18} />
                        Live Preview
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a 
                        href={selectedProject.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Github size={18} />
                        View Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}