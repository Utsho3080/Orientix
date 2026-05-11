import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [is2FAVerified, setIs2FAVerified] = useState(false);

  // On mount, check if there's a valid JWT in localStorage
  useEffect(() => {
    const token = localStorage.getItem('crm_token');
    const storedRole = localStorage.getItem('crm_role');

    if (token && storedRole) {
      setUserRole(storedRole);
      setIsAuthenticated(true);
      setIs2FAVerified(true); // Assuming stored 24h token means 2FA was done
    }
  }, []);

  // Step 1: Login with Email/Password (Connecting to backend)
  const login = async (role) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@orientix.com', password: 'password', role: role })
      });
      
      const data = await response.json();
      if (response.ok) {
        // Store temp token for 2FA phase
        localStorage.setItem('temp_jwt', data.token);
        setIsAuthenticated(true);
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  // Step 2: Verify 2FA
  const verify2FA = async (code) => {
    try {
      const tempToken = localStorage.getItem('temp_jwt');
      const response = await fetch('http://localhost:5000/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code, tempToken: tempToken })
      });
      
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('crm_token', data.token);
        localStorage.setItem('crm_role', data.role);
        localStorage.removeItem('temp_jwt');
        
        setUserRole(data.role);
        setIs2FAVerified(true);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('crm_token');
    localStorage.removeItem('crm_role');
    localStorage.removeItem('temp_jwt');
    setUserRole(null);
    setIsAuthenticated(false);
    setIs2FAVerified(false);
  };

  return (
    <AuthContext.Provider value={{ 
      userRole, 
      isAuthenticated, 
      is2FAVerified, 
      login, 
      verify2FA, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
