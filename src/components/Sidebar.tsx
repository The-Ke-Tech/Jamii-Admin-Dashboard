// src/components/Sidebar.tsx
// Your version is correct – just making sure classes are consistent

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white w-64 flex-shrink-0">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">Jamii Admin</h2>
      </div>
      <nav className="mt-4 space-y-1 px-3">
        <Link
          to="/dashboard"
          className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/users"
          className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          Users
        </Link>
        <Link
          to="/issues"
          className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          Issues
        </Link>
        <Link
          to="/donations"
          className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          Donations
        </Link>
        <Link
          to="/announcements"
          className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          Announcements
        </Link>
      </nav>
    </aside>
  );
}