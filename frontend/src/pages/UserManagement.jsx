import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Users, UserPlus, Trash2, Shield, Mail, CheckCircle, ArrowLeft, X } from 'lucide-react';

export default function UserManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Dispatcher' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users', form);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'Dispatcher' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen text-[var(--text-main)] bg-[var(--bg)]">
        <div className="text-lg font-medium animate-pulse">Loading user database...</div>
      </div>
    );
  }

  return (
    <div className="app-container min-h-screen bg-[var(--bg)] text-[var(--text-main)] animate-fade">
      <div className="app-content max-w-6xl mx-auto py-10 px-6">
        
        {/* Back Button and Header Section */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary mb-6 flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-header)] flex items-center gap-3">
                <Users className="text-[var(--primary)]" size={32} />
                User Management
              </h1>
              <p className="text-[var(--text-muted)] mt-1">Create, assign roles, and manage credentials for system users</p>
            </div>
            
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary flex items-center gap-2 self-start sm:self-auto"
            >
              <UserPlus size={18} />
              <span>Add System User</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="form-error-banner flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Users Table */}
        <div className="table-container">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="driver-avatar-cell">
                      <div className="driver-avatar">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="cell-bold">{u.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Mail size={14} />
                      <span>{u.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-dispatched flex items-center gap-1 w-fit">
                      <Shield size={12} />
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-available flex items-center gap-1 w-fit">
                      <span className="badge-dot"></span>
                      {u.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns-group justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {user.id !== u.id ? (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="icon-btn icon-btn-danger"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)] italic px-2">Current Session</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal popup for adding a new user */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content animate-scale">
              <div className="modal-header">
                <h3 className="modal-title flex items-center gap-2">
                  <UserPlus className="text-[var(--primary)]" size={22} />
                  Create New User
                </h3>
                <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateUser}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@transitops.com"
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Temporary Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({...form, password: e.target.value})}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">System Role Access</label>
                    <select
                      value={form.role}
                      onChange={e => setForm({...form, role: e.target.value})}
                      className="form-control"
                      style={{ cursor: 'pointer' }}
                    >
                      <option>Fleet Manager</option>
                      <option>Dispatcher</option>
                      <option>Safety Officer</option>
                      <option>Financial Analyst</option>
                    </select>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
