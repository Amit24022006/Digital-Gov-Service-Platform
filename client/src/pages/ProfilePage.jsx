import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Bookmark, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  Edit3
} from 'lucide-react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import { INDIAN_STATES } from '../utils/constants.js';


export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [savedServices, setSavedServices] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [activeTab, setActiveTab] = useState('saved');
  const [editingProfile, setEditingProfile] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    state: user?.state || 'Delhi',
    preferences: user?.preferences || []
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSaved();
  }, [user]);

  const fetchSaved = async () => {
    setLoadingSaved(true);
    try {
      const res = await api.get('/services/saved/my');
      if (res.data.success) {
        setSavedServices(res.data.saved_services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const res = await updateProfile(editForm);
    if (res.success) {
      setEditingProfile(false);
      alert('Profile updated successfully!');
    }
  };

  const toggleCategoryPreference = (catId) => {
    setEditForm(prev => {
      const exists = prev.preferences.includes(catId);
      const next = exists 
        ? prev.preferences.filter(id => id !== catId)
        : [...prev.preferences, catId];
      return { ...prev, preferences: next };
    });
  };

  const mockCitizenDocs = [
    { name: 'Aadhaar Card (12-Digit Biometric)', status: 'Verified', date: 'Linked on 14 Jan 2026', type: 'UIDAI' },
    { name: 'Permanent Account Number (PAN)', status: 'Verified', date: 'Linked on 20 Feb 2026', type: 'ITD' },
    { name: 'Income Certificate (2025-26)', status: 'Valid (Expires in 8 months)', date: 'Issued by Tehsildar', type: 'State Revenue' },
    { name: 'Bank Passbook / NPCI DBT Mapping', status: 'Active for Direct Transfer', date: 'State Bank of India', type: 'PFMS' }
  ];

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-900 to-blue-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-blue-100 text-blue-800">
                  {user.role}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user.email}</span>
                </span>
                {user.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{user.phone}</span>
                  </span>
                )}
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{user.state || 'All India'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setEditingProfile(!editingProfile)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 inline-flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{editingProfile ? 'Cancel' : 'Edit Preferences'}</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-700 text-xs font-bold hover:bg-red-100"
            >
              {t('logout')}
            </button>
          </div>
        </div>

        {/* Inline Edit Form */}
        {editingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Update Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <select
                  value={editForm.state}
                  onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden bg-white"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('saved')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'saved'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
          }`}
        >
          {t('savedBookmarks')} ({savedServices.length})
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'docs'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
          }`}
        >
          Citizen Document Locker ({mockCitizenDocs.length})
        </button>
      </div>

      {/* Tab 1: Saved Schemes */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {loadingSaved ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(n => (
                <div key={n} className="h-48 bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : savedServices.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No saved schemes yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Bookmark schemes from the directory to quickly access required documents, deadlines, and direct application links.
              </p>
              <Link
                to="/services"
                className="inline-block px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-800"
              >
                Browse Government Schemes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedServices.map(srv => (
                <ServiceCard key={srv.id} service={srv} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Digital Document Locker */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Verified Citizen Documents</h3>
            <p className="text-xs text-slate-500">
              Validated digital credentials used to pre-qualify for schemes across Indian ministries.
            </p>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {mockCitizenDocs.map((doc, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between bg-white hover:bg-slate-50 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{doc.name}</h4>
                    <p className="text-slate-500 text-[11px]">{doc.type} · {doc.date}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
