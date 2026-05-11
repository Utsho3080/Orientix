import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleMockLogin = async (role) => {
    // 1. Trigger the context login which fetch JWT from the real Express server
    await login(role);
    // 2. Push user to the 2FA test screen 
    navigate('/verify-2fa');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Orientix CRM Login</h2>
        <p>Enter your credentials to access the internal dashboard.</p>
        
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="admin@orientix.com" disabled />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" disabled />
          </div>
          
          <div className="devel-actions">
            <span className="devel-label">Mock Login Options (Dev Mode):</span>
            <button 
              type="button" 
              className="btn-admin"
              onClick={() => handleMockLogin('ADMIN')}
            >
              Login as Standard Admin
            </button>
            <button 
              type="button" 
              className="btn-superadmin"
              onClick={() => handleMockLogin('SUPER_ADMIN')}
            >
              Login as Super Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
