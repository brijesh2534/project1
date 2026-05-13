

export default function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-fade-in-up">
          <div className="mb-8 inline-block">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl rotate-6 animate-spin-slow opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-3xl -rotate-6 animate-spin-slow opacity-20"></div>
              <div className="relative w-full h-full rounded-3xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <span className="text-5xl sm:text-6xl font-bold text-gradient">BT</span>
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Full Stack <span className="text-gradient">Developer</span>
            <br />
            <span className="text-2xl sm:text-4xl lg:text-5xl text-slate-400 font-medium">Assistant Professor</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed px-4">
            Building <span className="text-white font-semibold">Scalable Web Applications</span> & Real-Time Systems while mentoring the next generation of developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4">
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              Hire Me
            </button>
            <div className="flex gap-4 w-full sm:w-auto">
              <a
                href="/resume.pdf"
                download="Brijesh_Tankariya_Resume.pdf"
                className="flex-1 sm:flex-none px-6 py-4 bg-white/5 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/10 backdrop-blur-sm"
              >
                Resume
              </a>
            </div>
          </div>
          
          <div className="animate-bounce">
            <button
              onClick={() => scrollToSection('projects')}
              className="text-slate-500 hover:text-cyan-400 transition-colors duration-300 flex flex-col items-center gap-2"
            >
              <span className="text-xs uppercase tracking-widest font-semibold">Scroll to explore</span>
              <div className="w-px h-12 bg-gradient-to-b from-cyan-500 to-transparent"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}