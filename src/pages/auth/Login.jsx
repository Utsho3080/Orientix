import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/verify-2fa');
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Orientix CRM Login</h2>
        <p>Enter your credentials to access the internal dashboard.</p>

        <form className="auth-form" onSubmit={handleLogin}>
          {error && <div className="error-text" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. Admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" style={{ marginTop: '1rem', width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
