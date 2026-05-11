import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="dashboard-view">
      <div className="card">
        <h3>Secure Portal Access</h3>
        <p>
          You are currently logged into the <strong>Standard Admin Walled Garden</strong>. 
          As an Admin, you have access to view Leads and add interaction Notes.
        </p>
        <div className="security-notice">
          <strong>Security Note:</strong> You do not have permissions to modify the CMS, delete leads, or view Analytics.
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Leads Assigned</h4>
          <span className="stat-number">42</span>
        </div>
        <div className="stat-card">
          <h4>Calls Made Today</h4>
          <span className="stat-number">12</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
