import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Workspaces from './pages/Workspaces'
import Tickets from './pages/Tickets'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

function App() {
  const { token } = useAuthStore()

  if (!token) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
