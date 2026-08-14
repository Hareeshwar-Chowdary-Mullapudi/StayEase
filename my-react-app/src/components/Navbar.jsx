import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const close = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const go = (path) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <header className="nav">
      <Link className="logo" to="/">
        StayEase
      </Link>
      <nav className="nav-right">
        <NavLink to="/">Home</NavLink>
        {user ? (
          <div className="menu" ref={menuRef}>
            <button type="button" className="hamburger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              <span />
              <span />
              <span />
            </button>
            {open && (
              <div className="dropdown">
                <button type="button" onClick={() => go('/profile')}>My profile</button>
                <button type="button" onClick={() => go('/trips')}>My trips</button>
                <button type="button" onClick={() => go('/host/dashboard')}>Host dashboard</button>
                <button type="button" onClick={() => go('/host/listings/new')}>Create listing</button>
                {user.role === 'admin' && (
                  <button type="button" onClick={() => go('/admin')}>Admin</button>
                )}
                <hr />
                <button
                  type="button"
                  className="danger"
                  onClick={() => {
                    setOpen(false)
                    logout()
                    navigate('/login')
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  )
}

export default Navbar
