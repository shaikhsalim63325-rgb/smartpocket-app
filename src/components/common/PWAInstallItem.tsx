import React, { useState } from 'react';
import { Smartphone, Download, ChevronRight, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../utils/usePWAInstall';

export const PWAInstallItem: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, show a neat badge
  if (isInstalled) {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Check size={18} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              SmartPocket App Installed
            </span>
            <span className="text-[11px] text-slate-400">
              Running as standalone offline PWA
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
          Installed
        </span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else if (isIOS) {
            setShowIOSGuide(true);
          } else {
            // For desktop/android browsers when beforeinstallprompt has not fired yet, show info
            setShowIOSGuide(true);
          }
        }}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Smartphone size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Install SmartPocket (PWA)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-400 text-[10px] font-bold border border-violet-500/30">
                Offline Ready
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Add to Home Screen for fast offline access
            </span>
          </div>
        </div>
        <ChevronRight size={16} className="text-slate-400 group-hover:text-violet-500" />
      </button>

      {/* Install Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-600 flex items-center justify-center mb-3">
              <Download size={22} />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Install SmartPocket App
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 leading-relaxed">
              Install SmartPocket onto your device for full-screen view and 100% offline access:
            </p>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-5">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  1
                </span>
                <span>
                  Tap browser <strong>Share</strong> (or Menu <strong>⋮</strong>) in the toolbar.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  2
                </span>
                <span>
                  Select <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                  3
                </span>
                <span>Launch SmartPocket directly from your home screen!</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
