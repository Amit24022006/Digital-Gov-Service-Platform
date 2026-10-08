import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  Clock, 
  Coins, 
  ExternalLink, 
  FileCheck2, 
  CheckCircle2, 
  Bookmark, 
  Share2, 
  Scale, 
  HelpCircle, 
  Compass, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Star,
  AlertCircle,
  Download
} from 'lucide-react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import EligibilityModal from '../components/EligibilityModal.jsx';
import DocumentChecklistModal from '../components/DocumentChecklistModal.jsx';
import FeedbackModal from '../components/FeedbackModal.jsx';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const { user, savedIds, toggleSave, addToCompare, comparedServices } = useAuth();
  const { lang, t } = useLanguage();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Modals state
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/services/${id}`);
      if (res.data.success) {
        setService(res.data.service);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Scheme not found</h2>
        <Link to="/services" className="text-blue-700 font-bold hover:underline">
          &larr; Back to Services Catalog
        </Link>
      </div>
    );
  }

  const isSaved = savedIds.includes(service.id);
  const isCompared = comparedServices.some(s => s.id === service.id);

  const tabs = [
    { id: 'overview', label: 'Overview & Benefits', icon: FileText },
    { id: 'eligibility', label: 'Eligibility Rules', icon: FileCheck2 },
    { id: 'documents', label: 'Required Documents', icon: CheckCircle2 },
    { id: 'steps', label: 'Step-by-Step Guidance', icon: Clock },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center space-x-2">
        <Link to="/" className="hover:text-blue-700">Home</Link>
        <span>/</span>
        <Link to="/services" className="hover:text-blue-700">Services</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium truncate max-w-xs">{service.title}</span>
      </nav>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2.5 flex-1">
            
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                service.scheme_type === 'Central' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {service.scheme_type} Scheme
              </span>

              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-700">
                Mode: {service.mode}
              </span>

              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-purple-100 text-purple-800">
                State: {service.state}
              </span>

              {service.rating && (
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-amber-100 text-amber-800 flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{service.rating} ({service.reviews_count} reviews)</span>
                </span>
              )}
            </div>

            {/* Department */}
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {service.department}
            </p>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              {lang === 'hi' && service.title_hi ? service.title_hi : service.title}
            </h1>

            {lang === 'en' && service.title_hi && (
              <p className="text-sm font-medium text-slate-500">
                {service.title_hi}
              </p>
            )}

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl pt-1">
              {lang === 'hi' && service.description_hi ? service.description_hi : service.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-56">
            <a
              href={service.official_url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 text-center"
            >
              <span>{t('applyOfficial')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => setShowEligibilityModal(true)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Check Eligibility</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSave(service.id)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                  isSaved 
                    ? 'bg-amber-50 text-amber-700 border-amber-300' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
              </button>

              <button
                onClick={() => addToCompare(service)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors ${
                  isCompared 
                    ? 'bg-blue-50 text-blue-700 border-blue-300' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
            </div>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="text-xs text-slate-500 hover:text-blue-700 font-medium py-1 text-center"
            >
              ★ Rate or Review this scheme
            </button>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Processing Time</span>
            <span className="text-slate-900 font-bold mt-0.5 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{service.processing_time || '15 to 30 Days'}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Application Fee</span>
            <span className="text-slate-900 font-bold mt-0.5 flex items-center space-x-1">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>{service.fee || 'Free of Cost'}</span>
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Official Portal</span>
            <span className="text-blue-700 font-bold mt-0.5 truncate block">
              {service.official_url.replace('https://', '')}
            </span>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Offline Support</span>
            <Link to="/offices" className="text-emerald-700 font-bold mt-0.5 flex items-center space-x-1 hover:underline">
              <Compass className="w-3.5 h-3.5" />
              <span>Find Nearest Kendra</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-1">
          {tabs.map(tab => {
            const IconComp = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                  active
                    ? 'bg-blue-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        {/* 1. Overview & Benefits */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Citizen Benefits & Financial Assistance</span>
              </h3>
              <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed font-medium">
                {lang === 'hi' && service.benefits_hi ? service.benefits_hi : service.benefits}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Full Scheme Description & Scope
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {service.description}
              </p>
            </div>

            {service.tags && (
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Related Keywords & Tags:
                </span>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Eligibility Rules */}
        {activeTab === 'eligibility' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Official Eligibility Guidelines</h3>
                <p className="text-xs text-slate-500">Demographic and financial limits defined by the nodal ministry</p>
              </div>
              <button
                onClick={() => setShowEligibilityModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Check My Profile Eligibility
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Age Window</span>
                <p className="text-sm font-semibold text-slate-900">
                  {service.eligibility_rules?.min_age || 18} to {service.eligibility_rules?.max_age || 100} Years
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Annual Income Cap</span>
                <p className="text-sm font-semibold text-slate-900">
                  {service.eligibility_rules?.max_annual_income 
                    ? `Up to ₹${service.eligibility_rules.max_annual_income.toLocaleString('en-IN')}` 
                    : 'No strict income cap specified'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Target Occupations</span>
                <p className="text-sm font-semibold text-slate-900 capitalize">
                  {service.eligibility_rules?.occupations 
                    ? service.eligibility_rules.occupations.join(', ').replace(/_/g, ' ') 
                    : 'All Indian citizens eligible'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Applicable State</span>
                <p className="text-sm font-semibold text-slate-900">
                  {service.state || 'All India'}
                </p>
              </div>
            </div>

            {service.eligibility_rules?.exclusions && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 uppercase flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Important Scheme Exclusions</span>
                </h4>
                <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                  {service.eligibility_rules.exclusions.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 3. Required Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Required Documents Checklist</h3>
                <p className="text-xs text-slate-500">
                  Have these scanned or photocopied before applying on the official portal.
                </p>
              </div>
              <button
                onClick={() => setShowDocModal(true)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm inline-flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Open Interactive Document Checklist</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {(service.documents || []).map((doc, idx) => (
                <div key={idx} className="p-4 flex items-start justify-between bg-white hover:bg-slate-50 text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{doc.name}</span>
                      {doc.mandatory ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
                          Optional
                        </span>
                      )}
                    </div>
                    {doc.sample && (
                      <p className="text-slate-500 text-[11px] mt-1">{doc.sample}</p>
                    )}
                  </div>

                  <button
                    onClick={() => alert(`Downloaded sample format for ${doc.name}`)}
                    className="text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Format</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Step-by-Step Guidance */}
        {activeTab === 'steps' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Step-by-Step Guidance Process</h3>
              <p className="text-xs text-slate-500">Official sequence to successfully complete registration and receive benefits</p>
            </div>

            <div className="space-y-4">
              {(service.guidance_steps || []).map((step, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="w-8 h-8 rounded-xl bg-blue-700 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {step.step_no || idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. FAQs */}
        {activeTab === 'faqs' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500">Common citizen inquiries answered by the nodal authority</p>
            </div>

            <div className="space-y-2">
              {(service.faqs || []).map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-1 text-xs text-slate-600 bg-slate-50/70 border-t border-slate-100 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      {showEligibilityModal && (
        <EligibilityModal
          service={service}
          isOpen={showEligibilityModal}
          onClose={() => setShowEligibilityModal(false)}
        />
      )}

      {showDocModal && (
        <DocumentChecklistModal
          service={service}
          isOpen={showDocModal}
          onClose={() => setShowDocModal(false)}
        />
      )}

      {showFeedbackModal && (
        <FeedbackModal
          service={service}
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}

    </div>
  );
}
