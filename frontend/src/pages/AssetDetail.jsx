import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import StatusBadge from '../components/StatusBadge'
import { ArrowLeft, Edit, Trash2, History } from 'lucide-react'

export default function AssetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [asset, setAsset] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    api.get(`/assets/${id}`).then((res) => setAsset(res.data))
    api.get(`/assets/${id}/history`).then((res) => setHistory(res.data))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this asset?')) return
    await api.delete(`/assets/${id}`)
    navigate('/assets')
  }

  if (!asset) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate('/assets')} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
            <p className="text-sm text-gray-500">{asset.asset_tag}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/assets/${id}/edit`)} className="btn-secondary">
            <Edit className="w-4 h-4 mr-2" />Edit
          </button>
          <button onClick={handleDelete} className="btn-secondary text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
            <Trash2 className="w-4 h-4 mr-2" />Delete
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Asset Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><dt className="text-sm text-gray-500">Status</dt><dd className="mt-1"><StatusBadge status={asset.status} /></dd></div>
              <div><dt className="text-sm text-gray-500">Serial Number</dt><dd className="mt-1 text-sm font-medium">{asset.serial_number || '-'}</dd></div>
              <div><dt className="text-sm text-gray-500">Model</dt><dd className="mt-1 text-sm font-medium">{asset.model || '-'}</dd></div>
              <div><dt className="text-sm text-gray-500">Manufacturer</dt><dd className="mt-1 text-sm font-medium">{asset.manufacturer || '-'}</dd></div>
              <div><dt className="text-sm text-gray-500">Category</dt><dd className="mt-1 text-sm font-medium">{asset.category?.name || '-'}</dd></div>
              <div><dt className="text-sm text-gray-500">Location</dt><dd className="mt-1 text-sm font-medium">{asset.location?.name || '-'}</dd></div>
              <div><dt className="text-sm text-gray-500">Purchase Date</dt><dd className="mt-1 text-sm font-medium">{asset.purchase_date || '-'}</dd></div>
              <div><dt className="text-sm text-gray-500">Warranty Expiry</dt><dd className="mt-1 text-sm font-medium">{asset.warranty_expiry || '-'}</dd></div>
              <div><dt className="text-sm text-gray-500">Purchase Cost</dt><dd className="mt-1 text-sm font-medium">{asset.purchase_cost ? `$${asset.purchase_cost}` : '-'}</dd></div>
              <div><dt className="text-sm text-gray-500">Vendor</dt><dd className="mt-1 text-sm font-medium">{asset.vendor?.name || '-'}</dd></div>
            </dl>
            {asset.notes && (
              <div className="mt-4">
                <dt className="text-sm text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{asset.notes}</dd>
              </div>
            )}
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center"><History className="w-5 h-5 mr-2" />Status History</h3>
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h.id} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{h.old_status || 'N/A'} → {h.new_status || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{h.reason}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(h.created_at).toLocaleString()}</span>
                </div>
              ))}
              {history.length === 0 && <p className="text-sm text-gray-500">No history yet.</p>}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Assignment</h3>
            {asset.assigned_user ? (
              <div>
                <p className="text-sm font-medium text-gray-900">{asset.assigned_user.first_name} {asset.assigned_user.last_name}</p>
                <p className="text-sm text-gray-500">{asset.assigned_user.email}</p>
              </div>
            ) : <p className="text-sm text-gray-500">Not assigned</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
