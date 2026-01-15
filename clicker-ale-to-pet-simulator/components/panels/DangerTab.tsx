import React, { useState, useEffect } from 'react';
import { Skull, AlertTriangle } from 'lucide-react';

interface DangerTabProps {
  resetGame: () => void;
}

const DangerTab: React.FC<DangerTabProps> = ({ resetGame }) => {
  const [confirmStage, setConfirmStage] = useState(0); // 0 = normal, 1 = confirm

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (confirmStage === 1) {
      timer = setTimeout(() => {
        setConfirmStage(0);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [confirmStage]);

  const handleClick = () => {
    if (confirmStage === 0) {
      setConfirmStage(1);
    } else {
      resetGame();
    }
  };

  return (
    <div className="pb-20 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
       <div className="bg-red-950/40 p-8 rounded-3xl border-2 border-red-600/50 shadow-[0_0_50px_rgba(220,38,38,0.2)] max-w-lg w-full relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 animate-pulse"></div>

          <Skull size={80} className="text-red-500 mx-auto mb-6 animate-pulse" />
          
          <h2 className="text-4xl font-bold text-red-100 mb-2">STREFA ZERO</h2>
          <p className="text-red-300 mb-8 font-mono text-sm">
            Tutaj możesz całkowicie usunąć swój postęp.
          </p>

          <div className="bg-black/40 p-4 rounded-xl mb-8 text-left border border-red-500/20">
             <h3 className="font-bold text-red-400 flex items-center gap-2 mb-2">
                <AlertTriangle size={18} /> OSTRZEŻENIE
             </h3>
             <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                <li>Stracisz wszystkie Punkty i Ulepszenia.</li>
                <li>Stracisz wszystkie <strong>ZWIERZAKI</strong>.</li>
                <li>Stracisz Punkty Odrodzenia.</li>
                <li>Tej operacji <strong>NIE MOŻNA</strong> cofnąć.</li>
             </ul>
          </div>

          <button
             onClick={handleClick}
             className={`w-full py-6 rounded-xl font-bold text-2xl border-2 transition-all duration-200 transform active:scale-95 shadow-xl
                ${confirmStage === 0 
                   ? 'bg-red-900 border-red-700 text-red-200 hover:bg-red-800' 
                   : 'bg-red-600 border-white text-white animate-pulse hover:bg-red-500 scale-105'}
             `}
          >
             {confirmStage === 0 ? "RESETUJ GRĘ" : "POTWIERDŹ USUNIĘCIE"}
          </button>
          
          {confirmStage === 1 && (
             <p className="text-xs text-red-400 mt-2 animate-bounce">
                Kliknij ponownie, aby potwierdzić! (3s)
             </p>
          )}

          <div className="mt-8 text-xs text-gray-600 font-mono">
             ID SESAJA: {Date.now().toString(16).toUpperCase()}
          </div>
       </div>
    </div>
  );
};

export default DangerTab;