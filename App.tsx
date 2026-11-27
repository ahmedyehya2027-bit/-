import React from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MeyarProvider, useMeyar } from './context/MeyarContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { TeachersPage } from './pages/TeachersPage';
import { StudentsPage } from './pages/StudentsPage';
import { GroupsPage } from './pages/GroupsPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { AnswerKeysPage } from './pages/AnswerKeysPage';
import { GradingPage } from './pages/GradingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';

const ActiveSectionRouter: React.FC = () => {
  const { activeSection } = useMeyar();

  switch (activeSection) {
    case 'dashboard':
      return <DashboardPage />;
    case 'teachers':
      return <TeachersPage />;
    case 'students':
      return <StudentsPage />;
    case 'groups':
      return <GroupsPage />;
    case 'subjects':
      return <SubjectsPage />;
    case 'assignments':
      return <AssignmentsPage />;
    case 'answer-keys':
      return <AnswerKeysPage />;
    case 'grading':
      return <GradingPage />;
    case 'analytics':
      return <AnalyticsPage />;
    case 'reports':
      return <ReportsPage />;
    default:
      return <DashboardPage />;
  }
};

const AuthGate: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-600">
        <span className="w-11 h-11 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-xl">
          م
        </span>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mt-1">
          <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
          <span>جاري التحقق من الجلسة...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <MeyarProvider>
      <Layout>
        <ActiveSectionRouter />
      </Layout>
    </MeyarProvider>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ErrorBoundary>
  );
}
