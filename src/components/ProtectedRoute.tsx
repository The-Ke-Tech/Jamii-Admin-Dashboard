// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  // While Firebase is checking auth state, show loader (prevents flash)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Checking authentication...</div>
      </div>
    );
  }

  // If no user → redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated → render the child routes (Outlet = where nested routes render)
  return <Outlet />;
}