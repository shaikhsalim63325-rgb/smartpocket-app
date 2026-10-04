import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, Info, Mail, Copy, Check, Lock, Smartphone } from 'lucide-react';

interface AboutPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutPrivacyModal: React.FC<AboutPrivacyModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const contactEmail = 'pocketsmartofficial@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About & Privacy"
      subtitle="100% Private, Offline-first Student Tracker"
    >
      <div className="space-y-4 text-xs">
        {/* Privacy Highlight Card */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <ShieldCheck size={20} />
            <span>Your Privacy Comes First</span>
          </div>
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            SmartPocket does not collect, store or share any personal data. Everything stays on your device. Clearing browser data or changing phones will erase it, so use Export Backup regularly.
          </p>
        </div>

        {/* Financial Disclaimer Card */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <Info size={18} />
            <span>Disclaimer</span>
          </div>
          <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            SmartPocket is for tracking only and is not financial advice.
          </p>
        </div>

        {/* App Version Info */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-600/10 text-violet-500 flex items-center justify-center">
              <Lock size={16} />
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-white block">SmartPocket Edition</span>
              <span className="text-[11px] text-slate-400">Client-side & Offline Local Storage</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-[11px] border border-violet-500/20">
            v1.2.0
          </span>
        </div>

        {/* Contact Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Support & Feedback Contact
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400">
              <Mail size={16} />
            </div>
            <input
              type="email"
              readOnly
              value={contactEmail}
              placeholder="pocketsmartofficial@gmail.com"
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Questions, feedback or suggestions? We'd love to hear from fellow students.
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-xs transition-colors mt-2 cursor-pointer"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
