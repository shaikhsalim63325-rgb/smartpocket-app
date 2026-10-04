import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseAnalytics } from './ExpenseAnalytics';
import { BudgetSettingsModal } from './BudgetSettingsModal';
import {
  TrendingDown,
  TrendingUp,
  Plus,
  Trash2,
  AlertTriangle,
  SlidersHorizontal,
  Calendar,
  CreditCard,
  PieChart,
} from 'lucide-react';
import { ExpenseCategory } from '../../types';
import { formatMoney } from '../../utils/format';

export const MoneyDashboard: React.FC = () => {
  const {
    profile,
    expenses,
    incomes,
    totalExpenses,
    totalIncome,
    netBalance,
    remainingBudget,
    dailyTarget,
    recommendedDailyBudget,
    daysInMonth,
    daysRemainingInMonth,
    todaySpent,
    isDailyOverspent,
    deleteExpense,
    deleteIncome,
    setIsAddExpenseOpen,
    setIsAddIncomeOpen,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'expenses' | 'income' | 'budget' | 'analytics'>(
    'expenses'
  );
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'expense' | 'income'; name: string } | null>(null);

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'Food': return '🍔';
      case 'Travel': return '🚌';
      case 'Education': return '📚';
      case 'Shopping': return '🛍️';
      case 'Recharge': return '📱';
      case 'Entertainment': return '🎬';
      default: return '🏷️';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Pocket Money': return '👨‍👩‍👧';
      case 'Part-time Job': return '💼';
      case 'Freelancing': return '💻';
      case 'Business': return '🏪';
      default: return '💰';
    }
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'expense') {
      deleteExpense(itemToDelete.id);
    } else {
      deleteIncome(itemToDelete.id);
    }
    setItemToDelete(null);
  };

  const budgetUsagePercent = profile.monthlyBudget > 0
    ? Math.min(100, Math.round((totalExpenses / profile.monthlyBudget) * 100))
    : 0;

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* 1. Net Balance Overview Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-slate-900 dark:text-white shadow-sm dark:shadow-xl transition-colors">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block mb-1">
          Net Student Balance
        </span>
        <div className="flex items-baseline justify-between mb-4">
          <span
            className={`text-3xl font-extrabold ${
              totalIncome === 0
                ? 'text-slate-700 dark:text-slate-200'
                : totalExpenses > totalIncome
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {totalIncome === 0
              ? `${profile.currency}0`
              : formatMoney(netBalance, profile.currency)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {totalIncome === 0
              ? 'Add income to track your balance'
              : '(Total Income - Total Expenses)'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Total Income</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {profile.currency}{totalIncome.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Total Spent</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {profile.currency}{totalExpenses.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub Tabs Header */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800">
        {(['expenses', 'income', 'budget', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
              activeSubTab === tab
                ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Tab Contents */}

      {/* EXPENSES TAB */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Logged Expenses ({expenses.length})
            </span>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Expense</span>
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-4xl block mb-1">🍽️</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No expenses logged yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Record your canteen snacks, metro tickets, mobile recharges, or stationery.
              </p>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Your First Expense</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {expenses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                      {getCategoryIcon(item.category)}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.note || item.category}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-rose-500 dark:text-rose-400">
                      -{profile.currency}{item.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        setItemToDelete({ id: item.id, type: 'expense', name: item.note || item.category })
                      }
                      className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Delete expense"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INCOME TAB */}
      {activeSubTab === 'income' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Income Sources ({incomes.length})
            </span>
            <button
              onClick={() => setIsAddIncomeOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Income</span>
            </button>
          </div>

          {incomes.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-4xl block mb-1">💵</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No income logged yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Record your monthly pocket money from parents, part-time stipend, or freelancing.
              </p>
              <button
                onClick={() => setIsAddIncomeOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Your First Income</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {incomes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex-shrink-0">
                      {getSourceIcon(item.source)}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.note || item.source}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                          {item.source}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                      +{profile.currency}{item.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        setItemToDelete({ id: item.id, type: 'income', name: item.note || item.source })
                      }
                      className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Delete income"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BUDGET TAB */}
      {activeSubTab === 'budget' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Monthly Budget Plan
            </span>
            <button
              onClick={() => setIsBudgetModalOpen(true)}
              className="flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
            >
              <SlidersHorizontal size={13} />
              <span>Adjust Budget</span>
            </button>
          </div>

          {/* Gentle / Strong Warning when daily recommended budget is exceeded */}
          {isDailyOverspent && (
            todaySpent > dailyTarget * 3 ? (
              <div className="p-4 rounded-3xl bg-rose-500/15 border border-rose-500/40 text-rose-900 dark:text-rose-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-600 dark:text-rose-400">
                  <AlertTriangle size={16} />
                  <span>🚨 You've gone well over today's target</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-6">
                  You spent {profile.currency}{todaySpent.toLocaleString()} today, which is over 3x your daily target of {profile.currency}{dailyTarget.toLocaleString()}/day. Consider pausing non-essential purchases for the next few days.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-3xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={16} />
                  <span>⚠️ You spent more than today's recommended budget.</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-6">
                  No worries at all! Just try to keep canteen snacks or outside travel minimal for the next 1-2 days to balance it out.
                </p>
              </div>
            )
          )}

          {/* Monthly Budget Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Budget</span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white block mt-0.5">
                  {profile.currency}{profile.monthlyBudget.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Spent so far</span>
                <span className="text-lg font-extrabold text-rose-500 block mt-0.5">
                  {profile.currency}{totalExpenses.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Remaining</span>
                <span className="text-lg font-extrabold text-emerald-500 block mt-0.5">
                  {formatMoney(remainingBudget, profile.currency)}
                </span>
              </div>
            </div>

            {/* Daily Target Calculation: Monthly Budget ÷ Days in Month */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-purple-600/10 border border-violet-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-700 dark:text-violet-300 flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>Daily Spending Target</span>
                </span>
                <span className="text-base font-extrabold text-violet-600 dark:text-violet-400">
                  {profile.currency}{dailyTarget.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400">/day</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Calculated as <span className="font-bold">monthly budget ÷ {daysInMonth} days in month</span> ({profile.currency}{dailyTarget.toLocaleString()}/day). {daysRemainingInMonth} days remaining in this month.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeSubTab === 'analytics' && <ExpenseAnalytics />}

      {/* Budget Adjust Modal */}
      <BudgetSettingsModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      {/* Confirmation Delete Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl text-center">
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Delete Entry?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Are you sure you want to remove "{itemToDelete.name}"?
            </p>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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
