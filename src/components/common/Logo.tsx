import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-20 h-20 rounded-3xl',
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 32,
    xl: 44,
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Wallet + Grad Cap fusion emblem */}
      <div
        className={`${sizeClasses[size]} bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 relative overflow-hidden flex-shrink-0`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
        <svg
          width={iconSizes[size]}
          height={iconSizes[size]}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative z-10 drop-shadow-sm"
        >
          {/* Graduation cap top */}
          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
          {/* Wallet body hanging underneath */}
          <path d="M5 13.5v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
          {/* Graduation tassel / coin latch */}
          <circle cx="12" cy="16.5" r="1.5" fill="white" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-slate-900 dark:text-white leading-none text-lg">
            Smart<span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">Pocket</span>
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
            Study • Spend • Save
          </span>
        </div>
      )}
    </div>
  );
};
