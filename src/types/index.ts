export type ExpenseCategory =
  | 'Food'
  | 'Travel'
  | 'Education'
  | 'Shopping'
  | 'Recharge'
  | 'Entertainment'
  | 'Other';

export type IncomeSource =
  | 'Pocket Money'
  | 'Part-time Job'
  | 'Freelancing'
  | 'Business'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  note: string;
  createdAt: number;
}

export interface Income {
  id: string;
  amount: number;
  source: IncomeSource;
  date: string; // YYYY-MM-DD
  note: string;
  createdAt: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // YYYY-MM-DD
  categoryIcon?: string;
  createdAt: number;
}

export interface SavingsChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  totalDays: number;
  completedDays: number;
  rewardPoints: number;
  isCompleted: boolean;
  active: boolean;
  lastCheckInDate?: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string;
}

export interface StudyTask {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  isToday: boolean;
  completedAt?: string;
}

export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimetableClass {
  id: string;
  day: WeekDay;
  time: string; // e.g. "10:00 AM - 11:00 AM" or "10:00 AM"
  subject: string;
  room: string;
  instructor?: string;
}

export type AssignmentPriority = 'Low' | 'Medium' | 'High';

export interface Assignment {
  id: string;
  name: string;
  subject: string;
  deadline: string; // YYYY-MM-DD
  priority: AssignmentPriority;
  status: TaskStatus;
  notes?: string;
}

export interface UserProfile {
  name: string;
  collegeName: string;
  course: string;
  year: string;
  monthlyBudget: number;
  avatar: string;
  currency: string;
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  studyStreak: number;
  bestStudyStreak: number;
  challengePoints: number;
  lastStreakDate?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'budget' | 'goal' | 'assignment' | 'study' | 'class';
  date: string;
  read: boolean;
}

export type NavigationTab = 'home' | 'money' | 'study' | 'goals' | 'profile';
