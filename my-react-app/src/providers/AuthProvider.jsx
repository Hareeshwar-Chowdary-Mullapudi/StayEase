import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import { AuthContext } from '../context/AuthContext.jsx'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (payload) => {
        const { data } = await api.post('/auth/login', payload)
        localStorage.setItem('token', data.token)
        setUser(data.user)
      },
      register: async (payload) => {
        const { data } = await api.post('/auth/register', payload)
        localStorage.setItem('token', data.token)
        setUser(data.user)
      },
      logout: () => {
        localStorage.removeItem('token')
        setUser(null)
      },
      updateUser: (next) => setUser(next),
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
