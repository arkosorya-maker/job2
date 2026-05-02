import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CVForm } from './pages/candidate/CVForm';
import { JobForm } from './pages/employer/JobForm';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { UserDashboard } from './pages/dashboard/UserDashboard';
import { Login } from './pages/Login';
import './lib/i18n';
import { useAuthStore } from './store/authStore';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' }) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
     return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="submit-cv" element={<CVForm />} />
          <Route path="post-job" element={<JobForm />} />
          <Route path="login" element={<Login />} />
          
          <Route path="dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />

          <Route path="admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
