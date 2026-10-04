import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { EditProfileModal } from './EditProfileModal';
import { DownloadReportModal } from './DownloadReportModal';
import { AboutPrivacyModal } from './AboutPrivacyModal';
import { PWAInstallItem } from '../common/PWAInstallItem';
import {
  User,
  School,
  BookOpen,
  Award,
  Flame,
  PiggyBank,
  TrendingDown,
  Moon,
  Sun,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  FileText,
  DollarSign,
  Download,
  FileDown,
  FileUp,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const ProfileDashboard: React.FC = () => {
  const {
    profile,
    expenses,
    incomes,
    goals,
    challenges,
    subjects,
    tasks,
    timetable,
    assignments,
    notifications,
    isOnboarded,
    totalSaved,
    totalExpenses,
    completedTasksCount,
    toggleDarkMode,
    resetAllData,
    restoreBackup,
    setIsReportOpen,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Backup & Restore states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImportData, setPendingImportData] = useState<any | null>(null);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  // 1. Export Backup as smartpocket-backup.json
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      appName: 'SmartPocket',
      exportedAt: new Date().toISOString(),
      data: {
        profile,
        expenses,
        incomes,
        goals,
        challenges,
        subjects,
        tasks,
        timetable,
        assignments,
        notifications,
        isOnboarded: true,
      },
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'smartpocket-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 2. Select file to import
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        const dataObj = parsed.data || parsed;
        if (!dataObj || typeof dataObj !== 'object') {
          throw new Error('The selected file does not contain valid JSON data.');
        }

        const hasProfile = !!dataObj.profile && typeof dataObj.profile === 'object';
        const hasExpenses = Array.isArray(dataObj.expenses);
        const hasTasks = Array.isArray(dataObj.tasks);
        const hasGoals = Array.isArray(dataObj.goals);

        if (!hasProfile && !hasExpenses && !hasTasks && !hasGoals) {
          throw new Error('The selected file is not a valid SmartPocket backup.');
        }

        setPendingImportData(parsed);
        setShowImportConfirm(true);
      } catch (err: any) {
        setImportError(
          err.message || 'Invalid backup file. Please ensure it is a valid smartpocket-backup.json file.'
        );
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (!pendingImportData) return;
    restoreBackup(pendingImportData);
    setShowImportConfirm(false);
    setPendingImportData(null);
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 4000);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* Hidden file input for backup restore */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json,application/json"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Success banner when backup restored */}
      {importSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
          <span className="font-bold">
            Backup restored successfully! All your data has been updated.
          </span>
        </div>
      )}

      {/* 1. Profile Hero Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white relative overflow-hidden shadow-sm dark:shadow-xl transition-colors">
        <div className="absolute top-0 right-0 w-36 h-36 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 border-2 border-violet-400/50 flex items-center justify-center text-3xl shadow-lg shadow-violet-600/30 flex-shrink-0">
              {profile.avatar || '🎓'}
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{profile.name || 'Student'}</h2>
              <p className="text-xs text-violet-600 dark:text-violet-300 font-semibold mt-0.5">
                {profile.course || 'Degree'} {profile.year ? `• ${profile.year}` : ''}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <School size={12} />
                <span>{profile.collegeName || 'College / University'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-violet-600 dark:text-violet-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>

      {/* 2. Key Statistics Grid */}
      <div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
          Student Statistics
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Total Saved */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-emerald-500">
              <PiggyBank size={18} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                Savings
              </span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white block mt-2">
              {profile.currency}{totalSaved.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block font-medium">Total Saved</span>
          </div>

          {/* Total Expenses */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-rose-500">
              <TrendingDown size={18} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60">
                Spends
              </span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white block mt-2">
              {profile.currency}{totalExpenses.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-400 block font-medium">Total Expenses</span>
          </div>

          {/* Study Tasks Completed */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-violet-500">
              <BookOpen size={18} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60">
                Study
              </span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white block mt-2">
              {completedTasksCount}
            </span>
            <span className="text-[11px] text-slate-400 block font-medium">
              {completedTasksCount === 1 ? 'Task Completed' : 'Tasks Completed'}
            </span>
          </div>

          {/* Current Streak */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-amber-500">
              <Flame size={18} />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60">
                Streak
              </span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white block mt-2">
              {profile.studyStreak} {profile.studyStreak === 1 ? 'Day' : 'Days'}
            </span>
            <span className="text-[11px] text-slate-400 block font-medium">
              Best: {profile.bestStudyStreak}d
            </span>
          </div>
        </div>

        {/* Challenge Points Banner */}
        <div className="mt-2.5 p-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
              🏆
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block">
                Challenge Reward Points
              </span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {profile.challengePoints} Points
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-amber-500">
            {profile.challengePoints >= 300 ? 'Gold Scholar' : 'Starter Scholar'}
          </span>
        </div>
      </div>

      {/* 3. Settings & Preferences */}
      <div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
          Preferences & Tools
        </span>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          {/* Monthly Report */}
          <button
            onClick={() => setIsReportOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Monthly Report
                </span>
                <span className="text-[11px] text-slate-400">
                  View full summary & savings breakdown
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          {/* Download Report in PDF / JPG */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Download size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Download Report (PDF / JPG)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
                    PDF & JPG
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Export official monthly student report easily
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-500" />
          </button>

          {/* Theme Mode Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-500/10 text-slate-500 dark:text-slate-300 flex items-center justify-center">
                {profile.isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Theme Mode
                </span>
                <span className="text-[11px] text-slate-400">
                  {profile.isDarkMode ? 'Dark Navy & Purple (Active)' : 'Crisp Light Mode (Active)'}
                </span>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                profile.isDarkMode ? 'bg-violet-600 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Install SmartPocket (PWA) */}
          <PWAInstallItem />

          {/* Currency Display & Change */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <DollarSign size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Currency Symbol
                </span>
                <span className="text-[11px] text-slate-400">
                  Currently using <span className="font-bold">{profile.currency}</span>
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>

          {/* 1. Export Backup */}
          <button
            onClick={handleExportBackup}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileDown size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Export Backup
                </span>
                <span className="text-[11px] text-slate-400">
                  Save all data as smartpocket-backup.json
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-violet-500" />
          </button>

          {/* 2. Import Backup */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileUp size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Import Backup
                </span>
                <span className="text-[11px] text-slate-400">
                  Restore data from a smartpocket-backup.json file
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-500" />
          </button>

          {/* 3. About & Privacy */}
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  About & Privacy
                </span>
                <span className="text-[11px] text-slate-400">
                  100% on-device data, privacy & disclaimer
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-emerald-500" />
          </button>

          {/* 4. Reset All Data */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <RotateCcw size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 block">
                  Reset All Data
                </span>
                <span className="text-[11px] text-slate-400">
                  Clear all data & start fresh for a new student
                </span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-rose-500" />
          </button>
        </div>
      </div>

      {/* App Branding Footer */}
      <div className="text-center pt-4">
        <p className="text-xs font-bold text-slate-400">
          SmartPocket v1.2.0 • Offline-first Student App
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          "Study Smart. Spend Smart. Save More."
        </p>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Download Report Modal (PDF / JPG) */}
      <DownloadReportModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* About & Privacy Modal */}
      <AboutPrivacyModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <RotateCcw size={24} />
            </div>

            <div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Reset All Data?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                This will completely erase all expenses, incomes, savings goals, study tasks, and profile details. The app will return to the first-time setup screen for a fresh user.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Confirmation Dialog */}
      {showImportConfirm && pendingImportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center mx-auto">
              <FileUp size={24} />
            </div>

            <div className="text-center">
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Restore Data from Backup?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will replace your current data with the backup file.
              </p>
            </div>

            {/* Backup Summary Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Student Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {pendingImportData.data?.profile?.name || pendingImportData.profile?.name || 'Student'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Expenses:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(pendingImportData.data?.expenses || pendingImportData.expenses || []).length} records
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Savings Goals:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(pendingImportData.data?.goals || pendingImportData.goals || []).length} goals
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Study Tasks:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {(pendingImportData.data?.tasks || pendingImportData.tasks || []).length} tasks
                </span>
              </div>
              {pendingImportData.exportedAt && (
                <div className="flex justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>Export Date:</span>
                  <span>{new Date(pendingImportData.exportedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setShowImportConfirm(false);
                  setPendingImportData(null);
                }}
                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmImport}
                className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white shadow-md shadow-violet-600/30 transition-all cursor-pointer"
              >
                Confirm & Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Error Dialog */}
      {importError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>

            <div>
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                Invalid Backup File
              </h4>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1.5 leading-relaxed">
                {importError}
              </p>
            </div>

            <button
              onClick={() => setImportError(null)}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
