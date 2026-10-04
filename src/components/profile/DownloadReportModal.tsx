import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  School,
  User,
  Target,
  BookOpen,
  Flame,
  Award,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { formatMoney } from '../../utils/format';

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadReportModal: React.FC<DownloadReportModalProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    totalIncome,
    totalExpenses,
    remainingBudget,
    totalSaved,
    completedTasksCount,
    goals,
    expenses,
    challenges,
  } = useApp();

  const [loadingType, setLoadingType] = useState<'pdf' | 'jpg' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const printableReportRef = useRef<HTMLDivElement>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentDate = new Date();
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const monthKey = currentMonthName.toLowerCase();
  const baseFilename = `smartpocket-report-${monthKey}-${currentYear}`;

  // Category breakdown for report
  const categories = ['Food', 'Travel', 'Education', 'Shopping', 'Recharge', 'Entertainment', 'Other'] as const;
  const categorySummary = categories
    .map((cat) => {
      const sum = expenses
        .filter((e) => e.category === cat)
        .reduce((acc, curr) => acc + curr.amount, 0);
      const pct = totalExpenses > 0 ? Math.round((sum / totalExpenses) * 100) : 0;
      return { name: cat, sum, pct };
    })
    .filter((c) => c.sum > 0);

  // Helper to trigger normal browser anchor download with Blob & revoke afterwards
  const triggerAnchorDownload = (blob: Blob, filename: string) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke object URL after download initiates
    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 2000);
  };

  const handleDownloadJPG = async () => {
    if (!printableReportRef.current) return;
    setLoadingType('jpg');
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const canvas = await html2canvas(printableReportRef.current, {
        scale: 2, // High resolution for crisp text
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        windowWidth: 800,
      });

      await new Promise<void>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create image blob from report canvas.'));
              return;
            }
            triggerAnchorDownload(blob, `${baseFilename}.jpg`);
            resolve();
          },
          'image/jpeg',
          0.95
        );
      });

      setSuccessMessage(`Report successfully downloaded as ${baseFilename}.jpg`);
    } catch (err: any) {
      console.error('Error generating JPG report:', err);
      setErrorMessage(
        err?.message || 'Failed to generate JPG report. Please try again.'
      );
    } finally {
      setLoadingType(null);
    }
  };

  const handleDownloadPDF = async () => {
    if (!printableReportRef.current) return;
    setLoadingType('pdf');
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const canvas = await html2canvas(printableReportRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false,
        windowWidth: 800,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, 297));
      const pdfBlob = pdf.output('blob');
      triggerAnchorDownload(pdfBlob, `${baseFilename}.pdf`);

      setSuccessMessage(`Report successfully downloaded as ${baseFilename}.pdf`);
    } catch (err: any) {
      console.error('Error generating PDF report:', err);
      setErrorMessage(
        err?.message || 'Failed to generate PDF report. Please try again.'
      );
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Download Monthly Report"
      subtitle={`${currentMonthName} ${currentYear} • A4 Printable Summary`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-xs">
        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
            <span className="font-bold">{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-900 dark:text-rose-200 flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle size={18} className="text-rose-500 flex-shrink-0" />
            <span className="font-bold">{errorMessage}</span>
          </div>
        )}

        {/* Description Note */}
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Choose a format below to generate your student pocket money and study report. Everything is processed offline right inside your browser.
        </p>

        {/* 1. Two Primary Download Buttons with Loading States */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={loadingType !== null}
            className="p-4 rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold flex flex-col items-center justify-center gap-2 shadow-lg shadow-violet-600/25 transition-all active:scale-98 cursor-pointer disabled:cursor-not-allowed"
          >
            {loadingType === 'pdf' ? (
              <Loader2 size={24} className="animate-spin text-white" />
            ) : (
              <FileText size={24} />
            )}
            <span className="text-sm font-extrabold">
              {loadingType === 'pdf' ? 'Generating PDF...' : 'Download PDF'}
            </span>
            <span className="text-[10px] text-violet-200 font-medium">
              A4 Printable Document
            </span>
          </button>

          {/* Download JPG Button */}
          <button
            onClick={handleDownloadJPG}
            disabled={loadingType !== null}
            className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-98 cursor-pointer disabled:cursor-not-allowed"
          >
            {loadingType === 'jpg' ? (
              <Loader2 size={24} className="animate-spin text-white" />
            ) : (
              <ImageIcon size={24} />
            )}
            <span className="text-sm font-extrabold">
              {loadingType === 'jpg' ? 'Generating JPG...' : 'Download JPG'}
            </span>
            <span className="text-[10px] text-emerald-200 font-medium">
              High-DPI Gallery Image
            </span>
          </button>
        </div>

        {/* Mini Preview Accordion / Thumbnail */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
            Report Layout Preview
          </span>

          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span>Student:</span>
              <span className="font-bold text-slate-900 dark:text-white">{profile.name || 'Student'}</span>
            </div>
            <div className="flex justify-between">
              <span>Institution:</span>
              <span className="font-medium text-slate-900 dark:text-white">{profile.collegeName || 'College'}</span>
            </div>
            <div className="flex justify-between">
              <span>Month & Year:</span>
              <span className="font-bold text-slate-900 dark:text-white">{currentMonthName} {currentYear}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Expenses:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{profile.currency}{totalExpenses.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Budget:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(remainingBudget, profile.currency)}</span>
            </div>
          </div>
        </div>

        {/* 2. Hidden Pure-Light Printable Layout (captured by html2canvas) */}
        {/* We place it in the DOM with off-screen coordinates so it renders cleanly in light-background print layout */}
        <div
          style={{
            position: 'fixed',
            left: '-9999px',
            top: 0,
            width: '760px',
            backgroundColor: '#FFFFFF',
            color: '#0F172A',
            zIndex: -9999,
          }}
        >
          <div
            ref={printableReportRef}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              padding: '36px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              width: '760px',
              boxSizing: 'border-box',
            }}
          >
            {/* Header: Logo, Name & Period */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '2px solid #E2E8F0',
                paddingBottom: '20px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: '#FFFFFF',
                  }}
                >
                  🎓
                </div>
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: '22px',
                      fontWeight: '800',
                      letterSpacing: '-0.5px',
                      color: '#0F172A',
                    }}
                  >
                    Smart<span style={{ color: '#7C3AED' }}>Pocket</span>
                  </h1>
                  <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748B', fontWeight: '500' }}>
                    Student Pocket Money & Study Report
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    backgroundColor: '#EDE9FE',
                    color: '#6D28D9',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: '1px solid #DDD6FE',
                  }}
                >
                  {currentMonthName} {currentYear}
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>
                  Offline Verified Report
                </p>
              </div>
            </div>

            {/* Student Info Box */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                  {profile.name || 'Student'}
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#4F46E5', fontWeight: '600' }}>
                  {profile.course || 'Degree'} • {profile.year || '1st Year'}
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                  {profile.collegeName || 'College / University'}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    border: '1px solid #BBF7D0',
                  }}
                >
                  Active Student
                </span>
                <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#64748B' }}>
                  Currency: <strong>{profile.currency}</strong>
                </p>
              </div>
            </div>

            {/* Financial Overview (3 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  borderRadius: '14px',
                  padding: '14px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '11px', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>
                  Total Income
                </span>
                <span style={{ display: 'block', fontSize: '18px', fontWeight: '800', color: '#15803D', marginTop: '4px' }}>
                  {profile.currency}{totalIncome.toLocaleString()}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: '14px',
                  padding: '14px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '11px', color: '#991B1B', fontWeight: '700', textTransform: 'uppercase' }}>
                  Total Expenses
                </span>
                <span style={{ display: 'block', fontSize: '18px', fontWeight: '800', color: '#DC2626', marginTop: '4px' }}>
                  {profile.currency}{totalExpenses.toLocaleString()}
                </span>
              </div>

              <div
                style={{
                  backgroundColor: '#F5F3FF',
                  border: '1px solid #EDE9FE',
                  borderRadius: '14px',
                  padding: '14px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '11px', color: '#5B21B6', fontWeight: '700', textTransform: 'uppercase' }}>
                  Remaining Budget
                </span>
                <span style={{ display: 'block', fontSize: '18px', fontWeight: '800', color: '#6D28D9', marginTop: '4px' }}>
                  {formatMoney(remainingBudget, profile.currency)}
                </span>
              </div>
            </div>

            {/* Category-wise Breakdown */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
                Category-wise Spending Breakdown
              </h3>
              {categorySummary.length === 0 ? (
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                  No expenses recorded for this month.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {categorySummary.map((cat) => (
                    <div
                      key={cat.name}
                      style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#1E293B' }}>{cat.name}</span>
                        <div
                          style={{
                            width: '100px',
                            height: '5px',
                            backgroundColor: '#E2E8F0',
                            borderRadius: '999px',
                            marginTop: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${cat.pct}%`,
                              height: '100%',
                              backgroundColor: '#7C3AED',
                              borderRadius: '999px',
                            }}
                          />
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                          {profile.currency}{cat.sum.toLocaleString()}
                        </span>
                        <span style={{ display: 'block', fontSize: '10px', color: '#64748B' }}>
                          {cat.pct}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Savings Goals & Progress */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
                Savings Goals & Progress ({goals.length})
              </h3>
              {goals.length === 0 ? (
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                  No savings goals created yet.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {goals.slice(0, 4).map((goal) => {
                    const pct = Math.min(100, Math.round((goal.currentAmount / Math.max(1, goal.targetAmount)) * 100));
                    return (
                      <div
                        key={goal.id}
                        style={{
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                            {goal.categoryIcon || '🎯'} {goal.name}
                          </span>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#16A34A' }}>
                            {pct}%
                          </span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '6px',
                            backgroundColor: '#E2E8F0',
                            borderRadius: '999px',
                            overflow: 'hidden',
                            marginBottom: '6px',
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              backgroundColor: '#16A34A',
                              borderRadius: '999px',
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
                          <span>Saved: {profile.currency}{goal.currentAmount.toLocaleString()}</span>
                          <span>Target: {profile.currency}{goal.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Study & Discipline Metrics (Streak, Points, Tasks) */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', color: '#334155', textTransform: 'uppercase' }}>
                Study Productivity & Discipline
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>📚</span>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                    {completedTasksCount} {completedTasksCount === 1 ? 'Task' : 'Tasks'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Tasks Completed</span>
                </div>

                <div
                  style={{
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FEF3C7',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>🔥</span>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: '#D97706', marginTop: '2px' }}>
                    {profile.studyStreak} {profile.studyStreak === 1 ? 'Day' : 'Days'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#92400E' }}>Active Study Streak</span>
                </div>

                <div
                  style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '12px',
                    padding: '12px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>🏆</span>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: '800', color: '#B45309', marginTop: '2px' }}>
                    {profile.challengePoints} Pts
                  </span>
                  <span style={{ fontSize: '10px', color: '#92400E' }}>Challenge Reward Points</span>
                </div>
              </div>
            </div>

            {/* Footer Line */}
            <div
              style={{
                borderTop: '1px solid #E2E8F0',
                paddingTop: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: '#64748B',
              }}
            >
              <span>Generated by SmartPocket. For tracking only, not financial advice.</span>
              <span>Generated: {currentDate.toISOString().split('T')[0]}</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};
