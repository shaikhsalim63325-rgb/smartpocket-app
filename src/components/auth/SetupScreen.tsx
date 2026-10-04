import React, { useState } from 'react';
import { User, School, BookOpen, Calendar, DollarSign, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';

interface SetupScreenProps {
  onFinish: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onFinish }) => {
  const { completeOnboarding } = useApp();

  const [name, setName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('1st Year');
  const [currency, setCurrency] = useState('₹');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [avatar, setAvatar] = useState('🎓');

  const avatarOptions = ['🎓', '🧑‍🎓', '👩‍🎓', '📚', '💼', '🚀', '⚡', '🎧', '💡', '🎯'];
  const currencyOptions = ['₹', '$', '€', '£', 'AED', 'SGD'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgrad'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const budgetNum = Math.max(0, parseFloat(monthlyBudget) || 0);

    completeOnboarding({
      name: name.trim(),
      collegeName: collegeName.trim() || 'College',
      course: course.trim() || 'Degree',
      year,
      avatar,
      currency,
      monthlyBudget: budgetNum,
      studyStreak: 0,
      bestStudyStreak: 0,
      challengePoints: 0,
    });

    onFinish();
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-white flex flex-col justify-center px-4 py-8 transition-colors">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-xl transition-colors">
        <div className="flex items-center justify-between mb-6">
          <Logo size="md" showText={true} />
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
            Step 1 of 1
          </span>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Your Profile</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Welcome! Set up your student profile to personalize your budget, timetable, and study streak.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Choose Avatar Emoji
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {avatarOptions.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`w-10 h-10 flex-shrink-0 rounded-2xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                    avatar === av
                      ? 'bg-violet-600 ring-2 ring-violet-400 scale-105 shadow-md shadow-violet-500/30 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name <span className="text-violet-500 dark:text-violet-400">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* College Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              College / University Name
            </label>
            <div className="relative">
              <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g. National College of Arts & Science"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Course & Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course / Degree</label>
              <div className="relative">
                <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="e.g. B.Tech / B.Com"
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Year of Study</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Currency selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Currency Symbol
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {currencyOptions.map((curr) => (
                <button
                  type="button"
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    currency === curr
                      ? 'bg-violet-600 border-violet-500 text-white shadow-sm ring-2 ring-violet-400/30'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Estimated Monthly Budget ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                {currency}
              </span>
              <input
                type="number"
                min="0"
                step="100"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Used to calculate your daily spending targets and savings recommendations.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 mt-6 cursor-pointer"
          >
            <span>Start Managing Pocket Money</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
