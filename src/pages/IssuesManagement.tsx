// src/pages/IssuesManagement.tsx
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  QueryDocumentSnapshot,
} from "firebase/firestore";
// @ts-ignore
import { db } from "../firebase/firebase.ts";
import { Issue } from "../types";

// or more explicitly:

import type { IssueStatus } from "../types/issue";

// Example in AuthContext.tsx


export default function IssuesManagement() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const q = query(collection(db, "issues"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const issueList: Issue[] = querySnapshot.docs.map(
          (docSnap: QueryDocumentSnapshot) => ({
            id: docSnap.id,
            ...docSnap.data(),
          } as Issue)
        );

        setIssues(issueList);
      } catch (err: any) {
        setError(err.message || "Could not load issues");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleUpdateStatus = async (
    issueId: string,
    newStatus: Issue["status"]
  ) => {
    try {
      await updateDoc(doc(db, "issues", issueId), { status: newStatus });
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i))
      );
      alert(`Issue marked as ${newStatus}`);
    } catch (err: any) {
      alert("Update failed: " + err.message);
    }
  };

  if (loading) return <div className="p-8">Loading issues...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Issue Management</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emergency
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{issue.title}</div>
                  <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {issue.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      issue.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : issue.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : issue.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {issue.emergency ? (
                    <span className="text-red-600 font-medium">Yes</span>
                  ) : (
                    "No"
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {issue.createdAt
                    ? new Date(issue.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  {issue.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateStatus(issue.id, "approved")
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateStatus(issue.id, "rejected")
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {issue.status === "approved" && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(issue.id, "completed")
                      }
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {issues.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No issues found in the system.
        </div>
      )}
    </div>
  );
}