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
          <NavLink to="/superadmin/onboarding" className={({isActive}) => isActive ? 'active' : ''}>
            Client Onboarding
          </NavLink>
          <NavLink to="/superadmin/contact-messages" className={({isActive}) => isActive ? 'active' : ''}>
            Contact Messages
          </NavLink>
          
          <div className="nav-section">Executive</div>
          <a href="#analytics" className="disabled-link">Google Analytics</a>
          <NavLink to="/superadmin/cms" className={({isActive}) => isActive ? 'active' : ''}>
            CMS Settings
          </NavLink>
          <NavLink to="/superadmin/upload" className={({isActive}) => isActive ? 'active nav-danger' : 'nav-danger'}>
            Upload Excel Data
          </NavLink>
          <NavLink to="/superadmin/audit" className={({isActive}) => isActive ? 'active nav-danger' : 'nav-danger'}>
            Audit Logs
          </NavLink>
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
