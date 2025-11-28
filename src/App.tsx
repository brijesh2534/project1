import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';


function AppContent() {
  const [route, setRoute] = useState<'portfolio' | 'admin'>('portfolio');
  const { user, loading } = useAuth();

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      setRoute('admin');
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setRoute(path.startsWith('/admin') ? 'admin' : 'portfolio');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (route === 'admin') {
    if (!user) {
      return <Login />;
    }
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
