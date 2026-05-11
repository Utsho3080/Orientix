import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

const AdminLayout = () => {
  const { logout, userRole } = useAuth();

  return (
    <div className="admin-layout">
      {/* Sidebar Walled Garden 1 */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Orientix CRM</h2>
          <span className="role-badge">Standard Admin</span>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin" end className={({isActive}) => isActive ? 'active' : ''}>
            Dashboard Info
          </NavLink>
          <NavLink to="/admin/leads" className={({isActive}) => isActive ? 'active' : ''}>
            Lead Pipeline
          </NavLink>
          <a href="#onboarding" className="disabled-link">Client Onboarding (Read Only)</a>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">Log Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Welcome back, Admin</h1>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
