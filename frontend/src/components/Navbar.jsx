import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      <div className="nav-left">Mini UMS</div>
      <div className="nav-right">
        {user && (
          <>
            <span className="chip">{user.fullName} ({user.role})</span>
            <Link to="/profile">Profile</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button className="link-btn" onClick={logout}>Logout</button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
