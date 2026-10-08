import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  ShieldCheck, 
  Scale, 
  Layers, 
  TrendingUp, 
  Users, 
  Building2,
  FileCheck2,
  Bell,
  Wheat,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Home,
  CreditCard,
  Car,
  FileText,
  UserCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import api from '../api/client.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import EligibilityModal from '../components/EligibilityModal.jsx';

const categoryIconMap = {
  Wheat: Wheat,
  GraduationCap: GraduationCap,
  HeartPulse: HeartPulse,
  Briefcase: Briefcase,
  Home: Home,
  CreditCard: CreditCard,
  Car: Car,
  Users: Users,
  Scale: Scale,
  Layers: Layers
};

export default function HomePage() {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceForEligibility, setSelectedServiceForEligibility] = useState(null);
  const [stats, setStats] = useState({ services: 23, categories: 10, offices: 22, citizens: '2.4M+' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, srvRes] = await Promise.all([
        api.get('/categories'),
        api.get('/services?popular=true')
      ]);
      if (catRes.data.success) setCategories(catRes.data.categories);
      if (srvRes.data.success) setPopularServices(srvRes.data.services.slice(0, 6));
    } catch (err) {
      console.error('Failed to load home data:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeywordClick = (keyword) => {
    setSearchQuery(keyword);
    navigate(`/services?search=${encodeURIComponent(keyword)}`);
  };

  const realCommonKeywords = [
    { label: 'Driving License', query: 'driving license' },
    { label: 'Driving Licence (DL)', query: 'driving licence' },
    { label: 'Ration Card', query: 'ration card' },
    { label: 'PM-KISAN', query: 'pm kisan' },
    { label: 'Ayushman Card', query: 'ayushman' },
    { label: 'Aadhaar Card', query: 'aadhaar' },
    { label: 'PAN Card', query: 'pan card' },
    { label: 'Scholarship', query: 'scholarship' },
    { label: 'Mudra Loan', query: 'mudra' },
    { label: 'Passport Seva', query: 'passport' },
    { label: 'Old Age Pension', query: 'pension' },
    { label: 'Caste Certificate', query: 'caste certificate' }
  ];

  const workflowSteps = [
    { num: 1, title: 'Register / Login', desc: 'Sign up with OTP and set your state & preferences', icon: UserCheck, link: '/login' },
    { num: 2, title: 'Explore Categories', desc: 'Browse 10 verified domains with smart filters', icon: Layers, link: '/services' },
    { num: 3, title: 'View Details', desc: 'Read official benefits, fees, and processing times', icon: FileText, link: '/services' },
    { num: 4, title: 'Check Eligibility', desc: 'Dynamic calculator checks age, income, occupation', icon: FileCheck2, link: '/eligibility' },
    { num: 5, title: 'Guidance & Docs', desc: 'Interactive step checklist & downloadable forms', icon: CheckCircle2, link: '/services' },
    { num: 6, title: 'Office Locator', desc: 'Find nearest Seva Kendra or RTO on real GPS map', icon: Compass, link: '/offices' },
    { num: 7, title: 'Get Alerts', desc: 'Real-time notifications on deadlines and updates', icon: Bell, link: '/services' },
    { num: 8, title: 'Manage Profile', desc: 'Bookmark favorite schemes and track grievances', icon: Users, link: '/profile' }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-950 via-blue-900 to-slate-900 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-800/80 border border-blue-700/80 text-amber-300 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified National Digital Governance Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            {lang === 'hi' 
              ? 'सभी सरकारी सेवाएं · एक मंच पर'
              : 'All Government Services · One Platform'}
          </h1>

          <p className="text-base sm:text-xl text-blue-200 font-medium max-w-2xl mx-auto leading-relaxed">
            "{t('mission')}"
          </p>

          {/* Real Keyword Search Bar */}
          <div className="max-w-2xl mx-auto pt-4">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white p-1.5 border-2 border-amber-400">
              <Search className="w-6 h-6 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search real keywords: driving licence, ration card, kisan, ayushman, pan, scholarship..."
                className="w-full px-3 py-3 text-slate-900 text-sm placeholder-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shrink-0 flex items-center space-x-1.5 cursor-pointer"
              >
                <span>{t('searchBtn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Real Search Keyword Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-blue-200">
              <span className="font-semibold text-slate-300">Common Keywords:</span>
              {realCommonKeywords.map(item => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => handleKeywordClick(item.query)}
                  className="px-3 py-1 rounded-full bg-blue-900/90 hover:bg-blue-800 border border-blue-700/80 text-blue-100 hover:text-amber-300 transition-colors font-medium cursor-pointer shadow-2xs"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-blue-800/80">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{stats.categories}</p>
              <p className="text-xs text-blue-200 mt-0.5">Service Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{stats.services}+</p>
              <p className="text-xs text-blue-200 mt-0.5">Active Schemes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">{stats.offices}+</p>
              <p className="text-xs text-blue-200 mt-0.5">Offices Mapped</p>
            </div>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">100% Free</p>
              <p className="text-xs text-blue-200 mt-0.5">Official Guidance</p>
            </div>
          </div>

        </div>
      </section>

      {/* 1. Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Browse by Domain
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {t('exploreByCategory')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('categoriesSubtitle')}
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 mt-3 sm:mt-0"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(cat => {
            const Icon = categoryIconMap[cat.icon] || Layers;
            return (
              <Link
                key={cat.id}
                to={`/services?category=${cat.id}`}
                className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-700 text-blue-700 group-hover:text-white flex items-center justify-center transition-colors shadow-xs mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {lang === 'hi' && cat.name_hi ? cat.name_hi : cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {lang === 'hi' && cat.description_hi ? cat.description_hi : cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">
                    {cat.services_count || 2} Schemes
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 2. Popular & Trending Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>High Citizen Engagement</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {t('popularServices')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('popularSubtitle')}
            </p>
          </div>
          <Link
            to="/services?popular=true"
            className="inline-flex items-center space-x-1 text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 mt-3 sm:mt-0"
          >
            <span>Browse All Popular</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularServices.map(srv => (
            <ServiceCard 
              key={srv.id} 
              service={srv}
              onCheckEligibility={(s) => setSelectedServiceForEligibility(s)}
            />
          ))}
        </div>
      </section>

      {/* 3. Citizen Workflow Roadmap (Placed after Popular & Trending Services) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <span>Workflow Roadmap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              End-to-End Citizen Journey
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              GovDesk takes you from discovery to official application in 8 guided steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map(step => {
              const IconComp = step.icon;
              return (
                <Link
                  key={step.num}
                  to={step.link}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-full bg-blue-900 text-amber-300 text-xs font-black flex items-center justify-center shadow-xs">
                        {step.num}
                      </span>
                      <IconComp className="w-5 h-5 text-slate-400 group-hover:text-blue-700 transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-900">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 mt-3 group-hover:translate-x-1 transition-transform">
                    <span>Explore step</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Interactive Quick Eligibility Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-8 sm:p-12 shadow-xl border border-blue-700 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold uppercase tracking-wider">
              Smart Eligibility Engine
            </span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
              Not sure which schemes you are eligible for?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              Don't spend hours searching through dozens of portals. Answer 4 quick questions (age, income, occupation, and state) and our rule engine will evaluate your eligibility across all central and state schemes in MongoDB!
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/eligibility"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md inline-flex items-center space-x-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Launch Universal Eligibility Wizard</span>
              </Link>
              <Link
                to="/offices"
                className="px-6 py-3 bg-blue-950 hover:bg-blue-900 text-white border border-blue-700 font-semibold text-sm rounded-xl transition-colors inline-flex items-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>Find Physical Seva Kendra</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Eligibility Modal */}
      {selectedServiceForEligibility && (
        <EligibilityModal
          service={selectedServiceForEligibility}
          isOpen={!!selectedServiceForEligibility}
          onClose={() => setSelectedServiceForEligibility(null)}
        />
      )}

    </div>
  );
}
