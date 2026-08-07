import { useEffect, useState } from 'react'
import api from '../services/api'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { RefreshCw } from 'lucide-react'

export default function Assignments() {
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    api.get('/assignments/').then((res) => setAssignments(res.data))
  }, [])

  const handleReturn = async (id) => {
    if (!confirm('Mark this assignment as returned?')) return
    await api.post(`/assignments/${id}/return`, {})
    api.get('/assignments/').then((res) => setAssignments(res.data))
  }

  const columns = [
    { key: 'asset', label: 'Asset', render: (row) => row.asset?.name || row.asset?.asset_tag },
    { key: 'assigned_user', label: 'Assigned To', render: (row) => row.assigned_user?.email },
    { key: 'assigned_date', label: 'Assigned Date' },
    { key: 'expected_return_date', label: 'Expected Return' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'actions', label: 'Actions', render: (row) =>
      row.status === 'ASSIGNED' ? (
        <button onClick={(e) => { e.stopPropagation(); handleReturn(row.id) }}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
          <RefreshCw className="w-3 h-3 mr-1" />Return
        </button>
      ) : <span className="text-sm text-gray-400">Returned</span>
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
      <DataTable columns={columns} data={assignments} total={assignments.length} page={0} limit={100} />
    </div>
  )
}
