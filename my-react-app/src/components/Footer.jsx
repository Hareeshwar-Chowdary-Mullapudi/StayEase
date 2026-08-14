import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div>
        <p className="footer-brand">StayEase</p>
        <p>Simple stays across India.</p>
      </div>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
    <p className="footer-copy">© {new Date().getFullYear()} StayEase</p>
  </footer>
)

export default Footer
