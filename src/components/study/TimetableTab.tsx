import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeekDay, TimetableClass } from '../../types';
import { Clock, MapPin, Plus, Trash2, User } from 'lucide-react';

export const TimetableTab: React.FC = () => {
  const { timetable, deleteClass, setIsAddClassOpen } = useApp();

  const days: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Current day of week for highlighting
  const currentDayIndex = new Date().getDay();
  const dayNames: WeekDay[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[currentDayIndex];

  const [selectedDay, setSelectedDay] = useState<WeekDay>(todayDayName || 'Monday');

  const filteredClasses = timetable.filter((c) => c.day === selectedDay);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Weekly Schedule
          </span>
          <p className="text-xs text-slate-400">Never miss a lecture or practical lab</p>
        </div>
        <button
          onClick={() => setIsAddClassOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95"
        >
          <Plus size={14} />
          <span>Add Class</span>
        </button>
      </div>

      {/* Day Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {days.map((d) => {
          const isSelected = selectedDay === d;
          const isToday = todayDayName === d;
          const count = timetable.filter((c) => c.day === d).length;

          return (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`flex flex-col items-center py-2 px-3 rounded-2xl border text-xs font-bold flex-shrink-0 transition-all ${
                isSelected
                  ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-500/25'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-[10px] uppercase font-semibold opacity-80">{d.slice(0, 3)}</span>
              <span className="text-xs font-extrabold mt-0.5">
                {count === 1 ? '1 class' : `${count} classes`}
              </span>
              {isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Class List */}
      <div className="space-y-2.5">
        {filteredClasses.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-3xl mb-1 block">🏖️</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No classes on {selectedDay}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Enjoy your self-study time, free period, or add a lecture.
            </p>
            <button
              onClick={() => setIsAddClassOpen(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>{timetable.length === 0 ? 'Add Your First Class' : `Add Class for ${selectedDay}`}</span>
            </button>
          </div>
        ) : (
          filteredClasses.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {item.subject}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-semibold text-violet-600 dark:text-violet-400">
                      {item.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-300">
                      <MapPin size={11} />
                      <span>{item.room}</span>
                    </span>
                  </div>
                  {item.instructor && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <User size={10} />
                      <span>{item.instructor}</span>
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteClass(item.id)}
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                title="Remove class"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
