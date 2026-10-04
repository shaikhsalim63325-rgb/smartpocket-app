import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { DownloadReportModal } from './DownloadReportModal';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Flame,
  Award,
  BookOpen,
  Calendar,
  Download,
} from 'lucide-react';

export const MonthlyReportModal: React.FC = () => {
  const {
    isReportOpen,
    setIsReportOpen,
    profile,
    totalIncome,
    totalExpenses,
    totalSaved,
    completedTasksCount,
    challenges,
  } = useApp();

  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const completedChallengesCount = challenges.filter((c) => c.isCompleted).length;

  const savingsRate = totalIncome > 0
    ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100))
    : 0;

  return (
    <Modal
      isOpen={isReportOpen}
      onClose={() => setIsReportOpen(false)}
      title={`${currentMonthName} ${currentYear} Report`}
      subtitle="Comprehensive overview of your studies and finances"
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Month Summary Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border border-indigo-800/40 text-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-300">
                Monthly Performance
              </span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">
                {currentMonthName} Summary
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              {savingsRate}% Net Saved
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Income</span>
              <span className="text-sm font-extrabold text-emerald-400">
                {profile.currency}{totalIncome.toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Expenses</span>
              <span className="text-sm font-extrabold text-rose-400">
                {profile.currency}{totalExpenses.toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Total Saved</span>
              <span className="text-sm font-extrabold text-indigo-300">
                {profile.currency}{totalSaved.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Academic Stats */}
        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Academic & Habit Achievements
          </h4>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-center text-violet-500 mb-1">
                <BookOpen size={18} />
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white block">
                {completedTasksCount}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {completedTasksCount === 1 ? 'Task Completed' : 'Tasks Completed'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-center text-amber-500 mb-1">
                <Flame size={18} />
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white block">
                {profile.bestStudyStreak}d
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                Best Streak
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-center text-emerald-500 mb-1">
                <Award size={18} />
              </div>
              <span className="text-lg font-extrabold text-slate-900 dark:text-white block">
                {completedChallengesCount}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block">
                {completedChallengesCount === 1 ? 'Challenge Won' : 'Challenges Won'}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Balance Visual Bar */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Expenses ({Math.round((totalExpenses / (totalIncome || 1)) * 100)}%)</span>
            <span>Surplus / Net Saved</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
            <div
              className="bg-rose-500 h-full"
              style={{
                width: `${Math.min(100, Math.round((totalExpenses / (totalIncome || 1)) * 100))}%`,
              }}
            />
            <div
              className="bg-emerald-500 h-full flex-1"
            />
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-1">
            You maintained healthy spending habits throughout {currentMonthName}. Keep it up!
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setIsDownloadOpen(true)}
            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs shadow-md shadow-violet-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-98"
          >
            <Download size={15} />
            <span>Download (PDF / JPG)</span>
          </button>

          <button
            onClick={() => setIsReportOpen(false)}
            className="py-3.5 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <DownloadReportModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </Modal>
  );
};
