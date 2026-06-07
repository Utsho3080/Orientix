import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw } from 'lucide-react';
import './CrmStyles.css';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('crm_token');
      const response = await fetch('http://localhost:5000/api/crm/audit', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch audit logs');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  const getActionBadgeClass = (action) => {
    const act = action.toUpperCase();
    if (act.includes('DELETE')) return 'badge-danger';
    if (act.includes('CREATE') || act.includes('UPLOAD')) return 'badge-success';
    if (act.includes('UPDATE')) return 'badge-warning';
    return 'badge-info';
  };

  if (loading && logs.length === 0) return <div className="p-6">Loading audit trails...</div>;
  if (error) return <div className="security-notice m-6">Error: {error}</div>;

  return (
    <div className="crm-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={20} style={{ color: '#ef4444' }} />
          <h3>System Audit Trail</h3>
        </div>
        <button
          onClick={fetchLogs}
          className="action-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            padding: '6px 12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Logs
        </button>
      </div>

      <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', marginTop: 0 }}>
        Logs represent live architectural edits, cold-call status changes, CSV imports, website configuration saves, and data alterations. 
      </p>

      <div className="table-wrapper">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Operator</th>
              <th>Event Action</th>
              <th>Details & Description</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {formatDate(log.created_at)}
                  </td>
                  <td style={{ fontWeight: '500', color: '#334155' }}>
                    {log.user_email}
                  </td>
                  <td>
                    <span className={`status-badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ color: '#475569', fontSize: '0.85rem', whiteSpace: 'normal', wordBreak: 'break-all' }}>
                    {log.details}
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

export default AuditLogs;
