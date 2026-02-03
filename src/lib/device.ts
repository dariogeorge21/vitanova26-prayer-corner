const DEVICE_HASH_KEY = 'vitanova_device_hash';

/**
 * Generate a unique device hash using crypto API
 */
function generateHash(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get or create a persistent device hash
 * Uses localStorage to persist across sessions
 */
export function getDeviceHash(): string {
  if (typeof window === 'undefined') {
    return 'server-side';
  }

  let hash = localStorage.getItem(DEVICE_HASH_KEY);
  
  if (!hash) {
    hash = generateHash();
    localStorage.setItem(DEVICE_HASH_KEY, hash);
  }
  
  return hash;
}

/**
 * Store the last submission time for cooldown tracking
 */
const LAST_SUBMISSION_KEY = 'vitanova_last_submission';

export function getLastSubmissionTime(): number {
  if (typeof window === 'undefined') {
    return 0;
  }
  
  const stored = localStorage.getItem(LAST_SUBMISSION_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function setLastSubmissionTime(time: number): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  localStorage.setItem(LAST_SUBMISSION_KEY, time.toString());
}

export function getCooldownRemaining(cooldownSeconds: number): number {
  const lastSubmission = getLastSubmissionTime();
  const now = Date.now();
  const elapsed = (now - lastSubmission) / 1000;
  const remaining = cooldownSeconds - elapsed;
  
  return remaining > 0 ? Math.ceil(remaining) : 0;
}
