import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import "../../pages/auth/Auth.css";

const TwoFactorSetup = ({ onSetupComplete }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { setup2FA } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const tempToken = localStorage.getItem('temp_jwt');
        const response = await fetch('http://localhost:5000/api/auth/generate-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tempToken })
        });
        
        const data = await response.json();
        if (response.ok) {
          setQrCodeUrl(data.qrCodeUrl);
          setSecret(data.secret);
        } else {
          setError('Failed to generate QR code.');
        }
      } catch (err) {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchQrCode();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length === 6) {
      try {
        await setup2FA(code, secret);
        const role = localStorage.getItem('crm_role');
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

  if (loading) {
    return <p>Generating secure QR code...</p>;
  }

  return (
    <div className="auth-card">
      <h2>Setup Two-Factor Authentication</h2>
      <p>Scan this QR code with Google Authenticator.</p>
      
      {qrCodeUrl && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={qrCodeUrl} alt="2FA QR Code" style={{ border: '2px solid #ddd', borderRadius: '8px' }} />
        </div>
      )}
      
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
          Complete Setup
        </button>
      </form>
    </div>
  );
};

export default TwoFactorSetup;
