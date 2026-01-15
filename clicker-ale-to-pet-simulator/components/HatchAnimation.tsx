import React, { useState, useEffect } from 'react';
import { Pet } from '../types';
import { WORLD_EGGS } from '../constants';
import { Egg, Sparkles, StopCircle } from 'lucide-react';

interface HatchAnimationProps {
  pets: Pet[];
  onClose: () => void;
  worldId: number;
  speedUpgradeLevel?: number; // New prop for speed control
  isAutoHatching?: boolean; // To show stop button
  stopAutoHatch?: () => void; // Function to stop auto hatch
  tierId: number; // To determine egg color
}

const HatchAnimation: React.FC<HatchAnimationProps> = ({ pets, onClose, worldId, speedUpgradeLevel = 0, isAutoHatching, stopAutoHatch, tierId }) => {
  // 0-3: Cracking stages, 4: Explode/Reveal
  const [crackLevel, setCrackLevel] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  // Used to re-trigger animation on every click
  const [shakeKey, setShakeKey] = useState(0);
  // Prevent double claiming
  const [hasClaimed, setHasClaimed] = useState(false);

  // Speed Logic: Reduce interval by 30% if upgraded
  const baseInterval = 800;
  const tickRate = speedUpgradeLevel > 0 ? baseInterval * 0.7 : baseInterval;
  
  // Auto-close delay after reveal
  // User requested 0.3s (300ms) for fast cycling
  const autoCloseDelay = 300;

  // Resolve Egg Appearance based on World & Tier
  const eggConfig = WORLD_EGGS[worldId]?.find(e => e.id === tierId);
  const eggColorClass = eggConfig?.color || 'text-white';

  // Auto-progress timer for cracking
  useEffect(() => {
    if (isRevealed) return;

    const interval = setInterval(() => {
        handleProgress();
    }, tickRate); 

    return () => clearInterval(interval);
  }, [crackLevel, isRevealed, tickRate]);

  // Auto-Close logic once revealed
  useEffect(() => {
      if (isRevealed && !hasClaimed) {
          const timer = setTimeout(() => {
              handleClaim();
          }, autoCloseDelay);
          return () => clearTimeout(timer);
      }
  }, [isRevealed, hasClaimed, autoCloseDelay]);

  const handleProgress = () => {
    if (isRevealed) return;
    
    setCrackLevel(prev => {
        const next = prev + 1;
        if (next >= 4) { // Max cracks before reveal
            setIsRevealed(true);
            return 4;
        }
        return next;
    });
    setShakeKey(prev => prev + 1); // Trigger re-render of animation
  };

  const handleClaim = () => {
      if (hasClaimed) return;
      setHasClaimed(true);
      onClose();
  };

  // --- Visual Assets ---

  // SVG Paths for progressive cracks
  const crackPaths = [
    "", // Level 0: No crack
    "M12 3 L12 6 L10 8", // Level 1: Tiny top crack
    "M12 3 L12 6 L10 8 L13 11 L11 14", // Level 2: Medium crack extending down
    "M12 3 L12 6 L10 8 L13 11 L11 14 L14 17 L10 21 M13 11 L16 10" // Level 3: Severe shattering
  ];

  // --- Helpers for Styling based on Rarity ---

  const getRarityTextClass = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-orange-400';
      case 'Mythical': return 'text-red-500';
      case 'Secret': return 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-pulse font-extrabold drop-shadow-sm';
      default: return 'text-white';
    }
  };

  const getRarityHexColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return '#9ca3af'; 
      case 'Rare': return '#60a5fa'; 
      case 'Epic': return '#c084fc'; 
      case 'Legendary': return '#fb923c'; 
      case 'Mythical': return '#ef4444'; 
      case 'Secret': return '#ffffff'; // Fallback for secret, mainly handled by custom classes now
      default: return '#ffffff';
    }
  };

  const translateRarity = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'Pospolity';
      case 'Rare': return 'Rzadki';
      case 'Epic': return 'Epicki';
      case 'Legendary': return 'Legendarny';
      case 'Mythical': return 'Mityczny';
      case 'Secret': return 'Sekretny';
      default: return rarity;
    }
  };

  // Determine Background Gradient based on world
  const bgGradient = worldId === 1 
    ? 'from-blue-900/95 to-black' 
    : 'from-purple-900/95 to-black';
  
  // Dynamic glow opacity based on crack level
  const lightOpacity = Math.min(1, crackLevel * 0.3);

  const isMultiple = pets.length > 1;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${bgGradient} backdrop-blur-xl animate-fade-in select-none`}>
      
      {/* Background Rays Effect (Revealed Only) */}
      {isRevealed && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className={`absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] bg-gradient-to-r from-transparent via-white/5 to-transparent animate-spin-slow rounded-full opacity-50 origin-center`} style={{marginTop: '-100vmax', marginLeft: '-100vmax'}}></div>
        </div>
      )}

      {/* Global Background Pulse syncing with cracks (generic) */}
      {!isRevealed && crackLevel > 0 && (
         <div 
            className="absolute inset-0 transition-colors duration-300 bg-white/5 animate-pulse"
         ></div>
      )}

      <div className="flex flex-col items-center relative z-10 p-4 w-full h-full justify-center overflow-y-auto">
        
        {!isRevealed ? (
          <div className="flex flex-col items-center cursor-pointer select-none mt-10 w-full" onClick={handleProgress}>
            <h2 className="text-3xl font-bold mb-12 text-white animate-pulse tracking-widest uppercase drop-shadow-lg text-center">
               {isMultiple ? "Klikaj Jajka!" : "Klikaj Jajko!"}
            </h2>
            
            <div 
               key={shakeKey}
               className={`transition-all duration-100 flex items-center justify-center
                  ${crackLevel === 3 ? 'animate-shake-hard' : 'animate-shake'}
                  ${isMultiple ? 'gap-2' : ''}
               `}
               style={{ 
                  animationDuration: `${Math.max(0.2, 0.5 - (crackLevel * 0.1))}s` // Faster shake as it cracks
               }}
            >
              {/* Render Egg(s) */}
              {pets.map((pet, index) => {
                  const size = isMultiple ? 100 : 220; // Scale down if multiple
                  const petRarityColor = getRarityHexColor(pet.rarity);
                  const isSecret = pet.rarity === 'Secret';
                  
                  return (
                      <div key={index} className="relative group">
                          {/* Back Glow - Grows with cracks, color is PET RARITY COLOR */}
                          <div 
                              className={`absolute inset-0 blur-2xl rounded-full transform scale-125 transition-all duration-300 ${isSecret ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-spin-slow' : ''}`}
                              style={{ 
                                  backgroundColor: isSecret ? undefined : petRarityColor,
                                  opacity: isSecret ? lightOpacity * 0.8 : lightOpacity 
                              }}
                          ></div>
                          
                          {/* The Egg Container */}
                          <div className="relative">
                             {/* Base Egg - Color determined by EGG TIER, NOT PET */}
                             <Egg 
                                size={size} 
                                className={`drop-shadow-2xl relative z-10 ${eggColorClass}`}
                                fill="currentColor" 
                                strokeWidth={1.5}
                             />

                             {/* CRACK OVERLAY - Dynamic SVG based on level */}
                             {/* The light leaking out is the PET RARITY COLOR */}
                             {crackLevel > 0 && (
                                <svg 
                                    viewBox="0 0 24 24" 
                                    className="absolute inset-0 z-20 w-full h-full drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]"
                                >
                                    {/* Define Gradient for Secret Cracks */}
                                    <defs>
                                       <linearGradient id={`secretCrackGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                          <stop offset="0%" stopColor="#ef4444" />
                                          <stop offset="50%" stopColor="#22c55e" />
                                          <stop offset="100%" stopColor="#3b82f6" />
                                       </linearGradient>
                                    </defs>

                                    {/* Inner Light of Crack - Color specific to pet */}
                                    <path 
                                        d={crackPaths[crackLevel] || crackPaths[crackPaths.length-1]} 
                                        fill="none" 
                                        stroke={isSecret ? `url(#secretCrackGradient-${index})` : petRarityColor}
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="animate-pulse-fast"
                                        style={{ filter: `drop-shadow(0 0 8px ${isSecret ? 'rgba(255,255,255,0.8)' : petRarityColor})` }}
                                    />
                                     {/* Outer Crack Line */}
                                     <path 
                                        d={crackPaths[crackLevel] || crackPaths[crackPaths.length-1]} 
                                        fill="none" 
                                        stroke="#000" 
                                        strokeWidth="0.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-50"
                                    />
                                </svg>
                             )}
                          </div>
                      </div>
                  );
              })}
            </div>

            <p className="mt-12 text-white/50 text-sm animate-bounce">
                {crackLevel === 0 ? "Kliknij, aby wykluć!" : "Pęka..."}
            </p>

            {/* Stop Auto Button - Replaces Skip if Auto Hatching is On */}
            {isAutoHatching && (
                <button
                  onClick={(e) => { e.stopPropagation(); stopAutoHatch && stopAutoHatch(); }}
                  className="mt-8 bg-red-600 hover:bg-red-500 border border-red-400 text-white px-6 py-3 rounded-full font-bold text-sm backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg animate-pulse"
                >
                  <StopCircle size={20} /> ZATRZYMAJ AUTO
                </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center animate-pop w-full max-w-4xl">
            <div className="mb-4 text-yellow-400 text-xl uppercase tracking-[0.2em] font-bold flex items-center gap-2 drop-shadow-md">
               <Sparkles className="animate-spin-slow" /> Wykluto! <Sparkles className="animate-spin-slow" />
            </div>
            
            <div className={`grid gap-6 w-full ${isMultiple ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 justify-items-center'}`}>
                {pets.map((pet, idx) => {
                    const pIsSecret = pet.rarity === 'Secret';
                    const pLightColor = getRarityHexColor(pet.rarity);
                    
                    return (
                        <div key={idx} className="flex flex-col items-center animate-pop" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="relative mb-4 group">
                               {/* Rarity Glow */}
                               <div 
                                  className={`absolute inset-0 blur-[40px] opacity-60 transition-opacity duration-1000 ${pIsSecret ? 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500 animate-spin-slow' : ''}`}
                                  style={{ backgroundColor: pIsSecret ? undefined : pLightColor }}
                               ></div>
                               
                               <img 
                                  src={pet.image} 
                                  alt={pet.name}
                                  onError={(e) => { (e.target as HTMLImageElement).src='https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Question%20Mark.png' }}
                                  className={`${isMultiple ? 'w-32 h-32' : 'w-56 h-56'} object-contain relative z-10 drop-shadow-2xl animate-float`}
                                  style={{ animationDelay: `${idx * 0.5}s` }}
                               />
                            </div>
            
                            <div className={`font-black mb-1 uppercase tracking-wide drop-shadow-lg ${isMultiple ? 'text-lg' : 'text-3xl'} ${getRarityTextClass(pet.rarity)}`}>
                               {translateRarity(pet.rarity)}
                            </div>
                            
                            <h3 className={`${isMultiple ? 'text-xl' : 'text-4xl'} font-bold text-white mb-2 drop-shadow-md`}>{pet.name}</h3>
                            
                            <div className={`flex gap-2 ${isMultiple ? 'text-xs' : 'text-base mb-6'}`}>
                               <div className="bg-black/40 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-md">
                                  <span className="text-gray-400">x</span><span className="text-green-400 font-mono font-bold">{pet.multiplier}</span>
                               </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Auto closing indicator */}
            <div className="mt-8 text-white/50 text-sm animate-pulse font-mono flex flex-col items-center gap-2">
               <span>Zamykanie...</span>
               {isAutoHatching && (
                   <button
                      onClick={(e) => { e.stopPropagation(); stopAutoHatch && stopAutoHatch(); }}
                      className="mt-2 bg-red-600/80 hover:bg-red-500 border border-red-400 text-white px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1"
                   >
                      <StopCircle size={14} /> STOP
                   </button>
               )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default HatchAnimation;