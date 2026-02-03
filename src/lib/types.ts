export interface PrayerType {
  id: number;
  name: string;
  unit: 'count' | 'minutes';
  icon_name: string;
  display_order: number;
}

export interface PrayerLog {
  id: string;
  prayer_type_id: number;
  value: number;
  device_hash: string;
  created_at: string;
}

export interface PrayerAggregate {
  prayer_type_id: number;
  total: number;
}

export interface PrayerWithAggregate extends PrayerType {
  total: number;
}

export interface SubmitPrayerResult {
  success: boolean;
  message: string;
  cooldownRemaining?: number;
}

export const PRAYER_TYPES: PrayerType[] = [
  { id: 1, name: 'Holy Mass', unit: 'count', icon_name: 'Church', display_order: 1 },
  { id: 2, name: 'Rosary', unit: 'count', icon_name: 'CircleDot', display_order: 2 },
  { id: 3, name: 'Adoration', unit: 'minutes', icon_name: 'Sun', display_order: 3 },
  { id: 4, name: 'Word of God', unit: 'minutes', icon_name: 'BookOpen', display_order: 4 },
  { id: 5, name: 'Memorare', unit: 'count', icon_name: 'Heart', display_order: 5 },
  { id: 6, name: 'Creed', unit: 'count', icon_name: 'Shield', display_order: 6 },
  { id: 7, name: 'Hail Mary', unit: 'count', icon_name: 'Star', display_order: 7 },
  { id: 8, name: 'Way of the Cross', unit: 'count', icon_name: 'Cross', display_order: 8 },
  { id: 9, name: 'Novena of St. Joseph', unit: 'count', icon_name: 'Flower2', display_order: 9 },
];

export const COOLDOWN_SECONDS = 5;
