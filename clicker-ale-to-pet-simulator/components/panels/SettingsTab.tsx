import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon } from 'lucide-react';

interface SettingsTabProps {
  resetGame: () => void;
  cheatAddPoints: (amt: number) => void;
  cheatMaxRebirthUpgrades: () => void;
  cheatUnlockWorlds: () => void;
  cheatInfinitePoints: () => void;
  sfxVolume: number;
  setSfxVolume: (val: number) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ resetGame, cheatAddPoints, cheatMaxRebirthUpgrades, cheatUnlockWorlds, cheatInfinitePoints, sfxVolume, setSfxVolume, theme, setTheme }) => {
  const [cheatCode, setCheatCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const handleCode = () => {
    if (cheatCode === "Admin083017") {
       setUnlocked(true);
    }
  };

  return (
    <div className="pb-20">
       <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Ustawienia</h2>
       
       {/* Sound Settings */}
       <div className="bg-white/50 dark:bg-black/30 p-6 rounded-xl border border-black/5 dark:border-white/5 mb-8 transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <Volume2 size={20} /> Dźwięk
          </h3>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setSfxVolume(sfxVolume > 0 ? 0 : 0.5)}
                className="p-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 rounded-full transition-colors text-gray-900 dark:text-white"
             >
                {sfxVolume > 0 ? <Volume2 /> : <VolumeX />}
             </button>
             <div className="flex-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                   <span>Efekty (SFX)</span>
                   <span>{Math.round(sfxVolume * 100)}%</span>
                </div>
                <input 
                   type="range" 
                   min="0" 
                   max="1" 
                   step="0.05" 
                   value={sfxVolume}
                   onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                   className="w-full h-2 bg-gray-300 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
             </div>
          </div>
       </div>

       {/* Appearance Settings */}
       <div className="bg-white/50 dark:bg-black/30 p-6 rounded-xl border border-black/5 dark:border-white/5 mb-8 transition-colors">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />} Wygląd
          </h3>
          
          <div className="flex bg-gray-200 dark:bg-black/40 p-1 rounded-lg w-full max-w-xs border border-transparent dark:border-white/10">
             <button 
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold text-sm transition-all ${theme === 'light' ? 'bg-white text-yellow-600 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
             >
                <Sun size={16} /> Jasny
             </button>
             <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md font-bold text-sm transition-all ${theme === 'dark' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
             >
                <Moon size={16} /> Ciemny
             </button>
          </div>
       </div>

       <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl border border-black/5 dark:border-white/5 mb-8">
          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-4">Narzędzia Deweloperskie</h3>
          
          {!unlocked ? (
             <div className="flex gap-2">
                <input 
                  type="password" 
                  value={cheatCode} 
                  onChange={(e) => setCheatCode(e.target.value)}
                  placeholder="Wpisz kod..."
                  className="flex-1 bg-gray-100 dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                />
                <button 
                   onClick={handleCode}
                   className="bg-blue-600 px-6 rounded-lg font-bold hover:bg-blue-500 text-white"
                >
                   Odblokuj
                </button>
             </div>
          ) : (
             <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                   <button onClick={() => cheatAddPoints(10000)} className="bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 p-2 rounded text-xs sm:text-sm font-mono text-black dark:text-white">+10k</button>
                   <button onClick={() => cheatAddPoints(1000000)} className="bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 p-2 rounded text-xs sm:text-sm font-mono text-black dark:text-white">+1M</button>
                   <button onClick={() => cheatAddPoints(1000000000)} className="bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 p-2 rounded text-xs sm:text-sm font-mono text-black dark:text-white">+1B</button>
                   
                   <button onClick={() => cheatAddPoints(10000000000)} className="bg-yellow-100 dark:bg-yellow-900/50 hover:bg-yellow-200 dark:hover:bg-yellow-800/50 border border-yellow-500/30 p-2 rounded text-yellow-700 dark:text-yellow-200 text-xs sm:text-sm font-mono">+10B</button>
                   <button onClick={() => cheatAddPoints(1000000000000)} className="bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800/50 border border-purple-500/30 p-2 rounded text-purple-700 dark:text-purple-200 text-xs sm:text-sm font-mono">+1T</button>
                   <button onClick={() => cheatAddPoints(10000000000000)} className="bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-800/50 border border-purple-500/30 p-2 rounded text-purple-700 dark:text-purple-200 text-xs sm:text-sm font-mono">+10T</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button 
                       onClick={cheatMaxRebirthUpgrades}
                       className="py-3 rounded bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all text-xs sm:text-sm"
                    >
                       MAX RP UPGRADES
                    </button>
                    <button 
                       onClick={cheatUnlockWorlds}
                       className="py-3 rounded bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all text-xs sm:text-sm"
                    >
                       UNLOCK ALL WORLDS
                    </button>
                    <button 
                       onClick={cheatInfinitePoints}
                       className="py-3 rounded bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white font-bold shadow-lg hover:shadow-green-500/20 active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-widest border border-white/20 col-span-1 md:col-span-1"
                    >
                       💸 Nieskończone Pieniądze
                    </button>
                </div>
             </div>
          )}
       </div>

       <div className="p-6 text-center text-gray-500 text-sm bg-black/5 dark:bg-black/10 rounded-xl">
          Szukasz przycisku reset? Przenieśliśmy go do osobnej zakładki (Ikona Czaszki) dla bezpieczeństwa.
       </div>
       
       <div className="mt-8 text-center text-gray-400 dark:text-gray-500 text-xs">
          Wersja 2.4.2 (Dev Tools Ultra)
       </div>
    </div>
  );
};

export default SettingsTab;