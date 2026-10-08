import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Mail, Lock, Phone, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client.js';
import { INDIAN_STATES, SCHEME_CATEGORIES } from '../utils/constants.js';


export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Tab: 'login' or 'register'
  const [authTab, setAuthTab] = useState(() => searchParams.get('mode') === 'register' ? 'register' : 'login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regState, setRegState] = useState('Delhi');
  const [regCity, setRegCity] = useState('');
  const [regPreferences, setRegPreferences] = useState(['cat_farmer', 'cat_transport']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const availableCategories = SCHEME_CATEGORIES;


  const togglePref = (id) => {
    setRegPreferences(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(loginEmail, loginPassword);
    setLoading(false);
    if (res.success) {
      navigate('/services');
    } else {
      setError(res.message || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      state: regState,
      city: regCity,
      preferences: regPreferences
    });
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Account registered in database successfully!');
      setTimeout(() => navigate('/services'), 1000);
    } else {
      setError(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Portal Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-900 to-blue-700 flex items-center justify-center text-white mx-auto shadow-md">
            <Building2 className="w-8 h-8 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Citizen Digital Gateway
          </h2>
          <p className="text-xs text-slate-500">
            Access, discover, and manage all central and state government services.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Tabs: Sign In / Create Account */}
          <div className="flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200 text-xs">
            <button
              onClick={() => { setAuthTab('login'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 font-bold rounded-xl transition-all cursor-pointer ${
                authTab === 'login' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => { setAuthTab('register'); setError(''); setSuccessMsg(''); }}
              className={`flex-1 py-2.5 font-bold rounded-xl transition-all cursor-pointer ${
                authTab === 'register' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              New Registration (Sign Up)
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {authTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                {loading ? 'Authenticating with MongoDB...' : 'Sign In'}
              </button>

              <p className="text-center text-xs text-slate-500 pt-2">
                New to GovDesk?{' '}
                <button
                  type="button"
                  onClick={() => setAuthTab('register')}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Create an Account
                </button>
              </p>
            </form>
          ) : (
            /* TAB 2: REGISTER */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="citizen@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Phone *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State of Residence *
                  </label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                  >
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Priority Interests (For Personalized Scheme Alerts)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableCategories.map(cat => {
                    const isChecked = regPreferences.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => togglePref(cat.id)}
                        className={`p-2 rounded-xl border text-xs font-medium text-left transition-colors flex items-center justify-between cursor-pointer ${
                          isChecked 
                            ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">{cat.label}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                {loading ? 'Creating Citizen Profile in MongoDB...' : 'Complete Citizen Registration'}
              </button>

              <p className="text-center text-xs text-slate-500 pt-2">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthTab('login')}
                  className="text-blue-700 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
