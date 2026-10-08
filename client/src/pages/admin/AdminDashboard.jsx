import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Users, 
  MessageSquareWarning, 
  Star, 
  PlusCircle, 
  Database, 
  Activity,
  FileCheck2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  RefreshCw,
  ArrowRight,
  Shield
} from 'lucide-react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

function StatCard({ label, value, icon: Icon, color, bg, trend, link, desc }) {
  const content = (
    <div className={`p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 hover:shadow-md transition-shadow ${link ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
        <div className={`p-2.5 rounded-xl ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      {(desc || trend) && (
        <div className="flex items-center justify-between">
          {desc && <p className="text-xs text-slate-500">{desc}</p>}
          {trend && (
            <span className={`text-xs font-bold flex items-center gap-1 ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
              <TrendingUp className="w-3 h-3" />
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
  
  return link ? <Link to={link}>{content}</Link> : content;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statRes, logRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/audit-logs')
      ]);
      if (statRes.data.success) setStats(statRes.data.stats);
      if (logRes.data.success) setAuditLogs(logRes.data.logs);
      setLastRefresh(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = stats ? [
    {
      label: 'Published Schemes',
      value: stats.total_services,
      icon: Layers,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      desc: `Across ${stats.total_categories} categories`,
      link: '/admin/services'
    },
    {
      label: 'Registered Citizens',
      value: stats.total_users,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      desc: 'Total platform users',
      link: '/admin/users'
    },
    {
      label: 'Pending Grievances',
      value: stats.pending_grievances,
      icon: MessageSquareWarning,
      color: 'text-red-600',
      bg: 'bg-red-50',
      desc: `${stats.total_grievances} total lodged`,
      trend: stats.pending_grievances > 0 ? { label: 'Needs attention', positive: false } : { label: 'All resolved!', positive: true },
      link: '/admin/grievances'
    },
    {
      label: 'Citizen Satisfaction',
      value: `${stats.avg_rating} ★`,
      icon: Star,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      desc: `Based on ${stats.total_feedback} ratings`
    },
  ] : [];

  const quickActions = [
    { label: 'Add New Scheme', icon: PlusCircle, to: '/admin/services', color: 'bg-blue-700 text-white hover:bg-blue-800' },
    { label: 'Review Grievances', icon: MessageSquareWarning, to: '/admin/grievances', color: 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100' },
    { label: 'Manage Users', icon: Users, to: '/admin/users', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' },
    { label: 'Data Seeding', icon: Database, to: '/admin/seeding', color: 'bg-slate-900 text-amber-300 hover:bg-slate-800' },
  ];

  const getActionColor = (action) => {
    if (action.startsWith('CREATE')) return 'bg-blue-100 text-blue-800';
    if (action.startsWith('UPDATE')) return 'bg-amber-100 text-amber-800';
    if (action.startsWith('DELETE')) return 'bg-red-100 text-red-800';
    if (action.startsWith('RESET')) return 'bg-purple-100 text-purple-800';
    return 'bg-slate-100 text-slate-800';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[1,2,3,4].map(n => <div key={n} className="h-32 bg-slate-200 rounded-3xl" />)}
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-blue-700" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              {user?.role === 'superadmin' ? 'SuperAdmin Control Center' : 'Admin Control Center'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            GovDesk platform metrics · Last updated {lastRefresh.toLocaleTimeString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <Link
            to="/admin/services"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Scheme</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* Quick Actions Row */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((a, i) => {
            const Icon = a.icon;
            return (
              <Link
                key={i}
                to={a.to}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl font-bold text-xs transition-all text-center ${a.color}`}
              >
                <Icon className="w-5 h-5" />
                <span>{a.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two-column: Metrics summary + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Platform Snapshot */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900">Platform Snapshot</h3>
          </div>

          <div className="space-y-3 text-sm">
            {stats && [
              { label: 'Total Schemes', val: stats.total_services, icon: Layers, color: 'text-blue-600' },
              { label: 'Active Categories', val: stats.total_categories, icon: FileCheck2, color: 'text-indigo-600' },
              { label: 'Registered Users', val: stats.total_users, icon: Users, color: 'text-emerald-600' },
              { label: 'Total Grievances', val: stats.total_grievances, icon: MessageSquareWarning, color: 'text-orange-600' },
              { label: 'Resolved Grievances', val: stats.total_grievances - stats.pending_grievances, icon: CheckCircle2, color: 'text-green-600' },
              { label: 'Pending Resolution', val: stats.pending_grievances, icon: AlertCircle, color: 'text-red-600' },
              { label: 'Total Feedback', val: stats.total_feedback, icon: Star, color: 'text-amber-600' },
              { label: 'Avg Rating', val: `${stats.avg_rating} / 5`, icon: TrendingUp, color: 'text-amber-500' },
            ].map((row, i) => {
              const Icon = row.icon;
              return (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${row.color}`} />
                    <span className="text-xs text-slate-600">{row.label}</span>
                  </div>
                  <span className="font-bold text-slate-900 text-xs">{row.val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit Log */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-slate-900">Administrative Audit Trail</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Security & compliance log</span>
          </div>

          <div className="divide-y divide-slate-50 text-xs">
            {auditLogs.length === 0 ? (
              <div className="p-10 text-center">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">No audit events recorded yet.</p>
                <p className="text-slate-400 text-[11px] mt-1">Actions like creating or updating schemes will appear here.</p>
              </div>
            ) : (
              auditLogs.slice(0, 8).map((log, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 mt-0.5 ${getActionColor(log.action)}`}>
                      {log.action.replace('_', ' ')}
                    </span>
                    <div>
                      <p className="text-slate-700 font-medium leading-snug">{log.details}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">by {log.admin_name}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-auto">
                    <span className="text-slate-400 font-mono text-[11px] block">
                      {new Date(log.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {auditLogs.length > 0 && (
            <div className="p-4 border-t border-slate-100">
              <p className="text-center text-[11px] text-slate-400">
                Showing latest {Math.min(auditLogs.length, 8)} of {auditLogs.length} audit events
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Strip */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-blue-900">GovDesk Platform Health</p>
            <p className="text-xs text-blue-700 mt-0.5">
              MongoDB connected · Backend API running · All endpoints operational
            </p>
          </div>
        </div>
        <Link to="/" className="px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5 shrink-0">
          <ArrowRight className="w-3.5 h-3.5" />
          View Public Portal
        </Link>
      </div>

    </div>
  );
}
