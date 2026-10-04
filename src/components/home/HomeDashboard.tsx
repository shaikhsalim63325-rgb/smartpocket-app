import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CheckCircle2,
  Circle,
  Flame,
  Plus,
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
  Target,
} from 'lucide-react';
import { formatMoney } from '../../utils/format';

export const HomeDashboard: React.FC = () => {
  const {
    profile,
    totalExpenses,
    remainingBudget,
    totalSaved,
    goals,
    tasks,
    timetable,
    toggleTaskStatus,
    setTab,
    setIsAddExpenseOpen,
    setIsAddIncomeOpen,
    setIsAddGoalOpen,
    setIsAddTaskOpen,
    openDepositModal,
    nextUpcomingClass,
    dailyTarget,
    isDailyOverspent,
    todaySpent,
  } = useApp();

  // Personalized Greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Filter tasks for today's study section
  const todayTasks = tasks.filter((t) => t.isToday);

  // Featured Goal (first goal or null)
  const featuredGoal = goals[0] || null;
  const goalProgress = featuredGoal
    ? Math.min(100, Math.round((featuredGoal.currentAmount / Math.max(1, featuredGoal.targetAmount)) * 100))
    : 0;

  // Budget progress percentage
  const budgetUsagePercent = profile.monthlyBudget > 0
    ? Math.min(100, Math.round((totalExpenses / profile.monthlyBudget) * 100))
    : 0;

  const isOverBudget = remainingBudget <= 0;
  const isHighBudgetUsage = budgetUsagePercent >= 80;

  return (
    <div className="space-y-5 pb-24 animate-in fade-in duration-300">
      {/* 1. Header Greeting & Streak */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{getGreeting()}, {profile.name ? profile.name.split(' ')[0] : 'Student'}</span>
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {profile.course || 'Degree'} {profile.collegeName ? `• ${profile.collegeName}` : ''}
          </p>
        </div>

        {/* Study Streak Badge */}
        <div
          onClick={() => setTab('study')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 cursor-pointer hover:scale-105 transition-all shadow-sm"
          title="Current study streak"
        >
          <Flame size={18} className="fill-amber-500 text-amber-500" />
          <span className="text-xs font-extrabold tracking-tight">
            {profile.studyStreak} {profile.studyStreak === 1 ? 'Day' : 'Days'}
          </span>
        </div>
      </div>

      {/* Daily spending warning banner if overspent today */}
      {isDailyOverspent && (
        todaySpent > dailyTarget * 3 ? (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-900 dark:text-rose-200 text-xs">
            <AlertTriangle size={18} className="text-rose-500 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold">🚨 You've gone well over today's target: </span>
              <span>
                You spent {profile.currency}{todaySpent.toLocaleString()} today, which is over 3x your daily target of {profile.currency}{dailyTarget.toLocaleString()}/day. Consider pausing non-essential spending.
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs">
            <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold">⚠️ Daily Budget Reminder: </span>
              <span>
                You spent {profile.currency}{todaySpent.toLocaleString()} today (daily target: {profile.currency}{dailyTarget.toLocaleString()}/day). Keep an eye on small expenses!
              </span>
            </div>
          </div>
        )
      )}

      {/* 2. Financial Summary Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 p-6 text-white shadow-xl shadow-indigo-950/30 border border-indigo-800/40">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-violet-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              This Month
            </span>
            <button
              onClick={() => setTab('money')}
              className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-semibold transition-colors"
            >
              <span>Manage</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Primary highlights */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">Spent</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">
                  {profile.currency}{totalExpenses.toLocaleString()}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold flex items-center gap-1 mt-0.5 ${
                  budgetUsagePercent < 70
                    ? 'text-emerald-400'
                    : budgetUsagePercent < 85
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                <TrendingDown size={12} />
                <span>{budgetUsagePercent}% of budget</span>
              </span>
            </div>

            {/* Remaining budget with dynamic orange/red status when usage is above 80% */}
            <div>
              <span className="text-xs text-slate-400 font-medium block mb-1">Remaining</span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl sm:text-3xl font-extrabold ${
                    isOverBudget
                      ? 'text-rose-400'
                      : isHighBudgetUsage
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {formatMoney(remainingBudget, profile.currency)}
                </span>
              </div>
              <span
                className={`text-[11px] font-semibold flex items-center gap-1 mt-0.5 ${
                  isOverBudget
                    ? 'text-rose-400'
                    : isHighBudgetUsage
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {isOverBudget ? (
                  <>
                    <AlertTriangle size={12} />
                    <span>Over budget</span>
                  </>
                ) : isHighBudgetUsage ? (
                  <>
                    <AlertTriangle size={12} />
                    <span>Low budget remaining (&gt;80%)</span>
                  </>
                ) : (
                  <>
                    <TrendingUp size={12} />
                    <span>Safe to spend</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Budget Progress Bar */}
          <div className="space-y-1.5 mb-5">
            <div className="flex justify-between text-xs text-slate-300 font-medium">
              <span>Budget Usage</span>
              <span>
                {profile.currency}{totalExpenses.toLocaleString()} / {profile.currency}{profile.monthlyBudget.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  budgetUsagePercent >= 100
                    ? 'bg-rose-500'
                    : budgetUsagePercent >= 80
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
              />
            </div>
          </div>

          {/* Secondary stats strip: Total Saved & Daily Target (monthlyBudget / daysInMonth) */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <PiggyBank size={15} />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Total Saved</span>
                <span className="font-bold text-white">
                  {profile.currency}{totalSaved.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {profile.currency}
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Daily Target</span>
                <span className="font-bold text-emerald-300">
                  {profile.currency}{dailyTarget.toLocaleString()}/day
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Buttons */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Quick Actions
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-violet-500/50 hover:shadow-md transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Plus size={18} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 text-center leading-tight">
              Expense
            </span>
          </button>

          <button
            onClick={() => setIsAddIncomeOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Plus size={18} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 text-center leading-tight">
              Income
            </span>
          </button>

          <button
            onClick={() => setIsAddGoalOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-amber-500/50 hover:shadow-md transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Plus size={18} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 text-center leading-tight">
              Goal
            </span>
          </button>

          <button
            onClick={() => setIsAddTaskOpen(true)}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-sm hover:border-violet-500/50 hover:shadow-md transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Plus size={18} />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 text-center leading-tight">
              Task
            </span>
          </button>
        </div>
      </div>

      {/* 4. Savings Goal Card (or Friendly Empty State) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Savings Goal
          </span>
          {goals.length > 0 && (
            <button
              onClick={() => setTab('goals')}
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-0.5"
            >
              <span>View All ({goals.length})</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {featuredGoal ? (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  {featuredGoal.categoryIcon || '🎯'}
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {featuredGoal.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Target: {profile.currency}{featuredGoal.targetAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  {goalProgress}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">completed</span>
              </div>
            </div>

            {/* Goal Progress Bar */}
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 mb-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {profile.currency}{featuredGoal.currentAmount.toLocaleString()} / {profile.currency}{featuredGoal.targetAmount.toLocaleString()}
              </span>

              <button
                onClick={() => openDepositModal(featuredGoal)}
                className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                + Deposit
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-xl">
              🎯
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">No savings goals yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Save up for earphones, semester books, or your college trip with milestones.
            </p>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Your First Goal</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Today's Study Section */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base">📚</span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Study
            </span>
          </div>
          <button
            onClick={() => setTab('study')}
            className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-0.5"
          >
            <span>Study Hub</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
          {todayTasks.length === 0 ? (
            <div className="text-center py-7 px-4 text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <span className="text-2xl block">📖</span>
              <p className="font-bold text-slate-800 dark:text-slate-200">No study tasks scheduled for today</p>
              <p className="text-[11px] text-slate-400">
                Add a chapter revision or question set to build your study streak!
              </p>
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="mt-1 inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Your First Task</span>
              </button>
            </div>
          ) : (
            todayTasks.map((t) => {
              const isDone = t.status === 'Completed';
              return (
                <div
                  key={t.id}
                  onClick={() => toggleTaskStatus(t.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-violet-400/60 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button className="flex-shrink-0 text-violet-600 dark:text-violet-400">
                      {isDone ? (
                        <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <Circle size={22} className="text-slate-400 dark:text-slate-500" />
                      )}
                    </button>
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                        {t.subjectName}
                      </span>
                      {/* Explicit text color ensures crystal-clear readability in both light & dark mode */}
                      <p
                        className={`text-xs font-bold mt-1 text-slate-900 dark:text-white ${
                          isDone ? 'line-through opacity-50' : 'opacity-100'
                        }`}
                      >
                        {t.title}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {isDone ? 'Done' : 'Pending'}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 6. Next Class Card (or Empty State) */}
      {nextUpcomingClass ? (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                NEXT CLASS
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{nextUpcomingClass.subject}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                <span>{nextUpcomingClass.time}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-blue-600 dark:text-blue-300">
                  <MapPin size={11} />
                  <span>{nextUpcomingClass.room}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setTab('study')}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-white transition-colors cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ) : (
        timetable.length === 0 && (
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">No college classes added yet</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Set up your weekly timetable to see your next lecture here.
                </p>
              </div>
            </div>
            <button
              onClick={() => setTab('study')}
              className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer flex-shrink-0"
            >
              + Timetable
            </button>
          </div>
        )
      )}
    </div>
  );
};
