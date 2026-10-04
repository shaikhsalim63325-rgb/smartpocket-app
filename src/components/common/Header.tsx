import React from 'react';
import { Bell, Sun, Moon, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const {
    profile,
    unreadNotificationsCount,
    setIsNotificationOpen,
    setIsReportOpen,
    toggleDarkMode,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-white/92 dark:bg-slate-950/92 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 py-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <Logo size="sm" showText={true} />

        <div className="flex items-center gap-1.5">
          {/* Monthly Report Button */}
          <button
            onClick={() => setIsReportOpen(true)}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
            title="Monthly Report"
          >
            <FileText size={18} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
            title={profile.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {profile.isDarkMode ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-indigo-500" />
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
