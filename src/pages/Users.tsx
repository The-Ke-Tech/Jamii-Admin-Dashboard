// src/pages/Users.tsx
import { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  QueryDocumentSnapshot 
} from "firebase/firestore";                             // ← removed unused getFirestore
// @ts-ignore
import { db } from "../firebase/firebase";
import { User } from "../types";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList: User[] = querySnapshot.docs.map(
          (docSnap: QueryDocumentSnapshot) => ({
            id: docSnap.id,
            ...docSnap.data(),
          } as User)
        );
        setUsers(userList);
      } catch (err: any) {
        setError(err.message || "Failed to load users");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateStatus = async (userId: string, newStatus: User["status"]) => {
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      alert(`User updated to ${newStatus}`);
    } catch (err: any) {
      alert("Update failed: " + err.message);
    }
  };

  if (loading) return <div className="p-8">Loading users...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : user.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {user.status === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus(user.id, "active")}
                      className="text-green-600 hover:text-green-900"
                    >
                      Approve
                    </button>
                  )}
                  {user.status === "active" && (
                    <button
                      onClick={() => handleUpdateStatus(user.id, "suspended")}
                      className="text-red-600 hover:text-red-900"
                    >
                      Suspend
                    </button>
                  )}
                  {user.status === "suspended" && (
                    <button
                      onClick={() => handleUpdateStatus(user.id, "active")}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}