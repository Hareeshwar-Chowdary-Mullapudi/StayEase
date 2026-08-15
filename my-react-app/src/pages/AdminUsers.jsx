import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

const AdminUsers = () => {
  const { user: me } = useAuth()
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api
      .get('/users')
      .then(({ data }) => setUsers(data.users || []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load admins'))
  }, [])

  const addAdmin = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      const { data } = await api.post('/users/admin', { email })
      setUsers((current) => {
        const exists = current.some((user) => user._id === data.user._id)
        return exists
          ? current.map((user) => (user._id === data.user._id ? data.user : user))
          : [data.user, ...current]
      })
      setMessage(`${data.user.email} is now an admin.`)
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add admin')
    }
  }

  const removeAdmin = async (id) => {
    setError('')
    setMessage('')
    try {
      const { data } = await api.patch(`/users/${id}/role`, { role: 'guest' })
      setUsers((current) => current.map((user) => (user._id === id ? data.user : user)))
      setMessage(`${data.user.email} is no longer an admin.`)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to remove admin')
    }
  }

  const admins = users.filter((user) => user.role === 'admin')

  return (
    <section className="page">
      <div className="row">
        <h2>Admins</h2>
        <Link className="btn light" to="/admin/requests">
          Listing requests
        </Link>
      </div>
      {message && <p className="ok">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form className="box admin-add" onSubmit={addAdmin}>
        <label>
          Add admin by email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
            required
          />
        </label>
        <button className="btn" type="submit">
          Add admin
        </button>
      </form>
      {admins.map((user) => (
        <article key={user._id} className="box row">
          <div>
            <h3>{user.name}</h3>
            <p className="muted">{user.email}</p>
          </div>
          {user._id !== me._id && (
            <button className="btn light" type="button" onClick={() => removeAdmin(user._id)}>
              Remove admin
            </button>
          )}
        </article>
      ))}
    </section>
  )
}

export default AdminUsers
