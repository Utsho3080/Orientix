import React from 'react';

const SuperAdminDashboard = () => {
  return (
    <div className="dashboard-view">
      <div className="card super-card">
        <h3>Full Portal Access Granted</h3>
        <p>
          You are currently logged into the <strong>Super Admin Walled Garden</strong>. 
          You have full architectural control over the CMS, CRM, and system settings.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Database Leads</h4>
          <span className="stat-number">1,204</span>
        </div>
        <div className="stat-card">
          <h4>Website Visitors (Today)</h4>
          <span className="stat-number">342</span>
        </div>
        <div className="stat-card danger-stat">
          <h4>Pending Deletions</h4>
          <span className="stat-number">0</span>
        </div>
      </div>
      
      <div className="card mt-4">
        <h4>System Status</h4>
        <p className="text-success">All backend API endpoints (Mocked) are online and secure.</p>
        <p className="text-success">Google Analytics Pipeline Status: Active</p>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
