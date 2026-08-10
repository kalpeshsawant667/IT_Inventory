import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { ArrowLeft } from 'lucide-react'

export default function AssetForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState({
    asset_tag: '',
    name: '',
    category_id: '',
    model: '',
    manufacturer: '',
    serial_number: '',
    specifications_json: '',
    purchase_date: '',
    warranty_expiry: '',
    purchase_cost: '',
    vendor_id: '',
    status: 'AVAILABLE',
    location_id: '',
    assigned_to_user_id: '',
    notes: '',
  })
  const [categories, setCategories] = useState([])
  const [locations, setLocations] = useState([])
  const [vendors, setVendors] = useState([])
  const [users, setUsers] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/categories/').then((res) => setCategories(res.data))
    api.get('/locations/').then((res) => setLocations(res.data))
    api.get('/vendors/').then((res) => setVendors(res.data))
    api.get('/users/').then((res) => setUsers(res.data))
    if (isEdit) {
      api.get(`/assets/${id}`).then((res) => {
        const a = res.data
        setForm({
          asset_tag: a.asset_tag || '',
          name: a.name || '',
          category_id: a.category_id || '',
          model: a.model || '',
          manufacturer: a.manufacturer || '',
          serial_number: a.serial_number || '',
          specifications_json: a.specifications_json || '',
          purchase_date: a.purchase_date || '',
          warranty_expiry: a.warranty_expiry || '',
          purchase_cost: a.purchase_cost || '',
          vendor_id: a.vendor_id || '',
          status: a.status || 'AVAILABLE',
          location_id: a.location_id || '',
          assigned_to_user_id: a.assigned_to_user_id || '',
          notes: a.notes || '',
        })
      })
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form }
    if (!payload.category_id) payload.category_id = null
    if (!payload.location_id) payload.location_id = null
    if (!payload.vendor_id) payload.vendor_id = null
    if (!payload.assigned_to_user_id) payload.assigned_to_user_id = null
    if (!payload.purchase_cost) payload.purchase_cost = null

    try {
      if (isEdit) {
        await api.put(`/assets/${id}`, payload)
      } else {
        await api.post('/assets/', payload)
      }
      navigate('/assets')
    } catch (err) {
      alert(err.response?.data?.detail || 'Error saving asset')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/assets')} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Asset' : 'New Asset'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Tag *</label>
            <input name="asset_tag" required value={form.asset_tag} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input name="name" required value={form.name} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} className="mt-1 input-field">
              <option value="">Select...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="mt-1 input-field">
              <option value="AVAILABLE">Available</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_REPAIR">In Repair</option>
              <option value="IN_MAINTENANCE">In Maintenance</option>
              <option value="RETIRED">Retired</option>
              <option value="LOST">Lost</option>
              <option value="DISPOSED">Disposed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input name="model" value={form.model} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
            <input name="manufacturer" value={form.manufacturer} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input name="serial_number" value={form.serial_number} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <select name="location_id" value={form.location_id} onChange={handleChange} className="mt-1 input-field">
              <option value="">Select...</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vendor</label>
            <select name="vendor_id" value={form.vendor_id} onChange={handleChange} className="mt-1 input-field">
              <option value="">Select...</option>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
            <select name="assigned_to_user_id" value={form.assigned_to_user_id} onChange={handleChange} className="mt-1 input-field">
              <option value="">Unassigned</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.email})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
            <input type="date" name="purchase_date" value={form.purchase_date} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Warranty Expiry</label>
            <input type="date" name="warranty_expiry" value={form.warranty_expiry} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Cost</label>
            <input type="number" step="0.01" name="purchase_cost" value={form.purchase_cost} onChange={handleChange} className="mt-1 input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} className="mt-1 input-field" />
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => navigate('/assets')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Asset'}</button>
        </div>
      </form>
    </div>
  )
}