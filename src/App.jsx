import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CheckIn = lazy(() => import('./pages/CheckIn'));
const Journal = lazy(() => import('./pages/Journal'));
const Chat = lazy(() => import('./pages/Chat'));

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Navbar /><Dashboard /></ProtectedRoute>} />
              <Route path="/checkin" element={<ProtectedRoute><Navbar /><CheckIn /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><Navbar /><Journal /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><Navbar /><Chat /></ProtectedRoute>} />
              
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
