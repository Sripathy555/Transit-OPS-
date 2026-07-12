import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-container animate-fade">
      <div className="auth-card">
        
        {/* Header Section */}
        <div className="auth-header">
          <div className="auth-logo">
            T
          </div>
          <h2 className="auth-title">
            TransitOps
          </h2>
          <p className="auth-subtitle">
            Enterprise Fleet Management Platform
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="form-error-banner flex items-center gap-2" style={{ textAlign: 'left' }}>
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }} className="space-y-4">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="manager@transitops.com"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex justify-center items-center gap-2"
            style={{ padding: '12px' }}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            <span>Sign in to Secure Portal</span>
          </button>
        </form>

        {/* Credentials Box */}
        <div className="mt-8 pt-6 border-t border-[var(--card-border)]">
          <div className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Demo Credentials
          </div>
          <div className="bg-[var(--bg)] border border-[var(--card-border)] rounded-lg p-3 text-sm text-[var(--text-main)] font-mono">
            manager@transitops.com / password123
          </div>
        </div>

      </div>
    </div>
  );
}
