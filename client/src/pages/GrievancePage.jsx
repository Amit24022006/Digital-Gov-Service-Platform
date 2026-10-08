import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  FileText, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function GrievancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [activeTab, setActiveTab] = useState(() => searchParams.get('track') ? 'track' : 'lodge');
  const [trackingInput, setTrackingInput] = useState(() => searchParams.get('track') || '');
  const [trackedGrievance, setTrackedGrievance] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [myGrievances, setMyGrievances] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    category: 'Farmer & Agriculture',
    service_name: 'PM-KISAN',
    subject: '',
    description: '',
    user_name: user?.name || '',
    user_email: user?.email || '',
    phone: user?.phone || ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successToken, setSuccessToken] = useState(null);

  useEffect(() => {
    if (searchParams.get('track')) {
      handleTrack(searchParams.get('track'));
    }
    if (user) {
      fetchMyGrievances();
    }
  }, [user]);

  const fetchMyGrievances = async () => {
    try {
      const res = await api.get('/grievances/my');
      if (res.data.success) {
        setMyGrievances(res.data.grievances);
      }
    } catch (err) {
      // Ignore
    }
  };

  const handleLodge = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/grievances', formData);
      if (res.data.success) {
        setSuccessToken(res.data.tracking_number);
        setFormData({
          category: 'Farmer & Agriculture',
          service_name: 'PM-KISAN',
          subject: '',
          description: '',
          user_name: user?.name || '',
          user_email: user?.email || '',
          phone: user?.phone || ''
        });
        if (user) fetchMyGrievances();
      }
    } catch (err) {
      alert('Failed to submit grievance: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (tokenToTrack) => {
    const token = tokenToTrack || trackingInput;
    if (!token.trim()) return;

    setTrackingLoading(true);
    setTrackedGrievance(null);
    try {
      const res = await api.get(`/grievances/track/${encodeURIComponent(token.trim())}`);
      if (res.data.success) {
        setTrackedGrievance(res.data.grievance);
      }
    } catch (err) {
      alert('No grievance found for token: ' + token);
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded bg-red-100 text-red-800">
            Citizen Grievance Redressal
          </span>
          <span className="text-xs text-slate-500">
            Centralized Public Grievance Helpdesk
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          {t('grievance')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lodge complaints regarding delayed scheme benefits, eKYC issues, or office services, and track status until resolution.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex space-x-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('lodge')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'lodge'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
          }`}
        >
          {t('lodgeGrievance')}
        </button>

        <button
          onClick={() => setActiveTab('track')}
          className={`py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${
            activeTab === 'track'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
          }`}
        >
          {t('trackGrievance')}
        </button>

        {user && (
          <button
            onClick={() => setActiveTab('my')}
            className={`py-2.5 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTab === 'my'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
            }`}
          >
            My Submitted Tickets ({myGrievances.length})
          </button>
        )}
      </div>

      {/* Tab 1: Lodge Grievance Form */}
      {activeTab === 'lodge' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {successToken ? (
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-950">
                Grievance Registered Successfully!
              </h3>
              <p className="text-xs text-emerald-800">
                Your grievance has been logged and assigned to the departmental officer. Note your tracking token:
              </p>
              <div className="inline-block px-4 py-2 bg-white rounded-xl border border-emerald-300 font-mono font-bold text-sm text-emerald-900 shadow-xs">
                {successToken}
              </div>
              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setTrackingInput(successToken);
                    setActiveTab('track');
                    handleTrack(successToken);
                  }}
                  className="px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-xl hover:bg-blue-800"
                >
                  Track Status Now &rarr;
                </button>
                <button
                  onClick={() => setSuccessToken(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
                >
                  Lodge Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLodge} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Service Domain *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                  >
                    <option value="Farmer & Agriculture">Farmer & Agriculture</option>
                    <option value="Education & Student">Education & Student</option>
                    <option value="Health & Family">Health & Family</option>
                    <option value="Employment & Business">Employment & Business</option>
                    <option value="Housing & Urban">Housing & Urban</option>
                    <option value="Identity & Certificates">Identity & Certificates</option>
                    <option value="Transport & Vehicles">Transport & Vehicles</option>
                    <option value="Social Welfare">Social Welfare</option>
                    <option value="Legal & Citizen Services">Legal & Citizen Services</option>
                    <option value="Others & Utilities">Others & Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Specific Scheme Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.service_name}
                    onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                    placeholder="e.g. PM-KISAN, Ayushman Bharat, Sarathi DL"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject / Summary of Issue *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. 16th Installment eKYC failed at center / Application pending over 45 days"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detailed Grievance Description *
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide registration number, dates of visit, office location, and full context..."
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Citizen Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.user_name}
                    onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.user_email}
                    onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting to Nodal Officer...' : 'Lodge Grievance Official Ticket'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* Tab 2: Track Status */}
      {activeTab === 'track' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-md">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Enter Grievance Tracking Number:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="e.g. GOV-GRV-2026-8819"
                className="flex-1 px-3.5 py-2.5 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden uppercase"
              />
              <button
                onClick={() => handleTrack()}
                disabled={trackingLoading}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                {trackingLoading ? 'Searching...' : 'Track Ticket'}
              </button>
            </div>
          </div>

          {/* Grievance Status Timeline Card */}
          {trackedGrievance && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 font-mono">Token: {trackedGrievance.tracking_number}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{trackedGrievance.subject}</h3>
                  <p className="text-xs text-slate-500">{trackedGrievance.category} · {trackedGrievance.service_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                  trackedGrievance.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : trackedGrievance.status === 'Under Review'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  ● {trackedGrievance.status}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Official Redressal Timeline:
                </h4>

                <div className="space-y-4 pl-2 border-l-2 border-blue-600">
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />
                    <p className="text-xs font-bold text-slate-900">1. Grievance Lodged</p>
                    <p className="text-[11px] text-slate-500">Citizen submitted complaint with initial details.</p>
                  </div>

                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />
                    <p className="text-xs font-bold text-slate-900">2. Forwarded to Department Nodal Officer</p>
                    <p className="text-[11px] text-slate-500">Under official investigation and record verification.</p>
                  </div>

                  <div className="relative pl-6">
                    <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-white ${
                      trackedGrievance.status === 'Resolved' ? 'bg-emerald-600' : 'bg-slate-300'
                    }`} />
                    <p className="text-xs font-bold text-slate-900">3. Action Taken / Resolution</p>
                    <div className="mt-1 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                      <span className="font-semibold block text-slate-900 mb-0.5">Official Response:</span>
                      {trackedGrievance.admin_response || 'In progress by nodal officer.'}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Grievances */}
      {activeTab === 'my' && user && (
        <div className="space-y-4">
          {myGrievances.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              You haven't lodged any grievances yet.
            </div>
          ) : (
            myGrievances.map(grv => (
              <div 
                key={grv.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-700">{grv.tracking_number}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      grv.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {grv.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{grv.subject}</h4>
                  <p className="text-xs text-slate-500">{grv.category} · Logged on {new Date(grv.created_at).toLocaleDateString()}</p>
                </div>

                <button
                  onClick={() => {
                    setTrackingInput(grv.tracking_number);
                    setActiveTab('track');
                    handleTrack(grv.tracking_number);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl self-start sm:self-auto"
                >
                  View Details &rarr;
                </button>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
