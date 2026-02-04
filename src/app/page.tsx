'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldCheck, Info } from 'lucide-react';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import CountPrayerCard from '@/components/CountPrayerCard';
import TimePrayerCard from '@/components/TimePrayerCard';
import FastingChartCard from '@/components/FastingChartCard';
import Footer from '@/components/Footer';
import { usePrayers } from '@/hooks/usePrayers';
import { useSubmitPrayer } from '@/hooks/useSubmitPrayer';
import { isSupabaseConfigured } from '@/lib/supabase';

// Animation variants for staggered list entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function Home() {
  const { prayers, isLoading, updatePrayerLocally } = usePrayers();
  
  const { submitPrayer, isSubmitting, cooldownRemaining } = useSubmitPrayer({
    onSuccess: updatePrayerLocally
  });

  const { countPrayers, timePrayers, fastingMeals } = useMemo(() => {
    const countPrayers = prayers.filter(p => p.unit === 'count' && ![10, 11, 12, 13].includes(p.id));
    const timePrayers = prayers.filter(p => p.unit === 'minutes');
    const fastingMeals = prayers.filter(p => [10, 11, 12, 13].includes(p.id));
    return { countPrayers, timePrayers, fastingMeals };
  }, [prayers]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#020617] text-slate-50 selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* --- AESTHETIC BACKGROUND ELEMENTS --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-pink-600/5 blur-[100px]" />
      </div>

      {/* Demo mode banner */}
      {!isSupabaseConfigured() && (
        <motion.div 
          initial={{ y: -50 }} animate={{ y: 0 }}
          className="relative z-50 bg-amber-500/10 border-b border-amber-500/20 backdrop-blur-md px-4 py-2 text-center"
        >
          <p className="text-amber-200 text-xs font-medium flex items-center justify-center gap-2 uppercase tracking-widest">
            <ShieldCheck size={14} className="text-amber-500" />
            Demo Mode: Local Data
          </p>
        </motion.div>
      )}

      <Header />
      
      <div className="relative z-10">
        <StatsBar prayers={prayers} isLoading={isLoading} />
      </div>

      <main className="relative z-10 flex-1 px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto space-y-32">
          
          {/* --- SECTION: COUNT PRAYERS --- */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-semibold tracking-[0.2em] uppercase text-xs">
                  <span>Spiritual Arsenal</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Prayers & Devotions
                </h2>
              </div>
              <p className="text-slate-400 max-w-md text-sm md:text-base font-light leading-relaxed">
                Every prayer offered is a ripple in the spiritual realm. Join thousands in this collective intercession.
              </p>
            </div>
            
            <AnimatePresence mode="wait">
              {isLoading ? (
                <SkeletonGrid count={6} />
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {countPrayers.map(prayer => (
                    <motion.div key={prayer.id} variants={itemVariants}>
                      <CountPrayerCard
                        prayer={prayer}
                        onSubmit={submitPrayer}
                        cooldownRemaining={cooldownRemaining}
                        isSubmitting={isSubmitting}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* --- SECTION: TIME PRAYERS --- */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-semibold tracking-[0.2em] uppercase text-xs">
                  <Clock size={16} />
                  <span>Consecrated Moments</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Time in Prayer
                </h2>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <SkeletonGrid count={2} />
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {timePrayers.map(prayer => (
                    <motion.div key={prayer.id} variants={itemVariants}>
                      <TimePrayerCard
                        prayer={prayer}
                        onSubmit={submitPrayer}
                        cooldownRemaining={cooldownRemaining}
                        isSubmitting={isSubmitting}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* --- SECTION: FASTING CHART --- */}
          <section>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-semibold tracking-[0.2em] uppercase text-xs">
                  <span>Sacrificial Journey</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Fasting Tracker
                </h2>
              </div>
              <p className="text-slate-400 max-w-md text-sm md:text-base font-light leading-relaxed">
                Embrace self-denial through fasting. Track each meal skipped as an offering of your body and spirit.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="h-[400px] rounded-[2rem] bg-white/[0.03] border border-white/5 animate-pulse" />
              ) : (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  {fastingMeals.length > 0 && (
                    <FastingChartCard
                      meals={fastingMeals}
                      onSubmit={submitPrayer}
                      cooldownRemaining={cooldownRemaining}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* --- INFO SECTION --- */}
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-transparent group">
              <div className="relative rounded-[2.3rem] bg-slate-900/80 backdrop-blur-2xl p-8 md:p-14 overflow-hidden">
                {/* Subtle internal glow */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full group-hover:bg-purple-500/20 transition-colors duration-700" />
                
                <div className="relative flex flex-col items-center text-center space-y-8">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                    <Info className="text-purple-400" size={32} />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-3xl font-bold text-white tracking-tight">About Vitanova 2026</h3>
                    <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
                  </div>

                  <p className="text-slate-300 text-lg leading-relaxed font-light">
                    Vitanova is a curated three-day encounter organized by <span className="text-white font-medium">Jesus Youth seniors of SJCET</span>. 
                    It’s more than a program—it’s a spiritual rebirth through music, fellowship, and divine intimacy.
                  </p>
                  
                  <div className="pt-8 border-t border-white/5 w-full">
                    <p className="text-purple-300/60 text-sm italic tracking-wide">
                      This digital repository unifies our voices in a singular symphony of intercession.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/**
 * Refactored Skeleton Loader for better readability
 */
function SkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="h-[320px] rounded-[2rem] bg-white/[0.03] border border-white/5 animate-pulse overflow-hidden"
        >
          <div className="p-8 space-y-6">
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5" />
              <div className="space-y-2 flex-1 pt-2">
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-3 w-1/2 bg-white/5 rounded" />
              </div>
            </div>
            <div className="h-20 w-full bg-white/5 rounded-2xl" />
            <div className="h-12 w-full bg-white/10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}