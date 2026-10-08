import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  RotateCcw, 
  Layers, 
  SlidersHorizontal,
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';
import api from '../api/client.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import EligibilityModal from '../components/EligibilityModal.jsx';
import { INDIAN_STATES } from '../utils/constants.js';


export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, t } = useLanguage();
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceForEligibility, setSelectedServiceForEligibility] = useState(null);

  // Filters state from URL query
  const currentCategory = searchParams.get('category') || 'all';
  const currentState = searchParams.get('state') || 'all';
  const currentType = searchParams.get('scheme_type') || 'all';
  const currentMode = searchParams.get('mode') || 'all';
  const currentSearch = searchParams.get('search') || '';
  const currentPopular = searchParams.get('popular') === 'true';
  const currentRecommended = searchParams.get('recommended') === 'true';
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(searchParams);
      const res = await api.get(`/services?${queryParams.toString()}`);
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'all') {
      newParams.set(key, val);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Sort services in-memory
  const sortedServices = [...services].sort((a, b) => {
    if (sortBy === 'popular') return (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0);
    if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
    if (sortBy === 'title_desc') return b.title.localeCompare(a.title);
    return 0;
  });

  const activeFiltersCount = [
    currentCategory !== 'all',
    currentState !== 'all',
    currentType !== 'all',
    currentMode !== 'all',
    currentSearch !== '',
    currentPopular,
    currentRecommended
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded bg-blue-100 text-blue-800">
                Official Directory
              </span>
              <span className="text-xs text-slate-500">
                Showing {sortedServices.length} Government Schemes
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {t('services')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search, filter, and compare authentic welfare schemes from Central and State Governments.
            </p>
          </div>

          {/* Quick Search Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              fetchServices();
            }}
            className="flex items-center gap-2 w-full md:w-96"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={currentSearch}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search schemes or tags..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white shadow-xs"
              />
              {currentSearch && (
                <button 
                  type="button"
                  onClick={() => updateFilter('search', '')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-700" />
                <span className="font-bold text-sm text-slate-900">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Personalized Recommendations Toggle */}
            {user && (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentRecommended}
                    onChange={(e) => updateFilter('recommended', e.target.checked ? 'true' : '')}
                    className="w-4 h-4 text-blue-600 rounded mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-blue-950 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Recommended for Me</span>
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Matched to your profile state ({user.state}) and interests.
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={currentCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
              >
                <option value="all">All Categories (10)</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {lang === 'hi' && c.name_hi ? c.name_hi : c.name} ({c.services_count || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Scheme Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Scheme Level
              </label>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {['all', 'Central', 'State'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateFilter('scheme_type', type)}
                    className={`py-1.5 rounded-lg border font-medium transition-colors ${
                      currentType.toLowerCase() === type.toLowerCase()
                        ? 'bg-blue-700 text-white border-blue-700 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type === 'all' ? 'All' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Application Mode
              </label>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {['all', 'Online', 'Hybrid'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => updateFilter('mode', m)}
                    className={`py-1.5 rounded-lg border font-medium transition-colors ${
                      currentMode.toLowerCase() === m.toLowerCase()
                        ? 'bg-blue-700 text-white border-blue-700 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m === 'all' ? 'All' : m}
                  </button>
                ))}
              </div>
            </div>

            {/* State filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Target State
              </label>
              <select
                value={currentState}
                onChange={(e) => updateFilter('state', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
              >
                <option value="all">All States / Pan-India</option>
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Popular toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentPopular}
                  onChange={(e) => updateFilter('popular', e.target.checked ? 'true' : '')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span>★ Popular & Trending Only</span>
              </label>
            </div>

            {/* Explicit Apply Filter / Search Button */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => fetchServices()}
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Apply Filter & Search</span>
              </button>
            </div>

          </div>
        </div>

        {/* Services Grid Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Sorting and Results count bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
            <div>
              Showing <span className="font-bold text-slate-900">{sortedServices.length}</span> schemes matching criteria
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-medium focus:outline-hidden"
              >
                <option value="popular">Popularity & Relevance</option>
                <option value="title_asc">Scheme Title (A to Z)</option>
                <option value="title_desc">Scheme Title (Z to A)</option>
              </select>
            </div>
          </div>

          {/* Scheme Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-64 bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : sortedServices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No schemes found matching your search</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing selected filters or searching with a broader keyword like "Kisan", "Loan", or "Aadhaar".
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedServices.map(srv => (
                <ServiceCard 
                  key={srv.id} 
                  service={srv}
                  onCheckEligibility={(s) => setSelectedServiceForEligibility(s)}
                />
              ))}
            </div>
          )}

        </div>

      </div>

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
