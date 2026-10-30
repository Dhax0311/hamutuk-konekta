import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './features/context/LanguageContext';
import { AuthProvider, useAuth } from './features/context/AuthContext';
import { NetworkProvider } from './features/context/NetworkContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import Login from './pages/Login';
import Overview from './pages/Overview';
import MapPage from './pages/MapPage';
import ReportsList from './pages/ReportsList';
import CreateReport from './pages/CreateReport';
import ReportDetail from './pages/ReportDetail';
import CommunityNeeds from './pages/CommunityNeeds';
import SiteWatch from './pages/SiteWatch';
import SiteWatchDetail from './pages/SiteWatchDetail';
import OfficialWarnings from './pages/OfficialWarnings';
import SyncQueue from './pages/SyncQueue';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

// Protected Route Guard
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NetworkProvider>
          <BrowserRouter>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />

              {/* Protected operational routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="map" element={<MapPage />} />
                <Route path="reports" element={<ReportsList />} />
                <Route path="reports/new" element={<CreateReport />} />
                <Route path="reports/:id" element={<ReportDetail />} />
                <Route path="needs" element={<CommunityNeeds />} />
                <Route path="sitewatch" element={<SiteWatch />} />
                <Route path="sitewatch/:id" element={<SiteWatchDetail />} />
                <Route path="warnings" element={<OfficialWarnings />} />
                <Route path="sync" element={<SyncQueue />} />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute adminOnly>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </NetworkProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
