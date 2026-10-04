import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { WeekDay } from '../../types';

export const AddClassModal: React.FC = () => {
  const { isAddClassOpen, setIsAddClassOpen, addClass, subjects } = useApp();

  const days: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [day, setDay] = useState<WeekDay>('Monday');
  const [time, setTime] = useState('10:00 AM - 11:00 AM');
  const [subject, setSubject] = useState(subjects[0]?.name || 'Economics');
  const [room, setRoom] = useState('Room 204');
  const [instructor, setInstructor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !time.trim()) return;

    addClass({
      day,
      time: time.trim(),
      subject: subject.trim(),
      room: room.trim() || 'TBA',
      instructor: instructor.trim(),
    });

    setIsAddClassOpen(false);
  };

  return (
    <Modal
      isOpen={isAddClassOpen}
      onClose={() => setIsAddClassOpen(false)}
      title="Add Timetable Class"
      subtitle="Schedule lecture or practical lab slot"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Day of Week */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Day
          </label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value as WeekDay)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Subject
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Economics, Financial Accounting"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Time slot */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Time Slot
          </label>
          <input
            type="text"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 10:00 AM - 11:00 AM"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Room & Instructor */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Room / Hall
            </label>
            <input
              type="text"
              required
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room 204"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Professor (Optional)
            </label>
            <input
              type="text"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Dr. Sen"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-600/30 transition-all active:scale-98"
        >
          Add to Timetable
        </button>
      </form>
    </Modal>
  );
};
