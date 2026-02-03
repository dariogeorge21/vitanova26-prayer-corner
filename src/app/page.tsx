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
    <div className="min-h-screen flex flex-col">
      {/* Demo mode banner */}
      {!isSupabaseConfigured() && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-center">
          <p className="text-amber-300 text-sm">
            🔧 Demo Mode - Configure Supabase environment variables to enable persistence
          </p>
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Stats Bar */}
      <StatsBar prayers={prayers} isLoading={isLoading} />

      {/* Main content */}
      <main className="flex-1 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Section: Count-based prayers */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Prayers & Devotions
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-white/10 rounded mb-1" />
                        <div className="h-3 w-16 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="h-10 w-20 bg-white/10 rounded mb-2" />
                    <div className="h-4 w-24 bg-white/5 rounded mb-4" />
                    <div className="h-12 w-full bg-white/10 rounded-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Time in Prayer
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10" />
                      <div className="flex-1">
                        <div className="h-5 w-24 bg-white/10 rounded mb-1" />
                        <div className="h-3 w-16 bg-white/5 rounded" />
                      </div>
                    </div>
                    <div className="h-10 w-20 bg-white/10 rounded mb-2" />
                    <div className="h-4 w-24 bg-white/5 rounded mb-4" />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-12 bg-white/10 rounded-xl" />
                      <div className="h-12 bg-white/10 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <section className="max-w-2xl mx-auto text-center py-8">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">
                About Vitanova 2026
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Vitanova is a special three-day program organized by Jesus Youth seniors of SJCET. 
                It is designed to help participants experience Jesus in a fresh, real, and unforgettable way, 
                blending deep spiritual encounters with joyful fellowship, music, activities, and community.
              </p>
              <p className="text-purple-300/80 text-sm italic">
                This prayer repository records and aggregates prayers offered by intercessors 
                for the success of this mega spiritual program.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
