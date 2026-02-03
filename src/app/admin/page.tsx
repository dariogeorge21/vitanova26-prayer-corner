'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, LogOut, RefreshCw, Home, Plus, Minus, 
  Save, AlertCircle, CheckCircle, BarChart3, 
  Clock, Activity, Zap, History, ShieldAlert
} from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PRAYER_TYPES, PrayerWithAggregate } from '@/lib/types';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'vitanova2026admin';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [prayers, setPrayers] = useState<PrayerWithAggregate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adjustments, setAdjustments] = useState<Record<number, number>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem('vitanova_admin_auth');
    if (auth === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('vitanova_admin_auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Invalid Credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('vitanova_admin_auth');
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    if (!isSupabaseConfigured()) {
      setPrayers(PRAYER_TYPES.map(p => ({ ...p, total: Math.floor(Math.random() * 100) })));
      setIsLoading(false);
      return;
    }
    try {
      const { data: aggregates } = await supabase.from('prayer_aggregates').select('*');
      const prayersWithTotals = PRAYER_TYPES.map(prayer => ({
        ...prayer,
        total: aggregates?.find(a => a.prayer_type_id === prayer.id)?.total || 0
      }));
      setPrayers(prayersWithTotals);

      const { data: logs } = await supabase
        .from('prayer_logs')
        .select('id, prayer_type_id, value, created_at')
        .order('created_at', { ascending: false }).limit(10);

      setRecentLogs(logs?.map(log => ({
        ...log,
        prayer_name: PRAYER_TYPES.find(p => p.id === log.prayer_type_id)?.name || 'Admin Mod'
      })) || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated, fetchData]);

  const handleAdjustment = (prayerId: number, delta: number) => {
    setAdjustments(prev => ({ ...prev, [prayerId]: (prev[prayerId] || 0) + delta }));
  };

  const handleSaveAdjustments = async () => {
    setSaveStatus('saving');
    try {
      if (isSupabaseConfigured()) {
        const entries = Object.entries(adjustments).filter(([, v]) => v !== 0);
        for (const [id, val] of entries) {
          await supabase.from('prayer_logs').insert({ 
            prayer_type_id: parseInt(id), 
            value: val, 
            device_hash: 'admin_panel' 
          });
        }
      }
      setSaveStatus('success');
      setAdjustments({});
      fetchData();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-1 rounded-[2.5rem] bg-gradient-to-b from-purple-500/20 to-transparent shadow-2xl"
        >
          <div className="bg-slate-900/90 backdrop-blur-xl p-10 rounded-[2.3rem] border border-white/5">
            <div className="text-center space-y-4 mb-8">
              <div className="w-20 h-20 bg-purple-500/10 rounded-3xl border border-purple-500/20 flex items-center justify-center mx-auto shadow-inner">
                <ShieldAlert className="w-10 h-10 text-purple-400" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Vitanova Command</h1>
              <p className="text-slate-500 text-sm">Authentication required to manage repository</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin Token"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" size={20} />
              </div>
              {passwordError && <p className="text-red-400 text-xs text-center font-medium">{passwordError}</p>}
              <button type="submit" className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-widest uppercase text-xs transition-all shadow-lg shadow-purple-500/20">
                Authorize Access
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Admin Control</h2>
              <p className="text-[10px] text-slate-500 font-medium">Session: Active</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <Link href="/" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
              <Home size={18} />
            </Link>
            <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* STATS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Intercessions" value={prayers.reduce((s, p) => s + p.total, 0)} icon={<Activity size={20}/>} color="purple" />
          <StatCard title="Consecrated Minutes" value={prayers.filter(p => p.unit === 'minutes').reduce((s, p) => s + p.total, 0)} icon={<Clock size={20}/>} color="amber" />
          <StatCard title="Prayer Variety" value={`${prayers.filter(p => p.total > 0).length} / ${prayers.length}`} icon={<Zap size={20}/>} color="blue" />
        </section>

        {/* ADJUSTMENT GRID */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-purple-400" />
              <h3 className="text-xl font-bold text-white">Prayer Management</h3>
            </div>
            <AnimatePresence>
              {Object.values(adjustments).some(v => v !== 0) && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  onClick={handleSaveAdjustments}
                  className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl transition-all ${
                    saveStatus === 'success' ? 'bg-green-600' : 'bg-purple-600 hover:bg-purple-500'
                  }`}
                >
                  {saveStatus === 'saving' ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                  {saveStatus === 'success' ? 'Database Updated' : 'Push Adjustments'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prayers.map(prayer => {
              const IconComp = (Icons as any)[prayer.icon_name] || Icons.Heart;
              const adj = adjustments[prayer.id] || 0;
              return (
                <motion.div 
                  key={prayer.id}
                  layout
                  className={`relative p-6 rounded-3xl border transition-all duration-500 ${adj !== 0 ? 'bg-purple-500/10 border-purple-500/50 shadow-lg shadow-purple-500/10' : 'bg-white/[0.03] border-white/5'}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-slate-300">
                      <IconComp size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{prayer.unit}</span>
                  </div>
                  
                  <div className="space-y-1 mb-6">
                    <h4 className="font-bold text-lg text-white">{prayer.name}</h4>
                    <p className="text-3xl font-black tracking-tighter text-white">
                      {(prayer.total + adj).toLocaleString()}
                    </p>
                    {adj !== 0 && (
                      <span className={`text-xs font-bold ${adj > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {adj > 0 ? '+' : ''}{adj} pending
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleAdjustment(prayer.id, prayer.unit === 'minutes' ? -10 : -1)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/5 transition-all">
                      <Minus size={16} className="mx-auto" />
                    </button>
                    <button onClick={() => handleAdjustment(prayer.id, prayer.unit === 'minutes' ? 10 : 1)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-green-500/20 text-slate-400 hover:text-green-400 border border-white/5 transition-all">
                      <Plus size={16} className="mx-auto" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* LOGS TABLE */}
        <section className="pb-12">
          <div className="flex items-center gap-3 mb-8">
            <History className="text-slate-500" />
            <h3 className="text-xl font-bold text-white">System Logs</h3>
          </div>
          <div className="rounded-[2rem] bg-white/[0.02] border border-white/5 overflow-hidden backdrop-blur-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Prayer Type</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Value</th>
                  <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-4 font-semibold text-slate-200">{log.prayer_name}</td>
                    <td className="px-8 py-4 text-purple-400 font-mono">+{log.value}</td>
                    <td className="px-8 py-4 text-slate-500 text-sm">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    purple: "from-purple-500/20 to-purple-900/40 border-purple-500/30 text-purple-400",
    amber: "from-amber-500/20 to-amber-900/40 border-amber-500/30 text-amber-400",
    blue: "from-blue-500/20 to-blue-900/40 border-blue-500/30 text-blue-400",
  };
  return (
    <div className={`p-8 rounded-[2rem] bg-gradient-to-br ${colors[color]} border shadow-2xl`}>
      <div className="flex items-center gap-3 mb-4 opacity-80">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
      </div>
      <p className="text-4xl font-black text-white tracking-tighter">{value.toLocaleString()}</p>
    </div>
  );
}