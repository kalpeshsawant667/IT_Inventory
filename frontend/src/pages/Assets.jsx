import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { Plus, Search } from 'lucide-react'

export default function Assets() {
  const [assets, setAssets] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const limit = 10
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/assets/', { params: { skip: page * limit, limit, search, status: statusFilter } })
      .then((res) => { setAssets(res.data.items); setTotal(res.data.total) })
  }, [page, search, statusFilter])

  const columns = [
    { key: 'asset_tag', label: 'Asset Tag' },
    { key: 'name', label: 'Name' },
    { key: 'model', label: 'Model' },
    { key: 'manufacturer', label: 'Manufacturer' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'location', label: 'Location', render: (row) => row.location?.name || '-' },
    { key: 'assigned_user', label: 'Assigned To', render: (row) => row.assigned_user?.email || '-' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
        <button onClick={() => navigate('/assets/new')} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />Add Asset
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search assets..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }} className="pl-10 input-field" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }} className="input-field w-full sm:w-48">
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_REPAIR">In Repair</option>
          <option value="IN_MAINTENANCE">In Maintenance</option>
          <option value="RETIRED">Retired</option>
        </select>
      </div>
      <DataTable columns={columns} data={assets} total={total} page={page} limit={limit}
        onPageChange={setPage} onRowClick={(row) => navigate(`/assets/${row.id}`)} />
    </div>
  )
}
