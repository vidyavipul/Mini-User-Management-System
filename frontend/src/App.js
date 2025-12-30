import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';

function AuthPage({ mode = 'login' }) {
  const { signup, login, loading, error, setError } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError?.(null);
    try {
      if (mode === 'signup') {
        await signup({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });
        setMessage('Signed up and logged in');
      } else {
        await login({ email: form.email, password: form.password });
        setMessage('Logged in');
      }
    } catch (err) {
      setMessage('');
      setError?.(err.message);
    }
  };

  return (
    <div className="layout">
      <div className="card">
        <h1>{mode === 'signup' ? 'Create account' : 'Welcome back'}</h1>
        <p className="muted">Authenticate to continue.</p>

        <form className="form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Full Name
              <input
                name="fullName"
                value={form.fullName}
                onChange={onChange}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              minLength={8}
            />
          </label>

          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signup' ? 'Sign up' : 'Log in'}
          </button>
        </form>

        {message && <div className="toast success">{message}</div>}
        {error && <div className="toast error">{error}</div>}

        <div className="api-hint">
          Backend base URL via REACT_APP_API_BASE_URL. Default: http://localhost:5001
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="layout">
      <div className="card">
        <h1>Profile</h1>
        {user ? (
          <div className="info">
            <div><strong>Name:</strong> {user.fullName}</div>
            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Role:</strong> {user.role}</div>
            <div><strong>Status:</strong> {user.status}</div>
          </div>
        ) : (
          <p className="muted">No user data.</p>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="layout">
      <div className="card">
        <h1>Admin Dashboard</h1>
        <p className="muted">Admin-only area. User list will go here.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          path="/profile"
          element={(
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/admin"
          element={(
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          )}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
