import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Package, AlertCircle } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
    <div className="w-full max-w-md">
      <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-2xl p-8">
        
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-500/10 border border-primary-500/20">
            <Package className="h-8 w-8 text-primary-400" />
          </div>

          <h2 className="mt-4 text-3xl font-bold text-white">
            IT Inventory
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage your assets
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="
                w-full rounded-xl
                bg-slate-900/70
                border border-slate-700
                px-4 py-3
                text-white
                placeholder-slate-500
                focus:outline-none
                focus:ring-2
                focus:ring-primary-500
                focus:border-primary-500
                transition-all duration-200
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="
                w-full rounded-xl
                bg-slate-900/70
                border border-slate-700
                px-4 py-3
                text-white
                placeholder-slate-500
                focus:outline-none
                focus:ring-2
                focus:ring-primary-500
                focus:border-primary-500
                transition-all duration-200
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3
              rounded-xl
              font-semibold
              text-white
              bg-primary-600
              hover:bg-primary-500
              transition-all duration-200
              shadow-lg shadow-primary-500/20
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
  )
}