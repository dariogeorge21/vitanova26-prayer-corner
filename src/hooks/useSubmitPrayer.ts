'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getDeviceHash, setLastSubmissionTime, getCooldownRemaining } from '@/lib/device';
import { COOLDOWN_SECONDS } from '@/lib/types';

interface UseSubmitPrayerOptions {
  onSuccess?: (prayerId: number, value: number) => void;
}

export function useSubmitPrayer(options?: UseSubmitPrayerOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  // Update cooldown timer
  useEffect(() => {
    const updateCooldown = () => {
      const remaining = getCooldownRemaining(COOLDOWN_SECONDS);
      setCooldownRemaining(remaining);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 100);

    return () => clearInterval(interval);
  }, []);

  const submitPrayer = useCallback(async (prayerId: number, value: number): Promise<boolean> => {
    // Check cooldown
    const remaining = getCooldownRemaining(COOLDOWN_SECONDS);
    if (remaining > 0) {
      setLastError(`Please wait ${remaining} seconds`);
      return false;
    }

    setIsSubmitting(true);
    setLastError(null);

    try {
      // If Supabase is not configured, simulate success
      if (!isSupabaseConfigured()) {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        setLastSubmissionTime(Date.now());
        options?.onSuccess?.(prayerId, value);
        return true;
      }

      const deviceHash = getDeviceHash();

      // Check server-side cooldown (double-check)
      const { data: recentLogs, error: checkError } = await supabase
        .from('prayer_logs')
        .select('created_at')
        .eq('device_hash', deviceHash)
        .order('created_at', { ascending: false })
        .limit(1);

      if (checkError) throw checkError;

      if (recentLogs && recentLogs.length > 0) {
        const lastLogTime = new Date(recentLogs[0].created_at).getTime();
        const elapsed = (Date.now() - lastLogTime) / 1000;
        if (elapsed < COOLDOWN_SECONDS) {
          setLastError(`Please wait ${Math.ceil(COOLDOWN_SECONDS - elapsed)} seconds`);
          return false;
        }
      }

      // Insert the prayer log
      const { error: insertError } = await supabase
        .from('prayer_logs')
        .insert({
          prayer_type_id: prayerId,
          value: value,
          device_hash: deviceHash
        });

      if (insertError) throw insertError;

      // Update local cooldown
      setLastSubmissionTime(Date.now());
      options?.onSuccess?.(prayerId, value);
      
      return true;
    } catch (err) {
      console.error('Error submitting prayer:', err);
      setLastError('Failed to submit prayer. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [options]);

  return {
    submitPrayer,
    isSubmitting,
    cooldownRemaining,
    lastError,
    clearError: () => setLastError(null)
  };
}
