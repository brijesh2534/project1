import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

// REPLACE WITH YOUR CLOUDINARY DETAILS
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtynls5ko/image/upload";
const UPLOAD_PRESET = "ml_default";

type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string;
  live_url: string;
  github_url: string;
  display_order: number;
  is_featured: boolean;
};

export default function ProjectsModule() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const initialForm = {
    title: '', description: '', tech_stack: '', image_url: '',
    live_url: '', github_url: '', display_order: 0, is_featured: false
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    const projectsRef = ref(db, 'projects');
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        projectList.sort((a, b) => a.display_order - b.display_order);
        setProjects(projectList);
      } else {
        setProjects([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: data });
      const json = await res.json();
      setFormData({ ...formData, image_url: json.secure_url });
    } catch (error) {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tech_stack: typeof formData.tech_stack === 'string' ? formData.tech_stack.split(',').map(t => t.trim()) : formData.tech_stack,
    };

    try {
      if (editingId) {
        await update(ref(db, `projects/${editingId}`), payload);
      } else {
        await push(ref(db, 'projects'), payload);
      }
      setShowModal(false);
      setFormData(initialForm);
      setEditingId(null);
    } catch (error) {
      alert('Error saving project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await remove(ref(db, `projects/${id}`));
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({ ...project, tech_stack: project.tech_stack.join(', ') as any });
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
        <button onClick={() => { setFormData(initialForm); setEditingId(null); setShowModal(true); }} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow p-4">
            <div className="h-40 bg-slate-200 rounded-lg mb-4 overflow-hidden relative group">
              {project.image_url ?
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" /> :
                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
              }
            </div>
            <h3 className="font-bold text-lg">{project.title}</h3>
            <div className="flex gap-2 mt-4">
              <button onClick={() => handleEdit(project)} className="p-2 bg-blue-50 text-blue-600 rounded"><Edit size={16} /></button>
              <button onClick={() => handleDelete(project.id)} className="p-2 bg-red-50 text-red-600 rounded"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border p-2 rounded" required />
              <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border p-2 rounded" required />
              <input type="text" placeholder="Tech Stack (comma separated)" value={formData.tech_stack} onChange={e => setFormData({ ...formData, tech_stack: e.target.value })} className="w-full border p-2 rounded" />

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-1">Project Image</label>
                <div className="flex gap-2">
                  <input type="url" placeholder="Image URL (or upload)" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="flex-1 border p-2 rounded" />
                  <label className="bg-slate-200 p-2 rounded cursor-pointer hover:bg-slate-300">
                    <Upload size={20} />
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                  </label>
                </div>
                {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="url" placeholder="Live URL" value={formData.live_url} onChange={e => setFormData({ ...formData, live_url: e.target.value })} className="w-full border p-2 rounded" />
                <input type="url" placeholder="GitHub URL" value={formData.github_url} onChange={e => setFormData({ ...formData, github_url: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <input type="number" placeholder="Order" value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-full border p-2 rounded" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} /> Featured
              </label>
              <button type="submit" disabled={uploading} className="w-full bg-blue-600 text-white py-2 rounded font-bold disabled:opacity-50">Save Project</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}