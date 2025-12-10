import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import WardDirectory from './pages/WardDirectory'
import AddOnRequest from './pages/AddOnRequest'
import LabDashboard from './pages/LabDashboard'
import Analytics from './pages/Analytics'
import CriticalCall from './pages/CriticalCall'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/ward-directory" element={<PrivateRoute><WardDirectory /></PrivateRoute>} />
      <Route path="/addon-request" element={<PrivateRoute><AddOnRequest /></PrivateRoute>} />
      <Route path="/lab-dashboard" element={<PrivateRoute><LabDashboard /></PrivateRoute>} />
      <Route path="/critical-call" element={<PrivateRoute><CriticalCall /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-center" />
      </Router>
    </AuthProvider>
  )
}

export default App

