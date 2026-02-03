'use client';

import { useState } from 'react';
import { Clock, Loader2, Check } from 'lucide-react';
import * as Icons from 'lucide-react';
import { PrayerWithAggregate } from '@/lib/types';

interface TimePrayerCardProps {
  prayer: PrayerWithAggregate;
  onSubmit: (prayerId: number, value: number) => Promise<boolean>;
  cooldownRemaining: number;
  isSubmitting: boolean;
}

export default function TimePrayerCard({ 
  prayer, 
  onSubmit, 
  cooldownRemaining,
  isSubmitting 
}: TimePrayerCardProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAdded, setLastAdded] = useState<number | null>(null);
  const [localTotal, setLocalTotal] = useState(prayer.total);

  // Update local total when prayer.total changes
  if (prayer.total !== localTotal && !showSuccess) {
    setLocalTotal(prayer.total);
  }

  // Dynamic icon loading
  const IconComponent = ((Icons as unknown) as Record<string, React.ComponentType<{ className?: string }>>)[prayer.icon_name] || Icons.Clock;

  const handleSubmit = async (minutes: number) => {
    if (cooldownRemaining > 0 || isSubmitting) return;
    
    const success = await onSubmit(prayer.id, minutes);
    if (success) {
      setLocalTotal(prev => prev + minutes);
      setLastAdded(minutes);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setLastAdded(null);
      }, 1500);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (mins === 0) return `${hours}h`;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  const isDisabled = cooldownRemaining > 0 || isSubmitting;

  const timeButtons = [
    { value: 5, label: '+5 min' },
    { value: 30, label: '+30 min' },
  ];

  return (
    <div className={`
      relative overflow-hidden rounded-2xl 
      bg-gradient-to-br from-white/[0.07] to-white/[0.02]
      border border-white/10 
      p-6 transition-all duration-300
      hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10
      ${showSuccess ? 'success-flash' : ''}
    `}>
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Icon and title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/20">
            <IconComponent className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-lg">{prayer.name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Time spent
            </p>
          </div>
        </div>
      </div>
      
      {/* Time display */}
      <div className="mb-5">
        <p className={`text-4xl font-bold text-white transition-transform ${showSuccess ? 'counter-bump' : ''}`}>
          {formatTime(localTotal)}
        </p>
        <p className="text-sm text-gray-400 mt-1">total time offered</p>
      </div>
      
      {/* Status message */}
      {showSuccess && lastAdded && (
        <div className="mb-3 flex items-center justify-center gap-2 text-green-400 text-sm">
          <Check className="w-4 h-4" />
          <span>+{lastAdded} minutes offered!</span>
        </div>
      )}
      
      {/* Time buttons */}
      <div className="grid grid-cols-2 gap-2">
        {timeButtons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => handleSubmit(btn.value)}
            disabled={isDisabled}
            className={`
              py-3 px-4 rounded-xl font-medium text-sm
              flex items-center justify-center gap-2
              transition-all duration-200
              ${isDisabled 
                ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:from-amber-500 hover:to-amber-400 active:scale-[0.98]'
              }
            `}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : cooldownRemaining > 0 ? (
              <span>{cooldownRemaining}s</span>
            ) : (
              <span>{btn.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
