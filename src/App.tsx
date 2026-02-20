// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './layouts/ProtectedLayout';
import Login from './pages/Login';
import DashboardOverview from './pages/DashboardOverview';
import Users from './pages/Users';
import IssuesManagement from './pages/IssuesManagement';
import DonationsOverview from './pages/DonationsOverview';
import Announcements from './pages/Announcements';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes – require authentication */}
      <Route element={<ProtectedRoute />}>
        {/* All dashboard pages share the same layout (sidebar + header) */}
        <Route element={<ProtectedLayout />}>
          <Route index element={<DashboardOverview />} />           {/* / → dashboard */}
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="users" element={<Users />} />
          <Route path="issues" element={<IssuesManagement />} />
          <Route path="donations" element={<DonationsOverview />} />
          <Route path="announcements" element={<Announcements />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}