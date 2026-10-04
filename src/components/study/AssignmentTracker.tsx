import React from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';
import {
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export const AssignmentTracker: React.FC = () => {
  const {
    assignments,
    toggleAssignmentStatus,
    deleteAssignment,
    setIsAddAssignmentOpen,
  } = useApp();

  // Helper to evaluate deadline status
  const getDeadlineInfo = (deadlineStr: string, status: string) => {
    if (status === 'Completed') {
      return { text: 'Submitted', isWarning: false, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800' };
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);

    const diffDays = Math.round((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue!', isWarning: true, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800' };
    }
    if (diffDays === 0) {
      return { text: 'Due Today!', isWarning: true, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800' };
    }
    if (diffDays === 1) {
      return { text: 'Due Tomorrow!', isWarning: true, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800' };
    }
    if (diffDays <= 3) {
      return { text: `Due in ${diffDays} days`, isWarning: true, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800' };
    }
    return { text: `Due in ${diffDays} days`, isWarning: false, color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-750' };
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'Medium':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            College Assignments & Projects
          </span>
          <p className="text-xs text-slate-400">Track deadlines with automatic warning indicators</p>
        </div>
        <button
          onClick={() => setIsAddAssignmentOpen(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95"
        >
          <Plus size={14} />
          <span>New Assignment</span>
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-4xl mb-1 block">📝</span>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No assignments added yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Stay ahead of college deadlines and avoid late submission penalties.
          </p>
          <button
            onClick={() => setIsAddAssignmentOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Your First Assignment</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((item) => {
            const isCompleted = item.status === 'Completed';
            const deadlineInfo = getDeadlineInfo(item.deadline, item.status);

            return (
              <div
                key={item.id}
                className={`p-4 rounded-3xl border transition-all space-y-3 ${
                  isCompleted
                    ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleAssignmentStatus(item.id)}
                      className="mt-1 text-violet-600 dark:text-violet-400 hover:scale-110 transition-transform"
                      title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={22} className="text-emerald-500 fill-emerald-500/20" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 hover:border-violet-500" />
                      )}
                    </button>

                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                        {item.subject}
                      </span>
                      <h4
                        className={`text-sm font-extrabold mt-1 ${
                          isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.name}
                      </h4>
                      {item.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAssignment(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                    title="Delete assignment"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Status Badges & Deadline Warning */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Priority badge */}
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getPriorityBadge(
                        item.priority
                      )}`}
                    >
                      {item.priority} Priority
                    </span>

                    {/* Status badge */}
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {item.status}
                    </span>
                  </div>

                  {/* Deadline badge with warning icon */}
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${deadlineInfo.color}`}
                  >
                    {deadlineInfo.isWarning && <AlertTriangle size={12} />}
                    <span>{deadlineInfo.text}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
