import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  X, 
  Plus, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Coins, 
  Building2,
  FileCheck2,
  Trash2
} from 'lucide-react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ComparePage() {
  const { comparedServices, removeFromCompare, clearCompare, addToCompare } = useAuth();
  const { lang, t } = useLanguage();

  const [allServices, setAllServices] = useState([]);
  const [selectedToAdd, setSelectedToAdd] = useState('');

  useEffect(() => {
    fetchAllServices();
  }, []);

  const fetchAllServices = async () => {
    try {
      const res = await api.get('/services');
      if (res.data.success) {
        setAllServices(res.data.services);
        // If user navigated here with empty compared list, pre-populate with 2 top schemes for demonstration!
        if (comparedServices.length < 2 && res.data.services.length >= 2) {
          addToCompare(res.data.services[0]); // PM-KISAN
          addToCompare(res.data.services[1]); // PMFBY
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddScheme = (e) => {
    const id = e.target.value;
    if (!id) return;
    const srv = allServices.find(s => s.id === id);
    if (srv) {
      addToCompare(srv);
      setSelectedToAdd('');
    }
  };

  const rows = [
    { label: 'Department / Ministry', render: (s) => <span className="font-semibold text-slate-800">{s.department}</span> },
    { label: 'Scheme Level', render: (s) => (
      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
        s.scheme_type === 'Central' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
      }`}>
        {s.scheme_type || 'Central'} Scheme
      </span>
    )},
    { label: 'Application Mode', render: (s) => <span className="font-medium text-slate-700">{s.mode || 'Online'}</span> },
    { label: 'Core Citizen Benefit', render: (s) => <p className="text-xs text-slate-700 leading-relaxed font-medium bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100">{s.benefits}</p> },
    { label: 'Processing Timeline', render: (s) => (
      <span className="flex items-center space-x-1 font-bold text-slate-900">
        <Clock className="w-3.5 h-3.5 text-blue-600" />
        <span>{s.processing_time || '15-30 Days'}</span>
      </span>
    )},
    { label: 'Citizen Fee', render: (s) => (
      <span className="flex items-center space-x-1 font-bold text-slate-900">
        <Coins className="w-3.5 h-3.5 text-amber-600" />
        <span>{s.fee || 'Free'}</span>
      </span>
    )},
    { label: 'Eligible Age Range', render: (s) => (
      <span className="font-medium text-slate-800">
        {s.eligibility_rules?.min_age || 18} - {s.eligibility_rules?.max_age || 100} Years
      </span>
    )},
    { label: 'Annual Income Limit', render: (s) => (
      <span className="font-medium text-slate-800">
        {s.eligibility_rules?.max_annual_income 
          ? `Up to ₹${s.eligibility_rules.max_annual_income.toLocaleString('en-IN')}` 
          : 'No cap specified'}
      </span>
    )},
    { label: 'Target Beneficiaries', render: (s) => (
      <span className="capitalize font-medium text-slate-800">
        {s.eligibility_rules?.occupations?.join(', ').replace(/_/g, ' ') || 'All citizens'}
      </span>
    )},
    { label: 'Key Required Docs', render: (s) => (
      <ul className="text-xs space-y-1 text-slate-600">
        {(s.documents || []).slice(0, 3).map((d, i) => (
          <li key={i} className="flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{d.name}</span>
          </li>
        ))}
      </ul>
    )},
    { label: 'Official Portal', render: (s) => (
      <a
        href={s.official_url}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
      >
        <span>Direct Portal</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    )}
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded bg-amber-100 text-amber-800">
              Side-by-Side Comparison
            </span>
            <span className="text-xs text-slate-500">
              Compare benefits, eligibility criteria & fees
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {t('compareSchemes')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Evaluate up to 3 schemes at a glance to make informed citizen decisions.
          </p>
        </div>

        {/* Add more scheme selector */}
        {comparedServices.length < 3 && (
          <div className="flex items-center space-x-2">
            <select
              value={selectedToAdd}
              onChange={handleAddScheme}
              className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white shadow-xs"
            >
              <option value="">+ Add scheme to compare...</option>
              {allServices
                .filter(s => !comparedServices.some(cs => cs.id === s.id))
                .map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {comparedServices.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <Scale className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No schemes selected for comparison</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse the services catalog and click the scale icon on any scheme card to compare them side-by-side.
          </p>
          <Link
            to="/services"
            className="inline-block px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 shadow-md"
          >
            Explore Schemes Directory
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 sm:p-6 w-1/4 text-xs font-black uppercase tracking-wider text-slate-500">
                  Feature / Attribute
                </th>
                {comparedServices.map(service => (
                  <th key={service.id} className="p-4 sm:p-6 w-1/3 align-top border-l border-slate-200">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                          {service.category?.name || 'Central Scheme'}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1">
                          {service.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeFromCompare(service.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-lg"
                        title="Remove from compare"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3">
                      <Link
                        to={`/services/${service.id}`}
                        className="text-xs font-bold text-blue-700 hover:underline inline-block"
                      >
                        View Full Details &rarr;
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {rows.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-4 sm:p-5 font-bold text-slate-700 align-top">
                    {row.label}
                  </td>
                  {comparedServices.map(service => (
                    <td key={service.id} className="p-4 sm:p-5 align-top border-l border-slate-200">
                      {row.render(service)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
