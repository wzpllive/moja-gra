import React, { useState } from 'react';
import { WORLDS } from '../../constants';

interface WorldsTabProps {
  currentWorld: number;
  unlockedWorlds: number[];
  points: number;
  switchWorld: (id: number) => void;
  buyWorld: (id: number) => void;
}

const WorldsTab: React.FC<WorldsTabProps> = ({ currentWorld, unlockedWorlds, points, switchWorld, buyWorld }) => {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const handleImgError = (id: number) => {
    setImgErrors(prev => ({ ...prev, [id]: true }));
  };

  const getFallbackEmoji = (id: number) => {
      switch(id) {
          case 1: return '🌍'; // Ziemia
          case 2: return '🚀'; // Kosmos
          case 3: return '🍬'; // Cukierkowa Kraina
          case 4: return '👾'; // Cyber Świat
          default: return '❓';
      }
  };

  return (
    <div className="pb-20">
       <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Światy</h2>
       <div className="flex flex-col gap-6">
          {WORLDS.filter(world => {
              // Logic:
              // 1. Always show worlds that are already unlocked.
              // 2. If locked, ONLY show if it is the immediate successor of the CURRENTLY ACTIVE world.
              // This satisfies: "World 3 can ONLY be bought in World 2" (so if current is W1, W3 is hidden).
              
              const isUnlocked = unlockedWorlds.includes(world.id);
              const isNextToBuy = world.id === currentWorld + 1;
              
              return isUnlocked || isNextToBuy;
          }).map(world => {
            const isUnlocked = unlockedWorlds.includes(world.id);
            const isCurrent = currentWorld === world.id;
            const canAfford = points >= world.cost;
            const hasError = imgErrors[world.id];
            
            // Get correct currency form from the PREVIOUS world (as you pay with current resources to unlock next)
            // Actually, usually in this game you pay with the currency of the PREVIOUS world to unlock the NEXT.
            // But if the game design is "Pay Gold to unlock Space", that implies World 1 Currency.
            // Let's assume the cost is always in the currency of the world YOU ARE CURRENTLY IN (which is usually world.id - 1 if unlocking next).
            // BUT simpler logic: The "cost" in WORLDS definition usually implies the currency of the previous tier.
            // Let's look at World 2 definition: cost 100 Mld. description: "Wymaga 100 Mld Złota".
            // So World 2 cost is in World 1 currency. World 3 cost is in World 2 currency.
            
            // However, to keep it simple and consistent with the display, let's just use the description which already says what it requires,
            // OR find the currency of the world required to buy it.
            // World 1 (Ziemia) -> Cost 0.
            // World 2 (Kosmos) -> Cost 100 Mld (Złota).
            
            // Let's find the currency name of the world BEFORE this one.
            const previousWorld = WORLDS.find(w => w.id === world.id - 1);
            const costCurrencyName = previousWorld ? previousWorld.currencyGenitive : 'Złota';

            return (
               <div key={world.id} className={`p-6 rounded-2xl border-2 transition-all ${isCurrent ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-500' : 'bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/10'}`}>
                  <div className="flex items-center gap-6 mb-4">
                     <div className="w-24 h-24 flex-shrink-0 bg-white/50 dark:bg-black/30 rounded-full flex items-center justify-center border border-black/5 dark:border-white/10 overflow-hidden">
                        {!hasError ? (
                           <img 
                              src={world.image} 
                              alt={world.name} 
                              className="w-16 h-16 object-contain" 
                              onError={() => handleImgError(world.id)}
                           />
                        ) : (
                           <div className="text-4xl select-none">{getFallbackEmoji(world.id)}</div>
                        )}
                     </div>
                     <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{world.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400">{world.description}</p>
                     </div>
                  </div>
                  
                  {isUnlocked ? (
                     <button
                       onClick={() => switchWorld(world.id)}
                       disabled={isCurrent}
                       className={`w-full py-3 rounded-lg font-bold text-lg 
                         ${isCurrent ? 'bg-green-100 dark:bg-green-600/50 text-green-800 dark:text-green-200 cursor-default' : 'bg-blue-600 hover:bg-blue-500 text-white'}
                       `}
                     >
                       {isCurrent ? 'Obecny Świat' : 'Podróżuj'}
                     </button>
                  ) : (
                     <button
                       onClick={() => buyWorld(world.id)}
                       disabled={!canAfford}
                       className={`w-full py-3 rounded-lg font-bold text-lg 
                         ${canAfford ? 'bg-yellow-600 hover:bg-yellow-500 text-white' : 'bg-gray-300 dark:bg-white/5 text-gray-500 cursor-not-allowed'}
                       `}
                     >
                        Odblokuj za {world.cost.toLocaleString()} {costCurrencyName}
                     </button>
                  )}
               </div>
            );
          })}
       </div>
    </div>
  );
};

export default WorldsTab;