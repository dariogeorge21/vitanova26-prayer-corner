'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PrayerWithAggregate, PRAYER_TYPES } from '@/lib/types';

// Demo data for when Supabase is not configured
const getDemoData = (): PrayerWithAggregate[] => {
  return PRAYER_TYPES.map(prayer => ({
    ...prayer,
    total: Math.floor(Math.random() * 100) + 10
  }));
};

export function usePrayers() {
  const [prayers, setPrayers] = useState<PrayerWithAggregate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayers = useCallback(async () => {
    // If Supabase is not configured, use demo data
    if (!isSupabaseConfigured()) {
      setPrayers(getDemoData());
      setIsLoading(false);
      return;
    }

    try {
      // Fetch aggregates from the view
      const { data: aggregates, error: aggError } = await supabase
        .from('prayer_aggregates')
        .select('*');

      if (aggError) throw aggError;

      // Merge with prayer types
      const prayersWithTotals: PrayerWithAggregate[] = PRAYER_TYPES.map(prayer => {
        const aggregate = aggregates?.find(a => a.prayer_type_id === prayer.id);
        return {
          ...prayer,
          total: aggregate?.total || 0
        };
      });

      setPrayers(prayersWithTotals);
      setError(null);
    } catch (err) {
      console.error('Error fetching prayers:', err);
      setError('Failed to load prayer data');
      // Fallback to demo data on error
      setPrayers(getDemoData());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPrayers();
  }, [fetchPrayers]);

  // Set up real-time subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('prayer_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'prayer_logs'
        },
        () => {
          // Refetch when new prayer is logged
          fetchPrayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPrayers]);

  // Update local state optimistically
  const updatePrayerLocally = useCallback((prayerId: number, value: number) => {
    setPrayers(prev => prev.map(p => 
      p.id === prayerId 
        ? { ...p, total: p.total + value }
        : p
    ));
  }, []);

  return {
    prayers,
    isLoading,
    error,
    refetch: fetchPrayers,
    updatePrayerLocally
  };
}
