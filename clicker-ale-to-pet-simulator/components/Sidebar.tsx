import React from 'react';
import { Hammer, PawPrint, Globe, Award, Settings, Zap, Skull } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'clicker', icon: <Hammer size={24} />, label: 'Kop' },
    { id: 'pets', icon: <PawPrint size={24} />, label: 'Zwierzaki' },
    { id: 'worlds', icon: <Globe size={24} />, label: 'Światy' },
    { id: 'rebirth', icon: <Zap size={24} />, label: 'Odrodzenie' },
    { id: 'achievements', icon: <Award size={24} />, label: 'Nagrody' },
    { id: 'settings', icon: <Settings size={24} />, label: 'Opcje' },
    { id: 'danger', icon: <Skull size={24} className="text-red-500 dark:text-red-400" />, label: 'RESET' },
  ];

  return (
    <div className="z-30 h-full flex flex-col items-center py-4 bg-white dark:bg-gray-900 border-r border-black/5 dark:border-white/10 w-20 md:w-24 shrink-0 transition-all duration-300 shadow-xl">
      <div className="mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 transform rotate-3 hover:rotate-0 transition-all cursor-default">
            <span className="font-black text-white text-lg">DCP</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 w-full px-2 overflow-y-auto no-scrollbar pb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group relative flex flex-col items-center justify-center p-3 rounded-xl w-full transition-all duration-300
                ${isActive 
                  ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-r-full shadow-[0_0_10px_#facc15]"></div>
              )}
              
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-sm' : 'group-hover:scale-105'}`}>
                {tab.icon}
              </div>
              <span className={`text-[9px] mt-1.5 font-bold uppercase tracking-wider ${isActive ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;