import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../admin/Admin.css'; // Shared CSS for now

const SuperAdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-layout superadmin-theme">
      {/* Sidebar Walled Garden 2 */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Orientix CRM</h2>
          <span className="role-badge super">Super Admin</span>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/superadmin" end className={({isActive}) => isActive ? 'active' : ''}>
            Command Center
          </NavLink>
          
          <div className="nav-section">CRM Features</div>
          <NavLink to="/superadmin/leads" className={({isActive}) => isActive ? 'active' : ''}>
            Lead Management (CRUD)
          </NavLink>
          <a href="#onboarding" className="disabled-link">Client Onboarding (CRUD)</a>
          
          <div className="nav-section">Executive</div>
          <a href="#analytics" className="disabled-link">Google Analytics</a>
          <a href="#cms" className="disabled-link">CMS Settings (Hero/Text)</a>
          <NavLink to="/superadmin/upload" className={({isActive}) => isActive ? 'active nav-danger' : 'nav-danger'}>
            Upload Excel Data
          </NavLink>
          <a href="#audit" className="disabled-link nav-danger">Audit Logs</a>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">Log Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Super Admin Command Center</h1>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
