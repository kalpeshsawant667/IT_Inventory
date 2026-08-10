import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import AssetDetail from './pages/AssetDetail'
import AssetForm from './pages/AssetForm'
import Assignments from './pages/Assignments'
import Users from './pages/Users'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> 
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/assets/new" element={<AssetForm />} />
                <Route path="/assets/:id" element={<AssetDetail />} />
                <Route path="/assets/:id/edit" element={<AssetForm />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/users" element={<Users />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}