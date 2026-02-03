'use client';

import { Heart, TrendingUp } from 'lucide-react';
import { PrayerWithAggregate } from '@/lib/types';

interface StatsBarProps {
  prayers: PrayerWithAggregate[];
  isLoading: boolean;
}

export default function StatsBar({ prayers, isLoading }: StatsBarProps) {
  const totalPrayers = prayers.reduce((sum, p) => {
    // For count-based prayers, add the count
    // For time-based prayers, we count each submission as 1 prayer
    return sum + (p.unit === 'count' ? p.total : Math.ceil(p.total / 30)); // Approx 1 prayer per 30 mins
  }, 0);

  const totalMinutes = prayers
    .filter(p => p.unit === 'minutes')
    .reduce((sum, p) => sum + p.total, 0);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="mb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-amber-900/40 border border-white/10 p-6 md:p-8">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <h2 className="text-lg font-medium text-gray-200">
                Collective Intercession
              </h2>
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            </div>
            
            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {/* Total prayers */}
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Total Prayers</span>
                </div>
                {isLoading ? (
                  <div className="h-8 w-20 mx-auto bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl md:text-3xl font-bold text-white">
                    {formatNumber(totalPrayers)}
                  </p>
                )}
              </div>
              
              {/* Time in prayer */}
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Time in Prayer</span>
                </div>
                {isLoading ? (
                  <div className="h-8 w-20 mx-auto bg-white/10 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl md:text-3xl font-bold text-amber-400">
                    {formatTime(totalMinutes)}
                  </p>
                )}
              </div>
              
              {/* Prayer warriors */}
              <div className="col-span-2 md:col-span-1 text-center p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Prayer Types</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-purple-400">
                  {prayers.filter(p => p.total > 0).length} / {prayers.length}
                </p>
              </div>
            </div>
            
            {/* Encouragement text */}
            <p className="text-center text-gray-400 text-sm mt-6">
              Every prayer offered brings us closer to God&apos;s grace for Vitanova 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
