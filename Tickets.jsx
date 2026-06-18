import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { api } from '../utils/api'
import toast from 'react-hot-toast'
import { Ticket, Search, CheckCircle, MessageSquare, Clock, X, Plus } from 'lucide-react'

export default function Tickets() {
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [replyModal, setReplyModal] = useState(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(['tickets', status, priority, page], () =>
    api.get(`/api/tickets?status=${status}&priority=${priority}&page=${page}&limit=20`).then(r => r.data)
  )

  const createMutation = useMutation(
    (ticketData) => api.post('/api/tickets', ticketData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tickets')
        setShowModal(false)
        toast.success('Ticket created')
      },
      onError: (err) => toast.error(err.response?.data?.detail || 'Failed')
    }
  )

  const updateMutation = useMutation(
    ({ id, data }) => api.patch(`/api/tickets/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tickets')
        setReplyModal(null)
        toast.success('Ticket updated')
      }
    }
  )

  const handleCreate = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    createMutation.mutate({
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      category: formData.get('category'),
    })
  }

  const handleReply = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    updateMutation.mutate({
      id: replyModal.id,
      data: {
        response: formData.get('response'),
        status: 'resolved'
      }
    })
  }

  const getPriorityBadge = (p) => {
    const map = { critical: 'badge-red', high: 'badge-orange', medium: 'badge-yellow', low: 'badge-green' }
    return <span className={`badge ${map[p] || 'badge-gray'}`}>{p}</span>
  }

  const getStatusBadge = (s) => {
    const map = { open: 'badge-blue', in_progress: 'badge-yellow', resolved: 'badge-green', closed: 'badge-gray' }
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">Support Tickets</h2>
          <p className="text-sm text-gray-400">Manage customer support requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <Plus size={16} /> New Ticket
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex items-center gap-2 bg-panel border border-border rounded-lg px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-gray-500" />
          <input placeholder="Search tickets..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-500" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control w-36">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="form-control w-36">
          <option value="">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : data?.tickets?.map((ticket) => (
          <div key={ticket.id} className="bg-card border border-border rounded-xl p-4 hover:border-border2 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <Ticket size={18} className="text-primary" />
                <div>
                  <div className="font-semibold text-sm">{ticket.title}</div>
                  <div className="text-xs text-gray-500">#{ticket.id?.slice(0, 8)} • {ticket.created_by_name || 'Unknown'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                {getPriorityBadge(ticket.priority)}
                {getStatusBadge(ticket.status)}
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-3">{ticket.description}</p>
            {ticket.response && (
              <div className="bg-panel border border-border rounded-lg p-3 mb-3">
                <div className="text-xs font-semibold text-primary mb-1">Response:</div>
                <div className="text-sm text-gray-300">{ticket.response}</div>
              </div>
            )}
            <div className="flex items-center gap-2">
              {ticket.status !== 'resolved' && (
                <button
                  onClick={() => setReplyModal(ticket)}
                  className="btn btn-sm bg-success/10 text-success border-success/20 hover:bg-success/20 flex items-center gap-1"
                >
                  <CheckCircle size={14} /> Resolve
                </button>
              )}
              <button className="btn btn-sm btn-ghost flex items-center gap-1">
                <MessageSquare size={14} /> Reply
              </button>
              <div className="ml-auto text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {new Date(ticket.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-panel border border-border rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold">Create Ticket</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-danger"><X size={14} /></button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Title</label>
                <input name="title" className="form-control" placeholder="Issue title" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                <textarea name="description" className="form-control h-24 resize-none" placeholder="Describe the issue..." required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                  <select name="priority" defaultValue="medium" className="form-control">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Category</label>
                  <select name="category" defaultValue="general" className="form-control">
                    <option value="general">General</option>
                    <option value="bug">Bug</option>
                    <option value="feature">Feature</option>
                    <option value="billing">Billing</option>
                    <option value="docs">Documentation</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-panel border border-border rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold">Resolve Ticket</h3>
              <button onClick={() => setReplyModal(null)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-gray-400 hover:text-danger"><X size={14} /></button>
            </div>
            <form onSubmit={handleReply} className="p-5 space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Response</label>
                <textarea name="response" className="form-control h-24 resize-none" placeholder="Enter your response..." required />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setReplyModal(null)} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary">Resolve & Reply</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
