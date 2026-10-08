import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CompareDrawer from './components/CompareDrawer.jsx';

import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import EligibilityCheckerPage from './pages/EligibilityCheckerPage.jsx';
import OfficeLocatorPage from './pages/OfficeLocatorPage.jsx';
import ComparePage from './pages/ComparePage.jsx';
import GrievancePage from './pages/GrievancePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminServices from './pages/admin/AdminServices.jsx';
import AdminGrievances from './pages/admin/AdminGrievances.jsx';
import AdminUsers from './pages/admin/AdminUsers.jsx';
import AdminSeeding from './pages/admin/AdminSeeding.jsx';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />
          <Route path="/eligibility" element={<EligibilityCheckerPage />} />
          <Route path="/offices" element={<OfficeLocatorPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/grievance" element={<GrievancePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Backoffice Sub-routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="grievances" element={<AdminGrievances />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="seeding" element={<AdminSeeding />} />
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <CompareDrawer />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
