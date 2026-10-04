import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory } from '../../types';
import { Utensils, Bus, GraduationCap, ShoppingBag, Smartphone, Film, Tag } from 'lucide-react';

export const AddExpenseModal: React.FC = () => {
  const { isAddExpenseOpen, setIsAddExpenseOpen, addExpense, profile } = useApp();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');

  const categories: { label: ExpenseCategory; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { label: 'Food', icon: Utensils },
    { label: 'Travel', icon: Bus },
    { label: 'Education', icon: GraduationCap },
    { label: 'Shopping', icon: ShoppingBag },
    { label: 'Recharge', icon: Smartphone },
    { label: 'Entertainment', icon: Film },
    { label: 'Other', icon: Tag },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;

    // Save exactly what the user typed; if left empty, default to category name
    const finalTitle = title.trim() || category;

    addExpense({
      amount: parsed,
      category,
      date,
      note: finalTitle,
    });

    setAmount('');
    setTitle('');
    setIsAddExpenseOpen(false);
  };

  return (
    <Modal
      isOpen={isAddExpenseOpen}
      onClose={() => setIsAddExpenseOpen(false)}
      title="Add Expense"
      subtitle="Track your daily student spending"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Amount ({profile.currency})
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
              {profile.currency}
            </span>
            <input
              type="number"
              required
              min="1"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50"
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[20, 50, 100, 200, 500].map((val) => (
            <button
              type="button"
              key={val}
              onClick={() => setAmount(val.toString())}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0 cursor-pointer"
            >
              +{profile.currency}{val}
            </button>
          ))}
        </div>

        {/* Category Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.label;
              return (
                <button
                  type="button"
                  key={cat.label}
                  onClick={() => setCategory(cat.label)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/25'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} className="mb-1" />
                  <span className="text-[11px] font-medium leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Title / Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expense Title / Description
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Canteen snacks"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Leave empty to default to the category name ({category}).
          </p>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-600/30 transition-all active:scale-98 cursor-pointer"
        >
          Add Expense
        </button>
      </form>
    </Modal>
  );
};
