import React, { useState, useEffect } from 'react';
import { Mail, Clock } from 'lucide-react';
import './CrmStyles.css';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/crm/contact-messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch contact messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) return <div className="p-6">Loading messages...</div>;
  if (error) return <div className="security-notice m-6">Error: {error}</div>;

  return (
    <div className="crm-container">
      <h2><Mail className="inline mr-2" /> Contact Form Submissions</h2>
      
      <div className="table-wrapper" style={{ marginTop: '20px' }}>
        <table className="crm-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Sender</th>
              <th style={{ width: '20%' }}>Email</th>
              <th style={{ width: '45%' }}>Message</th>
              <th style={{ width: '15%' }}>Received At</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No messages received yet.
                </td>
              </tr>
            ) : (
              messages.map(msg => (
                <tr key={msg.id}>
                  <td><strong style={{ color: '#0f172a' }}>{msg.name}</strong></td>
                  <td>
                    <a href={`mailto:${msg.email}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      {msg.email}
                    </a>
                  </td>
                  <td>
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.message}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    <Clock size={12} className="inline mr-1" />
                    {new Date(msg.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactMessages;
