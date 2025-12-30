import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/AdminDashboard';
import { updateProfile, changePassword } from './api/profile';
import { Loader } from './components/Loader';
import { Toast } from './components/Toast';

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

        <Loader show={loading} />

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

        <Toast message={message} type="success" />
        <Toast message={error} type="error" />

        <div className="api-hint">
          Backend base URL via REACT_APP_API_BASE_URL. Default: http://localhost:5001
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName || '', email: user?.email || '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onPwChange = (e) => setPw((p) => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      setLoading(true);
      await updateProfile({ fullName: form.fullName, email: form.email, token });
      setMessage('Profile updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      setLoading(true);
      await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword, token });
      setMessage('Password updated');
      setPw({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="layout">
      <div className="card">
        <h1>Profile</h1>
        <Loader show={loading} />
        {user ? (
          <>
            <form className="form" onSubmit={saveProfile}>
              <label>
                Full Name
                <input name="fullName" value={form.fullName} onChange={onChange} required />
              </label>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={onChange} required />
              </label>
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save profile'}
              </button>
            </form>

            <div className="divider" />

            <form className="form" onSubmit={savePassword}>
              <label>
                Current Password
                <input
                  name="currentPassword"
                  type="password"
                  value={pw.currentPassword}
                  onChange={onPwChange}
                  required
                />
              </label>
              <label>
                New Password
                <input
                  name="newPassword"
                  type="password"
                  value={pw.newPassword}
                  onChange={onPwChange}
                  required
                  minLength={8}
                />
              </label>
              <button className="btn secondary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Change password'}
              </button>
            </form>
          </>
        ) : (
          <p className="muted">No user data.</p>
        )}

        <Toast message={message} type="success" />
        <Toast message={error} type="error" />
      </div>
    </div>
  );
}

function AdminPage() {
  return <AdminDashboard />;
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
