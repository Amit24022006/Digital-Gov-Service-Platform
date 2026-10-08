import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Search, 
  Layers, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import api from '../../api/client.js';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    title_hi: '',
    category_id: 'cat_farmer',
    department: '',
    scheme_type: 'Central',
    mode: 'Online',
    state: 'All India',
    benefits: '',
    processing_time: '15 to 30 Days',
    fee: 'Free of cost',
    official_url: 'https://',
    min_age: 18,
    max_age: 70,
    max_annual_income: 600000,
    occupations: 'farmer, worker',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes] = await Promise.all([
        api.get('/services'),
        api.get('/categories')
      ]);
      if (sRes.data.success) setServices(sRes.data.services);
      if (cRes.data.success) setCategories(cRes.data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      title_hi: '',
      category_id: categories[0]?.id || 'cat_farmer',
      department: 'Ministry of Citizen Services',
      scheme_type: 'Central',
      mode: 'Online',
      state: 'All India',
      benefits: '',
      processing_time: '15 to 30 Days',
      fee: 'Free of cost',
      official_url: 'https://',
      min_age: 18,
      max_age: 70,
      max_annual_income: 600000,
      occupations: 'citizen, worker',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingId(srv.id);
    setForm({
      title: srv.title || '',
      title_hi: srv.title_hi || '',
      category_id: srv.category_id || 'cat_farmer',
      department: srv.department || '',
      scheme_type: srv.scheme_type || 'Central',
      mode: srv.mode || 'Online',
      state: srv.state || 'All India',
      benefits: srv.benefits || '',
      processing_time: srv.processing_time || '',
      fee: srv.fee || '',
      official_url: srv.official_url || '',
      min_age: srv.eligibility_rules?.min_age || 18,
      max_age: srv.eligibility_rules?.max_age || 70,
      max_annual_income: srv.eligibility_rules?.max_annual_income || 600000,
      occupations: srv.eligibility_rules?.occupations?.join(', ') || '',
      description: srv.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the public catalog?`)) return;
    try {
      const res = await api.delete(`/admin/services/${id}`);
      if (res.data.success) {
        setServices(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        title_hi: form.title_hi,
        category_id: form.category_id,
        department: form.department,
        scheme_type: form.scheme_type,
        mode: form.mode,
        state: form.state,
        benefits: form.benefits,
        processing_time: form.processing_time,
        fee: form.fee,
        official_url: form.official_url,
        description: form.description,
        eligibility_rules: {
          min_age: parseInt(form.min_age, 10),
          max_age: parseInt(form.max_age, 10),
          max_annual_income: parseFloat(form.max_annual_income),
          occupations: form.occupations.split(',').map(s => s.trim()).filter(Boolean)
        }
      };

      if (editingId) {
        const res = await api.put(`/admin/services/${editingId}`, payload);
        if (res.data.success) {
          setServices(prev => prev.map(s => s.id === editingId ? res.data.service : s));
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/admin/services', payload);
        if (res.data.success) {
          setServices(prev => [res.data.service, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      alert('Save failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = services.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Schemes Catalog</h1>
          <p className="text-xs text-slate-500">Create, edit, or decommission official government schemes.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Government Scheme</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter schemes by title or ministry..."
          className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
        />
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Scheme Title</th>
              <th className="p-4">Department</th>
              <th className="p-4">Level & Mode</th>
              <th className="p-4">Income Cap</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(srv => (
              <tr key={srv.id} className="hover:bg-slate-50/70">
                <td className="p-4 font-bold text-slate-900 max-w-xs">
                  <div>{srv.title}</div>
                  {srv.title_hi && <div className="text-[11px] text-slate-400 font-normal">{srv.title_hi}</div>}
                </td>
                <td className="p-4 text-slate-600 max-w-[200px] truncate">
                  {srv.department}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold mr-1.5 ${
                    srv.scheme_type === 'Central' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {srv.scheme_type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                    {srv.mode}
                  </span>
                </td>
                <td className="p-4 text-slate-700 font-mono">
                  {srv.eligibility_rules?.max_annual_income 
                    ? `₹${srv.eligibility_rules.max_annual_income.toLocaleString('en-IN')}` 
                    : 'None'}
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: Add or Edit Scheme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingId ? 'Edit Government Scheme' : 'Publish New Scheme'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Scheme Title (English) *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Scheme Title (Hindi)</label>
                <input
                  type="text"
                  value={form.title_hi}
                  onChange={(e) => setForm({ ...form, title_hi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category *</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Department / Ministry *</label>
                  <input
                    type="text"
                    required
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Level</label>
                  <select
                    value={form.scheme_type}
                    onChange={(e) => setForm({ ...form, scheme_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                  >
                    <option value="Central">Central</option>
                    <option value="State">State</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Mode</label>
                  <select
                    value={form.mode}
                    onChange={(e) => setForm({ ...form, mode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white focus:outline-hidden"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Processing Time</label>
                  <input
                    type="text"
                    value={form.processing_time}
                    onChange={(e) => setForm({ ...form, processing_time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Citizen Benefits Summary *</label>
                <textarea
                  rows="2"
                  required
                  value={form.benefits}
                  onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Min Age</label>
                  <input
                    type="number"
                    value={form.min_age}
                    onChange={(e) => setForm({ ...form, min_age: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Max Age</label>
                  <input
                    type="number"
                    value={form.max_age}
                    onChange={(e) => setForm({ ...form, max_age: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Income Cap (₹)</label>
                  <input
                    type="number"
                    value={form.max_annual_income}
                    onChange={(e) => setForm({ ...form, max_annual_income: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Target Occupations (comma separated)</label>
                <input
                  type="text"
                  value={form.occupations}
                  onChange={(e) => setForm({ ...form, occupations: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                  placeholder="farmer, student, artisan"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Official Portal URL</label>
                <input
                  type="url"
                  required
                  value={form.official_url}
                  onChange={(e) => setForm({ ...form, official_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Scheme Overview</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
