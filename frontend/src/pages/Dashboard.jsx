import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  Package, Users, Wrench, AlertTriangle, TrendingUp, Activity
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280']

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/').then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="p-6">Loading dashboard...</div>

  const stats = data.stats
  const statusData = Object.entries(data.assets_by_status).map(([name, value]) => ({ name, value }))
  const categoryData = data.assets_by_category

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Package} label="Total Assets" value={stats.total_assets} color="text-blue-600" bg="bg-blue-50" />
        <StatCard icon={Users} label="Assigned" value={stats.assigned_assets} color="text-green-600" bg="bg-green-50" />
        <StatCard icon={Wrench} label="In Repair" value={stats.in_repair_assets} color="text-yellow-600" bg="bg-yellow-50" />
        <StatCard icon={AlertTriangle} label="Warranty Expiring" value={stats.upcoming_warranty_expiry} color="text-red-600" bg="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Assets by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Assets by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {data.recent_activity.map((log) => (
            <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.action} on {log.table_name}</p>
                  <p className="text-xs text-gray-500">by {log.performed_by || 'System'}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
            </div>
          ))}
          {data.recent_activity.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="card p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}