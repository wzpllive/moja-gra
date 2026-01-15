import React, { useState } from 'react';
import { OwnedPet, PetVariant } from '../../types';
import { MAX_PET_INVENTORY, WORLDS, WORLD_EGGS } from '../../constants';
import { Egg, Backpack, BookOpen, Hammer, Lock, Zap, Trash2, PlayCircle, PauseCircle, ChevronDown, ChevronRight, Star } from 'lucide-react';

interface PetsTabProps {
  ownedPets: OwnedPet[];
  equippedPets: string[];
  discoveredPets: string[];
  rebirthUpgrades: Record<string, number>;
  points: number;
  worldId: number;
  autoDeleteFlags?: string[];
  isAutoHatching: boolean;
  hatchEgg: (amount?: number, tierId?: number, isAuto?: boolean) => void;
  toggleAutoHatch: (tierId: number) => void;
  equipPet: (id: string) => void;
  equipBestPets: () => void;
  deletePet: (id: string) => void;
  craftPet: (basePetId: string, targetVariant: PetVariant) => void;
  toggleAutoDelete?: (petId: string) => void;
  maxPetSlots: number;
}

const PetsTab: React.FC<PetsTabProps> = ({ 
    ownedPets, 
    equippedPets, 
    discoveredPets,
    rebirthUpgrades, 
    points, 
    worldId, 
    autoDeleteFlags = [],
    isAutoHatching,
    hatchEgg, 
    toggleAutoHatch,
    equipPet, 
    equipBestPets, 
    deletePet,
    craftPet,
    toggleAutoDelete,
    maxPetSlots
}) => {
  const [activeView, setActiveView] = useState<'inventory' | 'collection' | 'crafting'>('inventory');
  const [deleteMode, setDeleteMode] = useState(false);
  const [expandedCollections, setExpandedCollections] = useState<number[]>([]);
  const [collectionImgErrors, setCollectionImgErrors] = useState<Record<string, boolean>>({}); // Changed to string for pet ID
  const [worldLogoErrors, setWorldLogoErrors] = useState<Record<number, boolean>>({}); // New state for world logos
  const [petImgErrors, setPetImgErrors] = useState<Record<string, boolean>>({});
  
  // New: Track which egg is selected in the current world
  const [selectedEggTier, setSelectedEggTier] = useState<number>(0);

  const handleCollectionImgError = (id: string) => {
    setCollectionImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const handlePetImgError = (id: string) => {
    setPetImgErrors(prev => ({ ...prev, [id]: true }));
  };
  
  const currentWorldData = WORLDS.find(w => w.id === worldId) || WORLDS[0];
  const currencyGenitive = currentWorldData.currencyGenitive;

  const getBaseEggCost = (w: number) => {
      switch(w) {
          case 1: return 20000;
          case 2: return 2_500_000_000_000 / 100; // Base egg is usually cheaper than world entry
          case 3: return 10_000_000_000_000 / 100; 
          case 4: return 5_000_000_000_000_000 / 100; 
          case 5: return 500_000_000_000_000_000_000 / 100; 
          case 6: return 5_000_000_000_000_000_000_000 / 100; 
          case 7: return 100_000_000_000_000_000_000_000_000 / 100; 
          case 8: return 500_000_000_000_000_000_000_000_000_000 / 100; 
          case 9: return 1_000_000_000_000_000_000_000_000_000_000_000 / 100; 
          case 10: return 10_000_000_000_000_000_000_000_000_000_000_000 / 100; 
          default: return 20000;
      }
  };
  
  // Get Egg Data for UI
  const availableEggs = WORLD_EGGS[worldId] || [];
  const currentEgg = availableEggs.find(e => e.id === selectedEggTier) || availableEggs[0];
  
  const baseCost = getBaseEggCost(worldId);
  const eggCost = baseCost * (currentEgg?.costMult || 1);
  
  const canAfford = points >= eggCost;
  const canAffordTriple = points >= eggCost * 3;
  const inventoryFull = ownedPets.length >= MAX_PET_INVENTORY;
  
  // Unlocks
  const tripleUnlocked = (rebirthUpgrades['unlock_triple_egg'] || 0) > 0;
  const autoUnlocked = (rebirthUpgrades['unlock_auto_hatch'] || 0) > 0;
  const goldenUnlocked = (rebirthUpgrades['unlock_golden'] || 0) > 0;
  const rainbowUnlocked = (rebirthUpgrades['unlock_rainbow'] || 0) > 0;
  const darkMatterUnlocked = (rebirthUpgrades['unlock_dark_matter'] || 0) > 0;

  // Calculate Luck & Chances
  const luckLevel = rebirthUpgrades?.['egg_luck'] || 0;
  const luckMultiplier = 1 + (luckLevel * 0.2);

  const possiblePets = currentEgg?.pets || [];

  const weightedPool = possiblePets.map(entry => {
      let weight = entry.chance;
      if (entry.pet.rarity !== 'Common') {
          weight = weight * luckMultiplier;
      }
      return { ...entry, weight };
  });
  const totalWeight = weightedPool.reduce((sum, item) => sum + item.weight, 0);

  const getDisplayChance = (petId: string) => {
      const entry = weightedPool.find(p => p.pet.id === petId);
      if (!entry) return "0.0";
      const percent = (entry.weight / totalWeight) * 100;
      
      if (percent < 0.001) return percent.toExponential(1);
      if (percent < 0.1) return percent.toFixed(3);
      if (percent < 1) return percent.toFixed(2);
      return percent.toFixed(1);
  };

  const sortedPets = [...ownedPets].sort((a, b) => {
    const aEquipped = equippedPets.includes(a.instanceId);
    const bEquipped = equippedPets.includes(b.instanceId);
    if (aEquipped && !bEquipped) return -1;
    if (!aEquipped && bEquipped) return 1;
    
    const multA = a.world === worldId ? a.multiplier : a.multiplier / 3;
    const multB = b.world === worldId ? b.multiplier : b.multiplier / 3;
    return multB - multA;
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-500 dark:text-gray-400 border-gray-400';
      case 'Rare': return 'text-blue-500 dark:text-blue-400 border-blue-400';
      case 'Epic': return 'text-purple-500 dark:text-purple-400 border-purple-400';
      case 'Legendary': return 'text-orange-500 dark:text-orange-400 border-orange-400';
      case 'Mythical': return 'text-red-500 border-red-500';
      case 'Secret': return 'text-black dark:text-white border-black/40 dark:border-white/40';
      default: return 'text-black dark:text-white border-black dark:border-white';
    }
  };
  
  const getSecretTextStyles = () => {
      return 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-pulse font-extrabold tracking-wider';
  };

  const getVariantStyles = (variant: PetVariant, rarity: string) => {
     if (rarity === 'Secret') return 'border-black/50 dark:border-white/50 bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-900 shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]';

     if (variant === 'shiny') return 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-[0_0_15px_rgba(52,211,153,0.3)] border-2';
     if (variant === 'golden') return 'border-yellow-400 bg-yellow-100 dark:bg-yellow-900/20 shadow-[0_0_15px_rgba(250,204,21,0.3)]';
     if (variant === 'rainbow') return 'border-transparent bg-clip-border bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.5)]';
     if (variant === 'dark_matter') return 'border-purple-900 bg-gray-900 dark:bg-black shadow-[0_0_25px_rgba(168,85,247,0.6)] border-4';
     return '';
  };
  
  const getVariantText = (variant: PetVariant) => {
      if (variant === 'shiny') return <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-0.5"><Star size={8} fill="currentColor"/> Shiny</span>;
      if (variant === 'golden') return <span className="text-yellow-600 dark:text-yellow-400 font-bold uppercase text-[10px]">Złoty</span>;
      if (variant === 'rainbow') return <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500 font-bold uppercase text-[10px]">Tęczowy</span>;
      if (variant === 'dark_matter') return <span className="text-purple-600 dark:text-purple-500 font-black uppercase text-[10px] drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">Mroczny</span>;
      return null;
  };

  const toggleCollection = (id: number) => {
    setExpandedCollections(prev => 
        prev.includes(id) 
            ? prev.filter(x => x !== id) 
            : [...prev, id]
    );
  };
  
  const getFallbackEmoji = (id: number) => {
      switch(id) {
          case 1: return '🌍';
          case 2: return '🚀';
          case 3: return '🍭';
          case 4: return '👾';
          case 5: return '🐳';
          case 6: return '🌑';
          case 7: return '🌋';
          case 8: return '☁️';
          case 9: return '⚙️';
          case 10: return '⚛️';
          default: return '❓';
      }
  };

  const getCraftingGroups = () => {
     const groups: Record<string, { pet: OwnedPet, normalCount: number, goldenCount: number, rainbowCount: number }> = {};
     
     ownedPets.forEach(p => {
        if (!groups[p.id]) {
            groups[p.id] = { pet: p, normalCount: 0, goldenCount: 0, rainbowCount: 0 };
        }
        if (p.variant === 'normal' && !equippedPets.includes(p.instanceId)) groups[p.id].normalCount++;
        if (p.variant === 'golden' && !equippedPets.includes(p.instanceId)) groups[p.id].goldenCount++;
        if (p.variant === 'rainbow' && !equippedPets.includes(p.instanceId)) groups[p.id].rainbowCount++;
     });
     
     return Object.values(groups).sort((a,b) => a.pet.multiplier - b.pet.multiplier);
  };
  
  // Helper to convert text color class to border color class
  const getBorderColor = (textColorClass: string) => {
      return textColorClass.replace('text-', 'border-');
  };

  return (
    <div className="pb-20">
      
      {/* Navigation Toggles */}
      <div className="flex p-1 bg-white/50 dark:bg-black/40 rounded-xl mb-6 sticky top-0 z-20 backdrop-blur-md border border-black/5 dark:border-white/5">
         <button onClick={() => setActiveView('inventory')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${activeView === 'inventory' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <Backpack size={18} /> <span className="hidden sm:inline">Ekwipunek</span>
         </button>
         <button onClick={() => setActiveView('crafting')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${activeView === 'crafting' ? 'bg-amber-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <Hammer size={18} /> <span className="hidden sm:inline">Crafting</span>
         </button>
         <button onClick={() => setActiveView('collection')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${activeView === 'collection' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}>
            <BookOpen size={18} /> <span className="hidden sm:inline">Kolekcja</span>
         </button>
      </div>

      {/* --- INVENTORY VIEW --- */}
      {activeView === 'inventory' && (
        <>
          {/* Egg Section */}
          <div className={`bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black p-6 rounded-3xl mb-8 text-center shadow-lg dark:shadow-2xl border-2 ${getBorderColor(currentEgg?.color || 'text-gray-500')} relative overflow-hidden transition-all duration-300`}>
            {/* Egg Selector */}
            <div className="flex justify-center gap-4 sm:gap-6 mb-6 z-10 relative">
               {availableEggs.map((egg) => (
                   <button 
                      key={egg.id}
                      onClick={() => setSelectedEggTier(egg.id)}
                      className={`relative flex flex-col items-center p-3 rounded-2xl transition-all duration-300 group
                        ${selectedEggTier === egg.id 
                           ? `bg-white dark:bg-gray-800 scale-110 shadow-xl ring-2 ring-offset-2 ring-offset-transparent ${getBorderColor(egg.color).replace('border-', 'ring-')}` 
                           : 'bg-transparent opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'}
                      `}
                   >
                      <div className="relative">
                         <Egg size={42} className={`${egg.color} drop-shadow-md transition-transform group-hover:scale-110`} fill="currentColor" strokeWidth={1.5} />
                         {/* Sparkles for higher tiers */}
                         {egg.id > 0 && <Star size={12} className={`absolute -top-1 -right-1 ${egg.color} animate-pulse`} fill="currentColor" />}
                         {egg.id > 1 && <Star size={10} className={`absolute -bottom-1 -left-1 ${egg.color} animate-ping`} fill="currentColor" />}
                      </div>
                      
                      <span className="text-[10px] font-bold mt-2 max-w-[60px] truncate text-gray-700 dark:text-gray-300">{egg.name}</span>
                      
                      {selectedEggTier === egg.id && <div className={`absolute -bottom-3 w-3 h-3 rotate-45 ${egg.color.replace('text-', 'bg-')}`}></div>}
                   </button>
               ))}
            </div>

            <div className="flex flex-col items-center gap-4 relative z-10 mb-6">
               <h3 className={`text-2xl font-black ${currentEgg?.color} drop-shadow-sm`}>{currentEgg?.name}</h3>
               
               <div className="flex flex-wrap justify-center gap-4">
                  {/* Single Hatch */}
                  <button
                     onClick={() => hatchEgg(1, selectedEggTier)}
                     disabled={!canAfford || inventoryFull}
                     className={`px-8 py-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl flex flex-col items-center border border-transparent relative overflow-hidden group
                        ${inventoryFull 
                           ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 cursor-not-allowed border-red-500/50' 
                           : canAfford 
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-blue-500/40' 
                              : 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'}
                     `}
                  >
                     <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <div className="flex items-center gap-2 mb-1">
                        <Egg size={24} /> Wykluj 1
                     </div>
                     <span className="text-xs opacity-80 font-mono bg-black/20 dark:bg-black/30 px-2 py-1 rounded">{eggCost.toLocaleString()} {currencyGenitive}</span>
                  </button>

                  {/* Triple Hatch */}
                  {tripleUnlocked && (
                     <button
                        onClick={() => hatchEgg(3, selectedEggTier)}
                        disabled={!canAffordTriple || inventoryFull}
                        className={`px-8 py-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl flex flex-col items-center border border-transparent relative overflow-hidden group
                           ${inventoryFull 
                              ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 cursor-not-allowed border-red-500/50' 
                              : canAffordTriple 
                                 ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white hover:shadow-purple-500/40' 
                                 : 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'}
                        `}
                     >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-2 mb-1">
                           <div className="flex -space-x-2"><Egg size={20} /><Egg size={20} /><Egg size={20} /></div>
                        </div>
                        <span className="text-xs opacity-80 font-mono bg-black/20 dark:bg-black/30 px-2 py-1 rounded">{(eggCost * 3).toLocaleString()} {currencyGenitive}</span>
                     </button>
                  )}
               </div>

               {/* Auto Hatch Toggle */}
               {autoUnlocked && (
                  <button
                     onClick={() => toggleAutoHatch(selectedEggTier)}
                     className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-all border shadow-lg
                        ${isAutoHatching 
                           ? 'bg-green-100 dark:bg-green-600/20 border-green-500 text-green-600 dark:text-green-400 animate-pulse' 
                           : 'bg-white dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'}
                     `}
                  >
                     {isAutoHatching ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                     <span className="tracking-widest">AUTO: {isAutoHatching ? 'ON' : 'OFF'}</span>
                  </button>
               )}
            </div>

            {/* Chances Grid */}
            <div className="flex flex-wrap justify-center gap-2 relative z-10">
              {possiblePets
                .filter(p => p.pet.rarity !== 'Secret') 
                .map(p => {
                    const chance = getDisplayChance(p.pet.id);
                    const isBoosted = luckLevel > 0 && p.pet.rarity !== 'Common';
                    const isAutoDelete = autoDeleteFlags.includes(p.pet.id);
                    const borderColor = getRarityColor(p.pet.rarity).split(' ')[1];

                    return (
                        <div 
                           key={p.pet.id} 
                           onClick={() => toggleAutoDelete && toggleAutoDelete(p.pet.id)}
                           className={`
                              relative w-14 h-16 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105
                              ${isAutoDelete ? 'bg-red-100 dark:bg-red-900/50 border-red-500' : 'bg-white dark:bg-black/30 hover:bg-gray-50 dark:hover:bg-black/50'}
                              ${!isAutoDelete ? borderColor : ''}
                              ${isBoosted && !isAutoDelete ? 'shadow-[0_0_8px_rgba(74,222,128,0.4)]' : ''}
                           `}
                        >
                           {isAutoDelete && (
                               <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-20">
                                   <Trash2 className="text-red-500" size={16} />
                               </div>
                           )}

                           <img src={p.pet.image} alt="pet" className="w-6 h-6 object-contain mb-1" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                           <div className="hidden text-xl">❓</div>
                           <div className={`text-[9px] font-bold ${isBoosted ? 'text-green-600 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
                              {chance}%
                           </div>
                        </div>
                    );
                })}
            </div>
          </div>

          {/* Stats & Controls Bar */}
          <div className="flex flex-wrap gap-4 justify-between items-center bg-white/60 dark:bg-black/40 p-4 rounded-xl mb-6 border border-black/5 dark:border-white/5 backdrop-blur-md">
             <div className="flex gap-4 text-sm font-mono">
                 <div className="bg-gray-200 dark:bg-black/40 px-3 py-1 rounded-lg">
                    📦 <span className={`${inventoryFull ? 'text-red-600 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}>{ownedPets.length}/{MAX_PET_INVENTORY}</span>
                 </div>
                 <div className="bg-gray-200 dark:bg-black/40 px-3 py-1 rounded-lg">
                    🐾 <span className="text-yellow-600 dark:text-yellow-400">{equippedPets.length}/{maxPetSlots}</span>
                 </div>
             </div>

             <div className="flex gap-2">
                  <button
                      onClick={equipBestPets}
                      className="bg-yellow-100 dark:bg-yellow-700/50 hover:bg-yellow-200 dark:hover:bg-yellow-600/50 border border-yellow-600 text-yellow-800 dark:text-yellow-200 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  >
                      <Zap size={14} /> Najlepsze
                  </button>
                  <button
                      onClick={() => setDeleteMode(!deleteMode)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all border
                        ${deleteMode ? 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-700 dark:text-red-200 animate-pulse' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}
                      `}
                  >
                      <Trash2 size={14} /> {deleteMode ? 'Usuwanie...' : 'Usuń'}
                  </button>
             </div>
          </div>

          {/* Pet Grid */}
          {sortedPets.length === 0 ? (
            <div className="text-center text-gray-500 py-20 bg-white/40 dark:bg-black/20 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-800">
              <div className="text-6xl mb-4 grayscale opacity-30">🥚</div>
              Brak zwierzaków. Wykluj jajko, aby zacząć!
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
               {sortedPets.map((pet) => {
                 const isEquipped = equippedPets.includes(pet.instanceId);
                 const borderColor = getRarityColor(pet.rarity).split(' ')[1];
                 const variantClass = getVariantStyles(pet.variant, pet.rarity);
                 const isSecret = pet.rarity === 'Secret';
                 const isPenalized = pet.world !== worldId;
                 const effectiveMultiplier = isPenalized ? pet.multiplier / 3 : pet.multiplier;

                 return (
                    <div 
                      key={pet.instanceId}
                      onClick={() => {
                        if (deleteMode) {
                            deletePet(pet.instanceId);
                        } else {
                            equipPet(pet.instanceId);
                        }
                      }}
                      className={`
                        relative aspect-square rounded-xl cursor-pointer transition-all duration-200 border-2 overflow-hidden group
                        ${isEquipped ? 'ring-4 ring-yellow-400 dark:ring-yellow-500 z-10 scale-[1.02]' : 'hover:scale-105'}
                        ${deleteMode ? 'hover:bg-red-100 dark:hover:bg-red-900/50 hover:border-red-500' : ''}
                        ${variantClass ? variantClass : `bg-white dark:bg-black/40 border-${borderColor}`}
                        ${!variantClass ? getRarityColor(pet.rarity) : ''}
                      `}
                    >
                        {/* Equipped Indicator */}
                        {isEquipped && (
                            <div className="absolute top-1 right-1 bg-yellow-400 text-black p-0.5 rounded-full z-20 shadow-md">
                                <Zap size={10} fill="currentColor" />
                            </div>
                        )}
                        
                        {/* Variant Label */}
                        {pet.variant !== 'normal' && (
                            <div className="absolute top-1 left-1 z-20">
                                {getVariantText(pet.variant)}
                            </div>
                        )}
                        
                        {/* Background Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${isEquipped ? 'from-yellow-100/50 dark:from-yellow-900/30' : 'from-black/5 dark:from-white/5'} to-transparent opacity-50`}></div>
                        
                        {/* Pet Image */}
                        <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
                             {!petImgErrors[pet.instanceId] ? (
                                <img 
                                    src={pet.image} 
                                    alt={pet.name} 
                                    className="w-full h-full object-contain drop-shadow-md"
                                    onError={() => handlePetImgError(pet.instanceId)}
                                />
                             ) : (
                                <span className="text-2xl">🐾</span>
                             )}
                        </div>
                        
                        {/* Name & Multiplier */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-black/80 backdrop-blur-[2px] p-1.5 flex flex-col items-center z-20">
                            <div className={`text-[9px] font-bold truncate w-full text-center ${isSecret ? getSecretTextStyles() : ''} ${deleteMode ? 'text-red-500' : ''}`}>
                                {pet.name}
                            </div>
                            <div className="flex items-center gap-1 text-[10px]">
                                <span className="text-gray-400 dark:text-gray-500 text-[8px]">x</span>
                                <span className={`${isPenalized ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'} font-mono font-bold`}>
                                   {effectiveMultiplier.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                </span>
                            </div>
                        </div>

                        {/* Delete Overlay */}
                        {deleteMode && (
                            <div className="absolute inset-0 bg-red-500/20 z-30 flex items-center justify-center backdrop-blur-[1px]">
                                <Trash2 className="text-red-600 dark:text-red-400 drop-shadow-lg" size={24} />
                            </div>
                        )}
                    </div>
                 );
               })}
            </div>
          )}
        </>
      )}

      {/* --- CRAFTING VIEW --- */}
      {activeView === 'crafting' && (
          <div className="space-y-4">
              <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
                  <div className="bg-amber-500 text-white p-2 rounded-lg mt-1"><Hammer size={20}/></div>
                  <div>
                      <h3 className="font-bold text-amber-800 dark:text-amber-200">System Craftingu</h3>
                      <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Łącz słabsze wersje petów, aby tworzyć potężniejsze warianty! Wymaga odblokowania w Sklepie Odrodzeń.</p>
                  </div>
              </div>

              {getCraftingGroups().length === 0 ? (
                  <div className="text-center py-12 text-gray-500">Brak dostępnych petów do craftingu.</div>
              ) : (
                  getCraftingGroups().map((group) => {
                      const { pet, normalCount, goldenCount, rainbowCount } = group;
                      const hasGolden = goldenUnlocked;
                      const hasRainbow = rainbowUnlocked;
                      const hasDarkMatter = darkMatterUnlocked;

                      return (
                          <div key={pet.id} className="bg-white/50 dark:bg-black/30 border border-black/5 dark:border-white/5 p-4 rounded-xl flex items-center gap-4">
                              <div className="w-16 h-16 bg-white dark:bg-black/50 rounded-lg flex items-center justify-center border border-black/10 dark:border-white/10 shrink-0">
                                  <img src={pet.image} alt={pet.name} className="w-12 h-12 object-contain" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-900 dark:text-white truncate">{pet.name}</h4>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Posiadasz: {normalCount}x Normal, {goldenCount}x Złoty, {rainbowCount}x Tęczowy</div>
                              </div>

                              <div className="flex flex-col gap-2">
                                  {/* Craft Golden */}
                                  <button 
                                     onClick={() => craftPet(pet.id, 'golden')}
                                     disabled={!hasGolden || normalCount < 5}
                                     className={`px-3 py-1.5 rounded text-[10px] font-bold border flex items-center justify-between gap-2 w-32
                                        ${!hasGolden 
                                            ? 'bg-gray-200 dark:bg-black/40 text-gray-400 border-transparent cursor-not-allowed' 
                                            : normalCount >= 5 
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500 text-yellow-700 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800/50' 
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-300 dark:border-white/10'}
                                     `}
                                  >
                                      <span>ZŁOTY (5x)</span>
                                      {!hasGolden && <Lock size={8} />}
                                  </button>

                                  {/* Craft Rainbow */}
                                  <button 
                                     onClick={() => craftPet(pet.id, 'rainbow')}
                                     disabled={!hasRainbow || goldenCount < 3}
                                     className={`px-3 py-1.5 rounded text-[10px] font-bold border flex items-center justify-between gap-2 w-32
                                        ${!hasRainbow 
                                            ? 'bg-gray-200 dark:bg-black/40 text-gray-400 border-transparent cursor-not-allowed' 
                                            : goldenCount >= 3 
                                                ? 'bg-gradient-to-r from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-200 hover:opacity-80' 
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-300 dark:border-white/10'}
                                     `}
                                  >
                                      <span>TĘCZOWY (3x)</span>
                                      {!hasRainbow && <Lock size={8} />}
                                  </button>

                                  {/* Craft Dark Matter */}
                                  <button 
                                     onClick={() => craftPet(pet.id, 'dark_matter')}
                                     disabled={!hasDarkMatter || rainbowCount < 5}
                                     className={`px-3 py-1.5 rounded text-[10px] font-bold border flex items-center justify-between gap-2 w-32
                                        ${!hasDarkMatter 
                                            ? 'bg-gray-200 dark:bg-black/40 text-gray-400 border-transparent cursor-not-allowed' 
                                            : rainbowCount >= 5 
                                                ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 text-purple-700 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800/50' 
                                                : 'bg-gray-100 dark:bg-white/5 text-gray-400 border-gray-300 dark:border-white/10'}
                                     `}
                                  >
                                      <span>MROCZNY (5x)</span>
                                      {!hasDarkMatter && <Lock size={8} />}
                                  </button>
                              </div>
                          </div>
                      );
                  })
              )}
          </div>
      )}

      {/* --- COLLECTION VIEW --- */}
      {activeView === 'collection' && (
          <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="font-bold text-gray-700 dark:text-gray-300">Odkryte: {discoveredPets.length}</h3>
                 <div className="text-xs text-gray-500">Złap je wszystkie!</div>
              </div>

              {Object.values(WORLD_EGGS).map((eggTiers) => {
                  const worldId = eggTiers[0].pets[0].pet.world;
                  const world = WORLDS.find(w => w.id === worldId);
                  const worldName = world?.name || "Nieznany Świat";
                  
                  // Flatten all pets in this world
                  const allWorldPets = eggTiers.flatMap(e => e.pets);
                  const isExpanded = expandedCollections.includes(worldId);
                  const unlockedCount = allWorldPets.filter(p => discoveredPets.includes(p.pet.id)).length;
                  const totalCount = allWorldPets.length;
                  const isCompleted = unlockedCount === totalCount;
                  const hasLogoError = worldLogoErrors[worldId];

                  return (
                      <div key={worldName} className={`rounded-xl border transition-all overflow-hidden ${isCompleted ? 'border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/10' : 'border-black/10 dark:border-white/10 bg-white/30 dark:bg-black/20'}`}>
                          <button 
                            onClick={() => toggleCollection(worldId)}
                            className="w-full p-4 flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          >
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white/50 dark:bg-white/10 rounded-full overflow-hidden p-1">
                                      {!hasLogoError && world?.image ? (
                                          <img 
                                            src={world.image} 
                                            alt={worldName} 
                                            className="w-full h-full object-contain drop-shadow-sm" 
                                            onError={() => setWorldLogoErrors(prev => ({...prev, [worldId]: true}))}
                                          />
                                      ) : (
                                          <div className="text-2xl">{getFallbackEmoji(worldId)}</div>
                                      )}
                                  </div>
                                  <div className="text-left">
                                      <div className={`font-bold text-sm ${isCompleted ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-800 dark:text-white'}`}>{worldName}</div>
                                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{unlockedCount} / {totalCount}</div>
                                  </div>
                              </div>
                              {isExpanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                          </button>
                          
                          {isExpanded && (
                              <div className="p-4 pt-0 grid grid-cols-4 sm:grid-cols-6 gap-2 animate-fade-in">
                                  {allWorldPets.map(entry => {
                                      const isDiscovered = discoveredPets.includes(entry.pet.id);
                                      const rarityColor = getRarityColor(entry.pet.rarity).split(' ')[1];
                                      
                                      return (
                                          <div key={entry.pet.id} className={`aspect-square rounded-lg border flex items-center justify-center relative bg-white dark:bg-black/40 ${isDiscovered ? `border-${rarityColor}` : 'border-dashed border-gray-300 dark:border-gray-700 opacity-50'}`}>
                                              {isDiscovered ? (
                                                  !collectionImgErrors[entry.pet.id] ? (
                                                      <img 
                                                        src={entry.pet.image} 
                                                        alt={entry.pet.name} 
                                                        className="w-3/4 h-3/4 object-contain" 
                                                        onError={() => handleCollectionImgError(entry.pet.id)}
                                                      />
                                                  ) : (
                                                      <span className="text-xl">?</span>
                                                  )
                                              ) : (
                                                  <span className="text-xl grayscale opacity-20">?</span>
                                              )}
                                              {isDiscovered && entry.pet.rarity === 'Secret' && (
                                                  <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-blue-500/20 pointer-events-none rounded-lg"></div>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>
                          )}
                      </div>
                  );
              })}
          </div>
      )}

    </div>
  );
};

export default PetsTab;