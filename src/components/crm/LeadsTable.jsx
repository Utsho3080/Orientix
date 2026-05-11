import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Instagram, Facebook, Link as LinkIcon, User, Youtube, ChevronLeft, ChevronRight } from 'lucide-react';
import './CrmStyles.css';

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch('http://localhost:5000/api/crm/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const updateField = async (id, fieldName, value) => {
    try {
      const token = localStorage.getItem('crm_token');
      const payload = {};
      payload[fieldName] = value;

      const response = await fetch(`http://localhost:5000/api/crm/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchLeads();
      } else {
        alert("Update failed on the server.");
      }
    } catch (err) {
      alert("Failed to connect to backend updating.");
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return <span className="text-gray-400">Never</span>;
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const extractJSON = (jsonString) => {
    if (!jsonString) return {};
    try { return typeof jsonString === 'object' ? jsonString : JSON.parse(jsonString); }
    catch (e) { return {}; }
  };

  // Pagination Logic
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <div>Loading real-time pipelines...</div>;
  if (error) return <div className="security-notice">Error: {error}</div>;

  return (
    <div className="crm-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Active Pipeline ({leads.length} Leads)</h3>
        {totalPages > 1 && (
          <div className="pagination-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="action-btn"
              style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', backgroundColor: currentPage === 1 ? '#e2e8f0' : '#fff' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="action-btn"
              style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', backgroundColor: currentPage === totalPages ? '#e2e8f0' : '#fff' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="table-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
        <table className="crm-table" style={{ whiteSpace: 'nowrap', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th>ID</th>
              <th>Lead / Category</th>
              <th>Location</th>
              <th>Contact Details</th>
              <th>Website</th>
              <th>Social Media</th>
              <th>Pipeline Status</th>
              <th>Remarks</th>
              <th>Last Update Audit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeads.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No leads found. Super Admins can upload CSV/Excel files to populate.
                </td>
              </tr>
            ) : (
              currentLeads.map((lead) => {
                const outscraper = extractJSON(lead.outscraper_data);

                const category = outscraper.subtypes || outscraper.Category || <span style={{ color: '#94a3b8' }}>None</span>;
                const city = outscraper.city || outscraper.City || outscraper.location || <span style={{ color: '#94a3b8' }}>None</span>;
                const state = outscraper.state || outscraper.State || '';

                const fb = outscraper.company_facebook || outscraper.facebook || outscraper['Facebook URL'];
                const ig = outscraper.company_instagram || outscraper.instagram || outscraper['Instagram URL'];
                const yt = outscraper.youtube || outscraper.YouTube || outscraper['YouTube URL'];
                const web = outscraper.website || outscraper.Website;

                let cleanName = lead.name;
                if (cleanName && typeof cleanName === 'string') {
                  cleanName = cleanName.split(/ - | \| | , /)[0].trim();
                }

                // Email Body Paragraph
                const emailBody = `Dear ${cleanName},\n\nWe noticed your clinic and would like to discuss how Orientix Technologies can help you enhance your digital presence and streamline your operations.\n\nBest regards,\nOrientix Team`;

                return (
                  <tr key={lead.id}>
                    <td style={{ color: '#64748b', fontWeight: '500', padding: '12px' }}>#{lead.id}</td>

                    <td style={{ padding: '12px' }}>
                      <div><strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{cleanName}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{category}</div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: '500' }}>{city}</div>
                      {state && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{state}</div>}
                    </td>

                    <td style={{ padding: '12px' }}>
                      {lead.email ? <div style={{ fontSize: '0.85rem' }}><Mail size={14} className="inline mr-1" /> {lead.email}</div> : <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No Email</div>}
                      {lead.phone ? <div style={{ marginTop: '4px', fontSize: '0.85rem' }}><Phone size={14} className="inline mr-1" /> {lead.phone}</div> : <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>No Phone</div>}
                    </td>

                    <td style={{ padding: '12px' }}>
                      {web ? (
                        <a href={web.startsWith('http') ? web : `https://${web}`} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}>
                          <LinkIcon size={14} style={{ marginRight: '4px' }} /> Visit Site
                        </a>
                      ) : <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No Website</span>}
                    </td>

                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                        {fb ? <a href={fb} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8', display: 'flex', alignItems: 'center' }}><Facebook size={14} style={{ marginRight: '4px' }} /> Facebook</a> : null}
                        {ig ? <a href={ig} target="_blank" rel="noreferrer" style={{ color: '#ec4899', display: 'flex', alignItems: 'center' }}><Instagram size={14} style={{ marginRight: '4px' }} /> Instagram</a> : null}
                        {yt ? <a href={yt} target="_blank" rel="noreferrer" style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}><Youtube size={14} style={{ marginRight: '4px' }} /> YouTube</a> : null}
                        {!fb && !ig && !yt && <span style={{ color: '#94a3b8' }}>None Available</span>}
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <select
                        className={`status-select status-${lead.status?.toLowerCase() || 'new'}`}
                        value={lead.status || 'NEW'}
                        onChange={(e) => updateField(lead.id, 'status', e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTING">Contacting</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="UNQUALIFIED">Unqualified</option>
                      </select>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <textarea
                        defaultValue={lead.remarks || ''}
                        onBlur={(e) => {
                          if (e.target.value !== lead.remarks) {
                            updateField(lead.id, 'remarks', e.target.value);
                          }
                        }}
                        placeholder="Type remarks..."
                        style={{
                          width: '180px',
                          height: '45px',
                          fontSize: '0.8rem',
                          padding: '6px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          resize: 'none'
                        }}
                      />
                    </td>

                    <td style={{ fontSize: '0.75rem', padding: '12px' }}>
                      {lead.updated_at ? (
                        <>
                          <div style={{ fontWeight: '500', color: '#334155' }}>
                            <User size={12} className="inline mr-1" />
                            {lead.last_updated_by}
                          </div>
                          <div style={{ color: '#64748b', marginTop: '2px' }}>
                            {formatDate(lead.updated_at)}
                          </div>
                        </>
                      ) : (
                        <div style={{ color: '#94a3b8' }}>Never Modified</div>
                      )}
                    </td>

                    <td style={{ padding: '12px' }}>
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}?subject=Orientix Technologies Inquiry&body=${encodeURIComponent(emailBody)}`}
                          className="action-btn mail"
                          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                        >
                          Email
                        </a>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>No Action</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="action-btn"
            style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', backgroundColor: currentPage === 1 ? '#e2e8f0' : '#fff' }}
          >
            <ChevronLeft size={18} style={{ marginRight: '4px' }} /> Previous
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Page {currentPage} of {totalPages}</span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="action-btn"
            style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', backgroundColor: currentPage === totalPages ? '#e2e8f0' : '#fff' }}
          >
            Next <ChevronRight size={18} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
