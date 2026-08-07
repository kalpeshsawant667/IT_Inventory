import { useEffect, useState } from 'react'
import api from '../services/api'
import DataTable from '../components/DataTable'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users/').then((res) => setUsers(res.data))
  }, [])

  const columns = [
    { key: 'name', label: 'Name', render: (row) => (
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
          {row.first_name?.[0]}{row.last_name?.[0]}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{row.first_name} {row.last_name}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'phone', label: 'Phone', render: (row) => row.phone || '-' },
    { key: 'is_active', label: 'Status', render: (row) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {row.is_active ? 'Active' : 'Inactive'}
      </span>
    )},
    { key: 'last_login', label: 'Last Login', render: (row) => row.last_login ? new Date(row.last_login).toLocaleString() : 'Never' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      <DataTable columns={columns} data={users} total={users.length} page={0} limit={100} />
    </div>
  )
}
