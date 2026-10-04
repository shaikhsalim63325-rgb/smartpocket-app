import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimetableTab } from './TimetableTab';
import { AssignmentTracker } from './AssignmentTracker';
import {
  Flame,
  Plus,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export const StudyDashboard: React.FC = () => {
  const {
    tasks,
    subjects,
    profile,
    toggleTaskStatus,
    deleteTask,
    setIsAddTaskOpen,
    completedTasksCount,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'timetable' | 'assignments'>('tasks');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.isToday || t.dueDate === todayStr);
  const upcomingTasks = tasks.filter((t) => !t.isToday && t.dueDate !== todayStr);

  const filteredTasks =
    selectedSubjectFilter === 'all'
      ? tasks
      : tasks.filter((t) => t.subjectId === selectedSubjectFilter);

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
      {/* 1. Study Streak & Motivational Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Flame size={20} className="fill-amber-300 text-amber-200 animate-bounce" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-200">
                Study Streak
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              🔥 {profile.studyStreak} {profile.studyStreak === 1 ? 'Day' : 'Days'} Streak
            </h2>
            <p className="text-xs text-amber-100 font-semibold mt-1">
              {profile.studyStreak > 0
                ? 'Great work! Keep your streak going.'
                : 'Complete a task today to start your study streak!'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-black/20 text-white backdrop-blur-sm block">
              Best: {profile.bestStudyStreak} {profile.bestStudyStreak === 1 ? 'Day' : 'Days'}
            </span>
            {/* Grammar fix: 1 task finished vs X tasks finished */}
            <span className="text-[10px] text-amber-200 block mt-1 font-semibold">
              {completedTasksCount === 1 ? '1 task finished' : `${completedTasksCount} tasks finished`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sub Tabs Toggle */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'tasks'
              ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen size={14} />
          <span>Tasks & Subjects</span>
        </button>

        <button
          onClick={() => setActiveTab('timetable')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'timetable'
              ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Calendar size={14} />
          <span>Timetable</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck size={14} />
          <span>Assignments</span>
        </button>
      </div>

      {/* 3. TASKS & SUBJECTS TAB */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Subjects Horizontal Strip */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Subjects ({subjects.length})
              </span>
              <button
                onClick={() => setIsAddTaskOpen(true)}
                className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Task</span>
              </button>
            </div>

            {subjects.length === 0 ? (
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>No subjects added yet.</span>
                <button
                  onClick={() => setIsAddTaskOpen(true)}
                  className="text-violet-600 dark:text-violet-400 font-bold hover:underline"
                >
                  + Add Subject
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedSubjectFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                    selectedSubjectFilter === 'all'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  All Subjects
                </button>
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectFilter(sub.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 cursor-pointer ${
                      selectedSubjectFilter === sub.id
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Today's Tasks */}
          {selectedSubjectFilter === 'all' && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Today's Tasks ({todayTasks.length})
              </span>

              {todayTasks.length === 0 ? (
                <div className="p-6 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    No study tasks scheduled for today
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Add a quick revision or practice questions to boost your streak.
                  </p>
                  <button
                    onClick={() => setIsAddTaskOpen(true)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Task for Today</span>
                  </button>
                </div>
              ) : (
                todayTasks.map((t) => {
                  const isDone = t.status === 'Completed';
                  return (
                    <div
                      key={t.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskStatus(t.id)}
                          className="flex-shrink-0 text-violet-600 dark:text-violet-400 hover:scale-110 transition-transform cursor-pointer"
                        >
                          {isDone ? (
                            <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-500/20" />
                          ) : (
                            <Circle size={22} className="text-slate-400" />
                          )}
                        </button>
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                            {t.subjectName}
                          </span>
                          <p
                            className={`text-xs font-bold mt-1 text-slate-900 dark:text-white ${
                              isDone ? 'line-through opacity-50' : 'opacity-100'
                            }`}
                          >
                            {t.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-slate-400">
                          {isDone ? 'Done' : 'Today'}
                        </span>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Upcoming / Filtered Tasks */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {selectedSubjectFilter === 'all'
                ? `Upcoming Tasks (${upcomingTasks.length})`
                : `Tasks (${filteredTasks.length})`}
            </span>

            {(selectedSubjectFilter === 'all' ? upcomingTasks : filteredTasks).length === 0 ? (
              <div className="p-6 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  No upcoming study tasks found
                </p>
                <p className="text-[11px] text-slate-400">
                  Plan ahead by adding homework, revision chapters, or exam practice.
                </p>
                <button
                  onClick={() => setIsAddTaskOpen(true)}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Study Task</span>
                </button>
              </div>
            ) : (
              (selectedSubjectFilter === 'all' ? upcomingTasks : filteredTasks).map((t) => {
                const isDone = t.status === 'Completed';
                return (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaskStatus(t.id)}
                        className="flex-shrink-0 text-violet-600 dark:text-violet-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        {isDone ? (
                          <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-500/20" />
                        ) : (
                          <Circle size={22} className="text-slate-400" />
                        )}
                      </button>
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                          {t.subjectName}
                        </span>
                        <p
                          className={`text-xs font-bold mt-1 text-slate-900 dark:text-white ${
                            isDone ? 'line-through opacity-50' : 'opacity-100'
                          }`}
                        >
                          {t.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {t.dueDate}
                      </span>
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 4. TIMETABLE TAB */}
      {activeTab === 'timetable' && <TimetableTab />}

      {/* 5. ASSIGNMENTS TAB */}
      {activeTab === 'assignments' && <AssignmentTracker />}
    </div>
  );
};
