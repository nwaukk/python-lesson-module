/**
 * Seeded Variant Generator & Scenario Register
 * Section 10.2: Generates parameterised variations of numbers, names, and contexts
 * so practice retries are varied yet deterministic, avoiding prompt recall.
 */

import { DifficultyTier, ExerciseData } from './types';

export const NIGERIAN_NAMES = ['Amara', 'Tunde', 'Chidi', 'Folake', 'Zainab', 'Emeka', 'Ngozi', 'Ibrahim', 'Kemi', 'Damilola'];
export const CITIES = ['Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Enugu', 'Calabar', 'Kaduna'];
export const PRODUCTS = ['Mangoes', 'Yams', 'Cashews', 'Palm Oil', 'Cocoa Beans', 'Plantains', 'Rice Bags'];
export const CURRENCIES = ['₦', '$', '£', '€'];

export const TIER_CONFIGS: Record<DifficultyTier, { label: string; badgeClass: string; icon: string }> = {
  foundation: { label: 'Foundation', badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: '🟢' },
  standard: { label: 'Standard', badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30', icon: '🔵' },
  challenge: { label: 'Challenge', badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: '🟡' },
  project: { label: 'Project', badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30', icon: '🟣' },
};

// Simple Mulberry32 pseudo-random number generator for seeded variance
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSeededVariant<T extends string | ExerciseData>(
  target: T,
  seed: number = 42
): T {
  const rng = mulberry32(seed);

  const name = NIGERIAN_NAMES[Math.floor(rng() * NIGERIAN_NAMES.length)];
  const city = CITIES[Math.floor(rng() * CITIES.length)];
  const product = PRODUCTS[Math.floor(rng() * PRODUCTS.length)];
  const quantity = Math.floor(rng() * 15) + 3;
  const unitPrice = (Math.floor(rng() * 20) + 5) * 100;
  const totalPrice = quantity * unitPrice;

  const replacements: Record<string, string | number> = {
    name,
    city,
    product,
    quantity,
    unitPrice,
    totalPrice,
    Amina: name,
    Lagos: city,
  };

  const applyReplacements = (str: string): string => {
    let res = str;
    Object.entries(replacements).forEach(([k, v]) => {
      res = res.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    });
    return res;
  };

  if (typeof target === 'string') {
    return applyReplacements(target) as T;
  }

  // Handle ExerciseData
  const exercise = target as ExerciseData;
  return {
    ...exercise,
    prompt: applyReplacements(exercise.prompt),
    contextScenario: exercise.contextScenario ? applyReplacements(exercise.contextScenario) : undefined,
  } as T;
}

export function getTierBadge(tier: DifficultyTier): {
  label: string;
  badgeClass: string;
  symbol: string;
} {
  const cfg = TIER_CONFIGS[tier] || TIER_CONFIGS.standard;
  return {
    label: cfg.label,
    badgeClass: cfg.badgeClass,
    symbol: cfg.icon,
  };
}
