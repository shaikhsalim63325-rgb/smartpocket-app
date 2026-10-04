import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { SplashScreen } from './components/splash/SplashScreen';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';
import { SetupScreen } from './components/auth/SetupScreen';
import { HomeDashboard } from './components/home/HomeDashboard';
import { MoneyDashboard } from './components/money/MoneyDashboard';
import { GoalsDashboard } from './components/goals/GoalsDashboard';
import { StudyDashboard } from './components/study/StudyDashboard';
import { ProfileDashboard } from './components/profile/ProfileDashboard';
import { AddExpenseModal } from './components/money/AddExpenseModal';
import { AddIncomeModal } from './components/money/AddIncomeModal';
import { AddGoalModal } from './components/goals/AddGoalModal';
import { DepositModal } from './components/goals/DepositModal';
import { AddTaskModal } from './components/study/AddTaskModal';
import { AddClassModal } from './components/study/AddClassModal';
import { AddAssignmentModal } from './components/study/AddAssignmentModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { MonthlyReportModal } from './components/profile/MonthlyReportModal';

const MainAppContent: React.FC = () => {
  const { isOnboarded, activeTab } = useApp();

  // Lifecycle states: 'splash' | 'onboarding' | 'setup' | 'app'
  const [stage, setStage] = useState<'splash' | 'onboarding' | 'setup' | 'app'>(() => {
    // If user has already onboarded previously, show splash then app
    return 'splash';
  });

  // Handle stage transitions
  const handleSplashDone = () => {
    if (isOnboarded) {
      setStage('app');
    } else {
      setStage('onboarding');
    }
  };

  // If user resets all data while in app, redirect to setup
  React.useEffect(() => {
    if (!isOnboarded && stage === 'app') {
      setStage('setup');
    }
  }, [isOnboarded, stage]);

  const handleOnboardingDone = () => {
    setStage('setup');
  };

  const handleSetupDone = () => {
    setStage('app');
  };

  // 1. Splash Screen
  if (stage === 'splash') {
    return <SplashScreen onComplete={handleSplashDone} />;
  }

  // 2. Onboarding Screen (3 steps)
  if (stage === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingDone} />;
  }

  // 3. Login / Profile Setup Screen
  if (stage === 'setup') {
    return <SetupScreen onFinish={handleSetupDone} />;
  }

  // 4. Main Application Shell
  return (
    <div className="min-h-screen bg-slate-200/50 dark:bg-[#050816] text-slate-900 dark:text-slate-100 flex flex-col md:items-center md:justify-center md:py-6 transition-colors selection:bg-violet-500 selection:text-white">
      {/* Mobile container centered on tablet/desktop */}
      <div className="w-full max-w-[480px] mx-auto min-h-screen md:min-h-[820px] md:h-[92vh] md:max-h-[960px] flex flex-col bg-[#F4F6FB] dark:bg-slate-950 md:rounded-[32px] md:shadow-2xl md:border md:border-slate-300/80 dark:md:border-slate-800/80 relative overflow-hidden transition-colors">
        {/* Top Header */}
        <Header />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'home' && <HomeDashboard />}
          {activeTab === 'money' && <MoneyDashboard />}
          {activeTab === 'study' && <StudyDashboard />}
          {activeTab === 'goals' && <GoalsDashboard />}
          {activeTab === 'profile' && <ProfileDashboard />}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Global Modals & Drawers */}
        <AddExpenseModal />
        <AddIncomeModal />
        <AddGoalModal />
        <DepositModal />
        <AddTaskModal />
        <AddClassModal />
        <AddAssignmentModal />
        <NotificationDrawer />
        <MonthlyReportModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
