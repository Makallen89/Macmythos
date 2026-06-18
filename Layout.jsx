import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard,
  Users,
  Building2,
  Ticket,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/users', icon: Users, label: 'Users', badge: '6' },
  { path: '/workspaces', icon: Building2, label: 'Workspaces' },
  { path: '/tickets', icon: Ticket, label: 'Tickets', badge: '3' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen bg-bg text-white">
      {/* Sidebar */}
      <aside
        className={`bg-surface border-r border-border flex flex-col h-screen transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        } ${mobileOpen ? 'absolute z-50 translate-x-0' : 'relative'} ${
          !mobileOpen && 'max-md:-translate-x-full max-md:absolute max-md:z-50'
        }`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
            M
          </div>
          {!collapsed && (
            <div>
              <div className="text-sm font-bold">Mac Mythos</div>
              <div className="text-[10px] font-mono text-danger uppercase tracking-wider">Admin</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {!collapsed && (
            <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
              Main Menu
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <div
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setMobileOpen(false)
                }}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/25'
                    : 'text-gray-400 hover:bg-primary/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-danger text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-card cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold flex-shrink-0">
              {user?.first_name?.[0] || 'A'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="text-[10px] font-mono text-danger">{user?.role}</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full mt-2 px-2 py-1.5 text-xs text-gray-400 hover:text-danger transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-surface border-b border-border flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-8 h-8 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-white"
          >
            <Menu size={18} />
          </button>

          <h1 className="text-sm font-semibold flex-1">
            {navItems.find((i) => i.path === location.pathname)?.label || 'Dashboard'}
          </h1>

          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 w-52">
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
            />
          </div>

          <button className="relative w-8 h-8 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  )
}
