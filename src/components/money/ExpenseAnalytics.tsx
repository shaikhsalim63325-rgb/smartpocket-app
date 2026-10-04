import React from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory } from '../../types';
import { TrendingUp, Award, AlertCircle, PieChart, Sparkles } from 'lucide-react';

export const ExpenseAnalytics: React.FC = () => {
  const { expenses, profile, totalExpenses } = useApp();

  const categories: ExpenseCategory[] = [
    'Food',
    'Travel',
    'Education',
    'Shopping',
    'Recharge',
    'Entertainment',
    'Other',
  ];

  // Colors & category meta
  const categoryMeta: Record<ExpenseCategory, { color: string; bg: string; icon: string }> = {
    Food: { color: 'bg-amber-500', bg: 'text-amber-500', icon: '🍔' },
    Travel: { color: 'bg-blue-500', bg: 'text-blue-500', icon: '🚌' },
    Education: { color: 'bg-emerald-500', bg: 'text-emerald-500', icon: '📚' },
    Shopping: { color: 'bg-purple-500', bg: 'text-purple-500', icon: '🛍️' },
    Recharge: { color: 'bg-cyan-500', bg: 'text-cyan-500', icon: '📱' },
    Entertainment: { color: 'bg-rose-500', bg: 'text-rose-500', icon: '🎬' },
    Other: { color: 'bg-slate-500', bg: 'text-slate-500', icon: '🏷️' },
  };

  // Group amounts by category
  const categoryBreakdown = categories.map((cat) => {
    const sum = expenses
      .filter((e) => e.category === cat)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const percent = totalExpenses > 0 ? Math.round((sum / totalExpenses) * 100) : 0;
    return {
      category: cat,
      amount: sum,
      percent,
      ...categoryMeta[cat],
    };
  }).filter((item) => item.amount > 0).sort((a, b) => b.amount - a.amount);

  const highestCategory = categoryBreakdown[0] || null;

  return (
    <div className="space-y-4">
      {/* Top Total Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm dark:shadow-xl flex items-center justify-between transition-colors">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
            Total Monthly Spending
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            {profile.currency}{totalExpenses.toLocaleString()}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Across {expenses.length} student transactions
          </span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <PieChart size={28} />
        </div>
      </div>

      {/* Smart Student Insights */}
      <div className="p-4 rounded-3xl bg-violet-50/70 dark:bg-gradient-to-r dark:from-violet-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-violet-200 dark:border-violet-800/30 text-slate-900 dark:text-white space-y-2.5 transition-colors">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500 dark:text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300">
            Smart Spending Insights
          </h4>
        </div>

        {highestCategory ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-violet-100 dark:border-slate-700/50 shadow-xs">
              <span className="text-base">{highestCategory.icon}</span>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">
                  Your highest spending category is {highestCategory.category}.
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                  It accounts for {highestCategory.percent}% ({profile.currency}
                  {highestCategory.amount.toLocaleString()}) of your total monthly pocket money.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-violet-100 dark:border-slate-700/50 shadow-xs">
              <span className="text-base">💡</span>
              <div>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Student Saving Opportunity</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
                  Packing your own canteen snacks and water can save you approximately{' '}
                  <span className="text-slate-900 dark:text-white font-bold">{profile.currency}250-400</span> per month!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">Log some expenses to generate smart insights!</p>
        )}
      </div>

      {/* Category Breakdown Bars */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Category Breakdown
        </h4>

        {categoryBreakdown.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No expense records yet.</p>
        ) : (
          <div className="space-y-3.5">
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      {item.percent}%
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {profile.currency}{item.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
