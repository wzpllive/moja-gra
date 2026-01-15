import React from 'react';
import { UPGRADES_LIST } from '../../constants';
import { Upgrade } from '../../types';

interface UpgradesTabProps {
  upgrades: Record<string, number>;
  points: number;
  buyUpgrade: (id: string) => void;
  worldId: number;
  getCost: (u: Upgrade, l: number, w: number) => number;
  compact?: boolean;
}

const UpgradesTab: React.FC<UpgradesTabProps> = ({ upgrades, points, buyUpgrade, worldId, getCost, compact = false }) => {
  
  const availableUpgrades = UPGRADES_LIST.filter(u => !u.worldReq || u.worldReq === worldId);

  return (
    <div className={compact ? "" : "pb-20"}>
      {!compact && <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Ulepszenia</h2>}
      
      <div className={compact ? "flex flex-col gap-3" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
        {availableUpgrades.map(upgrade => {
          const level = upgrades[upgrade.id] || 0;
          const cost = getCost(upgrade, level, worldId);
          const canAfford = points >= cost;
          const isMaxed = upgrade.maxLevel ? level >= upgrade.maxLevel : false;

          if (compact) {
              return (
                <div key={upgrade.id} 
                    onClick={() => { if(canAfford && !isMaxed) buyUpgrade(upgrade.id) }}
                    className={`
                        p-3 rounded-xl border-2 transition-all select-none cursor-pointer relative overflow-hidden group
                        ${isMaxed 
                           ? 'bg-gray-200 dark:bg-white/5 border-gray-300 dark:border-white/5 opacity-70' 
                           : canAfford 
                              ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 shadow-md' 
                              : 'bg-gray-100 dark:bg-black/40 border-gray-200 dark:border-gray-700 opacity-80'}
                    `}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-bold truncate pr-2 ${canAfford ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'}`}>{upgrade.name}</span>
                        <span className="text-[10px] font-bold bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">Lvl {level}</span>
                    </div>
                    
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 leading-tight">{upgrade.description}</div>
                    
                    <div className={`text-xs font-mono font-black ${isMaxed ? 'text-blue-600 dark:text-blue-400' : (canAfford ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400')}`}>
                        {isMaxed ? 'MAX' : cost.toLocaleString()}
                    </div>

                    {/* Hover Effect */}
                    {canAfford && !isMaxed && (
                       <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    )}
                </div>
              );
          }

          // Full View
          return (
            <div key={upgrade.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all group">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{upgrade.name}</h3>
                   <p className="text-base text-gray-600 dark:text-gray-400">{upgrade.description}</p>
                 </div>
                 <div className="text-right bg-gray-100 dark:bg-black/30 px-3 py-2 rounded-lg">
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Poziom</div>
                   <div className="font-mono text-xl font-bold text-gray-800 dark:text-gray-200">{level} {upgrade.maxLevel && <span className="text-gray-400 text-sm">/ {upgrade.maxLevel}</span>}</div>
                 </div>
               </div>
               
               <button
                 onClick={() => buyUpgrade(upgrade.id)}
                 disabled={!canAfford || isMaxed}
                 className={`w-full py-3 rounded-xl font-bold text-lg transition-all shadow-md active:scale-95
                    ${isMaxed 
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                      : canAfford 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' 
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }
                 `}
               >
                 {isMaxed ? 'MAX' : `Kup: ${cost.toLocaleString()}`}
               </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradesTab;