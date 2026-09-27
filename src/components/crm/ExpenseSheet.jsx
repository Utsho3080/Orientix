import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Filter, TrendingUp, TrendingDown, Wallet, Building, UserCheck, ArrowRightLeft, ChevronDown, ChevronUp } from 'lucide-react';
import './CrmStyles.css';

const CATEGORIES = [
  'Partner Investment',
  'Marketing',
  'Software',
  'Office Supplies',
  'Campaign Expenses',
  'Travel',
  'Salaries',
  'Freelancers',
  'Operations',
  'Client Payment',
  'Client Refund',
  'Miscellaneous'
];

const PARTNERS = ['Sujit', 'Utsho', 'Shreya'];
const HOLDINGS = ['Bank', 'Sujit', 'Utsho', 'Shreya'];

// API Base URL - Uses VITE_API_URL or defaults to localhost in dev, or relative in production
const API_BASE = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

// Helper to convert email into friendly admin name
const getAdminName = (raw) => {
  if (!raw) return 'Admin';
  if (raw.toLowerCase().includes('utsho')) return 'Utsho';
  if (raw.toLowerCase().includes('sujit')) return 'Sujit';
  if (raw.toLowerCase().includes('shreya')) return 'Shreya';
  if (raw.toLowerCase().includes('puja')) return 'Puja';
  if (raw.includes('@')) {
    const prefix = raw.split('@')[0].split('.')[0];
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return raw;
};

const ExpenseSheet = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Toggle for More Details (Holdings & Investment Bars)
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // Form State (New / Edit Transaction)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'debit',
    category: 'Marketing',
    holding_account: 'Bank',
    partner: '',
    expense_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Transfer Modal State (1-Click Transfer)
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    from_holding: 'Utsho',
    to_holding: 'Sujit',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Filter States
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterHolding, setFilterHolding] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('crm_token');
      if (!token) {
        throw new Error('No active session found. Please log in again.');
      }
      const response = await fetch(`${API_BASE}/api/crm/expenses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Your session has expired or requires Super Admin permissions. Please log out and log back in.');
        }
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category || !form.holding_account) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const token = localStorage.getItem('crm_token');
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `${API_BASE}/api/crm/expenses/${editingId}`
        : `${API_BASE}/api/crm/expenses`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Failed to save transaction');

      setModalOpen(false);
      resetForm();
      fetchTransactions();
    } catch (err) {
      alert(err.message);
    }
  };

  // 1-Click Transfer Submit
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!transferForm.amount || parseFloat(transferForm.amount) <= 0) {
      alert('Please enter a valid amount to transfer.');
      return;
    }
    if (transferForm.from_holding === transferForm.to_holding) {
      alert('From Account and To Account must be different.');
      return;
    }

    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch(`${API_BASE}/api/crm/expenses/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transferForm)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to execute transfer');
      }

      setTransferModalOpen(false);
      setTransferForm({
        from_holding: 'Utsho',
        to_holding: 'Sujit',
        amount: '',
        expense_date: getTodayDateString(),
        description: ''
      });
      fetchTransactions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch(`${API_BASE}/api/crm/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      fetchTransactions();
    } catch (err) {
      alert(err.message);
    }
  };

  // Helper to format date string for <input type="date"> without UTC shift
  const toLocalDateInputString = (d) => {
    if (!d) return '';
    if (typeof d === 'string' && d.includes('T')) {
      const dateObj = new Date(d);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      return d;
    }
    const dateObj = new Date(d);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const openAddModal = () => {
    resetForm();
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (tx) => {
    setEditingId(tx.id);
    setForm({
      title: tx.title || '',
      amount: tx.amount || '',
      type: tx.type || 'debit',
      category: tx.category || 'Marketing',
      holding_account: tx.holding_account || 'Bank',
      partner: tx.partner || '',
      expense_date: toLocalDateInputString(tx.expense_date),
      description: tx.description || ''
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({
      title: '',
      amount: '',
      type: 'debit',
      category: 'Marketing',
      holding_account: 'Bank',
      partner: '',
      expense_date: getTodayDateString(),
      description: ''
    });
  };

  const formatRupee = (val) => {
    const num = parseFloat(val || 0);
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Overall Totals (Internal Transfers do not count as company expenses or revenue)
  const totalCredit = transactions
    .filter(tx => tx.type === 'credit' && tx.category !== 'Transfer')
    .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

  const totalDebit = transactions
    .filter(tx => tx.type === 'debit' && tx.category !== 'Transfer')
    .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

  const netBalance = totalCredit - totalDebit;

  // Investment Calculations for Sujit, Utsho, Shreya
  const partnerInvestments = PARTNERS.map(partner => {
    const pLower = partner.toLowerCase();

    const isPartnerInvestmentTx = (tx) => {
      if (tx.type !== 'credit') return false;
      if (tx.category === 'Transfer') return false; // Transfers are internal holding moves
      const partnerAttr = (tx.partner || '').toLowerCase();
      const holdingAcc = (tx.holding_account || '').toLowerCase();
      const titleLower = (tx.title || '').toLowerCase();
      const descLower = (tx.description || '').toLowerCase();

      // Explicit partner attribution
      if (partnerAttr === pLower) return true;

      // Category is Partner Investment
      if (tx.category === 'Partner Investment') {
        if (holdingAcc === pLower) return true;
        if (titleLower.includes(pLower) || descLower.includes(pLower)) return true;
      }

      // Title or description mentions partner and invest/investment/purchase/cost
      if (titleLower.includes(pLower) || descLower.includes(pLower)) {
        if (titleLower.includes('invest') || descLower.includes('invest') ||
          titleLower.includes('purchase') || descLower.includes('cover') ||
          tx.category === 'Partner Investment') {
          return true;
        }
      }

      return false;
    };

    const isPartnerDebitTx = (tx) => {
      if (tx.type !== 'debit') return false;
      if (tx.category === 'Transfer') return false; // Transfers are internal holding moves
      const partnerAttr = (tx.partner || '').toLowerCase();
      const titleLower = (tx.title || '').toLowerCase();
      const descLower = (tx.description || '').toLowerCase();

      // Explicit partner attribution
      if (partnerAttr === pLower) return true;

      // Reimbursement or withdrawal for this partner in title or description
      if (titleLower.includes(pLower) || descLower.includes(pLower)) {
        return true;
      }

      // If title contains "reimburse" or "reimbersment" and this partner has an active investment
      if (titleLower.includes('reimbers') || titleLower.includes('reimburse') || descLower.includes('reimburse')) {
        return true;
      }

      return false;
    };

    const totalInvested = transactions
      .filter(isPartnerInvestmentTx)
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    const partnerExpenses = transactions
      .filter(isPartnerDebitTx)
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    return {
      partner,
      totalInvestment: totalInvested,
      currentInvestment: Math.max(0, totalInvested - partnerExpenses)
    };
  });

  // Holding Balance Calculations: Bank, Sujit, Utsho, Shreya
  // Inflow to account (Credit where holding_account == X) - Outflow from account (Debit where holding_account == X)
  const holdingsBalance = HOLDINGS.map(holding => {
    const hLower = holding.toLowerCase();

    const credits = transactions
      .filter(tx => tx.type === 'credit' && (tx.holding_account || 'Bank').toLowerCase() === hLower)
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    const debits = transactions
      .filter(tx => tx.type === 'debit' && (tx.holding_account || 'Bank').toLowerCase() === hLower)
      .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    return {
      holding,
      balance: credits - debits
    };
  });

  // Filtered Table List
  const filteredTransactions = transactions.filter(tx => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
    const matchesHolding = filterHolding === 'all' || (tx.holding_account || 'Bank').toLowerCase() === filterHolding.toLowerCase();
    const matchesSearch = tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesCategory && matchesHolding && matchesSearch;
  });

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading expense sheet...</div>;
  if (error) return <div className="security-notice">Error: {error}</div>;

  return (
    <div className="crm-container">
      {/* Header section with 1-Click Transfer & New Transaction */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0 }}>Expense & Investment Sheet</h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}>Real-time holding balances & partner investments in Indian Rupees (₹)</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="action-btn"
            onClick={() => setTransferModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#6366f1', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            <ArrowRightLeft size={16} /> 1-Click Transfer
          </button>
          <button
            className="action-btn mail"
            onClick={openAddModal}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> New Transaction
          </button>
        </div>
      </div>

      {/* Main Totals */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <h4>Total Credit (Inflow)</h4>
          <div className="stat-number" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={24} />
            {formatRupee(totalCredit)}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid #dc2626' }}>
          <h4>Total Debit (Expenses)</h4>
          <div className="stat-number" style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingDown size={24} />
            {formatRupee(totalDebit)}
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: `4px solid ${netBalance >= 0 ? '#16a34a' : '#dc2626'}` }}>
          <h4>Net Cash Balance</h4>
          <div className="stat-number" style={{ color: netBalance >= 0 ? '#16a34a' : '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Wallet size={24} />
            {formatRupee(netBalance)}
          </div>
        </div>
      </div>

      {/* Collapsible More Details Toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '4px 0 12px 0' }}>
        <button
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#334155',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          {showMoreDetails ? (
            <>
              Hide Details <ChevronUp size={16} color="#64748b" />
            </>
          ) : (
            <>
              More Details (Holdings & Investments) <ChevronDown size={16} color="#64748b" />
            </>
          )}
        </button>
      </div>

      {/* 1. HOLDINGS BAR & 2. INVESTMENT BAR (Collapsible) */}
      {showMoreDetails && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
          {/* 1. HOLDINGS BAR */}
          <div className="card" style={{ padding: '1.25rem', margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Building size={18} style={{ color: '#3b82f6' }} />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Holding Bar (Current Balances)</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {holdingsBalance.map(item => (
                <div
                  key={item.holding}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 16px'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{item.holding} Holding</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px', color: item.balance >= 0 ? '#0f172a' : '#dc2626' }}>
                    {formatRupee(item.balance)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. INVESTMENT BAR */}
          <div className="card" style={{ padding: '1.25rem', margin: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <UserCheck size={18} style={{ color: '#10b981' }} />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Investment Bar (Sujit, Utsho, Shreya)</h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {partnerInvestments.map(item => (
                <div
                  key={item.partner}
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '12px 16px'
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#166534', fontSize: '0.95rem' }}>{item.partner}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.8rem', color: '#4b5563' }}>
                    <span>Current Investment:</span>
                    <strong style={{ color: '#15803d' }}>{formatRupee(item.currentInvestment)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.8rem', color: '#6b7280' }}>
                    <span>Total Investment:</span>
                    <span>{formatRupee(item.totalInvestment)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="card" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
        <div style={{ display: 'flex', flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={16} style={{ color: '#64748b' }} />
          <select
            value={filterHolding}
            onChange={(e) => setFilterHolding(e.target.value)}
            style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}
          >
            <option value="all">All Holdings</option>
            {HOLDINGS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}
          >
            <option value="all">All Types</option>
            <option value="credit">Credit (Inflow)</option>
            <option value="debit">Debit (Deduction)</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', backgroundColor: 'white' }}
          >
            <option value="all">All Categories</option>
            <option value="Transfer">Transfer</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-wrapper">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title / Description</th>
              <th>Holding Account</th>
              <th>Transfer Account</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount (₹)</th>
              <th>Created By</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                  No transactions found matching your filters.
                </td>
              </tr>
            ) : (
              filteredTransactions.map(tx => (
                <tr key={tx.id}>
                  <td>
                    {(() => {
                      const dateStr = toLocalDateInputString(tx.expense_date);
                      if (!dateStr) return 'N/A';
                      const [y, m, d] = dateStr.split('-');
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
                    })()}
                  </td>
                  <td>
                    <div><strong>{tx.title}</strong></div>
                    {tx.description && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{tx.description}</div>}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#334155' }}>
                      {tx.holding_account || 'Bank'}
                    </span>
                  </td>
                  <td>
                    {tx.partner ? (
                      <span style={{ fontWeight: 600, color: '#4f46e5' }}>
                        {tx.partner}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '6px' }}>
                      {tx.category}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${tx.type === 'credit' ? 'status-converted' : 'status-unqualified'}`}>
                      {tx.type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: tx.type === 'credit' ? '#16a34a' : '#dc2626' }}>
                      {tx.type === 'credit' ? '+' : '-'}{formatRupee(tx.amount)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 500, color: '#475569', fontSize: '0.85rem' }}>
                      {getAdminName(tx.created_by)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => openEditModal(tx)}
                        style={{ border: 'none', background: 'none', padding: '4px', cursor: 'pointer', color: '#3b82f6' }}
                        title="Edit Transaction"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        style={{ border: 'none', background: 'none', padding: '4px', cursor: 'pointer', color: '#ef4444' }}
                        title="Delete Transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 1-Click Transfer Modal */}
      {transferModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowRightLeft size={20} color="#6366f1" /> 1-Click Account Transfer
              </h3>
              <button className="close-btn" onClick={() => setTransferModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleTransferSubmit} className="modal-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>From Account (Deduct) *</label>
                  <select
                    value={transferForm.from_holding}
                    onChange={(e) => setTransferForm({ ...transferForm, from_holding: e.target.value })}
                    required
                  >
                    {HOLDINGS.map(h => (
                      <option key={h} value={h}>{h} Account</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>To Account (Deposit) *</label>
                  <select
                    value={transferForm.to_holding}
                    onChange={(e) => setTransferForm({ ...transferForm, to_holding: e.target.value })}
                    required
                  >
                    {HOLDINGS.map(h => (
                      <option key={h} value={h}>{h} Account</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 2000"
                    value={transferForm.amount}
                    onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    required
                    value={transferForm.expense_date}
                    onChange={(e) => setTransferForm({ ...transferForm, expense_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Transfer Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Campaign budget, cash handoff..."
                  value={transferForm.description}
                  onChange={(e) => setTransferForm({ ...transferForm, description: e.target.value })}
                />
              </div>

              <button type="submit" className="submit-btn" style={{ backgroundColor: '#6366f1' }}>
                Execute Transfer Now
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog for New / Edit Transaction */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Transaction' : 'Record Transaction'}</h3>
              <button className="close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title / Particulars *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hosting, Domain, Ad Campaign, Partner Investment"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Transaction Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="debit">Debit (Deduction / Expense)</option>
                    <option value="credit">Credit (Inflow / Investment)</option>
                  </select>
                </div>
              </div>

              {/* Deduct From / Holding Calculation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>{form.type === 'debit' ? 'Deduct From (Holding) *' : 'Deposit Into (Holding) *'}</label>
                  <select
                    value={form.holding_account}
                    onChange={(e) => setForm({ ...form, holding_account: e.target.value })}
                    required
                  >
                    {HOLDINGS.map(h => (
                      <option key={h} value={h}>{h} Account</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Transfer Account (Optional)</label>
                  <select
                    value={form.partner}
                    onChange={(e) => setForm({ ...form, partner: e.target.value })}
                  >
                    <option value="">None / Company</option>
                    {HOLDINGS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const updates = { category: newCat };
                      if (newCat === 'Partner Investment') {
                        updates.type = 'credit';
                      } else if (newCat === 'Client Payment') {
                        updates.type = 'credit';
                      }
                      setForm({ ...form, ...updates });
                    }}
                  >
                    <option value="Transfer">Transfer</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    required
                    value={form.expense_date}
                    onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes / Description</label>
                <input
                  type="text"
                  placeholder="Additional remarks or reference ID..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button type="submit" className="submit-btn">
                {editingId ? 'Save Changes' : 'Confirm & Calculate'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseSheet;
