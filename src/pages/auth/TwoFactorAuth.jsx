import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const TwoFactorAuth = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { verify2FA, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If they reached this page without logging in first, send back
  if (!isAuthenticated && !localStorage.getItem('temp_jwt')) {
    return <Navigate to="/login" replace />;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length === 6) {
      try {
        await verify2FA(code);
        const role = localStorage.getItem('crm_role');
        
        // Route them to their specific separated portals
        if (role === 'SUPER_ADMIN') {
          navigate('/superadmin');
        } else {
          navigate('/admin');
        }
      } catch (err) {
        setError(err.message || 'Verification failed. Try again.');
      }
    } else {
      setError('Please enter a valid 6-digit code.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Two-Factor Authentication</h2>
        <p>Open your Google Authenticator app and enter the 6-digit code for your Orientix account.</p>
        
        <form className="auth-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label>Authentication Code</label>
            <input 
              type="text" 
              maxLength="6"
              placeholder="123456" 
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            {error && <span className="error-text">{error}</span>}
          </div>
          
          <button type="submit" className="submit-btn" disabled={code.length !== 6}>
            Verify & Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
