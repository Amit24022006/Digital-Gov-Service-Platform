import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Building2,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import api from '../api/client.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import { INDIAN_STATES } from '../utils/constants.js';


export default function EligibilityCheckerPage() {
  const { lang, t } = useLanguage();

  const [formData, setFormData] = useState({
    age: '26',
    gender: 'Female',
    occupation: 'student',
    annual_income: '180000',
    social_category: 'OBC',
    state: 'Delhi'
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('eligible');

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/eligibility/check', {
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        occupation: formData.occupation,
        annual_income: parseFloat(formData.annual_income),
        category: formData.social_category,
        state: formData.state
      });

      if (res.data.success) {
        setResults(res.data);
      }
    } catch (err) {
      alert('Failed to evaluate eligibility: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-8 shadow-lg border border-blue-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Rule Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t('eligibilityTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {t('eligibilitySubtitle')}
          </p>
        </div>
      </div>

      {/* Main Questionnaire Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Your Demographic Profile</h2>
          <p className="text-xs text-slate-500">Provide accurate information to evaluate government scheme qualifications.</p>
        </div>

        <form onSubmit={handleEvaluate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            
            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Citizen Age (in Years) *
              </label>
              <input
                type="number"
                min="1"
                max="110"
                required
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Occupation *
              </label>
              <select
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
              >
                <option value="student">Student (School / College)</option>
                <option value="farmer">Farmer / Cultivator</option>
                <option value="agricultural_worker">Agricultural Laborer</option>
                <option value="business_owner">MSME Owner / Entrepreneur</option>
                <option value="shopkeeper">Trader / Vendor</option>
                <option value="artisan">Artisan / Weaver</option>
                <option value="daily_wager">Daily Wager / Construction</option>
                <option value="unemployed">Unemployed Youth</option>
                <option value="salaried">Private / Govt Employee</option>
                <option value="retired">Senior Citizen / Pensioner</option>
              </select>
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Annual Household Income (₹) *
              </label>
              <input
                type="number"
                step="10000"
                required
                value={formData.annual_income}
                onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
                placeholder="e.g. 200000"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            {/* Social Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Social Category *
              </label>
              <select
                value={formData.social_category}
                onChange={(e) => setFormData({ ...formData, social_category: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
              >
                <option value="General">General</option>
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                State of Residence *
              </label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Evaluating Rules Across Catalog...' : 'Evaluate My Eligibility'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-300">
          
          {/* Summary Banner */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Evaluation Result</span>
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-800">
                  {results.evaluated_count} Schemes Analyzed
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                You are qualified for <span className="text-emerald-600">{results.eligible_count} government schemes</span>!
              </h3>
            </div>

            {/* Toggle Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setActiveTab('eligible')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'eligible' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Eligible ({results.eligible.length})
              </button>
              <button
                onClick={() => setActiveTab('ineligible')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'ineligible' 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Ineligible ({results.non_eligible.length})
              </button>
            </div>
          </div>

          {/* Qualified Schemes Grid */}
          {activeTab === 'eligible' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.eligible.map(scheme => (
                <div 
                  key={scheme.id}
                  className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                        {scheme.scheme_type || 'Central'} Scheme
                      </span>
                      <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Eligible</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900">{scheme.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{scheme.benefits}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{scheme.mode} Application</span>
                    <Link
                      to={`/services/${scheme.id}`}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
                    >
                      <span>View & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ineligible Schemes with Clear Reasons */}
          {activeTab === 'ineligible' && (
            <div className="space-y-3">
              {results.non_eligible.map(scheme => (
                <div 
                  key={scheme.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <h4 className="font-bold text-sm text-slate-900">{scheme.title}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-[11px] text-red-700 bg-red-50 p-2 rounded-lg border border-red-100">
                      <span className="font-semibold">Unmet conditions:</span>
                      <span>{scheme.reasons.join(' · ')}</span>
                    </div>
                  </div>

                  <Link
                    to={`/services/${scheme.id}`}
                    className="text-xs font-semibold text-slate-500 hover:text-blue-700 shrink-0"
                  >
                    View Criteria &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
