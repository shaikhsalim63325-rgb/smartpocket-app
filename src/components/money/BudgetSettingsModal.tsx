import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetSettingsModal: React.FC<BudgetSettingsModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateBudget, remainingBudget, daysRemainingInMonth, recommendedDailyBudget } = useApp();
  const [budgetVal, setBudgetVal] = useState(profile.monthlyBudget.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(budgetVal);
    if (!num || num <= 0) return;
    updateBudget(num);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Monthly Budget"
      subtitle="Recalculate your daily recommended spending limits"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Total Monthly Budget ({profile.currency})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
              {profile.currency}
            </span>
            <input
              type="number"
              required
              min="500"
              step="100"
              value={budgetVal}
              onChange={(e) => setBudgetVal(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Quick Budget Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[3000, 5000, 8000, 10000, 15000].map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setBudgetVal(v.toString())}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0"
            >
              {profile.currency}{v.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1.5">
          <p className="font-semibold">💡 Student Spending Formula:</p>
          <p>
            Days left in month: <span className="font-bold">{daysRemainingInMonth} days</span>
          </p>
          <p>
            Current recommended daily budget:{' '}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {profile.currency}{recommendedDailyBudget}/day
            </span>
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-600/30 transition-all active:scale-98"
        >
          Save Budget
        </button>
      </form>
    </Modal>
  );
};
