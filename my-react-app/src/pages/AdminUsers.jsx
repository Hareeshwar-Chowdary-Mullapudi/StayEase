import { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

const AdminUsers = () => {
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = () => {
    api
      .get('/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load users'))
  }

  useEffect(() => {
    load()
  }, [])

  const setRole = async (id, role) => {
    setError('')
    setMessage('')
    try {
      const { data } = await api.patch(`/users/${id}/role`, { role })
      setUsers((current) =>
        current.map((user) => (user._id === id ? data.user : user))
      )
      setMessage(`${data.user.email} is now ${data.user.role}.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update role')
    }
  }

  return (
    <section className="page">
      <h2>Admin</h2>
      <p className="muted">Make other accounts admin. You stay guest/host as well.</p>
      {message && <p className="ok">{message}</p>}
      {error && <p className="error">{error}</p>}
      {users.map((user) => (
        <article key={user._id} className="box row">
          <div>
            <h3>{user.name}</h3>
            <p className="muted">{user.email}</p>
            <p>Role: {user.role}</p>
          </div>
          <div className="actions">
            {user.role !== 'admin' && (
              <button className="btn" type="button" onClick={() => setRole(user._id, 'admin')}>
                Make admin
              </button>
            )}
            {user.role === 'admin' && user._id !== me._id && (
              <button className="btn light" type="button" onClick={() => setRole(user._id, 'guest')}>
                Remove admin
              </button>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}

export default AdminUsers
