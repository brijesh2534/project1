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
  Code
} from 'lucide-react';
import ProjectsModule from './modules/ProjectsModule';
import MessagesModule from './modules/MessagesModule';
import ExperienceModule from './modules/ExperienceModule';
import DashboardHome from './modules/DashboardHome';
import SettingsModule from './modules/SettingsModule';
import SkillsModule from './modules/SkillsModule'; // Import the new module

type ActiveModule = 'home' | 'projects' | 'messages' | 'experience' | 'settings' | 'skills'; // Add 'skills' to the type

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('home');
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigation = [
    { id: 'home', name: 'Dashboard', icon: <Home size={20} /> },
    { id: 'projects', name: 'Projects', icon: <FolderKanban size={20} /> },
    { id: 'skills', name: 'Skills', icon: <Code size={20} /> }, // <-- ADD THIS LINE
    { id: 'messages', name: 'Messages', icon: <Mail size={20} /> },
    { id: 'experience', name: 'Experience', icon: <Briefcase size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
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

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveModule(item.id as ActiveModule)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeModule === item.id
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

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeModule === 'home' && <DashboardHome />}
          {activeModule === 'projects' && <ProjectsModule />}
          {activeModule === 'skills' && <SkillsModule />}  {/* <-- ADD THIS LINE */}
          {activeModule === 'messages' && <MessagesModule />}
          {activeModule === 'experience' && <ExperienceModule />}
          {activeModule === 'settings' && <SettingsModule />}
        </div>
      </main>
    </div>
  );
}
