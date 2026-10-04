import React, { useState } from 'react';
import { ArrowRight, ChevronRight, Check } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const slides = [
    {
      title: 'Track Your Money',
      subtitle: 'Know where your money goes every day.',
      description: 'Log daily expenses like canteen, metro, and mobile recharges in seconds with live budget limits.',
      icon: (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 text-white text-4xl">
            💳
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-md">
            ₹ Daily Cap
          </div>
        </div>
      ),
      highlightColor: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Plan Your Studies',
      subtitle: 'Keep assignments, subjects and study tasks organized.',
      description: 'Track daily revision, class timetables, and upcoming assignment deadlines so you never fall behind.',
      icon: (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-violet-500/30 text-white text-4xl">
            📚
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-2.5 py-1 text-xs font-bold text-violet-700 dark:text-violet-300 shadow-md">
            🔥 7d Streak
          </div>
        </div>
      ),
      highlightColor: 'from-violet-500 to-indigo-500',
    },
    {
      title: 'Reach Your Goals',
      subtitle: 'Set savings goals and track your progress.',
      description: 'Save up for earphones, laptops, and college trips with smart weekly savings targets and badges.',
      icon: (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30 text-white text-4xl">
            🎯
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 shadow-md">
            62.5% Saved
          </div>
        </div>
      ),
      highlightColor: 'from-amber-500 to-orange-500',
    },
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-6 bg-[#F4F6FB] dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-white overflow-hidden transition-colors">
      {/* Top Bar with Skip */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          Step {currentStep + 1} of {slides.length}
        </span>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex flex-col items-center text-center my-auto px-4 max-w-sm mx-auto">
        <div className="mb-8">{slide.icon}</div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          {slide.title}
        </h2>

        <p className="text-base font-semibold text-violet-600 dark:text-violet-300 mb-2">
          {slide.subtitle}
        </p>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">
          {slide.description}
        </p>

        {/* Dots indicator */}
        <div className="flex items-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentStep ? 'w-8 bg-violet-600 dark:bg-violet-400' : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="w-full max-w-sm mx-auto pb-4">
        {currentStep === slides.length - 1 ? (
          <button
            onClick={onComplete}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold text-base shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transform active:scale-98 transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <Check size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transform active:scale-98 transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
