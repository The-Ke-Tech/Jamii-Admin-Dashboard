// src/pages/DonationsOverview.tsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  QueryDocumentSnapshot,
} from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase/firebase.ts";
import { useAuth } from "../context/AuthContext";

interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  issueId?: string;
  issueTitle?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  createdAt: string; // ISO string
}

interface DonationStats {
  totalDonations: number; // count
  totalAmount: number;    // sum in KES
  completedAmount: number;
  pendingCount: number;
  recentDonations: Donation[];
}

export default function DonationsOverview() {
  const { userData } = useAuth();
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    totalAmount: 0,
    completedAmount: 0,
    pendingCount: 0,
    recentDonations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        // Fetch all donations (for stats & list) – in production, paginate!
        const donationsQuery = query(
          collection(db, "donations"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(donationsQuery);

        const donationsList: Donation[] = snap.docs.map(
          (doc: QueryDocumentSnapshot) => ({
            id: doc.id,
            ...doc.data(),
          } as Donation)
        );

        // Calculate stats
        const totalDonations = donationsList.length;
        const totalAmount = donationsList.reduce(
          (sum, d) => sum + (d.status === "completed" ? d.amount : 0),
          0
        );
        const completedAmount = totalAmount; // same if we filter completed only
        const pendingCount = donationsList.filter(
          (d) => d.status === "pending"
        ).length;

        // Recent 5
        const recentDonations = donationsList.slice(0, 5);

        setStats({
          totalDonations,
          totalAmount,
          completedAmount,
          pendingCount,
          recentDonations,
        });
      } catch (err: any) {
        setError(err.message || "Failed to load donations data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading donations...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Donations Overview – {userData?.name || "Admin"}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-600">Total Donations</h3>
          <p className="text-4xl font-bold mt-3">{stats.totalDonations}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-600">Total Amount (KES)</h3>
          <p className="text-4xl font-bold mt-3 text-green-600">
            {stats.totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-600">Pending Donations</h3>
          <p className="text-4xl font-bold mt-3 text-yellow-600">
            {stats.pendingCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium text-gray-600">Completed Amount</h3>
          <p className="text-4xl font-bold mt-3 text-blue-600">
            {stats.completedAmount.toLocaleString()} KES
          </p>
        </div>
      </div>

      {/* Recent Donations Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden mb-10">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">Recent Donations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue / Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (KES)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{donation.donorName}</div>
                    <div className="text-sm text-gray-500">
                      {donation.donorEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {donation.issueTitle || "General Donation"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {donation.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {donation.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donation.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : donation.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donation.createdAt).toLocaleDateString("en-KE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stats.recentDonations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No donations recorded yet.
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/issues"
          className="block p-6 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
        >
          <h3 className="font-semibold text-indigo-800">View Linked Issues</h3>
          <p className="mt-2 text-sm text-gray-600">
            See which projects received the most support
          </p>
        </a>
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-800">Export Data</h3>
          <p className="mt-2 text-sm text-gray-600">
            (Coming soon: CSV export of all donations)
          </p>
        </div>
      </div>
    </div>
  );
}