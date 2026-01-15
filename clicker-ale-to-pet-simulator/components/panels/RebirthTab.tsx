import React, { useState } from 'react';
import { REBIRTH_UPGRADES_LIST } from '../../constants';
import { Upgrade } from '../../types';
import { Star } from 'lucide-react';

interface RebirthTabProps {
  points: number;
  rebirthPoints: number;
  rebirthUpgrades: Record<string, number>;
  doRebirth: (amount: number) => void;
  getRebirthCost: (curr: number, amt: number) => number;
  buyRebirthUpgrade: (id: string) => void;
  getUpgradeCost: (u: Upgrade, l: number) => number;
  formatNumber: (num: number) => string;
}

const RebirthTab: React.FC<RebirthTabProps> = ({ 
  points, 
  rebirthPoints, 
  rebirthUpgrades,
  doRebirth, 
  getRebirthCost,
  buyRebirthUpgrade,
  getUpgradeCost,
  formatNumber
}) => {
  const [amount, setAmount] = useState(1);
  const cost = getRebirthCost(rebirthPoints, amount);
  const canAfford = points >= cost;
  
  const currentMult = 1.15 + (Math.max(0, rebirthPoints - 1) * 0.1);
  const nextMult = 1.15 + (Math.max(0, rebirthPoints + amount - 1) * 0.1);

  return (
    <div className="pb-20 text-center">
       <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">Odrodzenie</h2>
       
       {/* Rebirth Stats Area */}
       <div className="bg-white/50 dark:bg-black/30 p-8 rounded-2xl mb-8 border border-purple-500/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          
          <div className="text-gray-500 dark:text-gray-400 mb-2">Obecne Punkty Odrodzenia (RP)</div>
          <div className="text-6xl font-bold text-gray-900 dark:text-white mb-6 font-mono">
            {formatNumber(rebirthPoints)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm bg-white/50 dark:bg-black/20 p-4 rounded-xl">
             <div>
                <div className="text-gray-500">Obecny Mnożnik</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">x{currentMult.toFixed(2)}</div>
             </div>
             <div>
                <div className="text-gray-500">Następny Mnożnik</div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">x{nextMult.toFixed(2)}</div>
             </div>
          </div>
       </div>
       
       {/* Rebirth Actions */}
       <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-6 mb-8 border border-black/5 dark:border-white/10">
         <div className="flex justify-center gap-2 mb-6">
           {[1, 5, 25, 100].map(val => (
             <button
               key={val}
               onClick={() => setAmount(val)}
               className={`px-4 py-2 rounded-lg font-bold border transition-all
                 ${amount === val ? 'bg-purple-600 border-purple-400 text-white' : 'bg-transparent border-gray-300 dark:border-white/20 text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10'}
               `}
             >
               +{val} RP
             </button>
           ))}
         </div>
         
         <button
           onClick={() => doRebirth(amount)}
           disabled={!canAfford}
           className={`w-full py-4 rounded-xl font-bold text-2xl shadow-lg transition-transform active:scale-[0.98]
             ${canAfford 
               ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white' 
               : 'bg-gray-300 dark:bg-white/5 text-gray-500 cursor-not-allowed'}
           `}
         >
            Wykonaj Odrodzenie<br/>
            <span className="text-sm opacity-70 font-mono">Koszt: {formatNumber(cost)} pkt</span>
         </button>
         
         <div className="mt-4 text-xs text-left bg-black/5 dark:bg-black/40 p-4 rounded-lg">
            <p className="text-red-600 dark:text-red-400 mb-1 font-bold">⚠️ Odrodzenie RESETUJE:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-2">
               <li>Punkty i mnożnik kliknięć</li>
               <li>Kupione ulepszenia (sklep)</li>
            </ul>
            <p className="text-green-600 dark:text-green-400 mb-1 font-bold">✅ Odrodzenie ZACHOWUJE:</p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
               <li>Wszystkie Twoje ZWIERZAKI (Pets)</li>
               <li>Osiągnięcia</li>
               <li>Punkty Odrodzenia i ulepszenia RP</li>
            </ul>
         </div>
       </div>

       {/* Rebirth Shop */}
       <div className="text-left">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
             <Star className="text-yellow-500 fill-yellow-500" /> Sklep Odrodzenia
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
             {REBIRTH_UPGRADES_LIST.map(upgrade => {
                const level = rebirthUpgrades[upgrade.id] || 0;
                const cost = getUpgradeCost(upgrade, level);
                const canBuy = rebirthPoints >= cost;
                const isMaxed = upgrade.maxLevel ? level >= upgrade.maxLevel : false;

                return (
                   <div key={upgrade.id} className="bg-white/80 dark:bg-black/40 p-4 rounded-xl border border-black/5 dark:border-white/10 flex justify-between items-center shadow-sm">
                      <div className="flex-1">
                         <div className="flex items-center gap-2">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{upgrade.name}</h4>
                            <span className="bg-gray-200 dark:bg-black/50 px-2 py-0.5 rounded text-xs text-gray-600 dark:text-gray-400">
                               Lvl {level} {upgrade.maxLevel && `/ ${upgrade.maxLevel}`}
                            </span>
                         </div>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{upgrade.description}</p>
                      </div>
                      
                      <button
                         onClick={() => buyRebirthUpgrade(upgrade.id)}
                         disabled={!canBuy || isMaxed}
                         className={`ml-4 px-6 py-3 rounded-lg font-bold min-w-[120px] transition-all
                            ${isMaxed 
                               ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 cursor-default' 
                               : canBuy 
                                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                                  : 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-500 cursor-not-allowed'}
                         `}
                      >
                         {isMaxed ? 'MAX' : `${formatNumber(cost)} RP`}
                      </button>
                   </div>
                );
             })}
          </div>
       </div>

    </div>
  );
};

export default RebirthTab;