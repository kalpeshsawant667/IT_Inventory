useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await api.get('/auth/me') // or your auth check endpoint
      setUser(res.data)
    } catch (err) {
      console.error('Auth check failed:', err)
      localStorage.clear()
      setUser(null)
    } finally {
      setLoading(false) // Prevents staying stuck on "Loading..." indefinitely
    }
  }

  checkAuth()
}, [])