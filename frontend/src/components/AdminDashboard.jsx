import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUsers, activateUser, deactivateUser } from '../api/users';
import { Loader } from './Loader';
import { Toast } from './Toast';
import { Modal, useModal } from './Modal';

export function AdminDashboard() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const modal = useModal();

  const load = useCallback(async (p = page) => {
    if (!token) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const data = await fetchUsers({ page: p, limit: 10, token });
      setUsers(data.data);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAction = (actionFn, userId, label) => {
    const isDeactivate = label === 'deactivate';
    modal.show({
      title: `${label.charAt(0).toUpperCase() + label.slice(1)} User`,
      message: `Are you sure you want to ${label} this user?`,
      danger: isDeactivate,
      onConfirm: async () => {
        setLoading(true);
        setError('');
        setMessage('');
        try {
          await actionFn({ userId, token });
          setMessage(`User ${label}d`);
          await load(page);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className="layout">
      <div className="card">
        <h1>Admin Dashboard</h1>
        <p className="muted">Manage users (paginate, activate/deactivate).</p>
        <Loader show={loading} />
        <Toast message={error} type="error" />
        <Toast message={message} type="success" />

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>No users found</td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u._id || u.id}>
                  <td>{u.email}</td>
                  <td>{u.fullName}</td>
                  <td>{u.role}</td>
                  <td className={u.status === 'active' ? 'status active' : 'status inactive'}>{u.status}</td>
                  <td>
                    {u.status === 'inactive' ? (
                      <button
                        className="btn primary sm"
                        disabled={loading}
                        onClick={() => handleAction(activateUser, u._id || u.id, 'activate')}
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        className="btn danger sm"
                        disabled={loading}
                        onClick={() => handleAction(deactivateUser, u._id || u.id, 'deactivate')}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="btn secondary sm" disabled={page <= 1 || loading} onClick={() => load(page - 1)}>
            Prev
          </button>
          <span className="page-label">
            Page {page} / {totalPages}
          </span>
          <button className="btn secondary sm" disabled={page >= totalPages || loading} onClick={() => load(page + 1)}>
            Next
          </button>
        </div>
      </div>

      <Modal {...modal.props} />
    </div>
  );
}
