import { useState } from 'react';
import { db } from '../lib/firebase';
import { ref, push } from 'firebase/database';
import { Mail, Phone, CheckCircle } from 'lucide-react'; // Removed unused imports

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const messagesRef = ref(db, 'messages');
      await push(messagesRef, {
        ...formData,
        is_read: false,
        timestamp: Date.now()
      });
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <section id="contact" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="p-4 bg-slate-800 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 flex items-center justify-center rounded-lg"><Mail /></div>
              <div><p className="text-slate-400">Email</p><p className="text-white font-semibold">brijeshtankariya79969@gmail.com</p></div>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 text-blue-400 flex items-center justify-center rounded-lg"><Phone /></div>
              <div><p className="text-slate-400">Phone</p><p className="text-white font-semibold">+91 98988 25922</p></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-4 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 outline-none" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required type="email" className="w-full p-4 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 outline-none" />
            <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="w-full p-4 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 outline-none" />
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" required rows={4} className="w-full p-4 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-500 outline-none" />

            {success && <div className="text-green-400 flex items-center gap-2"><CheckCircle /> Message Sent!</div>}

            <button disabled={loading} className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:opacity-90 transition">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}