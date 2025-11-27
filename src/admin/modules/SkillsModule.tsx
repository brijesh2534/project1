import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { Plus, Edit, Trash2, X, Code, Database, Zap, Shield } from 'lucide-react';

type Skill = {
    id: string;
    name: string;
    category: string;
    proficiency: number;
    display_order: number;
};

// Categories matching your frontend icons
const CATEGORIES = [
    'Programming & Development',
    'Frameworks',
    'Database Management',
    'Best Practices',
    'Additional Expertise'
];

export default function SkillsModule() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Initial form state with safe defaults
    const initialForm = {
        name: '',
        category: CATEGORIES[0],
        proficiency: 50,
        display_order: 0,
    };
    const [formData, setFormData] = useState(initialForm);

    // 1. Fetch Skills from Realtime DB
    useEffect(() => {
        const skillsRef = ref(db, 'skills');
        const unsubscribe = onValue(skillsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                // Sort by category then by display order
                list.sort((a, b) => {
                    if (a.category === b.category) return a.display_order - b.display_order;
                    return a.category.localeCompare(b.category);
                });
                setSkills(list);
            } else {
                setSkills([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Handle Submit (Add or Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                await update(ref(db, `skills/${editingId}`), formData);
            } else {
                await push(ref(db, 'skills'), formData);
            }
            setShowModal(false);
            resetForm();
        } catch (error) {
            alert('Error saving skill');
        }
    };

    // 3. Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm('Delete this skill?')) return;
        await remove(ref(db, `skills/${id}`));
    };

    // 4. Handle Edit Click
    const handleEdit = (skill: Skill) => {
        setEditingId(skill.id);
        setFormData({
            name: skill.name || '',
            category: skill.category || CATEGORIES[0],
            proficiency: skill.proficiency || 0,
            display_order: skill.display_order || 0,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData(initialForm);
        setEditingId(null);
    };

    if (loading) return <div className="animate-pulse">Loading skills...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Skills</h1>
                    <p className="text-slate-600">Manage your technical expertise</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} /> Add Skill
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map((skill) => (
                    <div key={skill.id} className="bg-white rounded-xl shadow-md p-6 border border-slate-100 hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    {skill.category.includes('Database') ? <Database size={20} /> :
                                        skill.category.includes('Framework') ? <Zap size={20} /> :
                                            skill.category.includes('Best') ? <Shield size={20} /> :
                                                <Code size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{skill.name}</h3>
                                    <p className="text-xs text-slate-500">{skill.category}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(skill)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Proficiency Bar Preview */}
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${skill.proficiency}%` }}
                            ></div>
                        </div>
                        <p className="text-right text-xs font-bold text-slate-600">{skill.proficiency}%</p>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">{editingId ? 'Edit Skill' : 'Add New Skill'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Skill Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. React.js"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Proficiency ({formData.proficiency}%)
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.proficiency}
                                    onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                                    className="w-full accent-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-4"
                            >
                                {editingId ? 'Save Changes' : 'Add Skill'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}