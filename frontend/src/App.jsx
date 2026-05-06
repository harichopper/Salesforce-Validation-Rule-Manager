import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { RulesProvider } from './context/RulesContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RulesPage from './pages/RulesPage';
import SettingsPage from './pages/SettingsPage';
import ErrorPage from './pages/ErrorPage';

export default function App() {
  return (
    <AuthProvider>
      <RulesProvider>
        <BrowserRouter>
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(13,13,26,0.95)',
                color: '#f0f0ff',
                border: '1px solid rgba(99,102,241,0.3)',
                backdropFilter: 'blur(20px)',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                borderRadius: '12px',
                padding: '12px 16px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              loading: { iconTheme: { primary: '#6366f1', secondary: 'rgba(99,102,241,0.2)' } },
              duration: 4000,
            }}
          />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} errorElement={<ErrorPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected app routes with sidebar layout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </RulesProvider>
    </AuthProvider>
  );
}
