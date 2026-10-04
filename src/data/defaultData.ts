import {
  UserProfile,
  Expense,
  Income,
  SavingsGoal,
  SavingsChallenge,
  Subject,
  StudyTask,
  TimetableClass,
  Assignment,
  AppNotification
} from '../types';

export const defaultProfile: UserProfile = {
  name: '',
  collegeName: '',
  course: '',
  year: '',
  monthlyBudget: 0,
  avatar: '🎓',
  currency: '₹',
  isDarkMode: true,
  notificationsEnabled: true,
  studyStreak: 0,
  bestStudyStreak: 0,
  challengePoints: 0,
};

// All initial datasets start completely empty for a new user
export const defaultExpenses: Expense[] = [];
export const defaultIncomes: Income[] = [];
export const defaultGoals: SavingsGoal[] = [];
export const defaultChallenges: SavingsChallenge[] = [];
export const defaultSubjects: Subject[] = [];
export const defaultTasks: StudyTask[] = [];
export const defaultTimetable: TimetableClass[] = [];
export const defaultAssignments: Assignment[] = [];
export const defaultNotifications: AppNotification[] = [];

// Preset challenge templates that a user can activate at any time
export const presetChallengeTemplates: Omit<SavingsChallenge, 'id' | 'completedDays' | 'isCompleted' | 'active'>[] = [
  {
    title: '7-Day No-Spend Challenge',
    description: 'Zero spending on outside cafes, junk food, and shopping for 7 days.',
    icon: '🔥',
    totalDays: 7,
    rewardPoints: 100,
  },
  {
    title: 'Save ₹500 in 30 Days',
    description: 'Set aside small daily savings into your personal savings jar.',
    icon: '💰',
    totalDays: 30,
    rewardPoints: 150,
  },
  {
    title: 'Reduce Canteen Spending',
    description: 'Cut daily canteen snacking in half by carrying home snacks and water.',
    icon: '🍔',
    totalDays: 14,
    rewardPoints: 120,
  },
  {
    title: 'Study 7 Days in a Row',
    description: 'Complete at least one academic revision task every single day.',
    icon: '📚',
    totalDays: 7,
    rewardPoints: 100,
  },
];
