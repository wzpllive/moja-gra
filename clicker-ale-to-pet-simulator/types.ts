
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  level: number;
  maxLevel?: number;
  worldReq?: number; // 1 to 10
  effect?: (state: GameState) => number; // Function to calculate current effect value
  type: 'click' | 'auto' | 'multiplier' | 'chance' | 'special';
}

export interface Pet {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical' | 'Secret';
  multiplier: number;
  world: number;
  image: string; // URL to image
}

export interface EggTier {
  id: number; // 0, 1, 2
  name: string;
  costMult: number; // Multiplier relative to base world egg cost
  pets: { pet: Pet, chance: number }[];
  image: string; // Icon for the egg
  color: string; // CSS color class for border/bg
}

export type PetVariant = 'normal' | 'shiny' | 'golden' | 'rainbow' | 'dark_matter';

export interface OwnedPet extends Pet {
  instanceId: string; // Unique ID for each owned instance
  obtainedAt: number;
  variant: PetVariant; // Variant of the pet
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  reward: number;
  condition: (state: GameState) => boolean;
}

export interface World {
  id: number;
  name: string;
  cost: number;
  image: string; // URL to image
  baseClickMult: number;
  description: string;
  currency: string; // Nominative (Mianownik): Złoto
  currencyGenitive: string; // Genitive (Dopełniacz): Złota (używane przy ilościach)
}

export interface GameSettings {
  sfxVolume: number; // 0.0 to 1.0
  musicVolume: number; // 0.0 to 1.0
  theme: 'light' | 'dark';
}

export interface GameState {
  points: number;
  totalClicks: number; // Global lifetime clicks (for stats/achievements)
  worldClicks: Record<number, number>; // Clicks specific to each world (for visual progression)
  lifetimePoints: number; // For achievements
  
  // Upgrades
  upgrades: Record<string, number>; // id -> level

  // Multipliers & Status
  multiActive: boolean; // One-time x2 multi
  
  // Rebirth
  rebirthPoints: number;
  rebirthsPerformed: number;
  rebirthUpgrades: Record<string, number>; // New: Shop for RP
  
  // Pets
  ownedPets: OwnedPet[];
  equippedPets: string[]; // instanceIds
  discoveredPets: string[]; // List of ALL pet IDs ever found (for Collection)
  autoDeleteFlags: string[]; // List of pet IDs to auto-delete
  isAutoHatching: boolean; // New: Auto hatch active state
  
  // Worlds
  currentWorld: number;
  unlockedWorlds: number[];
  worldStates: Record<number, Partial<GameState>>; // Snapshot of state per world if needed

  // Settings
  settings: GameSettings;

  // Cheats
  cheatUnlocked: boolean;

  // Timestamps
  lastSaveTime: number;
  startTime: number;
  
  // Combo
  comboActive: boolean;
  comboStartTime: number;
  comboDuration: number;
  comboMultiplier: number;
}