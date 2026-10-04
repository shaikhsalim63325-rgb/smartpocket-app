import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const DepositModal: React.FC = () => {
  const {
    isDepositModalOpen,
    closeDepositModal,
    selectedGoalForDeposit,
    depositToGoal,
    profile,
  } = useApp();

  const [amount, setAmount] = useState('');

  if (!selectedGoalForDeposit) return null;

  const remaining = Math.max(
    0,
    selectedGoalForDeposit.targetAmount - selectedGoalForDeposit.currentAmount
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    depositToGoal(selectedGoalForDeposit.id, val);
    setAmount('');
    closeDepositModal();
  };

  return (
    <Modal
      isOpen={isDepositModalOpen}
      onClose={closeDepositModal}
      title={`Deposit to "${selectedGoalForDeposit.name}"`}
      subtitle={`Remaining needed: ${profile.currency}${remaining.toLocaleString()}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Deposit Amount ({profile.currency})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
              {profile.currency}
            </span>
            <input
              type="number"
              required
              min="1"
              max={remaining}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500"
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Quick Deposit Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[100, 200, 500, 1000].map((v) => (
            <button
              type="button"
              key={v}
              onClick={() => setAmount(Math.min(v, remaining).toString())}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0"
            >
              +{profile.currency}{v}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount(remaining.toString())}
            className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 rounded-full text-xs font-bold border border-emerald-300 dark:border-emerald-700 transition-colors flex-shrink-0"
          >
            Deposit Full Remaining
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
        >
          Confirm Deposit
        </button>
      </form>
    </Modal>
  );
};
