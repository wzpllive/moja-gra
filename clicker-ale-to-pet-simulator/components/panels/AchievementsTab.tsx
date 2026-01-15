import React from 'react';
import { GameState } from '../../types';
import { ACHIEVEMENTS } from '../../constants';

interface AchievementsTabProps {
  gameState: GameState;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ gameState }) => {
  return (
    <div className="pb-20">
       <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Osiągnięcia</h2>
       <div className="flex flex-col gap-3">
          {ACHIEVEMENTS.map(ach => {
             const isUnlocked = ach.condition(gameState);
             
             return (
               <div 
                 key={ach.id} 
                 className={`p-4 rounded-xl border flex justify-between items-center transition-all
                    ${isUnlocked 
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.1)]' 
                      : 'bg-white/50 dark:bg-black/20 border-black/5 dark:border-white/5 opacity-70'}
                 `}
               >
                  <div>
                     <h4 className={`font-bold text-lg ${isUnlocked ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'}`}>
                        {ach.name} {isUnlocked && '✓'}
                     </h4>
                     <p className="text-sm text-gray-600 dark:text-gray-400">{ach.description}</p>
                  </div>
                  <div className="text-right">
                     <span className="text-xs text-gray-500 uppercase">Nagroda</span>
                     <div className="font-mono text-yellow-600 dark:text-yellow-500">+{ach.reward.toLocaleString()}</div>
                  </div>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export default AchievementsTab;