import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  RefreshCw,
  UserCheck,
  Filter,
  X
} from 'lucide-react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';

const ROLE_CONFIG = {
  citizen:    { label: 'Citizen', color: 'bg-slate-100 text-slate-700 border-slate-300', icon: Users },
  admin:      { label: 'Admin',   color: 'bg-blue-100 text-blue-800 border-blue-300',   icon: Shield },
  superadmin: { label: 'SuperAdmin', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: ShieldCheck }
};

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === 'superadmin';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      showToast('Failed to load users.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!isSuperAdmin) {
      showToast('Only SuperAdmins can change user roles.', 'error');
      return;
    }
    if (userId === currentUser?._id || userId === currentUser?.id) {
      showToast('You cannot change your own role.', 'error');
      return;
    }
    setUpdatingId(userId);
    try {
      const res = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers(prev => prev.map(u => u._id === userId || u.id === userId ? { ...u, role: newRole } : u));
        showToast(`Role updated to "${newRole}" successfully.`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update role.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = users.filter(u => {
    const matchesSearch = !searchQuery ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.state?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    citizens: users.filter(u => u.role === 'citizen').length,
    admins: users.filter(u => u.role === 'admin').length,
    superadmins: users.filter(u => u.role === 'superadmin').length,
  };

  return (
    <div className="space-y-6 relative">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all animate-in slide-in-from-top-2 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Registered Users</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage citizen accounts and administrative roles.
            {!isSuperAdmin && <span className="ml-1 text-amber-600 font-semibold">(Role changes require SuperAdmin)</span>}
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', val: stats.total,       bg: 'bg-blue-50',    text: 'text-blue-800' },
          { label: 'Citizens',    val: stats.citizens,    bg: 'bg-slate-50',   text: 'text-slate-800' },
          { label: 'Admins',      val: stats.admins,      bg: 'bg-indigo-50',  text: 'text-indigo-800' },
          { label: 'SuperAdmins', val: stats.superadmins, bg: 'bg-amber-50',   text: 'text-amber-800' },
        ].map((s, i) => (
          <div key={i} className={`p-5 rounded-2xl border border-slate-200 ${s.bg} shadow-xs`}>
            <p className={`text-3xl font-black ${s.text}`}>{s.val}</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or state..."
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white shadow-xs"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {['all', 'citizen', 'admin', 'superadmin'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                filterRole === role
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-bold text-slate-900">
              {filtered.length} user{filtered.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>

        {loading ? (
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="p-5 flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-48" />
                  <div className="h-2.5 bg-slate-100 rounded w-64" />
                </div>
                <div className="h-6 bg-slate-200 rounded-full w-20" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-600">No users match your filter</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((u) => {
              const roleConf = ROLE_CONFIG[u.role] || ROLE_CONFIG.citizen;
              const RoleIcon = roleConf.icon;
              const isUpdating = updatingId === u._id || updatingId === u.id;
              const isSelf = (u._id || u.id) === (currentUser?._id || currentUser?.id);

              return (
                <div key={u._id || u.id} className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50/70 transition-colors ${isUpdating ? 'opacity-60' : ''}`}>
                  
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-blue-700 text-white font-black text-base flex items-center justify-center shadow-xs shrink-0">
                    {(u.name || 'U').charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{u.name}</h3>
                      {isSelf && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">YOU</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{u.email}</span>
                      {u.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{u.phone}</span>}
                      {u.state && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{u.state}{u.city ? `, ${u.city}` : ''}</span>}
                      {u.createdAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Role badge + changer */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleConf.color}`}>
                      <RoleIcon className="w-3 h-3" />
                      {roleConf.label}
                    </span>

                    {isSuperAdmin && !isSelf && (
                      <select
                        value={u.role}
                        disabled={isUpdating}
                        onChange={e => handleRoleChange(u._id || u.id, e.target.value)}
                        className="px-2.5 py-1.5 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">SuperAdmin</option>
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        Total {users.length} registered accounts · Role changes are logged in the audit trail.
      </p>
    </div>
  );
}
