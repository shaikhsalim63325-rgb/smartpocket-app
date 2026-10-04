import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavingsGoal, SavingsChallenge } from '../../types';
import { presetChallengeTemplates } from '../../data/defaultData';
import {
  Target,
  Plus,
  Flame,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  Trash2,
  TrendingUp,
} from 'lucide-react';

export const GoalsDashboard: React.FC = () => {
  const {
    goals,
    challenges,
    profile,
    totalSaved,
    setIsAddGoalOpen,
    openDepositModal,
    deleteGoal,
    checkInChallenge,
    startPresetChallenge,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'goals' | 'challenges'>('goals');
  const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);

  // Calculate suggested savings rate
  const calculateSavingsPlan = (goal: SavingsGoal) => {
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    if (remaining === 0) return '🎉 Target fully reached!';

    const now = new Date();
    const deadlineDate = new Date(goal.deadline);
    const diffDays = Math.max(1, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const diffWeeks = Math.max(1, Math.ceil(diffDays / 7));
    const weeklyAmount = Math.ceil(remaining / diffWeeks);

    return `Save approximately ${profile.currency}${weeklyAmount.toLocaleString()} per week to reach your goal on time.`;
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* 1. Header Overview Banner */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-slate-900 dark:text-white shadow-sm dark:shadow-xl flex items-center justify-between transition-colors">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
            Total Student Savings
          </span>
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block mt-1">
            {profile.currency}{totalSaved.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
            {goals.length} Active {goals.length === 1 ? 'Target' : 'Targets'} • {profile.challengePoints} Reward Points 🏆
          </span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Target size={28} />
        </div>
      </div>

      {/* 2. Sub Tabs Toggle: Goals vs Challenges */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'goals'
              ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Target size={14} />
          <span>Savings Goals ({goals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'challenges'
              ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Award size={14} />
          <span>Challenges ({challenges.length})</span>
        </button>
      </div>

      {/* 3. GOALS TAB */}
      {activeTab === 'goals' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              My Savings Targets
            </span>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Goal</span>
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-4xl block mb-1">🎯</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No savings goals created yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Start saving for new earphones, semester books, or your college trip!
              </p>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/25 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Your First Goal</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.map((goal) => {
                const percent = Math.min(
                  100,
                  Math.round((goal.currentAmount / Math.max(1, goal.targetAmount)) * 100)
                );
                const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
                const isComplete = goal.currentAmount >= goal.targetAmount;

                return (
                  <div
                    key={goal.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-violet-500/40 transition-all space-y-3.5 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          {goal.categoryIcon || '🎯'}
                        </span>
                        <div>
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{goal.name}</span>
                            {isComplete && <span className="text-xs">🏆</span>}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              <span>Due {goal.deadline}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span
                            className={`text-sm font-extrabold block ${
                              isComplete ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {percent}%
                          </span>
                          <span className="text-[10px] text-slate-400">completed</span>
                        </div>
                        <button
                          onClick={() => setGoalToDelete(goal)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors ml-1 cursor-pointer"
                          title="Delete goal"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Saved: {profile.currency}{goal.currentAmount.toLocaleString()}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          Target: {profile.currency}{goal.targetAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Remaining and Suggested Weekly Plan */}
                    <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-bold block">
                          Remaining: {profile.currency}{remaining.toLocaleString()}
                        </span>
                        <span className="text-[11px] text-indigo-700 dark:text-indigo-300">
                          {calculateSavingsPlan(goal)}
                        </span>
                      </div>

                      {!isComplete && (
                        <button
                          onClick={() => openDepositModal(goal)}
                          className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 flex-shrink-0 cursor-pointer"
                        >
                          <Plus size={13} />
                          <span>Deposit</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. SAVINGS CHALLENGES TAB */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Student Savings & Habit Challenges
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Award size={15} />
              <span>{profile.challengePoints} Pts</span>
            </div>
          </div>

          {challenges.length === 0 ? (
            <div className="space-y-4">
              <div className="p-6 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-3xl block">🏆</span>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  No active challenges yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Pick a challenge below to stay disciplined with pocket money and build a daily study habit!
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
                  Available Challenges
                </span>
                <div className="space-y-2.5">
                  {presetChallengeTemplates.map((t) => (
                    <div
                      key={t.title}
                      className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800">
                          {t.icon}
                        </span>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                            {t.title}
                          </h5>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {t.description}
                          </p>
                          <span className="text-[10px] font-semibold text-amber-500 mt-0.5 block">
                            {t.totalDays} Days • +{t.rewardPoints} Reward Points
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => startPresetChallenge(t.title)}
                        className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer flex-shrink-0"
                      >
                        Start
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {challenges.map((c) => {
                const progressPct = Math.min(100, Math.round((c.completedDays / Math.max(1, c.totalDays)) * 100));
                const isCheckedInToday = c.lastCheckInDate === new Date().toISOString().split('T')[0];

                return (
                  <div
                    key={c.id}
                    className={`p-5 rounded-3xl border transition-all space-y-3 ${
                      c.isCompleted
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                          {c.icon}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{c.title}</span>
                            {c.isCompleted && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                                🏆 Completed
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {c.description}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex-shrink-0">
                        +{c.rewardPoints} pts
                      </span>
                    </div>

                    {/* Progress info */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <span>
                          Progress: {c.completedDays} / {c.totalDays} Days
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {progressPct}%
                        </span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            c.isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Check-in button */}
                    {!c.isCompleted && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-400">
                          {isCheckedInToday
                            ? '✓ Checked in today! Return tomorrow.'
                            : 'Tap to check in for today!'}
                        </span>

                        <button
                          onClick={() => checkInChallenge(c.id)}
                          disabled={isCheckedInToday}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCheckedInToday
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/20 active:scale-95'
                          }`}
                        >
                          {isCheckedInToday ? 'Done Today' : 'Daily Check-In +1d'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Delete Goal Modal */}
      {goalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl text-center">
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Delete Savings Goal?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Remove "{goalToDelete.name}"? Your saved total will be adjusted.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setGoalToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteGoal(goalToDelete.id);
                  setGoalToDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
