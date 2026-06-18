import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { Search, Plus, Building2, Users, ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function Workspaces() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(['workspaces', search, page], () =>
    api.get(`/api/workspaces?search=${search}&page=${page}&limit=20`).then(r => r.data)
  )

  const createMutation = useMutation(
    (wsData) => api.post('/api/workspaces', wsData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('workspaces')
        setShowModal(false)
        toast.success('Workspace created')
      },
      onError: (err) => toast.error(err.response?.data?.detail || 'Failed')
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    createMutation.mutate({
      name: formData.get('name'),
      description: formData.get('description'),
      plan: formData.get('plan'),
    })
  }

  const getPlanColor = (plan) => ({
    free: 'from-gray-500 to-gray-600',
    starter: 'from-blue-500 to-blue-600',
    value: 'from-cyan-500 to-cyan-600',
    unlimited: 'from-green-500 to-green-600'
  }[plan] || 'from-gray-500 to-gray-600')

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">Workspaces</h2>
          <p className="text-sm text-gray-400">Manage teams and projects</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus size={16} /> New Workspace
        </button>
      </div>

      <div className="panel mb-4">
        <div className="p-4">
          <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-2 w-72">
            <Search size={14} className="text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workspaces..."
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-gray-400">Loading...</div>
        ) : data?.workspaces?.map((ws) => (
          <div key={ws.id} className="bg-card border border-border rounded-xl p-5 hover:border-border2 hover:-translate-y-0.5 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getPlanColor(ws.plan)} flex items-center justify-center text-lg text-white`}>
                <Building2 size={20} />
              </div>
              <div>
                <div className="font-semibold">{ws.name}</div>
                <div className="text-xs font-mono text-gray-500 uppercase">{ws.plan}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{ws.description || 'No description'}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Users size={14} />
                {ws.member_count} members
              </div>
              <span className={`badge ${ws.status === 'active' ? 'badge-green' : 'badge-yellow'}`}>
                {ws.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-1 mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-border text-gray-400 disabled:opacity-30 hover:text-white"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-xs text-gray-400 px-2">Page {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page >= (data?.pages || 1)}
          className="p-1.5 rounded-lg border border-border text-gray-400 disabled:opacity-30 hover:text-white"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-panel border border-border rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold">Create Workspace</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-danger">
                <X size={14} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Name</label>
                <input name="name" className="form-control" placeholder="My Team" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                <textarea name="description" className="form-control h-20 resize-none" placeholder="Workspace description..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Plan</label>
                <select name="plan" defaultValue="free" className="form-control">
                  <option value="free">Free</option>
                  <option value="starter">Starter</option>
                  <option value="value">Value</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Workspace</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
