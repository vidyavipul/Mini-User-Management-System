import { useState } from 'react';
import './App.css';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, signup, login, logout, loading, error, setError } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

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
        <h1>User Management Demo</h1>
        <p className="muted">Simple auth wiring to the backend API.</p>

        {user ? (
          <div className="panel">
            <div className="info">
              <div><strong>Name:</strong> {user.fullName}</div>
              <div><strong>Email:</strong> {user.email}</div>
              <div><strong>Role:</strong> {user.role}</div>
              <div><strong>Status:</strong> {user.status}</div>
            </div>
            <button className="btn secondary" onClick={logout} disabled={loading}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <div className="tabs">
              <button
                className={mode === 'login' ? 'tab active' : 'tab'}
                onClick={() => setMode('login')}
              >
                Login
              </button>
              <button
                className={mode === 'signup' ? 'tab active' : 'tab'}
                onClick={() => setMode('signup')}
              >
                Signup
              </button>
            </div>

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
          </>
        )}

        {message && <div className="toast success">{message}</div>}
        {error && <div className="toast error">{error}</div>}

        <div className="api-hint">
          Backend base URL is configurable via REACT_APP_API_BASE_URL. Default: http://localhost:5001
        </div>
      </div>
    </div>
  );
}

export default App;
