import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';

export const AddTaskModal: React.FC = () => {
  const { isAddTaskOpen, setIsAddTaskOpen, addTask, subjects, addSubject } = useApp();

  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [isToday, setIsToday] = useState(true);

  // Quick subject add state
  const [isAddingNewSubject, setIsAddingNewSubject] = useState(subjects.length === 0);
  const [newSubjectName, setNewSubjectName] = useState('');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addSubject(newSubjectName.trim());
    setNewSubjectName('');
    setIsAddingNewSubject(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let chosenSubject = subjects.find((s) => s.id === subjectId) || subjects[0];
    let chosenName = chosenSubject ? chosenSubject.name : 'General Study';

    if (subjects.length === 0 || isAddingNewSubject) {
      if (newSubjectName.trim()) {
        addSubject(newSubjectName.trim());
        chosenName = newSubjectName.trim();
      }
    }

    addTask({
      subjectId: chosenSubject ? chosenSubject.id : 'sub-' + Date.now(),
      subjectName: chosenName,
      title: title.trim(),
      status: 'Pending',
      dueDate,
      isToday,
    });

    setTitle('');
    setNewSubjectName('');
    setIsAddTaskOpen(false);
  };

  return (
    <Modal
      isOpen={isAddTaskOpen}
      onClose={() => setIsAddTaskOpen(false)}
      title="Add Study Task"
      subtitle="Organize chapter revisions, assignments or practice questions"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Subject selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Subject
            </label>
            {subjects.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAddingNewSubject(!isAddingNewSubject)}
                className="text-xs text-violet-600 dark:text-violet-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus size={13} />
                <span>{isAddingNewSubject ? 'Select Existing' : 'New Subject'}</span>
              </button>
            )}
          </div>

          {subjects.length === 0 || isAddingNewSubject ? (
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                required={subjects.length === 0}
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g. Accounts, Economics, Stats"
                className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
              />
              {subjects.length > 0 && (
                <button
                  type="button"
                  onClick={handleCreateSubject}
                  className="px-3 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save
                </button>
              )}
            </div>
          ) : (
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.code ? `(${s.code})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Task Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Task Description
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Chapter 3 Revision, Solve 10 Questions"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Today's Task Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              Mark as Today's Task
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Display immediately on your Home dashboard
            </span>
          </div>
          <input
            type="checkbox"
            checked={isToday}
            onChange={(e) => setIsToday(e.target.checked)}
            className="w-5 h-5 accent-violet-600 rounded cursor-pointer"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Target Due Date
          </label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-600/30 transition-all active:scale-98 cursor-pointer"
        >
          Add Study Task
        </button>
      </form>
    </Modal>
  );
};
