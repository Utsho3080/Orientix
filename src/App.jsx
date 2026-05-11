import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ReactLenis } from '@studio-freight/react-lenis';

// Public Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import WhatsAppButton from './components/WhatsAppButton';
import Faq from './components/Faq';
import Team from './components/Team';
import Projects from './components/Projects';
import Packages from './components/Packages';
import Logos from './components/Logos';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';

// Auth Provider
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Admin / Auth Pages (To Be Created)
import Login from './pages/auth/Login';
import TwoFactorAuth from './pages/auth/TwoFactorAuth';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import SuperAdminLayout from './pages/superadmin/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';

// CRM Components
import LeadsTable from './components/crm/LeadsTable';
import DataUploader from './components/crm/DataUploader';

function PublicSite() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = { root: null, threshold: 0.08 };
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const observe = () => {
      const elements = document.querySelectorAll('.reveal');
      elements.forEach(el => observer.observe(el));
    };

    observe();
    const timer = setTimeout(observe, 500);

    return () => {
      clearTimeout(timer);
      document.querySelectorAll('.reveal').forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <ReactLenis root>
      <div className="app-container">
        <Navbar />
        <WhatsAppButton />
        <main>
          <Hero />
          <Services />
          <Projects />
          <Packages />
          <Team />
          <Testimonials />
          <Contact />
          <Logos />
          <Faq />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicSite />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/verify-2fa" element={<TwoFactorAuth />} />

        {/* Regular Admin Portal (Walled Garden 1) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="leads" element={<LeadsTable />} />
        </Route>

        {/* Super Admin Portal (Walled Garden 2) */}
        <Route 
          path="/superadmin" 
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <SuperAdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="leads" element={<LeadsTable />} />
          <Route path="upload" element={<DataUploader />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

