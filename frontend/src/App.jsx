import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// RBAC
import ProtectedRoute from './components/ProtectedRoute';
import AccessDenied from './pages/AccessDenied';

// Dashboard Imports
import DashboardLayout from './pages/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import ServiceRegistry from './pages/dashboard/ServiceRegistry';
import DependencyManager from './pages/dashboard/DependencyManager';
import ArchitectureGraph from './pages/dashboard/ArchitectureGraph';
import ImpactAnalysis from './pages/dashboard/ImpactAnalysis';
import Teams from './pages/dashboard/Teams';
import HistoryPage from './pages/dashboard/HistoryPage';
import Settings from './pages/dashboard/Settings';
import AdminUserManagement from './pages/dashboard/AdminUserManagement';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import NotificationsPage from './pages/dashboard/NotificationsPage';

function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Rule: Always show Landing Page at "/" unless we want to force redirect logged-in users.
  // If we WANT to redirect logged-in users away from Landing Page, we use the logic below.
  // Currently, it redirects based on role.

  if (!user) return <LandingPage />;

  // Matching backend RoleEnum values (ADMIN, TEAM_LEAD, DEVELOPER)
  const role = user.role?.toUpperCase();

  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'TEAM_LEAD') return <Navigate to="/team/dashboard" replace />;
  return <Navigate to="/developer/dashboard" replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/access-denied" element={<AccessDenied />} />

          {/* Unified Dashboard Route Group */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TEAM_LEAD', 'DEVELOPER', 'Admin', 'Team Lead', 'Developer']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="services" element={<ServiceRegistry />} />
              <Route path="architecture" element={<ArchitectureGraph />} />
              <Route path="impact" element={<ImpactAnalysis />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="settings" element={<Settings />} />

              {/* Role-Restricted Inside Dashboard */}
              <Route path="teams" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'Admin', 'TEAM_LEAD', 'Team Lead']}>
                  <Teams />
                </ProtectedRoute>
              } />

              <Route path="users" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'Admin']}>
                  <AdminUserManagement />
                </ProtectedRoute>
              } />

              <Route path="dependencies" element={
                <ProtectedRoute allowedRoles={['ADMIN', 'Admin', 'TEAM_LEAD', 'Team Lead']}>
                  <DependencyManager />
                </ProtectedRoute>
              } />

              <Route index element={<Navigate to="overview" replace />} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Route>
          </Route>

          {/* Notifications page (accessible to all authenticated users) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'TEAM_LEAD', 'DEVELOPER', 'Admin', 'Team Lead', 'Developer']} />}>
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
