import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Layers, 
  MessageSquareWarning, 
  Database, 
  ArrowLeft,
  LogOut,
  Users,
  Activity,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Admin Authentication Required</h2>
            <p className="text-xs text-slate-500 mt-1.5">
              You must sign in with an administrative account to access the GovDesk Backoffice Control Center.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 shadow-md">
              Sign In to Admin Account
            </Link>
            <Link to="/" className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Access Restricted</h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Your account (<strong>{user.email}</strong>) does not have administrative privileges. Contact a SuperAdmin to upgrade your role.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="px-5 py-2.5 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800">
              Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const links = [
    { to: '/admin',            label: 'Overview & Metrics',        icon: LayoutDashboard,      exact: true },
    { to: '/admin/services',   label: 'Scheme Catalog',            icon: Layers },
    { to: '/admin/grievances', label: 'Grievance Desk',            icon: MessageSquareWarning },
    { to: '/admin/users',      label: 'Registered Users',          icon: Users },
    { to: '/admin/seeding',    label: 'Data Seeding & Reset',      icon: Database },
  ];

  const isCurrent = (to, exact) => {
    if (exact) return location.pathname === to || location.pathname === '/admin/';
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 lg:w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        
        {/* Brand header */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">GovDesk Admin</h2>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Activity className="w-2.5 h-2.5 text-green-400 inline" />
                <span>All Systems Operational</span>
              </p>
            </div>
          </div>

          {/* Admin info */}
          <div className="mt-4 p-3 bg-slate-800 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <span className={`mt-2 inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
              user.role === 'superadmin' ? 'bg-amber-400/20 text-amber-300' : 'bg-blue-400/20 text-blue-300'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 text-xs font-medium">
          {links.map(link => {
            const Icon = link.icon;
            const active = isCurrent(link.to, link.exact);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl transition-all ${
                  active
                    ? 'bg-blue-700 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-slate-800 space-y-1 text-xs">
          <Link
            to="/"
            className="flex items-center space-x-2.5 text-slate-400 hover:text-white px-3.5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Portal</span>
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center space-x-2.5 text-red-400 hover:text-red-300 px-3.5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}
