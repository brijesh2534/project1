import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { ref as dbRef, get, set } from 'firebase/database';
import { Upload, Check, AlertCircle } from 'lucide-react';

// REPLACE WITH YOUR CLOUDINARY DETAILS
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dtynls5ko/image/upload";
const UPLOAD_PRESET = "ml_default";
// SECRET KEY : TDNPmwCMgSADg4xWhuXaL81zmBs
// API KEY :857328492829477


export default function SettingsModule() {
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Fetch current settings from Realtime DB
    get(dbRef(db, 'settings/profile')).then((snapshot) => {
      if (snapshot.exists()) {
        setPhotoUrl(snapshot.val().photoUrl || '');
      }
      setLoading(false);
    });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      // Direct upload to Cloudinary (No Firebase Storage involved)
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setPhotoUrl(data.secure_url); // Get the hosted URL from Cloudinary

      setMessage({ type: 'success', text: 'Image uploaded to Cloudinary! Please click Save.' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Upload failed. Check your Cloud Name and Preset.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // We save ONLY the URL to Firebase Database
      await set(dbRef(db, 'settings/profile'), { photoUrl });
      setMessage({ type: 'success', text: 'Settings Saved!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Save failed' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg">
        <h2 className="text-xl font-bold mb-4">Profile Photo</h2>
        <div className="flex justify-center mb-6">
          {photoUrl ? (
            <img src={photoUrl} className="w-32 h-32 rounded-full object-cover border-4 border-blue-500" />
          ) : (
            <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center">No Photo</div>
          )}
        </div>

        <label className="block p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:bg-slate-50 mb-4">
          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          <Upload className="mx-auto text-slate-400 mb-2" />
          <span className="text-slate-600">{uploading ? 'Uploading to Cloudinary...' : 'Click to Upload'}</span>
        </label>

        {message && (
          <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.type === 'success' ? <Check size={20} className="inline mr-2" /> : <AlertCircle size={20} className="inline mr-2" />}
            {message.text}
          </div>
        )}

        <button onClick={handleSave} disabled={uploading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50">
          Save Changes
        </button>
      </div>
    </div>
  );
}