import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function Users() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(['users', search, page], () =>
    api.get(`/api/users?search=${search}&page=${page}&limit=20`).then(r => r.data)
  )

  const createMutation = useMutation(
    (userData) => api.post('/api/users', userData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        setShowModal(false)
        toast.success('User created successfully')
      },
      onError: (err) => toast.error(err.response?.data?.detail || 'Failed to create user')
    }
  )

  const updateMutation = useMutation(
    ({ id, data }) => api.patch(`/api/users/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        setShowModal(false)
        setEditingUser(null)
        toast.success('User updated')
      },
      onError: (err) => toast.error(err.response?.data?.detail || 'Failed to update')
    }
  )

  const deleteMutation = useMutation(
    (id) => api.delete(`/api/users/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        toast.success('User deleted')
      },
      onError: (err) => toast.error(err.response?.data?.detail || 'Failed to delete')
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const payload = {
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
      plan: formData.get('plan'),
      role: formData.get('role'),
    }
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: payload })
    } else {
      payload.password = 'changeme123'
      createMutation.mutate(payload)
    }
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id)
    }
  }

  const getPlanBadge = (plan) => {
    const map = {
      free: 'badge-gray',
      starter: 'badge-blue',
      value: 'badge-cyan',
      unlimited: 'badge-green'
    }
    return <span className={`badge ${map[plan] || 'badge-gray'}`}>{plan}</span>
  }

  const getRoleBadge = (role) => {
    const map = {
      admin: 'badge-red',
      moderator: 'badge-yellow',
      user: 'badge-blue'
    }
    return <span className={`badge ${map[role] || 'badge-gray'}`}>{role}</span>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">Users</h2>
          <p className="text-sm text-gray-400">Manage platform users</p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setShowModal(true) }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="panel">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-2 w-72">
            <Search size={14} className="text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-black/20">
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-gray-500">User</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-gray-500">Email</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-gray-500">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-gray-500">Role</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
              ) : data?.users?.map((user) => (
                <tr key={user.id} className="border-b border-border/50 hover:bg-primary/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold">
                        {user.first_name?.[0]}{user.last_name?.[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{user.first_name} {user.last_name}</div>
                        <div className="text-xs text-gray-500 font-mono">{user.id?.slice(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">{user.email}</td>
                  <td className="px-4 py-3">{getPlanBadge(user.plan)}</td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${user.is_active ? 'badge-green' : 'badge-red'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingUser(user); setShowModal(true) }}
                        className="p-1.5 rounded-lg border border-border text-gray-400 hover:text-primary hover:border-primary transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 rounded-lg border border-border text-gray-400 hover:text-danger hover:border-danger transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="text-xs text-gray-500">Page {page} of {data?.pages || 1}</div>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-border text-gray-400 disabled:opacity-30 hover:text-white"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= (data?.pages || 1)}
              className="p-1.5 rounded-lg border border-border text-gray-400 disabled:opacity-30 hover:text-white"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-panel border border-border rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button
                onClick={() => { setShowModal(false); setEditingUser(null) }}
                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-danger hover:border-danger transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">First Name</label>
                  <input name="first_name" defaultValue={editingUser?.first_name} className="form-control" placeholder="Rahul" required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Last Name</label>
                  <input name="last_name" defaultValue={editingUser?.last_name} className="form-control" placeholder="Sharma" required />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Email</label>
                <input name="email" type="email" defaultValue={editingUser?.email} className="form-control" placeholder="rahul@example.com" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Plan</label>
                  <select name="plan" defaultValue={editingUser?.plan || 'free'} className="form-control">
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="value">Value</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Role</label>
                  <select name="role" defaultValue={editingUser?.role || 'user'} className="form-control">
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
