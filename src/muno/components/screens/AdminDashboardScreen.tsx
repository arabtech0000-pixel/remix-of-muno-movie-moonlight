// @ts-nocheck -- imported app code; strict typing not yet applied
import React, { useState, useEffect } from 'react';
import {
  Users,
  Film,
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  RefreshCw,
  LogOut,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { Movie } from '../../types';
import { changeAdminUser } from '@/lib/adminUsers.functions';
import { fetchAdminMembers } from '../../services/adminMembers';
import { useServerFn } from '@tanstack/react-start';
import { Button } from '@/components/ui/button';

interface AdminDashboardScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
  movies: Movie[];
}

interface UserRecord {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'disabled';
  createdAt?: string;
  lastLogin?: number;
  plan?: string;
  amountPaid?: number;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  onBack,
  onLogout,
  onShowToast,
  movies,
}) => {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModalUser, setConfirmModalUser] = useState<UserRecord | null>(null);
  const [confirmAction, setConfirmAction] = useState<'disable' | 'enable' | 'delete' | null>(null);

  const updateMember = useServerFn(changeAdminUser);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load real Cloud member records; preserve the last successful list on failure.
  const loadUsers = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const list = await fetchAdminMembers();
      setUsers(list.map((u: any) => ({ ...u, createdAt: u.createdAt ? String(u.createdAt).split('T')[0] : '' })));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not load members. Try Refresh.');
    } finally { setIsLoading(false); }
  };
  useEffect(() => { loadUsers(); }, []);

  const totalUsersCount = users.length;
  const activeUsersCount = users.filter((u) => u.status === 'active').length;
  const disabledUsersCount = users.filter((u) => u.status === 'disabled').length;
  const serverCatalogsCount = movies.filter((m) => m.isSeries).length;

  // Real revenue calculated from registered subscriptions
  const netProfitUGX = users.reduce((sum, u) => sum + (u.amountPaid || 0), 0);
  const weeklyProfitUGX = users.filter((u) => u.lastLogin && u.lastLogin >= Date.now() - 7 * 86400000).length;

  const filteredUsers = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExecuteUserAction = async () => {
    if (!confirmModalUser || !confirmAction || isUpdating) return;
    setIsUpdating(true);

    try {
      await updateMember({ data: { userId: confirmModalUser.uid, action: confirmAction } });
      if (confirmAction === 'delete') setUsers((prev) => prev.filter((u) => u.uid !== confirmModalUser.uid));
      else { const newStatus = confirmAction === 'disable' ? 'disabled' : 'active'; setUsers((prev) => prev.map((u) => u.uid === confirmModalUser.uid ? { ...u, status: newStatus } : u)); }
      onShowToast('Member updated.');
    } catch (err) {
      onShowToast((err as Error)?.message || 'Could not update member.');
    }

    setIsUpdating(false);
    setConfirmModalUser(null);
    setConfirmAction(null);
  };

  return (
    <div className="min-h-full bg-[#05051F] text-white flex flex-col pb-24 select-none animate-fadeIn">
      {/* Top Header - Just "Admin" */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.06] sticky top-0 bg-[#05051F]/95 backdrop-blur-md z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-white hover:text-[#00D522] transition-colors focus:outline-none cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-white text-lg font-bold tracking-tight">Admin</h1>
        </div>

        <button
          onClick={onLogout}
          className="p-2 text-[#9292A5] hover:text-red-400 transition-colors cursor-pointer"
          title="Sign out Admin"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6 muno-account-theme">
        {/* OVERVIEW SECTION HEADER */}
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Overview
          </h2>
          <p className="text-xs text-[#9292A5]">
            Member accounts and account activity.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground" aria-live="polite">
          <span>{isLoading ? 'Loading members…' : loadError && users.length === 0 ? 'Members unavailable' : `${users.length} members loaded`}</span>
          <Button variant="outline" size="sm" onClick={loadUsers} disabled={isLoading}>
            <RefreshCw className={isLoading ? 'animate-spin' : ''} /> Refresh
          </Button>
        </div>
        {loadError && <div role="alert" className="border border-destructive rounded-md p-3 text-sm text-foreground">{loadError}</div>}

        {/* 2 ROWS x 2 COLUMNS GRID (Exactly as requested: "two columns and two rows") */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Row 1, Col 1: Total Users */}
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-1.5 shadow">
            <div className="flex items-center justify-between text-[#9292A5]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-[#00D522]" />
            </div>
            <div className="text-2xl font-black text-white">{(isLoading || loadError) && users.length === 0 ? '—' : totalUsersCount}</div>
            <div className="text-[10px] text-[#00D522] font-semibold">Registered accounts</div>
          </div>

          {/* Row 1, Col 2: Active Users */}
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-1.5 shadow">
            <div className="flex items-center justify-between text-[#9292A5]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Users</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{(isLoading || loadError) && users.length === 0 ? '—' : activeUsersCount}</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Active accounts</div>
          </div>

          {/* Row 2, Col 1: Disabled Users */}
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-1.5 shadow">
            <div className="flex items-center justify-between text-[#9292A5]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Disabled Users</span>
              <XCircle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-white">{(isLoading || loadError) && users.length === 0 ? '—' : disabledUsersCount}</div>
            <div className="text-[10px] text-red-400 font-semibold">Blocked accounts</div>
          </div>

          {/* Row 2, Col 2: Server Catalogs */}
          <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-1.5 shadow">
            <div className="flex items-center justify-between text-[#9292A5]">
              <span className="text-[11px] font-bold uppercase tracking-wider">Series</span>
              <Film className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{serverCatalogsCount}</div>
            <div className="text-[10px] text-amber-400 font-semibold">Live titles on server</div>
          </div>
        </div>

        {/* FINANCIAL REVENUE CARDS: NET PROFIT & WEEKLY PROFIT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-4 bg-gradient-to-r from-emerald-950/30 to-[#0C0C38] border border-[#00D522]/30 rounded-2xl space-y-1.5 shadow">
            <div className="flex items-center justify-between text-[#9292A5]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Subscription Revenue
              </span>
              <DollarSign className="w-4 h-4 text-[#00D522]" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {(isLoading || loadError) && users.length === 0 ? '—' : `UGX ${netProfitUGX.toLocaleString()}`}
            </div>
            <div className="text-[10px] text-[#9292A5]">Total paid by members on record</div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-950/30 to-[#0C0C38] border border-blue-500/30 rounded-2xl space-y-1.5 shadow">
            <div className="flex items-center justify-between text-[#9292A5]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Active This Week
              </span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {(isLoading || loadError) && users.length === 0 ? '—' : weeklyProfitUGX}
            </div>
            <div className="text-[10px] text-[#9292A5]">Members who signed in in the last 7 days</div>
          </div>
        </div>

        {/* USER MANAGEMENT SECTION (Directly at the bottom of Overview, no tabs) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                User Management
              </h3>
              <p className="text-xs text-[#9292A5]">
                Member access and subscription status.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#9292A5] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user..."
                className="w-full h-9 pl-9 pr-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-xs text-white placeholder-[#9292A5] focus:outline-none focus:border-[#00D522]"
              />
            </div>
          </div>

          {/* User List Table */}
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[#9292A5] text-[10px] uppercase tracking-wider">
                    <th className="py-2.5 px-3.5 font-semibold">User</th>
                    <th className="py-2.5 px-3.5 font-semibold">Status</th>
                    <th className="py-2.5 px-3.5 font-semibold">Plan</th>
                    <th className="py-2.5 px-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-white">{user.displayName}</div>
                        <div className="text-[#9292A5] text-[11px]">Joined {user.createdAt || '—'}</div>
                        <div className="text-[#9292A5] text-[11px]">Last sign-in {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</div>
                      </td>
                      <td className="py-3 px-3.5">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'
                            }`}
                          />
                          <span className="capitalize">{user.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-[#D0D0D8] text-[11px]">
                        {user.plan || 'Free'}
                      </td>
                      <td className="py-3 px-3.5 text-right space-x-2 whitespace-nowrap">
                        {user.role !== 'admin' ? (
                          <>
                            {user.status === 'active' ? (
                              <button
                                onClick={() => {
                                  setConfirmModalUser(user);
                                  setConfirmAction('disable');
                                }}
                                className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Disable
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setConfirmModalUser(user);
                                  setConfirmAction('enable');
                                }}
                                className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Enable
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setConfirmModalUser(user);
                                setConfirmAction('delete');
                              }}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer inline-block"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[#00D522] text-[11px] font-bold">Admin</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-xs text-[#9292A5]">
                        {isLoading ? 'Loading members…' : loadError ? 'Member list unavailable. Use Refresh to retry.' : searchQuery ? 'No matching members.' : 'No registered members.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalUser && confirmAction && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0C0C38] border border-white/[0.1] rounded-2xl p-6 max-w-md w-full space-y-4 animate-scaleUp">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Confirm User Action</h3>
            </div>
            <p className="text-xs text-[#D0D0D8] leading-relaxed">
              Are you sure you want to <span className="font-bold text-white">{confirmAction}</span>{' '}
              account for <span className="text-[#00D522] font-bold">{confirmModalUser.displayName}</span>?
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => {
                  setConfirmModalUser(null);
                  setConfirmAction(null);
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isUpdating}
                onClick={handleExecuteUserAction}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  confirmAction === 'delete' || confirmAction === 'disable'
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-[#00D522] hover:bg-[#00c21e] text-[#05051F]'
                }`}
              >
                {isUpdating ? 'Updating…' : `Confirm ${confirmAction}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
