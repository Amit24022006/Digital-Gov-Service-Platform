import React, { useState, useEffect } from 'react';
import { 
  MessageSquareWarning, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter,
  Send,
  X
} from 'lucide-react';
import api from '../../api/client.js';

export default function AdminGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Resolution modal state
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [newStatus, setNewStatus] = useState('Under Review');
  const [responseNotes, setResponseNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGrievances();
  }, [statusFilter]);

  const fetchGrievances = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await api.get('/admin/grievances', { params });
      if (res.data.success) {
        setGrievances(res.data.grievances);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAction = (grv) => {
    setSelectedGrievance(grv);
    setNewStatus(grv.status || 'Under Review');
    setResponseNotes(grv.admin_response || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setSubmitting(true);
    try {
      const res = await api.put(`/admin/grievances/${selectedGrievance.id}`, {
        status: newStatus,
        admin_response: responseNotes
      });
      if (res.data.success) {
        setGrievances(prev => prev.map(g => g.id === selectedGrievance.id ? res.data.grievance : g));
        setSelectedGrievance(null);
      }
    } catch (err) {
      alert('Update failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = grievances.filter(g => 
    g.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
    g.subject.toLowerCase().includes(search.toLowerCase()) ||
    g.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Citizen Grievance Desk</h1>
          <p className="text-xs text-slate-500">Track, escalate, and resolve citizen complaints with official Action Taken Reports.</p>
        </div>

        <div className="flex items-center space-x-2">
          {['all', 'Submitted', 'Under Review', 'Resolved'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === s
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grievances List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100 text-xs">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No grievances found in this status.
            </div>
          ) : (
            filtered.map(grv => (
              <div key={grv.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/70">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {grv.tracking_number}
                    </span>
                    <span className="font-semibold text-slate-500">{grv.category}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-500">{new Date(grv.created_at).toLocaleDateString()}</span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900">{grv.subject}</h3>
                  <p className="text-slate-600 leading-relaxed max-w-2xl">{grv.description}</p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span>Citizen: <strong>{grv.user_name}</strong></span>
                    <span>Email: {grv.user_email}</span>
                    {grv.phone && <span>Phone: {grv.phone}</span>}
                  </div>

                  {grv.admin_response && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                      <span className="font-semibold block text-slate-900 mb-0.5">Current Official Response:</span>
                      {grv.admin_response}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-3 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    grv.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : grv.status === 'Under Review'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    ● {grv.status}
                  </span>

                  <button
                    onClick={() => handleOpenAction(grv)}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Update & Respond
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resolution Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-mono">{selectedGrievance.tracking_number}</span>
                <h3 className="font-bold text-sm text-white">Departmental Response Desk</h3>
              </div>
              <button onClick={() => setSelectedGrievance(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Grievance Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold focus:outline-hidden"
                >
                  <option value="Submitted">Submitted (Pending Assignment)</option>
                  <option value="Under Review">Under Review (Assigned to Nodal Officer)</option>
                  <option value="Escalated">Escalated to District Collector / Joint Secretary</option>
                  <option value="Resolved">Resolved & Closed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Official Action Taken Report (ATR) *</label>
                <textarea
                  rows="4"
                  required
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Explain action taken, field report findings, or direct resolution details..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs"
                >
                  {submitting ? 'Saving...' : 'Save & Notify Citizen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
