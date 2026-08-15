import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext.jsx'

const Profile = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [message, setMessage] = useState('')

  const save = async (event) => {
    event.preventDefault()
    const { data } = await api.put('/users/profile', { name, avatar })
    updateUser(data.user)
    setMessage('Profile updated.')
  }

  return (
    <section className="panel">
      <h1>My profile</h1>
      <form onSubmit={save}>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Avatar URL
          <input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        </label>
        <label>
          Email
          <input value={user?.email || ''} disabled />
        </label>
        {message && <p className="ok">{message}</p>}
        <button className="btn wide" type="submit">
          Save
        </button>
      </form>
      <div className="profile-logout">
        <button
          className="btn light wide"
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
        >
          Logout
        </button>
      </div>
    </section>
  )
}

export default Profile
