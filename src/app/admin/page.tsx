'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Lock, 
  LogOut, 
  RefreshCw, 
  Home,
  Plus,
  Minus,
  Save,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Clock,
  Activity
} from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PRAYER_TYPES, PrayerWithAggregate } from '@/lib/types';

// Simple password check (in production, use proper auth)
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'vitanova2026admin';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [prayers, setPrayers] = useState<PrayerWithAggregate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adjustments, setAdjustments] = useState<Record<number, number>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [recentLogs, setRecentLogs] = useState<Array<{
    id: string;
    prayer_name: string;
    value: number;
    created_at: string;
  }>>([]);

  // Check session storage for auth
  useEffect(() => {
    const auth = sessionStorage.getItem('vitanova_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('vitanova_admin_auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('vitanova_admin_auth');
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    if (!isSupabaseConfigured()) {
      // Demo data
      setPrayers(PRAYER_TYPES.map(p => ({ ...p, total: Math.floor(Math.random() * 100) + 10 })));
      setRecentLogs([]);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch aggregates
      const { data: aggregates, error: aggError } = await supabase
        .from('prayer_aggregates')
        .select('*');

      if (aggError) throw aggError;

      const prayersWithTotals: PrayerWithAggregate[] = PRAYER_TYPES.map(prayer => {
        const aggregate = aggregates?.find(a => a.prayer_type_id === prayer.id);
        return { ...prayer, total: aggregate?.total || 0 };
      });

      setPrayers(prayersWithTotals);

      // Fetch recent logs
      const { data: logs, error: logsError } = await supabase
        .from('prayer_logs')
        .select('id, prayer_type_id, value, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (logsError) throw logsError;

      const logsWithNames = logs?.map(log => ({
        id: log.id,
        prayer_name: PRAYER_TYPES.find(p => p.id === log.prayer_type_id)?.name || 'Unknown',
        value: log.value,
        created_at: log.created_at
      })) || [];

      setRecentLogs(logsWithNames);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleAdjustment = (prayerId: number, delta: number) => {
    setAdjustments(prev => ({
      ...prev,
      [prayerId]: (prev[prayerId] || 0) + delta
    }));
  };

  const handleSaveAdjustments = async () => {
    if (!isSupabaseConfigured()) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
      setAdjustments({});
      return;
    }

    setSaveStatus('saving');

    try {
      const entries = Object.entries(adjustments).filter(([, value]) => value !== 0);
      
      for (const [prayerId, value] of entries) {
        const { error } = await supabase
          .from('prayer_logs')
          .insert({
            prayer_type_id: parseInt(prayerId),
            value: value,
            device_hash: 'admin_adjustment'
          });

        if (error) throw error;
      }

      setSaveStatus('success');
      setAdjustments({});
      fetchData();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Error saving adjustments:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const totalPrayers = prayers.reduce((sum, p) => sum + p.total, 0);
  const totalMinutes = prayers.filter(p => p.unit === 'minutes').reduce((sum, p) => sum + p.total, 0);
  const hasAdjustments = Object.values(adjustments).some(v => v !== 0);

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400 text-sm">Enter password to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
              />
              {passwordError && (
                <p className="mt-2 text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium hover:from-purple-500 hover:to-purple-400 transition-all"
            >
              Access Admin Panel
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-gray-400 text-sm hover:text-purple-400 inline-flex items-center gap-1">
              <Home className="w-4 h-4" />
              Back to Prayer Repository
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Vitanova 2026 Prayer Repository</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/"
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              <Home className="w-4 h-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Demo mode banner */}
      {!isSupabaseConfigured() && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-center">
          <p className="text-amber-300 text-sm">
            🔧 Demo Mode - Changes won&apos;t persist without Supabase configuration
          </p>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/20 p-6">
            <div className="flex items-center gap-2 text-purple-300 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-sm">Total Prayers</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalPrayers.toLocaleString()}</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-500/20 p-6">
            <div className="flex items-center gap-2 text-amber-300 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Total Minutes</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalMinutes.toLocaleString()}</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-500/20 p-6">
            <div className="flex items-center gap-2 text-green-300 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Active Prayer Types</span>
            </div>
            <p className="text-3xl font-bold text-white">{prayers.filter(p => p.total > 0).length} / {prayers.length}</p>
          </div>
        </div>

        {/* Prayer adjustments */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">Prayer Counters</h2>
            {hasAdjustments && (
              <button
                onClick={handleSaveAdjustments}
                disabled={saveStatus === 'saving'}
                className={`
                  px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2
                  ${saveStatus === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    saveStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-purple-600 text-white hover:bg-purple-500'}
                  transition-all
                `}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saved!
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Error
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prayers.map(prayer => {
              const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[prayer.icon_name] || Icons.Heart;
              const adjustment = adjustments[prayer.id] || 0;
              const newTotal = prayer.total + adjustment;

              return (
                <div
                  key={prayer.id}
                  className={`
                    rounded-xl bg-white/5 border p-4
                    ${adjustment !== 0 ? 'border-purple-500/50' : 'border-white/10'}
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${prayer.unit === 'minutes' ? 'bg-amber-500/20' : 'bg-purple-500/20'}`}>
                        <IconComponent className={`w-4 h-4 ${prayer.unit === 'minutes' ? 'text-amber-400' : 'text-purple-400'}`} />
                      </div>
                      <span className="font-medium text-white">{prayer.name}</span>
                    </div>
                    <span className="text-xs text-gray-500 uppercase">{prayer.unit}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {newTotal.toLocaleString()}
                      </p>
                      {adjustment !== 0 && (
                        <p className={`text-xs ${adjustment > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {adjustment > 0 ? '+' : ''}{adjustment} adjustment
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAdjustment(prayer.id, prayer.unit === 'minutes' ? -5 : -1)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAdjustment(prayer.id, prayer.unit === 'minutes' ? 5 : 1)}
                        className="p-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <h2 className="text-lg font-semibold text-gray-200 mb-4">Recent Activity</h2>
          
          {recentLogs.length === 0 ? (
            <div className="rounded-xl bg-white/5 border border-white/10 p-8 text-center">
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Prayer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.map((log, i) => (
                    <tr key={log.id} className={i !== recentLogs.length - 1 ? 'border-b border-white/5' : ''}>
                      <td className="px-4 py-3 text-sm text-white">{log.prayer_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">+{log.value}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
