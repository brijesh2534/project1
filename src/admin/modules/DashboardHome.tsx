import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { ref, get } from 'firebase/database';
import { FolderKanban, Mail, Briefcase, TrendingUp } from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, unreadMessages: 0, experiences: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projSnap, msgSnap, expSnap] = await Promise.all([
            get(ref(db, 'projects')),
            get(ref(db, 'messages')),
            get(ref(db, 'experiences'))
        ]);

        const msgs = msgSnap.val() || {};
        const unreadCount = Object.values(msgs).filter((m: any) => !m.is_read).length;

        setStats({
            projects: projSnap.exists() ? Object.keys(projSnap.val()).length : 0,
            messages: msgSnap.exists() ? Object.keys(msgs).length : 0,
            unreadMessages: unreadCount,
            experiences: expSnap.exists() ? Object.keys(expSnap.val()).length : 0,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Projects', value: stats.projects, icon: <FolderKanban size={24} />, color: 'from-blue-500 to-cyan-500' },
    { title: 'Total Messages', value: stats.messages, icon: <Mail size={24} />, color: 'from-purple-500 to-pink-500' },
    { title: 'Unread Messages', value: stats.unreadMessages, icon: <TrendingUp size={24} />, color: 'from-orange-500 to-red-500' },
    { title: 'Experiences', value: stats.experiences, icon: <Briefcase size={24} />, color: 'from-green-500 to-teal-500' },
  ];

  if (loading) return <div className="animate-pulse">Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4`}>
                {card.icon}
            </div>
            <p className="text-slate-600 text-sm font-medium">{card.title}</p>
            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}