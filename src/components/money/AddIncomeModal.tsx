import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { IncomeSource } from '../../types';
import { Wallet, Briefcase, Laptop, Store, PlusCircle } from 'lucide-react';

export const AddIncomeModal: React.FC = () => {
  const { isAddIncomeOpen, setIsAddIncomeOpen, addIncome, profile } = useApp();

  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<IncomeSource>('Pocket Money');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const sources: { label: IncomeSource; icon: React.FC<{ size?: number; className?: string }> }[] = [
    { label: 'Pocket Money', icon: Wallet },
    { label: 'Part-time Job', icon: Briefcase },
    { label: 'Freelancing', icon: Laptop },
    { label: 'Business', icon: Store },
    { label: 'Other', icon: PlusCircle },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;

    addIncome({
      amount: parsed,
      source,
      date,
      note: note.trim() || `${source} deposit`,
    });

    setAmount('');
    setNote('');
    setIsAddIncomeOpen(false);
  };

  return (
    <Modal
      isOpen={isAddIncomeOpen}
      onClose={() => setIsAddIncomeOpen(false)}
      title="Add Income"
      subtitle="Record pocket money, freelance stipend or savings"
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
              placeholder="1000"
              autoFocus
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xl font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[500, 1000, 2000, 5000].map((val) => (
            <button
              type="button"
              key={val}
              onClick={() => setAmount(val.toString())}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex-shrink-0"
            >
              +{profile.currency}{val}
            </button>
          ))}
        </div>

        {/* Source Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Income Source
          </label>
          <div className="grid grid-cols-2 gap-2">
            {sources.map((item) => {
              const Icon = item.icon;
              const isSelected = source === item.label;
              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => setSource(item.label)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-left ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note / Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Note / Details
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Monthly stipend or PPT presentation design"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
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
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all active:scale-98"
        >
          Add Income
        </button>
      </form>
    </Modal>
  );
};
