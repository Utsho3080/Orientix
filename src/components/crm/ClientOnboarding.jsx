import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, CheckCircle, Clock, X, Mail, Phone, User, DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './CrmStyles.css';

const ClientOnboarding = () => {
  const { userRole } = useAuth();
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Form Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeClient, setActiveClient] = useState(null);

  // Form Inputs
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Active');
  const [service, setService] = useState('Web');
  const [totalAmount, setTotalAmount] = useState('');
  const [pendingAmount, setPendingAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('');

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/crm/clients`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/crm/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          company_name: companyName, contact_name: contactName, email, phone, status,
          service, total_amount: totalAmount || 0, pending_amount: pendingAmount || 0, paid_amount: paidAmount || 0 
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        resetForm();
        fetchClients();
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to add client.');
      }
    } catch (err) {
      alert('Network error adding client.');
    }
  };

  const handleEditClient = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/crm/clients/${activeClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          company_name: companyName, contact_name: contactName, email, phone, status,
          service, total_amount: totalAmount || 0, pending_amount: pendingAmount || 0, paid_amount: paidAmount || 0 
        })
      });

      if (response.ok) {
        setShowEditModal(false);
        resetForm();
        fetchClients();
      } else {
        const errData = await response.json();
        alert(errData.error || 'Failed to update client.');
      }
    } catch (err) {
      alert('Network error updating client.');
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/crm/clients/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchClients();
      } else {
        alert('Failed to delete client.');
      }
    } catch (err) {
      alert('Network error deleting client.');
    }
  };

  const openEditModal = (client) => {
    setActiveClient(client);
    setCompanyName(client.company_name);
    setContactName(client.contact_name || '');
    setEmail(client.email || '');
    setPhone(client.phone || '');
    setStatus(client.status || 'Active');
    setService(client.service || 'Web');
    setTotalAmount(client.total_amount || '');
    setPendingAmount(client.pending_amount || '');
    setPaidAmount(client.paid_amount || '');
    setShowEditModal(true);
  };

  const resetForm = () => {
    setActiveClient(null);
    setCompanyName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setStatus('Active');
    setService('Web');
    setTotalAmount('');
    setPendingAmount('');
    setPaidAmount('');
  };

  // Stats calculation
  const totalCount = clients.length;
  const activeCount = clients.filter(c => c.status === 'Active').length;
  const totalRevenue = clients.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0);

  const filteredClients = clients.filter(c => 
    c.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.contact_name && c.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="p-6">Loading client pipelines...</div>;
  if (error) return <div className="security-notice m-6">Error: {error}</div>;

  return (
    <div className="crm-container">
      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4>Total Clients</h4>
              <span className="stat-number">{totalCount}</span>
            </div>
            <Users size={32} style={{ color: '#3b82f6', opacity: 0.8 }} />
          </div>
        </div>
        <div className="stat-card success-stat">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4>Active Accounts</h4>
              <span className="stat-number">{activeCount}</span>
            </div>
            <CheckCircle size={32} style={{ color: '#16a34a', opacity: 0.8 }} />
          </div>
        </div>
        <div className="stat-card warning-stat">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4>Total Revenue Pipeline</h4>
              <span className="stat-number">${totalRevenue.toLocaleString()}</span>
            </div>
            <DollarSign size={32} style={{ color: '#ca8a04', opacity: 0.8 }} />
          </div>
        </div>
      </div>

      {/* Control Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', width: '60%' }}>
          <input
            type="text"
            placeholder="Search company or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              width: '300px',
              fontSize: '0.875rem'
            }}
          />
        </div>
        {isSuperAdmin && (
          <button 
            className="action-btn"
            style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            onClick={() => { resetForm(); setShowAddModal(true); }}
          >
            <Plus size={16} /> Add Client
          </button>
        )}
      </div>

      {/* Table grid */}
      <div className="table-wrapper">
        <table className="crm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Company Name</th>
              <th>Primary Contact</th>
              <th>Service</th>
              <th>Financials</th>
              <th>Status</th>
              {isSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={isSuperAdmin ? 7 : 6} style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                  No clients found.
                </td>
              </tr>
            ) : (
              filteredClients.map(client => (
                <tr key={client.id}>
                  <td style={{ color: '#64748b' }}>#{client.id}</td>
                  <td>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{client.company_name}</strong>
                    {client.email && <span style={{ fontSize: '0.75rem', color: '#64748b' }}><Mail size={10} className="inline mr-1" />{client.email}</span>}
                  </td>
                  <td>
                    {client.contact_name || <span style={{ color: '#94a3b8' }}>None</span>}
                    {client.phone && <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}><Phone size={10} className="inline mr-1" />{client.phone}</span>}
                  </td>
                  <td>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e2e8f0', fontSize: '0.75rem', fontWeight: 'bold' }}>{client.service || 'N/A'}</span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    <div style={{ color: '#333' }}>Total: ${client.total_amount || 0}</div>
                    <div style={{ color: '#16a34a' }}>Paid: ${client.paid_amount || 0}</div>
                    <div style={{ color: '#ef4444' }}>Pending: ${client.pending_amount || 0}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${client.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {client.status}
                    </span>
                  </td>
                  {isSuperAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => openEditModal(client)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }} title="Edit Client"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteClient(client.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete Client"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals for Add/Edit using a shared form layout */}
      {(showAddModal || showEditModal) && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>{showAddModal ? 'Add New Client' : 'Edit Client'}</h3>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={showAddModal ? handleAddClient : handleEditClient} className="modal-form">
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Primary Contact Name</label>
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                <div className="form-group">
                  <label>Service Provided</label>
                  <select value={service} onChange={e => setService(e.target.value)}>
                    <option value="Web">Web Development</option>
                    <option value="Marketing">Marketing</option>
                    <option value="SEO">SEO</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Total Amount ($)</label>
                  <input type="number" step="0.01" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Paid Amount ($)</label>
                  <input type="number" step="0.01" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Pending Amount ($)</label>
                  <input type="number" step="0.01" value={pendingAmount} onChange={e => setPendingAmount(e.target.value)} />
                </div>
              </div>

              <button type="submit" className="submit-btn" style={{ marginTop: '1.5rem' }}>{showAddModal ? 'Register Client' : 'Save Changes'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientOnboarding;
