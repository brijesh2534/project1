

export default function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-fade-in-up">
          <div className="mb-8 inline-block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 p-1 animate-spin-slow">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">BT</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Full Stack Developer | Assistant Professor
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-blue-300 mb-4 font-semibold">
            Building Scalable Web Applications & Real-Time Systems
          </p>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            I develop high-performance applications using MERN, Laravel, and Flutter, while mentoring future developers and solving real-world problems through clean and efficient code.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a
              href="/resume.pdf"
              download="Brijesh_Tankariya_Resume.pdf"
              className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 border border-slate-600"
            >
              Resume
            </a>
            <a
              href="https://github.com/brijesh2534"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 border border-slate-600"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/brijesh-tankariya-603b57244/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 border border-slate-600"
            >
              LinkedIn
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
            >
              Hire Me
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center mt-8">
            <button
              onClick={() => scrollToSection('projects')}
              className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4 decoration-2 decoration-cyan-400/30 hover:decoration-cyan-400 transition-all duration-300"
            >
              Scroll down to view my projects ↓
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}