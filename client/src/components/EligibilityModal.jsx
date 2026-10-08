import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import api from '../api/client.js';

export default function EligibilityModal({ service, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    age: '28',
    gender: 'Male',
    occupation: 'farmer',
    annual_income: '250000',
    owns_pucca_house: false
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/eligibility/check', {
        service_id: service.id,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        occupation: formData.occupation,
        annual_income: parseFloat(formData.annual_income),
        owns_pucca_house: formData.owns_pucca_house
      });
      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      alert('Error calculating eligibility: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-blue-900 text-white p-5 flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Interactive Eligibility Check
            </span>
            <h3 className="text-lg font-bold leading-tight mt-0.5">
              {service.title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-blue-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600">
                Answer these 4 demographic parameters to instantly verify whether you qualify under official scheme criteria.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Age (in years) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Occupation *
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                >
                  <option value="farmer">Farmer / Cultivator</option>
                  <option value="agricultural_worker">Agricultural Laborer</option>
                  <option value="student">Student (School / College)</option>
                  <option value="business_owner">Small Business Owner / MSME</option>
                  <option value="shopkeeper">Trader / Shopkeeper / Vendor</option>
                  <option value="artisan">Artisan / Weaver / Craftsman</option>
                  <option value="daily_wager">Daily Wager / Construction Worker</option>
                  <option value="unemployed">Unemployed Youth</option>
                  <option value="salaried">Private / Govt Salaried</option>
                  <option value="retired">Retired / Senior Citizen</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Annual Household Income (₹) *
                </label>
                <input
                  type="number"
                  step="10000"
                  required
                  value={formData.annual_income}
                  onChange={(e) => setFormData({ ...formData, annual_income: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  placeholder="e.g. 200000"
                />
              </div>

              {service.id === 'srv_pmay' && (
                <div className="flex items-center space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    id="pucca"
                    checked={formData.owns_pucca_house}
                    onChange={(e) => setFormData({ ...formData, owns_pucca_house: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <label htmlFor="pucca" className="text-xs text-amber-900 font-medium cursor-pointer">
                    My family already owns a pucca house in India
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Evaluating Criteria...' : 'Check My Eligibility Now'}</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Result Banner */}
              <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                result.is_eligible 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
                {result.is_eligible ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-bold">
                    {result.is_eligible ? 'Congratulations! You are Eligible' : 'You May Not Be Eligible for this Scheme'}
                  </h4>
                  <p className="text-xs mt-1 text-slate-700">
                    {result.is_eligible 
                      ? 'You satisfy the basic age, occupation, and income guidelines for this central scheme.' 
                      : 'One or more of your parameters do not align with the scheme target demographics.'}
                  </p>
                </div>
              </div>

              {/* Itemized Criteria Checklist */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Detailed Verification Checklist:
                </p>
                {result.checks.map((c, i) => (
                  <div key={i} className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{c.param}: </span>
                      <span className="text-slate-600">{c.message}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ml-2 ${
                      c.status === 'passed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Suggested Alternatives if ineligible */}
              {!result.is_eligible && result.alternatives?.length > 0 && (
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                  <p className="text-xs font-bold text-blue-900 flex items-center space-x-1">
                    <span>Suggested Alternative Schemes:</span>
                  </p>
                  {result.alternatives.map(alt => (
                    <div key={alt.id} className="text-xs bg-white p-2 rounded border border-blue-100 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{alt.title}</span>
                      <a 
                        href={`/services/${alt.id}`} 
                        className="text-blue-700 font-bold hover:underline shrink-0 ml-2"
                      >
                        Check &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Next Steps Buttons */}
              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Re-check with Different Values
                </button>
                {result.is_eligible && (
                  <a
                    href={service.official_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg text-center shadow-sm"
                  >
                    Apply on Official Portal &rarr;
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
