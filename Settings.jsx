import React, { useState } from 'react'
import { Save, Shield, Bell, Globe, Database, Server, HardDrive, Key, Mail, Palette } from 'lucide-react'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  const Switch = ({ defaultChecked = false }) => (
    <label className="relative inline-block w-10 h-5 cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-10 h-5 bg-border2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
    </label>
  )

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-gray-400">Configure platform settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-48 space-y-1 flex-shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary/15 text-primary border border-primary/25'
                    : 'text-gray-400 hover:text-white hover:bg-primary/5 border border-transparent'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 panel">
          <div className="p-5">
            {activeTab === 'general' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-lg">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Platform Name</label>
                    <input defaultValue="Mac Mythos" className="form-control" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Support Email</label>
                    <input defaultValue="support@macmythos.com" className="form-control" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Company Name</label>
                    <input defaultValue="Mac Mythos Inc." className="form-control" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Timezone</label>
                    <select className="form-control">
                      <option>Asia/Kolkata (IST)</option>
                      <option>UTC</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                      <option>Asia/Tokyo (JST)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Default Language</label>
                  <select className="form-control w-48">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button className="btn btn-primary flex items-center gap-2">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-lg">Security Settings</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Two-Factor Authentication', desc: 'Require 2FA for admin accounts', checked: true },
                    { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', checked: true },
                    { label: 'IP Whitelisting', desc: 'Restrict access to specific IP addresses', checked: false },
                    { label: 'Password Policy', desc: 'Enforce strong password requirements', checked: true },
                    { label: 'Login Alerts', desc: 'Send email on new device login', checked: true },
                    { label: 'API Rate Limiting', desc: 'Limit API requests per minute', checked: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-panel rounded-lg border border-border">
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                      <Switch defaultChecked={item.checked} />
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <button className="btn btn-primary flex items-center gap-2">
                    <Key size={16} /> Update Security Settings
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-lg">Notification Preferences</h3>
                <div className="space-y-3">
                  {[
                    { label: 'New User Registration', desc: 'When a new user signs up', checked: true },
                    { label: 'Ticket Created', desc: 'When a new support ticket is created', checked: true },
                    { label: 'Payment Received', desc: 'When a payment is processed', checked: true },
                    { label: 'System Alerts', desc: 'Critical system health notifications', checked: true },
                    { label: 'Workspace Updates', desc: 'When workspace settings change', checked: false },
                    { label: 'Weekly Reports', desc: 'Receive weekly analytics summary', checked: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-panel rounded-lg border border-border">
                      <div>
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                      <Switch defaultChecked={item.checked} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Notification Email</label>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <input defaultValue="admin@macmythos.com" className="form-control" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-lg">Database Management</h3>
                <div className="p-4 bg-panel rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Database size={20} className="text-primary" />
                    <div>
                      <div className="text-sm font-medium">PostgreSQL Database</div>
                      <div className="text-xs text-gray-400">Connected • Version 16.1</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs text-green-400">Healthy</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-card rounded-lg">
                      <div className="text-lg font-mono font-bold">12</div>
                      <div className="text-xs text-gray-500">Active Connections</div>
                    </div>
                    <div className="p-3 bg-card rounded-lg">
                      <div className="text-lg font-mono font-bold">45ms</div>
                      <div className="text-xs text-gray-500">Avg Latency</div>
                    </div>
                    <div className="p-3 bg-card rounded-lg">
                      <div className="text-lg font-mono font-bold">2.4GB</div>
                      <div className="text-xs text-gray-500">Database Size</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-panel rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Server size={20} className="text-secondary" />
                    <div>
                      <div className="text-sm font-medium">Redis Cache</div>
                      <div className="text-xs text-gray-400">Connected • Version 7.2</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs text-green-400">Healthy</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-card rounded-lg">
                      <div className="text-lg font-mono font-bold">128</div>
                      <div className="text-xs text-gray-500">Keys Stored</div>
                    </div>
                    <div className="p-3 bg-card rounded-lg">
                      <div className="text-lg font-mono font-bold">45MB</div>
                      <div className="text-xs text-gray-500">Memory Used</div>
                    </div>
                    <div className="p-3 bg-card rounded-lg">
                      <div className="text-lg font-mono font-bold">99.9%</div>
                      <div className="text-xs text-gray-500">Hit Rate</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="btn btn-primary flex items-center gap-2">
                    <HardDrive size={16} /> Backup Now
                  </button>
                  <button className="btn btn-ghost text-danger border-danger/30 hover:bg-danger/10">
                    Reset Cache
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-5">
                <h3 className="font-semibold text-lg">Appearance</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-2 block">Theme</label>
                    <div className="flex gap-3">
                      <button className="flex-1 p-4 bg-card border-2 border-primary rounded-xl text-center">
                        <div className="w-8 h-8 rounded-full bg-bg border border-border mx-auto mb-2" />
                        <div className="text-sm font-medium">Dark</div>
                      </button>
                      <button className="flex-1 p-4 bg-card border border-border rounded-xl text-center opacity-50">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 mx-auto mb-2" />
                        <div className="text-sm font-medium">Light</div>
                      </button>
                      <button className="flex-1 p-4 bg-card border border-border rounded-xl text-center opacity-50">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-100 border border-gray-400 mx-auto mb-2" />
                        <div className="text-sm font-medium">Auto</div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Accent Color</label>
                    <div className="flex gap-2">
                      {['#6366f1', '#8b5cf6', '#06b6d4', '#f43f5e', '#f59e0b', '#10b981'].map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-transparent hover:border-white transition-colors"
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Sidebar Density</label>
                    <select className="form-control w-48">
                      <option>Compact</option>
                      <option>Comfortable</option>
                      <option>Spacious</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
