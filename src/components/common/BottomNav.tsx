import React from 'react';
import { Home, Wallet, BookOpen, Target, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setTab } = useApp();

  const tabs: { id: NavigationTab; label: string; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'money', label: 'Money', icon: Wallet },
    { id: 'study', label: 'Study', icon: BookOpen },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed md:absolute bottom-0 left-0 right-0 md:left-0 md:right-0 z-40 w-full max-w-[480px] mx-auto bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800/80 px-2 py-2 pb-safe shadow-lg transition-colors">
      <div className="w-full flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 select-none cursor-pointer ${
                isActive
                  ? 'text-violet-600 dark:text-white font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
            >
              {/* Active pill background */}
              {isActive && (
                <div className="absolute inset-0 bg-violet-50 dark:bg-gradient-to-r dark:from-violet-600/30 dark:to-indigo-600/30 rounded-2xl border border-violet-200 dark:border-violet-500/30 -z-10 shadow-xs" />
              )}
              <Icon
                size={21}
                className={`transition-transform duration-200 ${
                  isActive ? 'text-violet-600 dark:text-violet-400 -translate-y-0.5' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span
                className={`text-[11px] mt-1 ${
                  isActive
                    ? 'text-violet-700 dark:text-violet-200 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
