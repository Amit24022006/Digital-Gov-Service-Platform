import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Bell, 
  Globe, 
  User, 
  LogOut, 
  ShieldCheck, 
  Scale, 
  Compass, 
  Layers, 
  Menu, 
  X,
  FileCheck2,
  CheckCircle2,
  ExternalLink,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function Navbar() {
  const { user, logout, isAdmin, comparedServices } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { notifications, unreadCount, markRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* Top Gov Desk Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center text-slate-200 font-medium tracking-wide">
              🇮🇳 भारत सरकार · Government of India
            </span>
            <span className="hidden sm:inline text-slate-400 text-opacity-40">|</span>
            <span className="hidden sm:inline text-slate-300">
              {t('tollFree')}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors border border-slate-700 font-medium cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-900 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
              <Building2 className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-blue-950">
                  {lang === 'hi' ? 'गोवडेस्क' : 'GovDesk'}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-blue-100 text-blue-800 rounded">
                  Official
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 line-clamp-1">
                {t('tagline')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {t('home')}
            </Link>

            <Link
              to="/services"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/services') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {t('services')}
            </Link>

            <Link
              to="/eligibility"
              className={`px-3 py-2 rounded-lg transition-colors inline-flex items-center space-x-1 ${
                isActive('/eligibility') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>{t('eligibilityChecker')}</span>
            </Link>

            <Link
              to="/offices"
              className={`px-3 py-2 rounded-lg transition-colors inline-flex items-center space-x-1 ${
                isActive('/offices') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>{t('officeLocator')}</span>
            </Link>

            <Link
              to="/compare"
              className={`px-3 py-2 rounded-lg transition-colors relative ${
                isActive('/compare') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              <span className="inline-flex items-center space-x-1">
                <Scale className="w-4 h-4 text-slate-500" />
                <span>{t('compareSchemes')}</span>
              </span>
              {comparedServices.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-xs font-bold bg-amber-500 text-white rounded-full">
                  {comparedServices.length}
                </span>
              )}
            </Link>

            <Link
              to="/grievance"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/grievance') ? 'text-blue-700 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-blue-700 hover:bg-slate-50'
              }`}
            >
              {t('grievance')}
            </Link>
          </nav>

          {/* Right Action Icons, Admin Button, & Merged Auth */}
          <div className="flex items-center space-x-3">
            


            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 relative transition-colors cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-blue-700" />
                      <span className="font-semibold text-slate-900 text-sm">{t('notifications')}</span>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markRead('all')}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-6">
                        {t('noNotifications')}
                      </p>
                    ) : (
                      notifications.slice(0, 5).map(n => (
                        <div 
                          key={n._id || n.id}
                          className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                            !n.read_status ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-slate-900 leading-tight">
                              {lang === 'hi' && n.title_hi ? n.title_hi : n.title}
                            </h4>
                            {!n.read_status && (
                              <button 
                                onClick={() => markRead(n._id || n.id)}
                                title="Mark read"
                                className="text-blue-600 hover:text-blue-800 ml-2 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-slate-600 mt-1 line-clamp-2">
                            {lang === 'hi' && n.message_hi ? n.message_hi : n.message}
                          </p>
                          {n.link && (
                            <Link 
                              to={n.link}
                              onClick={() => {
                                markRead(n._id || n.id);
                                setNotifDropdownOpen(false);
                              }}
                              className="inline-flex items-center text-[11px] text-blue-700 hover:underline font-medium mt-1.5"
                            >
                              <span>View details</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Merged Login / Sign Up Button OR Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pl-2.5 pr-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer border border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold max-w-[110px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wide rounded bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('myProfile')}</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-emerald-700 hover:bg-emerald-50 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left border-t border-slate-100 mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Merged Login / Sign Up Button */
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-xl shadow-md shadow-blue-900/15 transition-all hover:shadow-lg cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-300" />
                <span>Sign In / Register</span>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
          >
            {t('home')}
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
          >
            {t('services')}
          </Link>
          <Link
            to="/eligibility"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
          >
            {t('eligibilityChecker')}
          </Link>
          <Link
            to="/offices"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
          >
            {t('officeLocator')}
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
          >
            {t('compareSchemes')} ({comparedServices.length})
          </Link>
          <Link
            to="/grievance"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
          >
            {t('grievance')}
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-bold text-amber-300 bg-slate-900"
          >
            🛡️ Admin Portal
          </Link>
        </div>
      )}
    </header>
  );
}
