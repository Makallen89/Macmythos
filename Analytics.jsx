import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { api } from '../utils/api'
import { TrendingUp, Users, DollarSign, BarChart3, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981']

function StatCard({ title, value, change, changeType, icon: Icon }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary`}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {changeType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-mono">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{title}</div>
    </div>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('30d')

  const { data: chartData } = useQuery(['chart-data', period], () =>
    api.get(`/api/dashboard/chart-data?period=${period}`).then(r => r.data)
  )

  const { data: stats } = useQuery('dashboard-stats', () =>
    api.get('/api/dashboard/stats').then(r => r.data)
  )

  const revenueBreakdown = [
    { name: 'Starter', value: 12500, color: '#6366f1' },
    { name: 'Value', value: 45000, color: '#8b5cf6' },
    { name: 'Unlimited', value: 89000, color: '#10b981' },
    { name: 'Enterprise', value: 25000, color: '#f59e0b' },
  ]

  const planDistribution = [
    { name: 'Free', value: stats?.total_users ? Math.round(stats.total_users * 0.6) : 4, color: '#475569' },
    { name: 'Starter', value: stats?.total_users ? Math.round(stats.total_users * 0.2) : 2, color: '#6366f1' },
    { name: 'Value', value: stats?.total_users ? Math.round(stats.total_users * 0.1) : 1, color: '#8b5cf6' },
    { name: 'Unlimited', value: stats?.total_users ? Math.round(stats.total_users * 0.1) : 1, color: '#10b981' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Analytics</h2>
          <p className="text-sm text-gray-400">Detailed platform analytics and insights</p>
        </div>
        <div className="flex gap-1">
          {['7d', '30d', '90d', '1y'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p ? 'bg-primary text-white' : 'text-gray-400 hover:text-white border border-border'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.total_users || 0} change={12.5} changeType="up" icon={Users} />
        <StatCard title="Revenue (30d)" value={`₹${stats?.total_revenue?.toLocaleString() || 0}`} change={8.2} changeType="up" icon={DollarSign} />
        <StatCard title="Active Rate" value={`${stats?.total_users ? Math.round((stats.active_users / stats.total_users) * 100) : 0}%`} change={2.1} changeType="up" icon={Activity} />
        <StatCard title="Tickets Resolved" value={stats?.tickets_resolved || 0} change={5.4} changeType="down" icon={BarChart3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Growth */}
        <div className="panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              User Growth
            </div>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData?.users || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="date" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="panel">
          <div className="panel-header">
            <div className="text-sm font-semibold">Revenue Trend</div>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData?.revenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="date" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Breakdown */}
        <div className="panel">
          <div className="panel-header">
            <div className="text-sm font-semibold">Revenue by Plan</div>
          </div>
          <div className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={revenueBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {revenueBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-gray-300">{item.name}:</span>
                  <span className="font-mono font-semibold">₹{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="panel">
          <div className="panel-header">
            <div className="text-sm font-semibold">User Plan Distribution</div>
          </div>
          <div className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planDistribution} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '8px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Analytics */}
      <div className="panel">
        <div className="panel-header">
          <div className="text-sm font-semibold">Ticket Volume</div>
        </div>
        <div className="p-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData?.tickets || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
              <XAxis dataKey="date" stroke="#475569" fontSize={11} />
              <YAxis stroke="#475569" fontSize={12} />
              <Tooltip contentStyle={{ background: '#111827', border: '1px solid #1e2d45', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="value" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
