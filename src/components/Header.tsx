import { useState, useEffect } from 'react';
import { Menu, X, Code2, Linkedin, Mail } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  // Handle scroll effects (Background + Active Section Spy)
  useEffect(() => {
    const handleScroll = () => {
      // 1. Handle Navbar Background
      setIsScrolled(window.scrollY > 20);

      // 2. Determine Active Section
      let current = '';
      
      // Loop through nav items to find which one is currently in view
      for (const item of navItems) {
        const sectionId = item.href.substring(1); // remove '#'
        const element = document.getElementById(sectionId);
        
        if (element) {
          // If we have scrolled past the top of this section (minus an offset for the header)
          const rect = element.getBoundingClientRect();
          // Logic: If the top of the section is somewhat near the top of the viewport
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = item.href;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80; // -80 for header height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false); // Close mobile menu if open
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-slate-900/80 backdrop-blur-md shadow-xl border-b border-white/5 py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <Code2 size={24} />
            </div>
            <span className="font-bold text-xl text-white tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
              Brijesh Tankariya
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg relative group ${
                    isActive ? 'text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-cyan-400 rounded-full animate-fade-in"></span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Social Icons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 mr-2">
              <a href="https://www.linkedin.com/in/brijesh-tankariya-603b57244/" className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
            </div>
            <a href="/resume.pdf" download="Brijesh_Tankariya_Resume.pdf" className="px-5 py-2 text-slate-300 border border-slate-700 text-sm font-medium rounded-xl hover:bg-slate-800 hover:border-slate-600 transition-all">
              Resume
            </a>
            <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5">
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
                isMobileMenuOpen ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300 origin-top ${
          isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive 
                    ? 'text-cyan-400 bg-white/5' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </a>
            );
          })}
          <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a href="https://www.linkedin.com/in/brijesh-tankariya-603b57244/" className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 rounded-xl transition-all" target="_blank" rel="noopener noreferrer">
                <Linkedin size={22} />
              </a>
              <a href="mailto:brijeshtankariya79969@gmail.com" className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white bg-white/5 rounded-xl transition-all">
                <Mail size={22} />
              </a>
            </div>
            <a href="/resume.pdf" download="Brijesh_Tankariya_Resume.pdf" className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-xl">
              Resume
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}