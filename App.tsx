
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { FormationsPage } from './pages/FormationsPage';
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages';
import { CourseBuilder } from './components/CourseBuilder';
import { AIChatbot } from './components/AIChatbot';
import { CourseLanding } from './components/CourseLanding';

const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Pages (Hors Layout global si besoin de plein écran) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Public Pages */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/formations" element={<Layout><FormationsPage /></Layout>} />
          
          {/* Protected Content */}
          <Route path="/builder" element={
            <ProtectedRoute>
              <Layout><CourseBuilder /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/assistant" element={
            <ProtectedRoute>
              <Layout><AIChatbot /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Public Course View */}
          <Route path="/share/:courseId" element={<CourseLanding />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
