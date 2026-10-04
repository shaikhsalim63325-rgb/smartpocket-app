import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  Calendar,
  AlertTriangle,
  Target,
  Clock,
  BookOpen,
} from 'lucide-react';
import { AppNotification } from '../../types';

export const NotificationDrawer: React.FC = () => {
  const {
    notifications,
    isNotificationOpen,
    setIsNotificationOpen,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    unreadNotificationsCount,
  } = useApp();

  if (!isNotificationOpen) return null;

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'assignment':
        return <Calendar className="text-amber-500" size={18} />;
      case 'budget':
        return <AlertTriangle className="text-rose-500" size={18} />;
      case 'goal':
        return <Target className="text-emerald-500" size={18} />;
      case 'class':
        return <Clock className="text-blue-500" size={18} />;
      default:
        return <BookOpen className="text-violet-500" size={18} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md h-[80vh] sm:h-[70vh] bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-violet-600 dark:text-violet-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Notifications
            </h3>
            {unreadNotificationsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {unreadNotificationsCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadNotificationsCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={17} />
              </button>
            )}
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs my-auto">
              <span className="text-3xl block mb-2">🎉</span>
              <p className="font-semibold text-slate-700 dark:text-slate-300">You're all caught up!</p>
              <p className="text-[11px] text-slate-400 mt-1">No alerts or warnings right now.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  n.read
                    ? 'bg-slate-50 dark:bg-slate-850/60 border-slate-200/80 dark:border-slate-800/60 opacity-75'
                    : 'bg-white dark:bg-slate-800 border-violet-300/80 dark:border-violet-700/80 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex-shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">{n.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={clearAllNotifications}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 size={13} />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
