import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { api } from '../utils/api'
import {
  Users,
  Building2,
  Ticket,
  TrendingUp,
  Activity,
  Server,
  Database,
  HardDrive,
  Wifi,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b']

function StatCard({ label, value, sub, icon: Icon, color, change, changeType }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden hover:border-border2 transition-all hover:-translate-y-0.5">
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-${color}-400 to-${color}-600`} />
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold font-mono mt-1">{value}</div>
        </div>
        <div className={`w-9 h-9 rounded-lg bg-${color}-500/10 flex items-center justify-center text-${color}-400`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {change && (
          <span className={`px-2 py-0.5 rounded-full font-semibold ${
            changeType === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {changeType === 'up' ? '+' : ''}{change}%
          </span>
        )}
        <span className="text-gray-500">{sub}</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [period, setPeriod] = useState('30d')

  const { data: stats, isLoading: statsLoading } = useQuery('dashboard-stats', () =>
    api.get('/api/dashboard/stats').then((r) => r.data)
  )

  const { data: chartData } = useQuery(['chart-data', period], () =>
    api.get(`/api/dashboard/chart-data?period=${period}`).then((r) => r.data)
  )

  const { data: activity } = useQuery('recent-activity', () =>
    api.get('/api/dashboard/activity?limit=10').then((r) => r.data)
  )

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const healthItems = stats?.server_health
    ? Object.entries(stats.server_health).map(([key, val]) => ({ key, ...val }))
    : []

  return (
    <div className="space-y-5">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats?.total_users || 0}
          sub="Active now"
          icon={Users}
          color="primary"
          change={stats?.growth_rate}
          changeType="up"
        />
        <StatCard
          label="Workspaces"
          value={stats?.total_workspaces || 0}
          sub="Total teams"
          icon={Building2}
          color="secondary"
        />
        <StatCard
          label="Revenue"
          value={`₹${stats?.total_revenue?.toLocaleString() || 0}`}
          sub="Last 30 days"
          icon={TrendingUp}
          color="success"
          change={12.5}
          changeType="up"
        />
        <StatCard
          label="Open Tickets"
          value={stats?.tickets_open || 0}
          sub={`${stats?.tickets_resolved || 0} resolved`}
          icon={Ticket}
          color="danger"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart */}
        <div className="lg:col-span-2 panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Activity size={16} className="text-primary" />
              User Growth
            </div>
            <div className="flex gap-1">
              {['7d', '30d', '90d', '1y'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    period === p
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white border border-border'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData?.users || []}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="date" stroke="#475569" fontSize={12} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #1e2d45',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="panel">
          <div className="panel-header">
            <div className="text-sm font-semibold">Revenue</div>
          </div>
          <div className="p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData?.revenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="date" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid #1e2d45',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Server Health */}
        <div className="panel">
          <div className="panel-header">
            <div className="text-sm font-semibold flex items-center gap-2">
              <Server size={16} className="text-success" />
              Server Health
            </div>
          </div>
          <div className="p-4 space-y-3">
            {healthItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 p-3 bg-panel border border-border rounded-lg hover:border-border2 transition-colors"
              >
                <div className="text-lg">
                  {item.key === 'api' && <Wifi size={20} className="text-primary" />}
                  {item.key === 'database' && <Database size={20} className="text-secondary" />}
                  {item.key === 'redis' && <Server size={20} className="text-accent" />}
                  {item.key === 'storage' && <HardDrive size={20} className="text-warning" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold capitalize">{item.key}</div>
                  <div className="text-xs text-gray-400">{item.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-success">{item.uptime}</div>
                  <div className="text-[10px] text-gray-500">
                    {item.latency || item.connections || item.memory || item.used}
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'healthy' ? 'bg-success shadow-[0_0_6px_#10b981]' : 'bg-danger'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="panel">
          <div className="panel-header">
            <div className="text-sm font-semibold">Recent Activity</div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {(activity?.activities || []).slice(0, 8).map((act) => (
                <div key={act.id} className="flex gap-3 items-start">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    act.action.includes('login') ? 'bg-primary' :
                    act.action.includes('create') ? 'bg-success' :
                    act.action.includes('delete') ? 'bg-danger' : 'bg-warning'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{act.action.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-gray-400">
                      {act.user_name || 'System'} • {new Date(act.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
