import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { Package, AlertCircle, CheckCircle } from 'lucide-react'

export default function Signup() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await api.post('/auth/register', {
        ...form,
        role_id: 2, // regular user by default
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-primary-400" />
          <h2 className="mt-6 text-3xl font-bold text-white">IT Inventory</h2>
          <p className="mt-2 text-sm text-slate-400">Create your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center p-4 text-sm text-red-400 bg-red-900/30 rounded-lg">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center p-4 text-sm text-green-400 bg-green-900/30 rounded-lg">
              <CheckCircle className="w-4 h-4 mr-2" />
              Account created! Redirecting to login...
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300">First Name *</label>
                <input
                  name="first_name"
                  required
                  value={form.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300">Last Name</label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Password *</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full btn-primary py-2.5 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}