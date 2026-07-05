import React, { useState, useEffect } from 'react';
import { Save, Settings, Info, Check, Plus, Trash2 } from 'lucide-react';
import './CrmStyles.css';

const CmsSettings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Settings State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Packages State
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({ name: '', price: '', features: '', is_popular: false });

  // Testimonials State
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({ client_name: '', client_role: '', content: '', rating: 5 });

  const fetchData = async () => {
    try {
      const [settingsRes, packagesRes, testimonialsRes] = await Promise.all([
        fetch('/api/crm/cms'),
        fetch('/api/crm/cms/packages'),
        fetch('/api/crm/cms/testimonials')
      ]);
      
      const settingsData = await settingsRes.json();
      setHeroTitle(settingsData.hero_title || '');
      setHeroSubtitle(settingsData.hero_subtitle || '');
      setContactEmail(settingsData.contact_email || '');
      setContactPhone(settingsData.contact_phone || '');

      setPackages(await packagesRes.json());
      setTestimonials(await testimonialsRes.json());
    } catch (err) {
      setError('Failed to fetch CMS data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSuccessMsg(''); setError('');
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch('/api/crm/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ hero_title: heroTitle, hero_subtitle: heroSubtitle, contact_email: contactEmail, contact_phone: contactPhone })
      });
      if (response.ok) {
        setSuccessMsg('Website configuration saved!');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else { throw new Error('Failed to save settings.'); }
    } catch (err) { setError(err.message); }
  };

  const handleAddPackage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch('/api/crm/cms/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newPackage)
      });
      if (response.ok) {
        setNewPackage({ name: '', price: '', features: '', is_popular: false });
        fetchData();
        setSuccessMsg('Package added!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) { setError('Failed to add package'); }
  };

  const handleDeletePackage = async (id) => {
    if(!window.confirm('Delete package?')) return;
    try {
      const token = localStorage.getItem('crm_token');
      await fetch(`/api/crm/cms/packages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) { setError('Failed to delete package'); }
  };

  const handleAddTestimonial = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch('/api/crm/cms/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(newTestimonial)
      });
      if (response.ok) {
        setNewTestimonial({ client_name: '', client_role: '', content: '', rating: 5 });
        fetchData();
        setSuccessMsg('Testimonial added!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) { setError('Failed to add testimonial'); }
  };

  const handleDeleteTestimonial = async (id) => {
    if(!window.confirm('Delete testimonial?')) return;
    try {
      const token = localStorage.getItem('crm_token');
      await fetch(`/api/crm/cms/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) { setError('Failed to delete testimonial'); }
  };

  if (loading) return <div className="p-6">Loading CMS settings...</div>;

  return (
    <div className="crm-container" style={{ maxWidth: '1000px' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <Settings size={22} style={{ color: '#3b82f6' }} />
          <h3 style={{ margin: 0 }}>Website Live Content Manager</h3>
        </div>

        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'general' ? '2px solid #3b82f6' : 'none', fontWeight: activeTab === 'general' ? 'bold' : 'normal', color: activeTab === 'general' ? '#3b82f6' : '#64748b', cursor: 'pointer' }}>General Settings</button>
          <button className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`} onClick={() => setActiveTab('packages')} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'packages' ? '2px solid #3b82f6' : 'none', fontWeight: activeTab === 'packages' ? 'bold' : 'normal', color: activeTab === 'packages' ? '#3b82f6' : '#64748b', cursor: 'pointer' }}>Pricing Packages</button>
          <button className={`tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')} style={{ padding: '10px 20px', background: 'none', border: 'none', borderBottom: activeTab === 'testimonials' ? '2px solid #3b82f6' : 'none', fontWeight: activeTab === 'testimonials' ? 'bold' : 'normal', color: activeTab === 'testimonials' ? '#3b82f6' : '#64748b', cursor: 'pointer' }}>Testimonials</button>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: '#dcfce3', color: '#15803d', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Check size={16} /> {successMsg}
          </div>
        )}
        {error && <div className="security-notice" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        {/* GENERAL TAB */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Hero Header Title</label>
              <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div className="form-group">
              <label>Hero Description Paragraph</label>
              <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} required style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>
            <button type="submit" className="submit-btn" style={{ width: 'auto', alignSelf: 'flex-start' }}><Save size={16} className="inline mr-2" /> Save General Settings</button>
          </form>
        )}

        {/* PACKAGES TAB */}
        {activeTab === 'packages' && (
          <div>
            <form onSubmit={handleAddPackage} style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '2rem' }}>
              <h4>Add New Package</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <input type="text" placeholder="Package Name (e.g. Basic)" value={newPackage.name} onChange={e => setNewPackage({...newPackage, name: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="Price (e.g. $99/mo)" value={newPackage.price} onChange={e => setNewPackage({...newPackage, price: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={newPackage.is_popular} onChange={e => setNewPackage({...newPackage, is_popular: e.target.checked})} />
                  Mark as Popular
                </label>
              </div>
              <textarea placeholder="Features (comma separated)" value={newPackage.features} onChange={e => setNewPackage({...newPackage, features: e.target.value})} required style={{ width: '100%', marginTop: '1rem', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              <button type="submit" className="submit-btn" style={{ marginTop: '1rem', width: 'auto' }}><Plus size={16} className="inline mr-1" /> Add Package</button>
            </form>

            <div className="table-wrapper">
              <table className="crm-table">
                <thead><tr><th>Name</th><th>Price</th><th>Features</th><th>Popular</th><th>Actions</th></tr></thead>
                <tbody>
                  {packages.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td>{p.price}</td>
                      <td><span style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.features}</span></td>
                      <td>{p.is_popular ? <span className="status-badge status-active">Yes</span> : 'No'}</td>
                      <td><button onClick={() => handleDeletePackage(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div>
            <form onSubmit={handleAddTestimonial} style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '2rem' }}>
              <h4>Add New Testimonial</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <input type="text" placeholder="Client Name" value={newTestimonial.client_name} onChange={e => setNewTestimonial({...newTestimonial, client_name: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="text" placeholder="Client Role (e.g. CEO)" value={newTestimonial.client_role} onChange={e => setNewTestimonial({...newTestimonial, client_role: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={newTestimonial.rating} onChange={e => setNewTestimonial({...newTestimonial, rating: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              <textarea placeholder="Testimonial Content" value={newTestimonial.content} onChange={e => setNewTestimonial({...newTestimonial, content: e.target.value})} required style={{ width: '100%', marginTop: '1rem', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', height: '80px' }} />
              <button type="submit" className="submit-btn" style={{ marginTop: '1rem', width: 'auto' }}><Plus size={16} className="inline mr-1" /> Add Testimonial</button>
            </form>

            <div className="table-wrapper">
              <table className="crm-table">
                <thead><tr><th>Client</th><th>Role</th><th>Review</th><th>Rating</th><th>Actions</th></tr></thead>
                <tbody>
                  {testimonials.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.client_name}</strong></td>
                      <td>{t.client_role}</td>
                      <td><span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.content}</span></td>
                      <td>{t.rating}/5</td>
                      <td><button onClick={() => handleDeleteTestimonial(t.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CmsSettings;
