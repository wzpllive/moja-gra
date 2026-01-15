import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, OwnedPet, Pet, Upgrade, PetVariant } from './types';
import { INITIAL_STATE, UPGRADES_LIST, REBIRTH_UPGRADES_LIST, WORLDS, WORLD_EGGS, ACHIEVEMENTS, PET_SLOTS, MAX_PET_INVENTORY, SOUNDS, MAX_CPS } from './constants';
import Sidebar from './components/Sidebar';
import ClickZone from './components/ClickZone';
import UpgradesTab from './components/panels/UpgradesTab';
import PetsTab from './components/panels/PetsTab';
import WorldsTab from './components/panels/WorldsTab';
import RebirthTab from './components/panels/RebirthTab';
import AchievementsTab from './components/panels/AchievementsTab';
import SettingsTab from './components/panels/SettingsTab';
import DangerTab from './components/panels/DangerTab';
import HatchAnimation from './components/HatchAnimation';
import { Toaster, toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { Globe, ArrowRightCircle } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<string>('clicker');
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; x: number; y: number; text: string }[]>([]);
  
  // Hatching State
  const [hatchingPets, setHatchingPets] = useState<Pet[]>([]);
  const [isHatching, setIsHatching] = useState(false);
  const [hatchingTier, setHatchingTier] = useState<number>(0); // Store which egg tier is being opened

  // Anti-Cheat / Performance Refs
  const frameRef = useRef<number>(0);
  const lastTickRef = useRef<number>(Date.now());
  const clickHistoryRef = useRef<number[]>([]); // Timestamp of last clicks
  const hasNotifiedW2 = useRef<boolean>(false);
  const processingHatchRef = useRef<boolean>(false); // Mutex for finishHatching
  const lastHatchConfigRef = useRef<{ amount: number, tierId: number } | null>(null); // To remember auto-hatch config
  
  // Upgrades Sidebar State (collapsed/expanded)
  const [upgradesCollapsed, setUpgradesCollapsed] = useState(false);

  // Refs for saving logic
  const latestGameStateRef = useRef<GameState>(gameState);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sound helper function
  const playSound = useCallback((url: string) => {
    if (!latestGameStateRef.current.settings) return;
    const vol = latestGameStateRef.current.settings.sfxVolume;
    if (vol <= 0) return;

    const audio = new Audio(url);
    audio.volume = vol;
    audio.currentTime = 0;
    audio.play().catch(e => {
        // Ignore auto-play errors
    });
  }, []);

  // Global UI Click Sound Listener
  useEffect(() => {
    const handleUiClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('[role="button"]') || target.closest('a')) {
         playSound(SOUNDS.UI_CLICK);
      }
    };
    window.addEventListener('click', handleUiClick);
    return () => window.removeEventListener('click', handleUiClick);
  }, [playSound]);

  // Sync ref with state
  useEffect(() => {
    latestGameStateRef.current = gameState;
  }, [gameState]);

  // Load Game
  useEffect(() => {
    const saved = localStorage.getItem('diamondClickerV2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mergedState = { ...INITIAL_STATE, ...parsed };
        if (!mergedState.rebirthUpgrades) mergedState.rebirthUpgrades = {};
        if (!mergedState.autoDeleteFlags) mergedState.autoDeleteFlags = [];
        if (mergedState.isAutoHatching === undefined) mergedState.isAutoHatching = false;
        
        // Settings migration
        if (!mergedState.settings) mergedState.settings = { sfxVolume: 0.5, musicVolume: 0.5, theme: 'dark' };
        if (!mergedState.settings.theme) mergedState.settings.theme = 'dark';

        // Data Migration for variants
        if (mergedState.ownedPets) {
            mergedState.ownedPets = mergedState.ownedPets.map((p: any) => ({
                ...p,
                variant: p.variant || 'normal'
            }));
        }

        // Migration for Collection (Populate discoveredPets from existing inventory if empty)
        if (!mergedState.discoveredPets) {
            mergedState.discoveredPets = Array.from(new Set(mergedState.ownedPets.map((p: any) => p.id)));
        }

        // Migration for World Clicks
        if (!mergedState.worldClicks) {
            mergedState.worldClicks = {};
        }

        setGameState(mergedState);
        toast.success('Gra wczytana!');
      } catch (e) {
        console.error("Failed to load save", e);
      }
    }
  }, []);

  // Save Game Logic
  useEffect(() => {
    saveIntervalRef.current = setInterval(() => {
        localStorage.setItem('diamondClickerV2', JSON.stringify(latestGameStateRef.current));
    }, 30000);

    const handleBeforeUnload = () => {
        localStorage.setItem('diamondClickerV2', JSON.stringify(latestGameStateRef.current));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Get current world data
  const currentWorldData = WORLDS.find(w => w.id === gameState.currentWorld) || WORLDS[0];
  const currencyName = currentWorldData.currency;
  const currencyGenitive = currentWorldData.currencyGenitive;

  // Notification for World 2
  useEffect(() => {
      if (gameState.unlockedWorlds.includes(2)) return;
      
      const w2Cost = 2_500_000_000_000; 
      if (gameState.points >= w2Cost && !hasNotifiedW2.current) {
          hasNotifiedW2.current = true;
          toast((t) => (
             <div onClick={() => { setActiveTab('worlds'); toast.dismiss(t.id); }} className="cursor-pointer flex items-center gap-2">
                <Globe className="text-blue-400" />
                <div>
                   <div className="font-bold">Nowy Świat Dostępny!</div>
                   <div className="text-xs">Masz wystarczająco Złota na Kosmos!</div>
                </div>
             </div>
          ), { duration: 6000, style: { border: '1px solid #60a5fa', background: '#1e3a8a', color: '#fff' }});
      }
  }, [gameState.points, gameState.unlockedWorlds]);

  // Game Loop (Auto Clickers)
  useEffect(() => {
    const loop = () => {
      const now = Date.now();
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      if (dt > 0) {
        const autoRate = calculateAutoRate(latestGameStateRef.current);
        if (autoRate > 0) {
          addPoints(autoRate * dt, false); 
        }
      }
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState]); 

  // --- ROBUST AUTO HATCH LOOP ---
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (gameState.isAutoHatching && !isHatching) {
        // Wait briefly for the previous modal to unmount fully
        timeoutId = setTimeout(() => {
            const currentRef = latestGameStateRef.current;
            // Double check strict conditions before firing
            if (currentRef.isAutoHatching && !isHatching && !processingHatchRef.current) {
                 const config = lastHatchConfigRef.current;
                 if (config) {
                     hatchEgg(config.amount, config.tierId, false, true);
                 } else {
                     // If config is missing, stop auto hatch
                     setGameState(prev => ({ ...prev, isAutoHatching: false }));
                 }
            }
        }, 300); // 300ms delay between hatches. MUST be longer than the finishHatching lock release (50ms).
    }
    
    return () => clearTimeout(timeoutId);
  }, [gameState.isAutoHatching, isHatching]);

  // --- Helper Functions ---

  const getWorldMultiplier = (worldId: number) => {
    return worldId === 1 ? 1.0 : Math.pow(2.5, worldId - 1); 
  };

  const getMaxPetSlots = useCallback(() => {
      let slots = PET_SLOTS;
      if ((gameState.rebirthUpgrades['more_pets_1'] || 0) > 0) slots += 3;
      if ((gameState.rebirthUpgrades['more_pets_2'] || 0) > 0) slots += 2;
      return slots;
  }, [gameState.rebirthUpgrades]);

  const getUpgradeCost = (upgrade: Upgrade, level: number, worldId: number) => {
    const worldMult = getWorldMultiplier(worldId);
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level) * worldMult);
  };
  
  const getRebirthUpgradeCost = (upgrade: Upgrade, level: number) => {
     return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
  };

  const getRebirthCost = (currentRP: number, amount: number) => {
     let totalCost = 0;
     for(let i=0; i<amount; i++) {
        totalCost += Math.floor(100_000_000 * Math.pow(1.8, currentRP + i));
     }
     return totalCost;
  };

  // Base Egg Cost (Tier 0)
  const getBaseEggCost = (w: number) => {
    switch(w) {
        case 1: return 20000;
        case 2: return 100_000_000; 
        case 3: return 1_000_000_000_000; 
        case 4: return 500_000_000_000_000; 
        case 5: return 50_000_000_000_000_000_000; 
        case 6: return 500_000_000_000_000_000_000_000; 
        case 7: return 10_000_000_000_000_000_000_000_000; 
        case 8: return 50_000_000_000_000_000_000_000_000_000; 
        case 9: return 100_000_000_000_000_000_000_000_000_000_000; 
        case 10: return 1_000_000_000_000_000_000_000_000_000_000_000; 
        default: return 99999999999999999999;
    }
  };

  const getEggCost = (w: number, tierId: number = 0) => {
      const base = getBaseEggCost(w);
      const eggInfo = WORLD_EGGS[w]?.find(e => e.id === tierId);
      return base * (eggInfo?.costMult || 1);
  };

  const calculateClickValue = (state: GameState, includeRng: boolean = true): { total: number, isCrit: boolean, multText: string } => {
    let base = 1.0; 

    // Standard Upgrades
    if (state.upgrades['click_power']) base += state.upgrades['click_power'] * 1; 
    if (state.upgrades['mega_click']) base += state.upgrades['mega_click'] * 5;
    if (state.upgrades['click_frenzy']) base += state.upgrades['click_frenzy'] * 10;
    if (state.upgrades['reinforced_handle']) base += state.upgrades['reinforced_handle'] * 15;

    let multiplier = 1.0;
    
    // Multipliers
    const polishLvl = state.upgrades['gem_polish'] || 0;
    if (polishLvl > 0) multiplier *= Math.pow(1.2, polishLvl);

    if (state.multiActive) multiplier *= 2.0;
    
    // REBIRTH POINTS (Now GLOBAL)
    const rp = state.rebirthPoints;
    const rebirthMult = rp > 0 ? 1.10 + (rp - 1) * 0.05 : 1.0;
    multiplier *= rebirthMult;
    
    const divineLvl = state.rebirthUpgrades?.['divine_power'] || 0;
    if (divineLvl > 0) multiplier *= (1 + divineLvl * 0.5);

    const equippedPets = state.ownedPets.filter(p => state.equippedPets.includes(p.instanceId));
    
    // --- ADDITIVE PET MULTIPLIER LOGIC ---
    let petsSum = 0;
    equippedPets.forEach(p => {
       let effective = p.multiplier;
       if (p.world !== state.currentWorld) {
           effective = effective / 3;
       }
       petsSum += effective;
    });

    if (petsSum > 0) {
        multiplier *= petsSum;
    }

    let isCrit = false;
    let multText = "";
    
    if (includeRng) {
       const critLvl = state.upgrades['crit_strike'] || 0;
       const chance = Math.min(critLvl * 1, 50); 
       if (Math.random() * 100 < chance) {
         multiplier *= 5;
         isCrit = true;
         multText = "CRIT x5!";
       }
       
       if (!isCrit) {
          const burstLvl = state.upgrades['burst_click'] || 0;
          if (Math.random() * 100 < Math.min(burstLvl * 5, 100)) {
            multiplier *= 3;
            isCrit = true;
            multText = "Burst x3!";
          }
        }
        
        if (!isCrit) {
          const luckyLvl = state.upgrades['lucky_click'] || 0;
          if (Math.random() * 100 < Math.min(luckyLvl * 10, 100)) {
            multiplier *= 2;
            isCrit = true;
            multText = "Lucky x2!";
          }
        }
    }

    return { total: base * multiplier, isCrit, multText };
  };

  const calculateAutoRate = (state: GameState): number => {
    // Nerfed Auto Clicker: 2% per level instead of 5%
    const autoLevel = state.upgrades['auto_clicker_percent'] || 0;
    if (autoLevel === 0) return 0;
    const { total } = calculateClickValue(state, false);
    const percentage = autoLevel * 0.02; // Reduced from 0.05
    return total * percentage;
  };

  const addPoints = (amount: number, showFloat = false, x = 0, y = 0, text = "") => {
    setGameState(prev => {
      const newPoints = prev.points + amount;
      const newLifetime = prev.lifetimePoints + amount;
      return {
        ...prev,
        points: newPoints,
        lifetimePoints: newLifetime
      };
    });

    if (showFloat) {
      const id = Date.now() + Math.random();
      setFloatingTexts(prev => [...prev, { id, x, y, text: text || `+${formatNumber(amount)}` }]);
      setTimeout(() => {
        setFloatingTexts(prev => prev.filter(t => t.id !== id));
      }, 1000);
    }
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // ANTI-CHEAT: CPS Limit Check
    const now = Date.now();
    // Filter clicks older than 1 second
    clickHistoryRef.current = clickHistoryRef.current.filter(t => now - t < 1000);
    
    // Check if CPS exceeds limit
    if (clickHistoryRef.current.length >= MAX_CPS) {
        toast.error("Ostudź emocje! Zbyt szybkie klikanie.", { id: 'cps-warning', duration: 1000 });
        return; // Block the click
    }
    
    // Record click
    clickHistoryRef.current.push(now);

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const { total, isCrit, multText } = calculateClickValue(gameState);
    
    setGameState(prev => ({
       ...prev,
       totalClicks: prev.totalClicks + 1,
       worldClicks: {
           ...prev.worldClicks,
           [prev.currentWorld]: (prev.worldClicks[prev.currentWorld] || 0) + 1
       }
    }));
    
    addPoints(total, true, clientX, clientY, multText ? `+${formatNumber(total)} (${multText})` : `+${formatNumber(total)}`);
  };

  const buyUpgrade = (upgradeId: string) => {
     const upgrade = UPGRADES_LIST.find(u => u.id === upgradeId);
     if (!upgrade) return;
     
     const currentLevel = gameState.upgrades[upgradeId] || 0;
     if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return;

     const cost = getUpgradeCost(upgrade, currentLevel, gameState.currentWorld);
     if (gameState.points >= cost) {
       playSound(SOUNDS.UI_BUY);
       setGameState(prev => ({
         ...prev,
         points: prev.points - cost,
         upgrades: {
           ...prev.upgrades,
           [upgradeId]: currentLevel + 1
         }
       }));
       toast.success(`Kupiono ${upgrade.name}!`);
     } else {
       toast.error(`Potrzebujesz ${formatNumber(cost)} ${currencyGenitive}!`);
     }
  };

  const buyRebirthUpgrade = (upgradeId: string) => {
      const upgrade = REBIRTH_UPGRADES_LIST.find(u => u.id === upgradeId);
      if (!upgrade) return;

      const currentLevel = gameState.rebirthUpgrades[upgradeId] || 0;
      if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return;

      const cost = getRebirthUpgradeCost(upgrade, currentLevel);
      if (gameState.rebirthPoints >= cost) {
          playSound(SOUNDS.UI_BUY);
          setGameState(prev => ({
              ...prev,
              rebirthPoints: prev.rebirthPoints - cost,
              rebirthUpgrades: {
                  ...prev.rebirthUpgrades,
                  [upgradeId]: currentLevel + 1
              }
          }));
          toast.success(`Ulepszono: ${upgrade.name}!`);
      } else {
          toast.error("Za mało Punktów Odrodzenia (RP)!");
      }
  };

  const toggleAutoHatch = (tierId: number) => {
      const isUnlocked = (gameState.rebirthUpgrades['unlock_auto_hatch'] || 0) > 0;
      if (!isUnlocked) {
          toast.error("Musisz odblokować Auto Otwieranie w Sklepie Odrodzeń!");
          return;
      }
      
      const newState = !gameState.isAutoHatching;
      
      if (newState) {
          const tripleUnlocked = (gameState.rebirthUpgrades['unlock_triple_egg'] || 0) > 0;
          const amountToHatch = tripleUnlocked ? 3 : 1;
          
          // IMPORTANT: Capture the specific egg tier clicked by the user
          // Force update the ref immediately so the loop picks it up
          lastHatchConfigRef.current = { amount: amountToHatch, tierId: tierId };
          
          if (isHatching) {
              toast.success("Auto Otwieranie: Włączone (czekam na zakończenie obecnego)");
          } else {
              toast.success("Auto Otwieranie: START!");
          }
      } else {
          toast('Auto Otwieranie: Zatrzymane');
      }
      
      setGameState(prev => ({ ...prev, isAutoHatching: newState }));
  };

  const stopAutoHatch = () => {
      setGameState(prev => ({ ...prev, isAutoHatching: false }));
      toast('Auto Otwieranie: Zatrzymane przez użytkownika');
  };

  const hatchEgg = (amount: number = 1, tierId: number = 0, isInstant: boolean = false, isTriggeredByAuto: boolean = false) => {
    if (isHatching && !isInstant) return; 
    
    // Ensure we always update the ref with latest config
    lastHatchConfigRef.current = { amount, tierId };
    
    // Store current tier for animation
    setHatchingTier(tierId);

    if (gameState.ownedPets.length + amount > MAX_PET_INVENTORY + (amount-1)) { 
        if (gameState.ownedPets.length >= MAX_PET_INVENTORY) {
            if (!isTriggeredByAuto) toast.error(`Ekwipunek pełny!`);
            // FORCE STOP AUTO HATCH
            if (isTriggeredByAuto) {
                setGameState(prev => ({ ...prev, isAutoHatching: false }));
                toast.error("Auto Stop: Ekwipunek pełny!");
            }
            return;
        }
    }

    const singleCost = getEggCost(gameState.currentWorld, tierId);
    const totalCost = singleCost * amount;

    if (gameState.points < totalCost) {
      if (!isTriggeredByAuto) toast.error(`Potrzebujesz ${formatNumber(totalCost)} ${currencyGenitive}!`);
      // FORCE STOP AUTO HATCH
      if (isTriggeredByAuto) {
          setGameState(prev => ({ ...prev, isAutoHatching: false }));
          toast.error("Auto Stop: Brak środków!");
      }
      return;
    }

    setGameState(prev => ({ ...prev, points: prev.points - totalCost }));

    // Generate Pets logic
    const luckLevel = gameState.rebirthUpgrades?.['egg_luck'] || 0;
    const luckMultiplier = 1 + (luckLevel * 0.2); 

    const eggData = WORLD_EGGS[gameState.currentWorld]?.find(e => e.id === tierId);
    const pool = eggData?.pets || []; 
    
    const weightedPool = pool.map(entry => {
        let weight = entry.chance;
        if (entry.pet.rarity !== 'Common') {
            weight = weight * luckMultiplier;
        }
        return { ...entry, weight };
    });

    const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);
    const newPets: Pet[] = [];

    for(let i=0; i<amount; i++) {
        const rand = Math.random() * totalWeight;
        let cumulative = 0;
        for (const entry of weightedPool) {
          cumulative += entry.weight;
          if (rand <= cumulative) {
            newPets.push(entry.pet);
            break;
          }
        }
    }

    if (newPets.length > 0) {
        setHatchingPets(newPets);
        setIsHatching(true);
    }
  };

  const finishHatching = useCallback(() => {
      if (processingHatchRef.current) return;
      processingHatchRef.current = true;

      // Extract current hatching pets from state
      const currentHatchingPets = hatchingPets;

      if (currentHatchingPets.length === 0) {
           setIsHatching(false);
           processingHatchRef.current = false;
           return;
      }

      // 1. Prepare new instances
      const petsToKeep: Pet[] = [];
      const discoveredIds = new Set<string>();

      currentHatchingPets.forEach(pet => {
          discoveredIds.add(pet.id);
          if (!gameState.autoDeleteFlags.includes(pet.id)) {
              petsToKeep.push(pet);
          }
      });

      const newPetInstances: OwnedPet[] = petsToKeep.map(pet => {
          // SHINY LOGIC: 0.1% chance
          const isShiny = Math.random() < 0.001; 
          
          return {
            ...pet,
            instanceId: uuidv4(),
            obtainedAt: Date.now(),
            variant: isShiny ? 'shiny' : 'normal',
            multiplier: isShiny ? pet.multiplier * 5.5 : pet.multiplier
          };
      });

      // Show toast for shiny
      const shinies = newPetInstances.filter(p => p.variant === 'shiny');
      if (shinies.length > 0) {
          setTimeout(() => {
              toast.success(`WYKLUTO ${shinies.length}x SHINY!`, { duration: 5000, style: { border: '2px solid gold', background: '#333', color: '#fff' }});
          }, 500);
      }

      // 2. Single Atomic State Update
      setGameState(prev => {
          const oldDiscovered = prev.discoveredPets || [];
          const newDiscovered = Array.from(new Set([...oldDiscovered, ...Array.from(discoveredIds)]));
          
          return {
              ...prev,
              ownedPets: [...prev.ownedPets, ...newPetInstances],
              discoveredPets: newDiscovered
          };
      });

      // 3. Clear State Immediately
      setHatchingPets([]);
      
      // CRITICAL: Set isHatching to false here. This will trigger the useEffect to run the next cycle.
      setIsHatching(false); 

      // 4. Release Lock after delay
      // REDUCED to 50ms to ensure loop (300ms) can pick up cleanly
      setTimeout(() => {
          processingHatchRef.current = false;
      }, 50);

  }, [hatchingPets, gameState.autoDeleteFlags, gameState.isAutoHatching]);

  // ... (rest of helper functions: toggleAutoDelete, equipPet, equipBestPets, deletePet, craftPet, switchWorld, buyWorld, doRebirth, resetGame, cheatAddPoints, formatNumber) ...
  // Re-pasting standard functions to ensure file integrity

  const toggleAutoDelete = (petId: string) => {
      setGameState(prev => {
          const exists = prev.autoDeleteFlags.includes(petId);
          let newFlags;
          if (exists) {
              newFlags = prev.autoDeleteFlags.filter(id => id !== petId);
          } else {
              newFlags = [...prev.autoDeleteFlags, petId];
          }
          return { ...prev, autoDeleteFlags: newFlags };
      });
  };

  const equipPet = (instanceId: string) => {
    // We can use latestGameStateRef here safely for validation if needed, 
    // but functional update is safer for toggling.
    // Side effects (toast) must be outside.
    
    // Check if maxed out before setting state (requires access to current state)
    // We use functional update logic but we need to know IF we should toast error.
    
    // Access current state via ref for decision making
    const current = latestGameStateRef.current;
    const isEquipped = current.equippedPets.includes(instanceId);
    
    if (!isEquipped) {
        const maxSlots = getMaxPetSlots();
        if (current.equippedPets.length >= maxSlots) {
            toast.error(`Max ${maxSlots} zwierzaki założone!`);
            return;
        }
    }

    setGameState(prev => {
      const isEquippedNow = prev.equippedPets.includes(instanceId);
      if (isEquippedNow) {
        return { ...prev, equippedPets: prev.equippedPets.filter(id => id !== instanceId) };
      } else {
        // Redundant check inside to be safe against async updates
        // but likely unnecessary if we checked above.
        return { ...prev, equippedPets: [...prev.equippedPets, instanceId] };
      }
    });
  };

  const equipBestPets = () => {
    // Use ref to calculate best pets without race conditions
    const current = latestGameStateRef.current;
    if (current.ownedPets.length === 0) {
      toast.error("Nie masz żadnych zwierzaków!");
      return;
    }
    const maxSlots = getMaxPetSlots();
    const sorted = [...current.ownedPets].sort((a, b) => {
       const multA = a.world === current.currentWorld ? a.multiplier : a.multiplier / 3;
       const multB = b.world === current.currentWorld ? b.multiplier : b.multiplier / 3;
       return multB - multA;
    });
    
    const bestPets = sorted.slice(0, maxSlots).map(p => p.instanceId);
    
    setGameState(prev => ({ ...prev, equippedPets: bestPets }));
    toast.success(`Założono ${bestPets.length} najlepszych zwierzaków!`);
  };

  const deletePet = (instanceId: string) => {
     const current = latestGameStateRef.current;
     if (current.equippedPets.includes(instanceId)) {
         toast.error("Najpierw zdejmij zwierzaka!");
         return;
     }
     
     setGameState(prev => ({
        ...prev,
        ownedPets: prev.ownedPets.filter(p => p.instanceId !== instanceId)
     }));
     toast.success("Usunięto zwierzaka");
  };

  const craftPet = (basePetId: string, targetVariant: PetVariant) => {
      const current = latestGameStateRef.current;
      
      let currentVariant: PetVariant = 'normal';
      let needed = 0;
      let multiplierFactor = 1;

      if (targetVariant === 'golden') {
          currentVariant = 'normal';
          needed = 5;
          multiplierFactor = 4.5;
      } else if (targetVariant === 'rainbow') {
          currentVariant = 'golden';
          needed = 3;
          multiplierFactor = 2; 
      } else if (targetVariant === 'dark_matter') {
          currentVariant = 'rainbow';
          needed = 5;
          multiplierFactor = 4;
      } else {
          return;
      }
      
      const candidates = current.ownedPets.filter(p => 
         p.id === basePetId && 
         p.variant === currentVariant &&
         !current.equippedPets.includes(p.instanceId)
      );
      
      if (candidates.length < needed) {
         toast.error(`Potrzebujesz ${needed} sztuk (niezałożonych)!`);
         return;
      }

      const ingredients = candidates.slice(0, needed);
      const ingredientIds = ingredients.map(p => p.instanceId);
      const basePet = ingredients[0]; 
      
      const newMultiplier = basePet.multiplier * multiplierFactor;

      const newPet: OwnedPet = {
          ...basePet,
          instanceId: uuidv4(),
          variant: targetVariant,
          multiplier: newMultiplier,
          obtainedAt: Date.now()
      };

      let variantName = "Złotego";
      if (targetVariant === 'rainbow') variantName = "Tęczowego";
      if (targetVariant === 'dark_matter') variantName = "Mrocznego";
      
      toast.success(`Stworzono ${variantName} Peta!`);

      setGameState(prev => ({
          ...prev,
          ownedPets: [
              ...prev.ownedPets.filter(p => !ingredientIds.includes(p.instanceId)),
              newPet
          ]
      }));
  };

  const switchWorld = (worldId: number) => {
    if (worldId === gameState.currentWorld) return;
    if (!gameState.unlockedWorlds.includes(worldId)) return;

    setGameState(prev => {
       const newWorldStates = {
          ...prev.worldStates,
          [prev.currentWorld]: {
             points: prev.points,
             upgrades: prev.upgrades,
             rebirthPoints: prev.rebirthPoints,
          }
       };
       
       const targetState = newWorldStates[worldId];
       return {
         ...prev,
         worldStates: newWorldStates,
         currentWorld: worldId,
         points: targetState?.points ?? 0,
         upgrades: targetState?.upgrades ?? {},
         rebirthPoints: targetState?.rebirthPoints ?? 0, 
       };
    });
    toast.success(`Podróż do Świata ${worldId}!`);
  };

  const buyWorld = (worldId: number) => {
    const world = WORLDS.find(w => w.id === worldId);
    if (!world) return;
    if (gameState.points >= world.cost) {
      playSound(SOUNDS.UI_BUY);
      setGameState(prev => ({
        ...prev,
        points: prev.points - world.cost,
        unlockedWorlds: [...prev.unlockedWorlds, worldId]
      }));
      toast.success(`Odblokowano ${world.name}!`);
    } else {
      toast.error("Za drogo!");
    }
  };

  const doRebirth = (amount: number) => {
     const totalCost = getRebirthCost(gameState.rebirthPoints, amount);
     if (gameState.points >= totalCost) {
        playSound(SOUNDS.MAGIC);
        setGameState(prev => ({
           ...prev,
           points: 0,
           upgrades: {}, 
           rebirthPoints: prev.rebirthPoints + amount,
           rebirthsPerformed: prev.rebirthsPerformed + amount,
           ownedPets: prev.ownedPets,
           equippedPets: prev.equippedPets,
           discoveredPets: prev.discoveredPets, 
           autoDeleteFlags: prev.autoDeleteFlags,
           isAutoHatching: false,
           // Rebirth Reset Logic:
           currentWorld: 1, // Go back to Earth
           unlockedWorlds: [1], // Lock other worlds
           worldStates: {}, // Clear progress in other worlds
           worldClicks: { 1: 0 } // Reset clicks visual
        }));
        toast.success("Odrodzenie Udane! Powrót do Świata 1.");
     } else {
       toast.error(`Potrzebujesz ${formatNumber(totalCost)} ${currencyGenitive}!`);
     }
  };

  const resetGame = () => {
     localStorage.removeItem('diamondClickerV2');
     const cleanState: GameState = { 
        ...INITIAL_STATE, 
        startTime: Date.now(),
        lastSaveTime: Date.now(),
        upgrades: {},
        ownedPets: [],
        equippedPets: [],
        discoveredPets: [],
        unlockedWorlds: [1],
        worldStates: {},
        rebirthUpgrades: {},
        autoDeleteFlags: [],
        isAutoHatching: false,
        worldClicks: { 1: 0 }
     };
     latestGameStateRef.current = cleanState;
     setGameState(cleanState);
     setActiveTab('clicker');
     toast.success("Gra Zresetowana Pomyślnie!");
  };

  const cheatAddPoints = (amt: number) => {
     addPoints(amt);
     toast.success("Oszukano punkty!");
  };

  const cheatMaxRebirthUpgrades = () => {
      setGameState(prev => {
          const newUpgrades = { ...prev.rebirthUpgrades };
          REBIRTH_UPGRADES_LIST.forEach(u => {
              newUpgrades[u.id] = u.maxLevel || 100;
          });
          return {
              ...prev,
              rebirthUpgrades: newUpgrades
          };
      });
      toast.success("Wymaksowano ulepszenia RP!");
  };

  const cheatUnlockWorlds = () => {
      setGameState(prev => ({
          ...prev,
          unlockedWorlds: WORLDS.map(w => w.id)
      }));
      toast.success("Odblokowano wszystkie światy!");
  };
  
  const cheatInfinitePoints = () => {
     setGameState(prev => ({
         ...prev,
         points: Infinity
     }));
     toast.success("Nieskończone Pieniądze! 💸");
  };
  
  const formatNumber = (num: number) => {
    if (num === Infinity || isNaN(num)) return "∞";
    if (num < 1000) return Math.floor(num).toString();
    
    const suffixes = [
        "", "k", "Mln", "Mld", "Bln", "Bld", "Trn", "Trd", 
        "Kw", "Kwd", "Kn", "Knd", "Sx", "Sxd", "Sp", "Spd", "Oc", "Ocd",
        "No", "Nod", "Dc", "Dcd", "Ud", "Udd", "Dd", "Ddd", 
        "Td", "Tdd", "Qd", "Qdd", "Qn", "Qnd", "Sd", "Sdd", "St", "Std"
    ];
    
    const exponent = Math.floor(Math.log10(num));
    const suffixIndex = Math.floor(exponent / 3);

    if (suffixIndex < suffixes.length) {
        const mantissa = num / Math.pow(10, suffixIndex * 3);
        return parseFloat(mantissa.toFixed(2)) + suffixes[suffixIndex];
    }
    
    return num.toExponential(2);
  };

  const getClickPerSec = () => calculateAutoRate(gameState);
  
  return (
    <div className={`${gameState.settings.theme || 'dark'} h-screen w-screen overflow-hidden font-sans select-none flex`}>
       <Toaster position="top-center" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
       
       {isHatching && (
          <HatchAnimation 
            pets={hatchingPets} 
            onClose={finishHatching} 
            worldId={gameState.currentWorld}
            speedUpgradeLevel={gameState.rebirthUpgrades['hatch_speed'] || 0}
            isAutoHatching={gameState.isAutoHatching}
            stopAutoHatch={stopAutoHatch}
            tierId={hatchingTier}
          />
       )}

       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
       
       <div className="flex-1 flex flex-col relative bg-gray-100 dark:bg-black transition-colors duration-300">
          <div className="absolute inset-0 bg-transparent dark:bg-gradient-to-br dark:from-gray-900 dark:to-black z-0 pointer-events-none"></div>
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] invert dark:invert-0 z-0"></div>

          <div className="flex flex-wrap justify-between items-center p-4 bg-white/70 dark:bg-black/60 backdrop-blur-md z-10 border-b border-black/5 dark:border-white/10 shadow-sm transition-colors duration-300">
             <div className="flex flex-col">
                <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-widest">Zasoby: {currencyName}</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600 dark:from-yellow-400 dark:to-orange-500 font-mono filter drop-shadow-sm">
                   {formatNumber(gameState.points)}
                </span>
             </div>

             <div className="flex gap-8">
                <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Na Klik</div>
                    <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-300">{formatNumber(calculateClickValue(gameState).total)}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Na Sekundę</div>
                    <div className="text-xl font-bold font-mono text-green-600 dark:text-green-300">{formatNumber(getClickPerSec())}</div>
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-hidden relative flex z-10">
             <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
                {floatingTexts.map(ft => (
                  <div 
                    key={ft.id} 
                    className="absolute text-3xl font-black text-gray-900 dark:text-white stroke-white dark:stroke-black animate-float drop-shadow-md whitespace-nowrap"
                    style={{ left: ft.x, top: ft.y, textShadow: '1px 1px 0 #888' }}
                  >
                    {ft.text}
                  </div>
                ))}
             </div>

             {activeTab === 'clicker' ? (
                 <div className="flex-1 flex h-full">
                     <div className="flex-1 flex items-center justify-center relative p-4">
                        <ClickZone 
                            onClick={handleClick} 
                            worldId={gameState.currentWorld} 
                            clicks={gameState.worldClicks?.[gameState.currentWorld] || 0}
                            playSound={playSound}
                        />
                     </div>

                     <div className={`
                        transition-all duration-300 ease-in-out border-l border-black/5 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-sm overflow-y-auto no-scrollbar
                        ${upgradesCollapsed ? 'w-12' : 'w-72 md:w-80'}
                     `}>
                        <div className="p-2 flex justify-start sticky top-0 bg-white/80 dark:bg-black/50 z-10 backdrop-blur-md">
                           <button onClick={() => setUpgradesCollapsed(!upgradesCollapsed)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded text-gray-700 dark:text-white">
                              <ArrowRightCircle className={`transition-transform duration-300 ${upgradesCollapsed ? 'rotate-180' : ''}`} />
                           </button>
                        </div>
                        
                        {!upgradesCollapsed && (
                            <div className="p-2 pb-20">
                                <h3 className="text-lg font-bold mb-4 text-center text-yellow-600 dark:text-yellow-500 uppercase tracking-widest border-b border-black/5 dark:border-white/10 pb-2">Ulepszenia</h3>
                                <UpgradesTab 
                                    upgrades={gameState.upgrades} 
                                    points={gameState.points}
                                    buyUpgrade={buyUpgrade}
                                    worldId={gameState.currentWorld}
                                    getCost={getUpgradeCost}
                                    compact={true} 
                                />
                            </div>
                        )}
                     </div>
                 </div>
             ) : (
                 <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
                    <div className="max-w-5xl mx-auto">
                        {activeTab === 'pets' && (
                          <PetsTab 
                             ownedPets={gameState.ownedPets}
                             equippedPets={gameState.equippedPets}
                             discoveredPets={gameState.discoveredPets || []}
                             rebirthUpgrades={gameState.rebirthUpgrades}
                             autoDeleteFlags={gameState.autoDeleteFlags || []}
                             isAutoHatching={gameState.isAutoHatching || false}
                             points={gameState.points}
                             worldId={gameState.currentWorld}
                             hatchEgg={hatchEgg}
                             toggleAutoHatch={toggleAutoHatch}
                             equipPet={equipPet}
                             equipBestPets={equipBestPets}
                             deletePet={deletePet}
                             craftPet={craftPet}
                             toggleAutoDelete={toggleAutoDelete}
                             maxPetSlots={getMaxPetSlots()}
                          />
                        )}
                        
                        {activeTab === 'worlds' && (
                          <WorldsTab 
                             currentWorld={gameState.currentWorld}
                             unlockedWorlds={gameState.unlockedWorlds}
                             points={gameState.points}
                             switchWorld={switchWorld}
                             buyWorld={buyWorld}
                          />
                        )}
                        
                        {activeTab === 'rebirth' && (
                           <RebirthTab 
                              points={gameState.points}
                              rebirthPoints={gameState.rebirthPoints}
                              rebirthUpgrades={gameState.rebirthUpgrades || {}}
                              doRebirth={doRebirth}
                              getRebirthCost={getRebirthCost}
                              buyRebirthUpgrade={buyRebirthUpgrade}
                              getUpgradeCost={getRebirthUpgradeCost}
                              formatNumber={formatNumber}
                           />
                        )}
                        
                        {activeTab === 'achievements' && (
                           <AchievementsTab 
                              gameState={gameState}
                           />
                        )}

                        {activeTab === 'settings' && (
                           <SettingsTab 
                              resetGame={resetGame}
                              cheatAddPoints={cheatAddPoints}
                              cheatMaxRebirthUpgrades={cheatMaxRebirthUpgrades}
                              cheatUnlockWorlds={cheatUnlockWorlds}
                              cheatInfinitePoints={cheatInfinitePoints}
                              sfxVolume={gameState.settings?.sfxVolume ?? 0.5}
                              setSfxVolume={(vol) => setGameState(prev => ({...prev, settings: {...prev.settings, sfxVolume: vol}}))}
                              theme={gameState.settings?.theme ?? 'dark'}
                              setTheme={(t) => setGameState(prev => ({...prev, settings: {...prev.settings, theme: t}}))}
                           />
                        )}

                        {activeTab === 'danger' && (
                           <DangerTab 
                              resetGame={resetGame}
                           />
                        )}
                    </div>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
}