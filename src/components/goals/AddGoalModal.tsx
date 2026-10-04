import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export const AddGoalModal: React.FC = () => {
  const { isAddGoalOpen, setIsAddGoalOpen, addGoal, profile } = useApp();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 86400000 * 60).toISOString().split('T')[0]
  );
  const [categoryIcon, setCategoryIcon] = useState('🎯');

  const icons = ['🎯', '🎧', '📱', '💻', '🏕️', '👟', '🚲', '📚', '🎒', '🎸'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initialSaved = parseFloat(currentAmount) || 0;

    if (!name.trim() || !target || target <= 0) return;

    addGoal({
      name: name.trim(),
      targetAmount: target,
      currentAmount: Math.min(target, Math.max(0, initialSaved)),
      deadline,
      categoryIcon,
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setIsAddGoalOpen(false);
  };

  return (
    <Modal
      isOpen={isAddGoalOpen}
      onClose={() => setIsAddGoalOpen(false)}
      title="Create Savings Goal"
      subtitle="Set a student target to save money consistently"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Icon picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Select Goal Icon
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {icons.map((ic) => (
              <button
                type="button"
                key={ic}
                onClick={() => setCategoryIcon(ic)}
                className={`w-10 h-10 flex-shrink-0 rounded-2xl flex items-center justify-center text-lg transition-all ${
                  categoryIcon === ic
                    ? 'bg-amber-500 text-white ring-2 ring-amber-400 scale-105 shadow-md shadow-amber-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Goal Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Goal Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. New Earphones, Laptop, Semester Trip"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Target Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Amount ({profile.currency})
          </label>
          <input
            type="number"
            required
            min="100"
            step="any"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="20000"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Initial Saved Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Already Saved Amount ({profile.currency}) (Optional)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Target Deadline */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Deadline
          </label>
          <input
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl font-bold text-sm shadow-lg shadow-amber-500/30 transition-all active:scale-98"
        >
          Create Goal
        </button>
      </form>
    </Modal>
  );
};
