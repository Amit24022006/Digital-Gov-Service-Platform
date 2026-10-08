import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Building2, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Illustration */}
        <div className="relative">
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center mx-auto shadow-xl">
            <Building2 className="w-16 h-16 text-amber-300" />
          </div>
          <div className="absolute -top-3 -right-3 left-0 mx-auto">
            <span className="inline-block text-7xl font-black text-slate-100 select-none">404</span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-slate-900">Page Not Found</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            The government page or service you are looking for doesn't exist or has been moved. Please use the navigation below to find what you need.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-sm mx-auto">
          <Link
            to="/"
            className="flex flex-col items-center gap-2 p-4 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-bold text-xs transition-all shadow-md"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/services"
            className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-xs transition-all shadow-sm"
          >
            <Search className="w-5 h-5 text-blue-700" />
            <span>Services</span>
          </Link>
          <Link
            to="/offices"
            className="flex flex-col items-center gap-2 p-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-xs transition-all shadow-sm"
          >
            <Compass className="w-5 h-5 text-blue-700" />
            <span>Find Office</span>
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          Error Code: 404 · GovDesk Citizen Portal
        </p>
      </div>
    </div>
  );
}
