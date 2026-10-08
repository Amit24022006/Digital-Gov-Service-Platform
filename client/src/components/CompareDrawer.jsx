import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function CompareDrawer() {
  const { comparedServices, removeFromCompare, clearCompare } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (comparedServices.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-11/12 max-w-4xl bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom duration-300">
      
      <div className="flex items-center space-x-3 overflow-x-auto w-full sm:w-auto py-1">
        <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
          <Scale className="w-5 h-5" />
        </div>
        <div className="shrink-0">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Compare Schemes
          </p>
          <p className="text-xs text-slate-300">
            {comparedServices.length} of 3 schemes selected
          </p>
        </div>

        <div className="flex items-center space-x-2 pl-2">
          {comparedServices.map(s => (
            <span 
              key={s.id} 
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full text-xs font-medium shrink-0"
            >
              <span className="max-w-[120px] sm:max-w-[150px] truncate">{s.title}</span>
              <button 
                onClick={() => removeFromCompare(s.id)}
                className="hover:text-red-400"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        <button
          onClick={clearCompare}
          className="text-xs text-slate-400 hover:text-white px-2 py-1"
        >
          Clear
        </button>
        <button
          onClick={() => navigate('/compare')}
          disabled={comparedServices.length < 2}
          className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
            comparedServices.length >= 2 
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer' 
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          <span>Compare Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
