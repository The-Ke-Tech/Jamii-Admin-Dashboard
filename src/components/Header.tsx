// src/components/Header.tsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { userData, logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-gray-900">
          Jamii Admin
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{userData?.name || "Admin"}</span>
          <button
            onClick={logout}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}