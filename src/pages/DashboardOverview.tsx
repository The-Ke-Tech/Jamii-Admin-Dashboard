// src/pages/DashboardOverview.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase/firebase.ts";

interface Stats {
  totalUsers: number;
  pendingUsers: number;
  pendingIssues: number;
  activeIssues: number;
}

export default function DashboardOverview() {
  const { userData } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    pendingUsers: 0,
    pendingIssues: 0,
    activeIssues: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Users stats
        const usersSnap = await getDocs(collection(db, "users"));
        const totalUsers = usersSnap.size;

        const pendingUsersQuery = query(
          collection(db, "users"),
          where("status", "==", "pending")
        );
        const pendingUsersSnap = await getDocs(pendingUsersQuery);
        const pendingUsers = pendingUsersSnap.size;

        // Issues stats
        const pendingIssuesQuery = query(
          collection(db, "issues"),
          where("status", "==", "pending")
        );
        const pendingIssuesSnap = await getDocs(pendingIssuesQuery);
        const pendingIssues = pendingIssuesSnap.size;

        const activeIssuesQuery = query(
          collection(db, "issues"),
          where("status", "==", "approved")
        );
        const activeIssuesSnap = await getDocs(activeIssuesQuery);
        const activeIssues = activeIssuesSnap.size;

        setStats({ totalUsers, pendingUsers, pendingIssues, activeIssues });
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        Welcome back, {userData?.name || "Admin"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-600">Total Users</h3>
          <p className="text-3xl sm:text-4xl font-bold mt-3">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-600">Pending Approvals</h3>
          <p className="text-3xl sm:text-4xl font-bold mt-3 text-yellow-600">
            {stats.pendingUsers}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-600">Pending Issues</h3>
          <p className="text-3xl sm:text-4xl font-bold mt-3 text-orange-600">
            {stats.pendingIssues}
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-600">Active Issues</h3>
          <p className="text-3xl sm:text-4xl font-bold mt-3 text-green-600">
            {stats.activeIssues}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <a
            href="/users"
            className="block p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
          >
            <h3 className="font-semibold text-blue-800">Manage Users</h3>
            <p className="mt-2 text-sm text-gray-600">
              Approve, suspend or change roles
            </p>
          </a>
          <a
            href="/issues"
            className="block p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
          >
            <h3 className="font-semibold text-green-800">Review Issues</h3>
            <p className="mt-2 text-sm text-gray-600">
              Verify and update community reports
            </p>
          </a>
          <a
            href="/announcements"
            className="block p-4 sm:p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
          >
            <h3 className="font-semibold text-purple-800">Post Announcement</h3>
            <p className="mt-2 text-sm text-gray-600">
              Communicate with all users
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}