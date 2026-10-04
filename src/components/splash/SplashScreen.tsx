import React, { useEffect } from 'react';
import { Logo } from '../common/Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white cursor-pointer select-none overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div />

      {/* Main Center Brand */}
      <div className="flex flex-col items-center text-center relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="mb-6 transform hover:scale-105 transition-transform duration-300">
          <Logo size="xl" showText={false} />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          Smart<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Pocket</span>
        </h1>

        <p className="text-sm font-medium text-slate-300 max-w-xs px-4 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm mt-1">
          "Study Smart. Spend Smart. Save More."
        </p>

        <div className="flex items-center gap-1.5 mt-8">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
          <span className="text-xs text-slate-400 font-medium tracking-wide">Starting your smart student dashboard...</span>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 text-center pb-4">
        <p className="text-xs text-slate-500 hover:text-slate-400 transition-colors">
          Tap anywhere to skip
        </p>
      </div>
    </div>
  );
};
