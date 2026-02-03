'use client';

import { useState } from 'react';
import { Plus, Loader2, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { PrayerWithAggregate } from '@/lib/types';

interface CountPrayerCardProps {
  prayer: PrayerWithAggregate;
  onSubmit: (prayerId: number, value: number) => Promise<boolean>;
  cooldownRemaining: number;
  isSubmitting: boolean;
}

export default function CountPrayerCard({ 
  prayer, 
  onSubmit, 
  cooldownRemaining,
  isSubmitting 
}: CountPrayerCardProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [localTotal, setLocalTotal] = useState(prayer.total);

  // Update local total when prayer.total changes
  if (prayer.total !== localTotal && !showSuccess) {
    setLocalTotal(prayer.total);
  }

  // Dynamic icon loading
  const IconComponent = (Icons as Record<string, React.ComponentType<{ className?: string }>>)[prayer.icon_name] || Icons.Heart;

  const handleSubmit = async () => {
    if (cooldownRemaining > 0 || isSubmitting) return;
    
    const success = await onSubmit(prayer.id, 1);
    if (success) {
      setLocalTotal(prev => prev + 1);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
  };

  const isDisabled = cooldownRemaining > 0 || isSubmitting;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl 
      bg-gradient-to-br from-white/[0.07] to-white/[0.02]
      border border-white/10 
      p-6 transition-all duration-300
      hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10
      ${showSuccess ? 'success-flash' : ''}
    `}>
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Icon and title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/20">
            <IconComponent className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{prayer.name}</h3>
            <p className="text-xs text-gray-500">Count offered</p>
          </div>
        </div>
      </div>
      
      {/* Counter display */}
      <div className="mb-5">
        <p className={`text-4xl font-bold text-white transition-transform ${showSuccess ? 'counter-bump' : ''}`}>
          {localTotal.toLocaleString()}
        </p>
        <p className="text-sm text-gray-400 mt-1">prayers offered</p>
      </div>
      
      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isDisabled}
        className={`
          w-full py-3 px-4 rounded-xl font-medium text-sm
          flex items-center justify-center gap-2
          transition-all duration-200
          ${isDisabled 
            ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-500 hover:to-purple-400 active:scale-[0.98]'
          }
        `}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Offering...</span>
          </>
        ) : showSuccess ? (
          <>
            <Check className="w-4 h-4" />
            <span>Prayer Offered!</span>
          </>
        ) : cooldownRemaining > 0 ? (
          <span>Wait {cooldownRemaining}s</span>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span>Offer Prayer</span>
          </>
        )}
      </button>
    </div>
  );
}
