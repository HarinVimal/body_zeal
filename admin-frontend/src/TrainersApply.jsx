import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TrainersApply() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // Filter: all, approved, pending, rejected

  const fetchApplications = async () => {
    try {
      const res = await fetch("http://localhost:5001/admin/trainers");
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // =================== Update Status ===================
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5001/admin/trainers/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        // update locally
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status } : app))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // =================== Filtered Applications ===================
  const filteredApps =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-200">Trainer Applications</h2>

      {/* Filter Dropdown */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-gray-300 font-medium">Filter by Status:</label>
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredApps.length === 0 && (
        <p className="text-gray-400 text-center">No applications found.</p>
      )}

      <div className="grid gap-6">
        {filteredApps.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-yellow-400">{app.name}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium
                  ${
                    app.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : app.status === "reviewed"
                      ? "bg-blue-100 text-blue-800"
                      : app.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
              >
                {app.status}
              </span>
            </div>

            <p className="text-gray-300">
              <strong>Email:</strong> {app.email} | <strong>Phone:</strong>{" "}
              {app.phone}
            </p>
            <p className="text-gray-300">
              <strong>Experience:</strong> {app.experience} years |{" "}
              <strong>Specialization:</strong> {app.specialization}
            </p>
            <p className="mt-2 text-gray-200">{app.message}</p>
            <p className="mt-2 text-gray-400 text-sm">
              Applied on: {new Date(app.created_at).toLocaleString()}
            </p>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                onClick={() => updateStatus(app.id, "approved")}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-medium transition"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(app.id, "pending")}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded text-sm font-medium transition"
              >
                Pending
              </button>
              <button
                onClick={() => updateStatus(app.id, "rejected")}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-sm font-medium transition"
              >
                Reject
              </button>
              <a
                href={`https://wa.me/${app.phone}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition"
              >
                Contact
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
