import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useApp();

  const [name, setName] = useState(profile.name);
  const [collegeName, setCollegeName] = useState(profile.collegeName);
  const [course, setCourse] = useState(profile.course);
  const [year, setYear] = useState(profile.year);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [currency, setCurrency] = useState(profile.currency);

  const avatars = ['🎓', '🧑‍🎓', '👩‍🎓', '📚', '💼', '🚀', '⚡', '🎧', '🎯'];
  const currencies = ['₹', '$', '€', '£', 'AED', 'SGD'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || profile.name,
      collegeName: collegeName.trim() || profile.collegeName,
      course: course.trim() || profile.course,
      year: year.trim() || profile.year,
      avatar,
      currency,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Student Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Avatar Emoji
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {avatars.map((av) => (
              <button
                type="button"
                key={av}
                onClick={() => setAvatar(av)}
                className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center transition-all ${
                  avatar === av
                    ? 'bg-violet-600 text-white ring-2 ring-violet-400 scale-105 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Currency Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Currency Symbol
          </label>
          <div className="flex items-center gap-2">
            {currencies.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  currency === c
                    ? 'bg-violet-600 border-violet-500 text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            College Name
          </label>
          <input
            type="text"
            required
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course / Degree
            </label>
            <input
              type="text"
              required
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Year of Study
            </label>
            <input
              type="text"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-600/30 transition-all active:scale-98"
        >
          Save Changes
        </button>
      </form>
    </Modal>
  );
};
