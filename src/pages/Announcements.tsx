// src/pages/Announcements.tsx
import { useEffect, useState, FormEvent } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  QueryDocumentSnapshot,
} from "firebase/firestore";
// @ts-ignore
import { auth, db } from "../firebase/firebase.ts";
import { useAuth } from "../context/AuthContext";
import { Announcement } from "../types";

export default function Announcements() {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const q = query(
          collection(db, "announcements"),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        const list: Announcement[] = snap.docs.map(
          (d: QueryDocumentSnapshot) => ({
            id: d.id,
            ...d.data(),
          } as Announcement)
        );
        setAnnouncements(list);
      } catch (err) {
        console.error("Announcements fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);

    try {
      const docRef = await addDoc(collection(db, "announcements"), {
        title: title.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
        createdBy: currentUser?.uid || "system",
      });

      setAnnouncements((prev) => [
        {
          id: docRef.id,
          title: title.trim(),
          content: content.trim(),
          createdAt: new Date().toISOString(),
          createdBy: currentUser?.uid || "system",
        },
        ...prev,
      ]);

      setTitle("");
      setContent("");
      alert("Announcement posted successfully");
    } catch (err: any) {
      alert("Failed to post: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this announcement?")) return;

    try {
      await deleteDoc(doc(db, "announcements", id));
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      alert("Announcement deleted");
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Announcements</h1>

      {/* Post new announcement form */}
      <div className="bg-white p-6 rounded-lg shadow border mb-10">
        <h2 className="text-xl font-semibold mb-4">Create New Announcement</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Announcement title"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message here..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Posting..." : "Post Announcement"}
          </button>
        </form>
      </div>

      {/* List of existing announcements */}
      <h2 className="text-2xl font-semibold mb-4">Published Announcements</h2>

      {loading ? (
        <div>Loading announcements...</div>
      ) : announcements.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">
          No announcements yet.
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white p-6 rounded-lg shadow border relative"
            >
              <h3 className="text-xl font-bold mb-2">{ann.title}</h3>
              <p className="text-gray-700 whitespace-pre-line mb-4">
                {ann.content}
              </p>
              <div className="text-sm text-gray-500">
                Posted on{" "}
                {ann.createdAt
                  ? new Date(ann.createdAt).toLocaleString()
                  : "—"}
              </div>

              <button
                onClick={() => handleDelete(ann.id)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}