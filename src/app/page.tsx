'use client';

import { useMemo } from 'react';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import CountPrayerCard from '@/components/CountPrayerCard';
import TimePrayerCard from '@/components/TimePrayerCard';
import Footer from '@/components/Footer';
import { usePrayers } from '@/hooks/usePrayers';
import { useSubmitPrayer } from '@/hooks/useSubmitPrayer';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Home() {
  const { prayers, isLoading, updatePrayerLocally } = usePrayers();
  
  const { submitPrayer, isSubmitting, cooldownRemaining } = useSubmitPrayer({
    onSuccess: updatePrayerLocally
  });

  // Separate prayers by type
  const { countPrayers, timePrayers } = useMemo(() => {
    const countPrayers = prayers.filter(p => p.unit === 'count');
    const timePrayers = prayers.filter(p => p.unit === 'minutes');
    return { countPrayers, timePrayers };
  }, [prayers]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Demo mode banner */}
      {!isSupabaseConfigured() && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-b border-amber-500/20 backdrop-blur-sm px-4 py-3 text-center">
          <p className="text-amber-200 text-sm font-medium flex items-center justify-center gap-2">
            <span className="text-base">🔧</span>
            <span>Demo Mode - Configure Supabase environment variables to enable persistence</span>
          </p>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Stats Bar */}
      <StatsBar prayers={prayers} isLoading={isLoading} />

      {/* Main content */}
      <main className="flex-1 px-4 py-8 pb-16">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Section: Count-based prayers */}
          <section>
            {/* Modern section header */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full blur-md opacity-50" />
                    <div className="relative w-1.5 h-10 bg-gradient-to-b from-purple-400 via-purple-500 to-pink-500 rounded-full shadow-lg" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-200 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
                    Prayers & Devotions
                  </h2>
                </div>
              </div>
              <p className="text-gray-300/80 text-sm md:text-base ml-8 font-light">
                Join us in intercession through these powerful prayers
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className="group relative rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent border border-white/10 p-8 backdrop-blur-xl shadow-2xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 shadow-xl animate-pulse" />
                        <div className="flex-1">
                          <div className="h-6 w-32 bg-gradient-to-r from-white/20 to-white/5 rounded-xl mb-2.5 animate-pulse" />
                          <div className="h-3.5 w-24 bg-gradient-to-r from-white/10 to-white/5 rounded-lg animate-pulse" />
                        </div>
                      </div>
                      <div className="h-14 w-28 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl mb-4 animate-pulse" />
                      <div className="h-4 w-32 bg-gradient-to-r from-white/10 to-white/5 rounded-lg mb-6 animate-pulse" />
                      <div className="h-16 w-full bg-gradient-to-r from-white/20 to-white/5 rounded-2xl animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {countPrayers.map(prayer => (
                  <CountPrayerCard
                    key={prayer.id}
                    prayer={prayer}
                    onSubmit={submitPrayer}
                    cooldownRemaining={cooldownRemaining}
                    isSubmitting={isSubmitting}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Section: Time-based prayers */}
          <section>
            {/* Modern section header */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full blur-md opacity-50" />
                    <div className="relative w-1.5 h-10 bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500 rounded-full shadow-lg" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent tracking-tight">
                    Time in Prayer
                  </h2>
                </div>
              </div>
              <p className="text-gray-300/80 text-sm md:text-base ml-8 font-light">
                Dedicate your time in communion with God
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div 
                    key={i} 
                    className="group relative rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent border border-white/10 p-8 backdrop-blur-xl shadow-2xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 shadow-xl animate-pulse" />
                        <div className="flex-1">
                          <div className="h-6 w-32 bg-gradient-to-r from-white/20 to-white/5 rounded-xl mb-2.5 animate-pulse" />
                          <div className="h-3.5 w-24 bg-gradient-to-r from-white/10 to-white/5 rounded-lg animate-pulse" />
                        </div>
                      </div>
                      <div className="h-14 w-28 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl mb-4 animate-pulse" />
                      <div className="h-4 w-32 bg-gradient-to-r from-white/10 to-white/5 rounded-lg mb-6 animate-pulse" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-16 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl animate-pulse" />
                        <div className="h-16 bg-gradient-to-r from-white/20 to-white/5 rounded-2xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {timePrayers.map(prayer => (
                  <TimePrayerCard
                    key={prayer.id}
                    prayer={prayer}
                    onSubmit={submitPrayer}
                    cooldownRemaining={cooldownRemaining}
                    isSubmitting={isSubmitting}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Info section */}
          <section className="max-w-3xl mx-auto text-center py-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-transparent border border-white/10 backdrop-blur-xl p-10 shadow-2xl">
                <div className="inline-block mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                    About Vitanova 2026
                  </h3>
                  <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-400/50 to-transparent mt-2" />
                </div>
                <p className="text-gray-300/90 text-base leading-relaxed mb-6 font-light">
                  Vitanova is a special three-day program organized by Jesus Youth seniors of SJCET. 
                  It is designed to help participants experience Jesus in a fresh, real, and unforgettable way, 
                  blending deep spiritual encounters with joyful fellowship, music, activities, and community.
                </p>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-purple-200/80 text-sm leading-relaxed font-light italic">
                    This prayer repository records and aggregates prayers offered by intercessors 
                    for the success of this mega spiritual program.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
