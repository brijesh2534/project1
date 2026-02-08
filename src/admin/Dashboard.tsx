import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Mail,
  Briefcase,
  LogOut,
  Home,
  Settings,
  Code,
  Menu, // Imported Menu icon
  X     // Imported X icon
} from 'lucide-react';
import ProjectsModule from './modules/ProjectsModule';
import MessagesModule from './modules/MessagesModule';
import ExperienceModule from './modules/ExperienceModule';
import DashboardHome from './modules/DashboardHome';
import SettingsModule from './modules/SettingsModule';
import SkillsModule from './modules/SkillsModule';

type ActiveModule = 'home' | 'projects' | 'messages' | 'experience' | 'settings' | 'skills';

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navigation = [
    { id: 'home', name: 'Dashboard', icon: <Home size={20} /> },
    { id: 'projects', name: 'Projects', icon: <FolderKanban size={20} /> },
    { id: 'skills', name: 'Skills', icon: <Code size={20} /> },
    { id: 'messages', name: 'Messages', icon: <Mail size={20} /> },
    { id: 'experience', name: 'Experience', icon: <Briefcase size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <LayoutDashboard className="text-white" size={16} />
          </div>
          <span className="font-bold text-slate-900">Admin Panel</span>
        </div>
        <button onClick={toggleMobileMenu} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay (Backdrop) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden glass"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-slate-200 hidden md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Admin Panel</h1>
              <p className="text-xs text-slate-500">Portfolio Manager</p>
            </div>
          </div>
        </div>

        {/* Mobile Header inside Sidebar (Optional: to close menu from inside) */}
        <div className="md:hidden p-4 border-b border-slate-200 flex items-center justify-between">
             <span className="font-bold text-slate-900">Menu</span>
             <button onClick={closeMobileMenu} className="p-1 text-slate-500">
               <X size={20} />
             </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveModule(item.id as ActiveModule);
                    closeMobileMenu(); // Close menu on selection (mobile)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeModule === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="mb-3 px-4 py-2 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Signed in as</p>
            <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto w-full">
        <div className="p-4 md:p-8">
          {activeModule === 'home' && <DashboardHome />}
          {activeModule === 'projects' && <ProjectsModule />}
          {activeModule === 'skills' && <SkillsModule />}
          {activeModule === 'messages' && <MessagesModule />}
          {activeModule === 'experience' && <ExperienceModule />}
          {activeModule === 'settings' && <SettingsModule />}
        </div>
      </main>
    </div>
  );
}