import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { ref, onValue, update, remove } from 'firebase/database';
import { Mail, Trash2, Eye, MailOpen } from 'lucide-react';

type Message = { id: string; name: string; email: string; subject: string; message: string; is_read: boolean; timestamp: number };

export default function MessagesModule() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let msgList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        
        // Sorting by timestamp desc
        msgList.sort((a, b) => b.timestamp - a.timestamp);

        if (filter === 'unread') {
            msgList = msgList.filter(m => !m.is_read);
        }
        setMessages(msgList);
      } else {
        setMessages([]);
      }
    });
    return () => unsubscribe();
  }, [filter]);

  const toggleRead = async (id: string, currentStatus: boolean) => {
    await update(ref(db, `messages/${id}`), { is_read: !currentStatus });
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this message?")) return;
    await remove(ref(db, `messages/${id}`));
  };

  return (
    <div>
        <div className="flex justify-between mb-6">
            <h1 className="text-3xl font-bold">Messages</h1>
            <div className="space-x-2">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-200'}`}>All</button>
                <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded ${filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-slate-200'}`}>Unread</button>
            </div>
        </div>
        
        <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                    <tr>
                        <th className="p-4">Status</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.length === 0 && <tr><td colSpan={4} className="p-4 text-center">No messages found.</td></tr>}
                    {messages.map(msg => (
                        <tr key={msg.id} className={`border-b ${!msg.is_read ? 'bg-blue-50' : ''}`}>
                            <td className="p-4 text-blue-500">{msg.is_read ? <MailOpen size={20}/> : <Mail size={20}/>}</td>
                            <td className="p-4 font-medium">{msg.name}</td>
                            <td className="p-4 text-slate-600">{msg.subject}</td>
                            <td className="p-4 flex gap-2">
                                <button onClick={() => toggleRead(msg.id, msg.is_read)} className="p-2 bg-slate-100 rounded hover:bg-slate-200">
                                    <Eye size={16}/>
                                </button>
                                <button onClick={() => handleDelete(msg.id)} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200">
                                    <Trash2 size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}