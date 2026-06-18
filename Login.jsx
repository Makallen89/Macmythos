import React, { useState } from 'react'
import { api } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('admin@macmythos.com')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      setAuth(data.access_token, data.refresh_token, data.user)
      toast.success('Welcome back, ' + data.user.first_name)
      window.location.reload()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            M
          </div>
          <h1 className="text-2xl font-bold mb-1">Mac Mythos</h1>
          <p className="text-sm text-gray-400">Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control pl-10"
                  placeholder="admin@macmythos.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              Demo: <span className="text-primary">admin@macmythos.com</span> / <span className="text-primary">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
