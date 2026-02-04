'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check, Coffee, UtensilsCrossed, Cake, Utensils, Zap } from 'lucide-react';
import { PrayerWithAggregate } from '@/lib/types';

interface FastingChartCardProps {
  meals: PrayerWithAggregate[];
  onSubmit: (prayerId: number, value: number) => Promise<boolean>;
  cooldownRemaining: number;
  isSubmitting: boolean;
}

const MEAL_CONFIG: Record<string, { icon: any; color: string; glow: string }> = {
  'Breakfast': { icon: Coffee, color: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/20' },
  'Lunch': { icon: UtensilsCrossed, color: 'from-rose-500 to-pink-500', glow: 'shadow-rose-500/20' },
  'Tea & Snacks': { icon: Cake, color: 'from-amber-400 to-orange-400', glow: 'shadow-amber-500/20' },
  'Dinner': { icon: Utensils, color: 'from-red-500 to-rose-600', glow: 'shadow-red-500/20' },
};

export default function FastingChartCard({
  meals,
  onSubmit,
  cooldownRemaining,
  isSubmitting,
}: FastingChartCardProps) {
  const [showSuccess, setShowSuccess] = useState<Record<number, boolean>>({});
  const [localTotals, setLocalTotals] = useState<Record<number, number>>(
    meals.reduce((acc, meal) => ({ ...acc, [meal.id]: meal.total }), {})
  );

  useEffect(() => {
    setLocalTotals(meals.reduce((acc, meal) => ({ ...acc, [meal.id]: meal.total }), {}));
  }, [meals]);

  const handleMealSubmit = async (mealId: number) => {
    if (cooldownRemaining > 0 || isSubmitting) return;

    const success = await onSubmit(mealId, 1);
    if (success) {
      setLocalTotals((prev) => ({ ...prev, [mealId]: (prev[mealId] || 0) + 1 }));
      setShowSuccess((prev) => ({ ...prev, [mealId]: true }));
      setTimeout(() => setShowSuccess((prev) => ({ ...prev, [mealId]: false })), 2000);
    }
  };

  const isDisabled = cooldownRemaining > 0 || isSubmitting;

  return (
    <section className="relative group">
      {/* Decorative Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />

      <div className="relative overflow-hidden rounded-[2.3rem] bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-8 md:p-10 shadow-2xl">
        
        {/* Background Mesh */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold tracking-[0.2em] uppercase text-[10px]">
              <Zap size={14} fill="currentColor" />
              <span>Sacrificial Devotion</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Fasting Chart</h3>
            <p className="text-slate-400 font-light text-sm max-w-xs">
              Every meal skipped is a spiritual hunger for God's glory.
            </p>
          </div>
          
          {cooldownRemaining > 0 && (
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Cooldown: <span className="text-rose-400">{cooldownRemaining}s</span>
              </span>
            </div>
          )}
        </div>

        {/* Meal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {meals.map((meal) => {
            const config = MEAL_CONFIG[meal.name] || MEAL_CONFIG['Dinner'];
            const Icon = config.icon;
            const isSuccess = showSuccess[meal.id];

            return (
              <div key={meal.id} className="relative flex flex-col gap-4">
                {/* Main Tile */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className={`
                    relative p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden
                    ${isSuccess ? 'border-green-500/50 bg-green-500/10' : 'border-white/5 bg-white/[0.03]'}
                  `}
                >
                  {/* Subtle Icon Background Watermark */}
                  <Icon className="absolute -right-2 -bottom-2 w-16 h-16 text-white/[0.03] rotate-12" />

                  <div className="relative flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${config.color} ${config.glow} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="text-center">
                      <motion.p 
                        key={localTotals[meal.id]}
                        initial={{ scale: 1.2, color: '#fff' }}
                        animate={{ scale: 1, color: isSuccess ? '#4ade80' : '#fff' }}
                        className="text-4xl font-black tracking-tighter"
                      >
                        {(localTotals[meal.id] || 0).toLocaleString()}
                      </motion.p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">
                        Total Fasts
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Action */}
                <button
                  onClick={() => handleMealSubmit(meal.id)}
                  disabled={isDisabled}
                  className="group relative w-full h-12 rounded-xl overflow-hidden transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  
                  <span className="relative flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Loader2 className="w-3 h-3 animate-spin" />
                        </motion.span>
                      ) : isSuccess ? (
                        <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                          <Check size={14} strokeWidth={3} /> Done
                        </motion.span>
                      ) : (
                        <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          + {meal.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}