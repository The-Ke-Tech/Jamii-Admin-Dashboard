// src/layouts/ProtectedLayout.tsx
// This version uses Outlet – the correct way for nested routes

import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function ProtectedLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with logout */}
      <Header />

      {/* Main content area */}
      <div className="flex flex-1">
        {/* Sidebar – fixed width */}
        <Sidebar />

        {/* Scrollable main content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet /> {/* ← This is where the page content (Dashboard, Users, etc.) renders */}
        </main>
      </div>

      <Footer />
    </div>
  );
}