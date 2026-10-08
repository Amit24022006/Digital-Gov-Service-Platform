import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, Shield, CheckCircle, ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow">
                <Building2 className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">
                  GovDesk
                </span>
                <span className="block text-xs text-amber-400 font-medium">
                  Digital Government Services Platform
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              "{t('mission')}"
            </p>

            <p className="text-xs text-slate-400">
              GovDesk consolidates central and state government welfare schemes, providing automated eligibility evaluation, step-by-step guidance, and Seva Kendra locator for all citizens.
            </p>

            <div className="flex items-center space-x-2 pt-2">
              <span className="px-2.5 py-1 bg-slate-800 text-emerald-400 border border-slate-700 rounded-md text-xs font-semibold inline-flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                <span>Verified Official Data</span>
              </span>
              <span className="px-2.5 py-1 bg-slate-800 text-blue-300 border border-slate-700 rounded-md text-xs font-semibold">
                MERN Stack MVP
              </span>
            </div>
          </div>

          {/* Citizen Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services" className="hover:text-amber-300 transition-colors">
                  All Schemes Directory
                </Link>
              </li>
              <li>
                <Link to="/eligibility" className="hover:text-amber-300 transition-colors">
                  Check Eligibility Wizard
                </Link>
              </li>
              <li>
                <Link to="/offices" className="hover:text-amber-300 transition-colors">
                  Find Nearest Seva Kendra
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-amber-300 transition-colors">
                  Compare Multiple Schemes
                </Link>
              </li>
              <li>
                <Link to="/grievance" className="hover:text-amber-300 transition-colors">
                  Lodge Public Grievance
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              Core Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services?category=cat_farmer" className="hover:text-amber-300 transition-colors">
                  🌾 Farmer & Agriculture
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat_education" className="hover:text-amber-300 transition-colors">
                  🎓 Education & Student
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat_health" className="hover:text-amber-300 transition-colors">
                  ❤️ Health & Family
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat_employment" className="hover:text-amber-300 transition-colors">
                  💼 Employment & MSME
                </Link>
              </li>
              <li>
                <Link to="/services?category=cat_housing" className="hover:text-amber-300 transition-colors">
                  🏠 Housing & Ration
                </Link>
              </li>
            </ul>
          </div>

          {/* National Citizen Helplines */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider text-white uppercase">
              National Helplines
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div>
                <p className="font-semibold text-white">Kisan Call Center:</p>
                <p className="text-amber-300 font-mono">1800-180-1551</p>
              </div>
              <div>
                <p className="font-semibold text-white">Ayushman Bharat PM-JAY:</p>
                <p className="text-amber-300 font-mono">14555</p>
              </div>
              <div>
                <p className="font-semibold text-white">National Scholarship Helpdesk:</p>
                <p className="text-amber-300 font-mono">0120-6619540</p>
              </div>
              <div>
                <p className="font-semibold text-white">Cyber Crime Emergency:</p>
                <p className="text-amber-300 font-mono">1930</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} GovDesk · Digital Government Services Platform. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Right information at the right time for every citizen.</span>
            <Link
              to="/admin"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer shadow-xs"
              title="Administrative Backoffice Portal"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
