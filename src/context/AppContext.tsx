import React, { createContext, useContext, useState, useEffect } from 'react';
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
  AppNotification,
  NavigationTab,
} from '../types';
import {
  defaultProfile,
  defaultExpenses,
  defaultIncomes,
  defaultGoals,
  defaultChallenges,
  defaultSubjects,
  defaultTasks,
  defaultTimetable,
  defaultAssignments,
  defaultNotifications,
  presetChallengeTemplates,
} from '../data/defaultData';

interface AppContextType {
  profile: UserProfile;
  expenses: Expense[];
  incomes: Income[];
  goals: SavingsGoal[];
  challenges: SavingsChallenge[];
  subjects: Subject[];
  tasks: StudyTask[];
  timetable: TimetableClass[];
  assignments: Assignment[];
  notifications: AppNotification[];
  isOnboarded: boolean;
  activeTab: NavigationTab;
  isNotificationOpen: boolean;
  isReportOpen: boolean;

  // Modals
  isAddExpenseOpen: boolean;
  isAddIncomeOpen: boolean;
  isAddGoalOpen: boolean;
  isAddTaskOpen: boolean;
  isAddClassOpen: boolean;
  isAddAssignmentOpen: boolean;
  isDepositModalOpen: boolean;
  selectedGoalForDeposit: SavingsGoal | null;

  // Computed metrics
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalSaved: number;
  remainingBudget: number;
  dailyTarget: number; // monthly budget ÷ days in month
  recommendedDailyBudget: number;
  daysInMonth: number;
  daysRemainingInMonth: number;
  todaySpent: number;
  isDailyOverspent: boolean;
  completedTasksCount: number;
  completedAssignmentsCount: number;
  unreadNotificationsCount: number;
  nextUpcomingClass: TimetableClass | null;

  // Setters
  setTab: (tab: NavigationTab) => void;
  setIsNotificationOpen: (open: boolean) => void;
  setIsReportOpen: (open: boolean) => void;
  setIsAddExpenseOpen: (open: boolean) => void;
  setIsAddIncomeOpen: (open: boolean) => void;
  setIsAddGoalOpen: (open: boolean) => void;
  setIsAddTaskOpen: (open: boolean) => void;
  setIsAddClassOpen: (open: boolean) => void;
  setIsAddAssignmentOpen: (open: boolean) => void;
  openDepositModal: (goal: SavingsGoal) => void;
  closeDepositModal: () => void;

  // Business Actions
  addExpense: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  addIncome: (data: Omit<Income, 'id' | 'createdAt'>) => void;
  deleteIncome: (id: string) => void;
  updateBudget: (amount: number) => void;
  addGoal: (data: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  depositToGoal: (goalId: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  addTask: (data: Omit<StudyTask, 'id'>) => void;
  deleteTask: (id: string) => void;
  addSubject: (name: string, code?: string) => void;
  addClass: (data: Omit<TimetableClass, 'id'>) => void;
  deleteClass: (id: string) => void;
  addAssignment: (data: Omit<Assignment, 'id'>) => void;
  toggleAssignmentStatus: (id: string) => void;
  deleteAssignment: (id: string) => void;
  checkInChallenge: (id: string) => void;
  startPresetChallenge: (templateTitle: string) => void;
  toggleDarkMode: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;
  completeOnboarding: (setupData?: Partial<UserProfile>) => void;
  resetAllData: () => void;
  restoreBackup: (backup: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Using sp_v2_ namespace to guarantee fresh start without any residual v1 sample data
const STORAGE_PREFIX = 'sp_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial from local storage or empty defaults
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'profile');
    const savedTheme = localStorage.getItem('sp_theme');
    const parsed: UserProfile = saved ? JSON.parse(saved) : defaultProfile;
    if (savedTheme) {
      parsed.isDarkMode = savedTheme === 'dark';
    }
    return parsed;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'expenses');
    return saved ? JSON.parse(saved) : defaultExpenses;
  });

  const [incomes, setIncomes] = useState<Income[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'incomes');
    return saved ? JSON.parse(saved) : defaultIncomes;
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'goals');
    return saved ? JSON.parse(saved) : defaultGoals;
  });

  const [challenges, setChallenges] = useState<SavingsChallenge[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'challenges');
    return saved ? JSON.parse(saved) : defaultChallenges;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'subjects');
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [timetable, setTimetable] = useState<TimetableClass[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'timetable');
    return saved ? JSON.parse(saved) : defaultTimetable;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'assignments');
    return saved ? JSON.parse(saved) : defaultAssignments;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_PREFIX + 'onboarded') === 'true';
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<SavingsGoal | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'onboarded', isOnboarded ? 'true' : 'false');
  }, [isOnboarded]);

  // Keep dark mode class in sync on <html> / document element
  useEffect(() => {
    if (profile.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sp_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sp_theme', 'light');
    }
  }, [profile.isDarkMode]);

  // Financial Calculations
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const totalSaved = goals.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const remainingBudget = profile.monthlyBudget - totalExpenses;

  // Days in month calculation
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemainingInMonth = Math.max(1, daysInMonth - currentDay + 1);

  // Daily target auto-calculated as monthly budget ÷ days in month (Requirement 3)
  const dailyTarget = profile.monthlyBudget > 0 ? Math.floor(profile.monthlyBudget / daysInMonth) : 0;
  // Dynamic daily budget based on remaining budget ÷ days left in month
  const recommendedDailyBudget = remainingBudget > 0 ? Math.floor(remainingBudget / daysRemainingInMonth) : 0;

  // Today's total spending
  const todayStr = now.toISOString().split('T')[0];
  const todaySpent = expenses
    .filter((e) => e.date === todayStr)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const isDailyOverspent = dailyTarget > 0 && todaySpent > dailyTarget;

  const completedTasksCount = tasks.filter((t) => t.status === 'Completed').length;
  const completedAssignmentsCount = assignments.filter((a) => a.status === 'Completed').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Next upcoming class determination
  const dayNames: TimetableClass['day'][] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = dayNames[now.getDay()];
  const todaysClasses = timetable.filter((c) => c.day === todayDayName);
  const nextUpcomingClass = todaysClasses.length > 0 ? todaysClasses[0] : (timetable[0] || null);

  // Actions
  const addExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...data,
      id: 'exp-' + Date.now(),
      createdAt: Date.now(),
    };
    setExpenses((prev) => [newExpense, ...prev]);

    // Check if daily spend triggers a notification
    if (dailyTarget > 0 && (todaySpent + data.amount) > dailyTarget) {
      const isSevere = (todaySpent + data.amount) > (dailyTarget * 3);
      const newNotif: AppNotification = {
        id: 'notif-' + Date.now(),
        title: isSevere ? "You've gone well over today's target 🚨" : 'Daily Budget Alert ⚠️',
        message: isSevere
          ? `You've gone well over today's target! Total spent today is ${profile.currency}${todaySpent + data.amount}, which is over 3x your daily target of ${profile.currency}${dailyTarget}. Consider pausing non-essential spending.`
          : `You spent ${profile.currency}${data.amount}. Total today is ${profile.currency}${todaySpent + data.amount}, which exceeded your recommended daily budget of ${profile.currency}${dailyTarget}. Spend mindfully!`,
        type: 'budget',
        date: 'Just now',
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const addIncome = (data: Omit<Income, 'id' | 'createdAt'>) => {
    const newIncome: Income = {
      ...data,
      id: 'inc-' + Date.now(),
      createdAt: Date.now(),
    };
    setIncomes((prev) => [newIncome, ...prev]);
  };

  const deleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  const updateBudget = (amount: number) => {
    setProfile((prev) => ({ ...prev, monthlyBudget: amount }));
  };

  const addGoal = (data: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...data,
      id: 'goal-' + Date.now(),
      createdAt: Date.now(),
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const depositToGoal = (goalId: string, amount: number) => {
    if (amount <= 0) return;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updated = g.currentAmount + amount;
          return { ...g, currentAmount: updated };
        }
        return g;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isCompleting = t.status !== 'Completed';
          const newStatus = isCompleting ? 'Completed' : 'Pending';

          // Update study streak when a task is completed today
          if (isCompleting) {
            const today = new Date().toISOString().split('T')[0];
            setProfile((p) => {
              if (p.lastStreakDate === today) return p;
              const newStreak = p.studyStreak + 1;
              return {
                ...p,
                studyStreak: newStreak,
                bestStudyStreak: Math.max(p.bestStudyStreak, newStreak),
                lastStreakDate: today,
              };
            });
          }

          return {
            ...t,
            status: newStatus,
            completedAt: isCompleting ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return t;
      })
    );
  };

  const addTask = (data: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...data,
      id: 'task-' + Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addSubject = (name: string, code?: string) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-rose-500 to-red-600',
      'from-cyan-500 to-blue-600',
    ];
    const color = colors[subjects.length % colors.length];
    const newSub: Subject = {
      id: 'sub-' + Date.now(),
      name,
      code,
      color,
    };
    setSubjects((prev) => [...prev, newSub]);
  };

  const addClass = (data: Omit<TimetableClass, 'id'>) => {
    const newClass: TimetableClass = {
      ...data,
      id: 'tt-' + Date.now(),
    };
    setTimetable((prev) => [...prev, newClass]);
  };

  const deleteClass = (id: string) => {
    setTimetable((prev) => prev.filter((c) => c.id !== id));
  };

  const addAssignment = (data: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = {
      ...data,
      id: 'asg-' + Date.now(),
    };
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  const toggleAssignmentStatus = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const checkInChallenge = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id && !c.isCompleted && c.lastCheckInDate !== today) {
          const newCompletedDays = c.completedDays + 1;
          const isDone = newCompletedDays >= c.totalDays;

          if (isDone) {
            setProfile((p) => ({
              ...p,
              challengePoints: p.challengePoints + c.rewardPoints,
            }));
            setNotifications((n) => [
              {
                id: 'notif-' + Date.now(),
                title: '🏆 Challenge Completed!',
                message: `You completed "${c.title}"! Earned ${c.rewardPoints} points!`,
                type: 'goal',
                date: 'Just now',
                read: false,
              },
              ...n,
            ]);
          }
          return {
            ...c,
            completedDays: newCompletedDays,
            isCompleted: isDone,
            lastCheckInDate: today,
          };
        }
        return c;
      })
    );
  };

  const startPresetChallenge = (templateTitle: string) => {
    const template = presetChallengeTemplates.find((t) => t.title === templateTitle);
    if (!template) return;
    // Check if already in list
    if (challenges.some((c) => c.title === template.title)) return;

    const newChallenge: SavingsChallenge = {
      ...template,
      id: 'chal-' + Date.now(),
      completedDays: 0,
      isCompleted: false,
      active: true,
    };
    setChallenges((prev) => [newChallenge, ...prev]);
  };

  const toggleDarkMode = () => {
    setProfile((prev) => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const completeOnboarding = (setupData?: Partial<UserProfile>) => {
    if (setupData) {
      setProfile((prev) => ({ ...prev, ...setupData }));
    }
    setIsOnboarded(true);
    setActiveTab('home');
  };

  // Reset all data completely so next user can start fresh
  const resetAllData = () => {
    setProfile(defaultProfile);
    setExpenses([]);
    setIncomes([]);
    setGoals([]);
    setChallenges([]);
    setSubjects([]);
    setTasks([]);
    setTimetable([]);
    setAssignments([]);
    setNotifications([]);
    setIsOnboarded(false);
    setActiveTab('home');
    localStorage.clear();
  };

  const restoreBackup = (backup: any) => {
    const rawData = backup.data || backup;
    if (!rawData) return;

    if (rawData.profile) {
      setProfile(rawData.profile);
    }
    setExpenses(Array.isArray(rawData.expenses) ? rawData.expenses : []);
    setIncomes(Array.isArray(rawData.incomes) ? rawData.incomes : []);
    setGoals(Array.isArray(rawData.goals) ? rawData.goals : []);
    setChallenges(Array.isArray(rawData.challenges) ? rawData.challenges : []);
    setSubjects(Array.isArray(rawData.subjects) ? rawData.subjects : []);
    setTasks(Array.isArray(rawData.tasks) ? rawData.tasks : []);
    setTimetable(Array.isArray(rawData.timetable) ? rawData.timetable : []);
    setAssignments(Array.isArray(rawData.assignments) ? rawData.assignments : []);
    setNotifications(Array.isArray(rawData.notifications) ? rawData.notifications : []);
    setIsOnboarded(true);
    setActiveTab('home');
  };

  const openDepositModal = (goal: SavingsGoal) => {
    setSelectedGoalForDeposit(goal);
    setIsDepositModalOpen(true);
  };

  const closeDepositModal = () => {
    setSelectedGoalForDeposit(null);
    setIsDepositModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        expenses,
        incomes,
        goals,
        challenges,
        subjects,
        tasks,
        timetable,
        assignments,
        notifications,
        isOnboarded,
        activeTab,
        isNotificationOpen,
        isReportOpen,

        isAddExpenseOpen,
        isAddIncomeOpen,
        isAddGoalOpen,
        isAddTaskOpen,
        isAddClassOpen,
        isAddAssignmentOpen,
        isDepositModalOpen,
        selectedGoalForDeposit,

        totalIncome,
        totalExpenses,
        netBalance,
        totalSaved,
        remainingBudget,
        dailyTarget,
        recommendedDailyBudget,
        daysInMonth,
        daysRemainingInMonth,
        todaySpent,
        isDailyOverspent,
        completedTasksCount,
        completedAssignmentsCount,
        unreadNotificationsCount,
        nextUpcomingClass,

        setTab: setActiveTab,
        setIsNotificationOpen,
        setIsReportOpen,
        setIsAddExpenseOpen,
        setIsAddIncomeOpen,
        setIsAddGoalOpen,
        setIsAddTaskOpen,
        setIsAddClassOpen,
        setIsAddAssignmentOpen,
        openDepositModal,
        closeDepositModal,

        addExpense,
        deleteExpense,
        addIncome,
        deleteIncome,
        updateBudget,
        addGoal,
        depositToGoal,
        deleteGoal,
        toggleTaskStatus,
        addTask,
        deleteTask,
        addSubject,
        addClass,
        deleteClass,
        addAssignment,
        toggleAssignmentStatus,
        deleteAssignment,
        checkInChallenge,
        startPresetChallenge,
        toggleDarkMode,
        updateProfile,
        markNotificationRead,
        markAllNotificationsRead,
        clearAllNotifications,
        completeOnboarding,
        resetAllData,
        restoreBackup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
