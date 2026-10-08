import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Clock, 
  Bookmark, 
  CheckCircle2, 
  Scale, 
  ArrowRight, 
  ExternalLink,
  Coins,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function ServiceCard({ service, onCheckEligibility }) {
  const { savedIds, toggleSave, comparedServices, addToCompare, removeFromCompare } = useAuth();
  const { lang, t } = useLanguage();

  const isSaved = savedIds.includes(service.id);
  const isCompared = comparedServices.some(s => s.id === service.id);

  const handleCompareClick = (e) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(service.id);
    } else {
      addToCompare(service);
    }
  };

  const handleSaveClick = (e) => {
    e.stopPropagation();
    toggleSave(service.id);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-300 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Meta Bar */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
              service.scheme_type === 'Central' 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              {service.scheme_type || 'Central'} Scheme
            </span>

            <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-slate-100 text-slate-700 border border-slate-200">
              {service.mode || 'Online'}
            </span>

            {service.is_popular && (
              <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200">
                ★ Popular
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {/* Compare Toggle */}
            <button
              onClick={handleCompareClick}
              className={`p-1.5 rounded-lg text-xs transition-colors flex items-center space-x-1 ${
                isCompared 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={isCompared ? 'Remove from compare' : 'Add to compare'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Bookmark Toggle */}
            <button
              onClick={handleSaveClick}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                isSaved 
                  ? 'bg-amber-50 text-amber-600 font-bold' 
                  : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
              }`}
              title={isSaved ? 'Remove from bookmarks' : 'Bookmark scheme'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Department Name */}
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider line-clamp-1 mb-1">
          {service.department}
        </p>

        {/* Scheme Title */}
        <Link to={`/services/${service.id}`}>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
            {lang === 'hi' && service.title_hi ? service.title_hi : service.title}
          </h3>
        </Link>

        {/* Bilingual Subtitle if in English */}
        {lang === 'en' && service.title_hi && (
          <p className="text-xs text-slate-500 mt-0.5 font-medium line-clamp-1">
            {service.title_hi}
          </p>
        )}

        {/* Benefits Teaser */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="font-semibold text-slate-800">Benefit: </span>
          {lang === 'hi' && service.benefits_hi ? service.benefits_hi : service.benefits}
        </p>

        {/* Quick Parameters */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{service.processing_time || '15-30 Days'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Coins className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{service.fee || 'Free'}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onCheckEligibility ? onCheckEligibility(service) : null}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center space-x-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Eligibility</span>
        </button>

        <Link
          to={`/services/${service.id}`}
          className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
        >
          <span>{t('viewDetails')}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
}
