import React, { useState } from 'react';
import { CLICK_STAGES } from '../constants';

interface ClickZoneProps {
  onClick: (e: React.MouseEvent | React.TouchEvent) => void;
  worldId: number;
  clicks: number; // Changed from totalClicks to general 'clicks' (which will be world-specific)
  playSound: (url: string) => void;
}

const ClickZone: React.FC<ClickZoneProps> = ({ onClick, worldId, clicks, playSound }) => {
  const [clickKey, setClickKey] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Determine current image based on clicks
  const stages = CLICK_STAGES[worldId] || CLICK_STAGES[1]; // Fallback to World 1
  
  // Find the highest threshold met
  let currentStage = stages[0];
  for (let i = stages.length - 1; i >= 0; i--) {
     if (clicks >= stages[i].threshold) {
         currentStage = stages[i];
         break;
     }
  }

  const imageUrl = currentStage.image;
  const objectName = currentStage.name;
  const soundUrl = currentStage.sound;

  const handlePointerDown = (e: any) => {
     setClickKey(prev => prev + 1);
     playSound(soundUrl);
     onClick(e);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] relative w-full select-none">
       
       <div className="text-center z-10 mb-4">
           <h2 className="text-3xl font-bold text-gray-800 dark:text-white drop-shadow-sm dark:drop-shadow-md">{objectName}</h2>
           <div className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">Uderzenia: {clicks.toLocaleString()}</div>
       </div>
       
       <div 
         className="relative cursor-pointer select-none group touch-manipulation z-10"
         onPointerDown={handlePointerDown}
       >
          {!imgError ? (
             <img 
               key={`${imageUrl}-${clickKey}`}
               src={imageUrl} 
               alt={objectName} 
               onError={() => setImgError(true)}
               className="w-[250px] h-[250px] md:w-[350px] md:h-[350px] object-contain drop-shadow-2xl animate-click active:scale-95 transition-transform"
               draggable={false}
             />
          ) : (
             <div 
               key={`err-${clickKey}`}
               className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] flex items-center justify-center text-6xl bg-black/10 dark:bg-white/10 rounded-full animate-click active:scale-95 text-gray-400"
             >
                ?
             </div>
          )}
       </div>
       
       <div className="mt-8 text-gray-400 dark:text-gray-500 text-sm animate-pulse">
          Kliknij by kopać
       </div>
    </div>
  );
};

export default ClickZone;