import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438";

/* ----------- NEW: BRANCH OPTIONS ----------- */
const BRANCH_OPTIONS = ["Nava India", "RS Puram", "Kovaipudur"];

export default function AdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeProgram, setActiveProgram] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  /* ----------- NEW: selected branch dropdown ----------- */
  const [selectedBranch, setSelectedBranch] = useState("");

  // ================= FETCH PROGRAMS =================
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5001/api/programs-with-branches");
      if (Array.isArray(res.data)) setPrograms(res.data);
      else setPrograms([]);
    } catch (err) {
      console.error(err);
      setPrograms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (file, programKey = "img") => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await axios.post("http://localhost:5001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = `http://localhost:5001${res.data.url}`;

      if (programKey === "img") {
        setActiveProgram((prev) => ({ ...prev, img: imageUrl }));
      } else {
       const [branchId] = programKey.split(".");
     setActiveProgram((prev) => ({
  ...prev,
  branches: prev.branches.map((b) =>
    String(b.id) === branchId ? { ...b, img: imageUrl } : b
  ),
}));
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  // ================= SAVE PROGRAM =================
  const saveProgram = async (program) => {
    try {
      if (!program.title.trim()) return alert("Title is required");

      const payload = {
        title: program.title,
        img: program.img || "",
        short_text: program.short_text || "",
        branches: program.branches || [],
      };

      if (isEditing) {
        await axios.put(`http://localhost:5001/admin/programs/${program.id}`, payload);
      } else {
        await axios.post("http://localhost:5001/admin/programs", payload);
      }

      fetchPrograms();
      setActiveProgram(null);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save program");
    }
  };

  // ================= DELETE PROGRAM =================
  const deleteProgram = async (id) => {
    if (!window.confirm("Are you sure you want to delete this program?")) return;
    try {
      await axios.delete(`http://localhost:5001/admin/programs/${id}`);
      fetchPrograms();
    } catch (err) {
      console.error(err);
      alert("Failed to delete program");
    }
  };

  // ================= BRANCH HANDLERS =================
  const handleBranchChange = (branchId, field, value) => {
    setActiveProgram((prev) => ({
      ...prev,
      branches: prev.branches.map((b) =>
        b.id === branchId ? { ...b, [field]: value } : b
      ),
    }));
  };

  /* ----------- UPDATED ADD BRANCH ----------- */
  const addBranch = async () => {
    if (!selectedBranch) return alert("Please select a branch");

    const newBranch = { branch_name: selectedBranch, img: "", detailed_text: "" };

    if (isEditing) {
      try {
        const res = await axios.post(
          `http://localhost:5001/admin/programs/${activeProgram.id}/branch`,
          newBranch
        );

        setActiveProgram((prev) => ({
          ...prev,
          branches: [...prev.branches, { ...newBranch, id: res.data.id }],
        }));
      } catch (err) {
        console.error(err);
        alert("Failed to add branch");
      }
    } else {
      setActiveProgram((prev) => ({
        ...prev,
        branches: [...(prev.branches || []), { ...newBranch }],
      }));
    }

    setSelectedBranch("");
  };

  const removeBranch = async (branchId) => {
    if (isEditing && branchId) {
      try {
        await axios.delete(`http://localhost:5001/admin/programs/branch/${branchId}`);
        setActiveProgram((prev) => ({
          ...prev,
          branches: prev.branches.filter((b) => b.id !== branchId),
        }));
      } catch (err) {
        console.error(err);
        alert("Failed to remove branch");
      }
    } else {
      setActiveProgram((prev) => ({
        ...prev,
        branches: prev.branches.filter((b) => b.id !== branchId),
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-400">Programs</h2>
        <button
          onClick={() =>
            setActiveProgram({ title: "", img: "", short_text: "", branches: [] })
          }
          className="px-6 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
        >
          Add Program
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : programs.length === 0 ? (
        <p>No programs found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -5 }}
              className="bg-black border border-white/10 rounded-2xl shadow-lg overflow-hidden"
            >
              <img
                src={p.img || FALLBACK_IMAGE}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                alt={p.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex flex-col">
                <h3 className="text-xl font-semibold text-yellow-400">{p.title}</h3>
                <p className="text-gray-400 text-sm mt-2 flex-1">{p.short_text}</p>

                {p.branches && p.branches.length > 0 && (
                  <>
                    <h4 className="text-yellow-400 font-semibold mt-2 mb-1">
                      Branches:
                    </h4>
                    <ul className="text-gray-300 text-sm">
                      {p.branches.map((b) => (
                        <li key={b.id || b.branch_name}>{b.branch_name}</li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="flex mt-4 gap-2">
                  <button
                    onClick={() => {
                      setActiveProgram(p);
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProgram(p.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ================= ADD/EDIT MODAL ================= */}
      <AnimatePresence>
        {activeProgram && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-start justify-center p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black border border-white/20 rounded-2xl p-6 w-full max-w-3xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => {
                  setActiveProgram(null);
                  setIsEditing(false);
                }}
                className="text-gray-400 hover:text-white mb-4"
              >
                ← Back
              </button>

              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                {isEditing ? "Edit Program" : "Add Program"}
              </h3>

              <input
                type="text"
                placeholder="Title"
                value={activeProgram.title}
                onChange={(e) =>
                  setActiveProgram({ ...activeProgram, title: e.target.value })
                }
                className="w-full mb-3 p-2 rounded border border-white/20 bg-black text-white"
              />

              <div className="mb-3">
                <label className="text-gray-300 mb-1 block">Program Image</label>

                {activeProgram.img && (
                  <img
                    src={activeProgram.img}
                    className="w-32 h-32 object-cover mb-2 rounded"
                    alt="program"
                  />
                )}

                <input
                  type="file"
                  onChange={(e) => handleImageUpload(e.target.files[0], "img")}
                  className="w-full p-1 rounded border border-white/20 bg-black text-white"
                />
              </div>

              <textarea
                placeholder="Short Description"
                value={activeProgram.short_text}
                onChange={(e) =>
                  setActiveProgram({
                    ...activeProgram,
                    short_text: e.target.value,
                  })
                }
                className="w-full mb-3 p-2 rounded border border-white/20 bg-black text-white"
              />

              {/* ----------- BRANCH DROPDOWN ----------- */}

              <div className="mb-3">
                <h4 className="text-yellow-400 font-semibold mb-2">Branches</h4>

                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full mb-2 p-2 rounded border border-white/20 bg-black text-white"
                >
                  <option value="">Select Branch</option>
                  {BRANCH_OPTIONS.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>

                <button
                  onClick={addBranch}
                  className="px-4 py-2 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition mb-3"
                >
                  Add Branch
                </button>

                {activeProgram.branches &&
                  activeProgram.branches.map((b) => (
                    <div
                      key={b.id || b.branch_name}
                      className="mb-2 border border-white/10 p-2 rounded"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-white">
                          {b.branch_name}
                        </span>

                        <button
                          onClick={() => removeBranch(b.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      {b.img && (
                        <img
                          src={b.img}
                          className="w-24 h-24 object-cover mb-1 rounded"
                          alt={b.branch_name}
                        />
                      )}

                      <input
                        type="file"
                        onChange={(e) =>
                          handleImageUpload(e.target.files[0], `${b.id}.img`)
                        }
                        className="w-full mb-1 p-1 rounded border border-white/20 bg-black text-white"
                      />

                      <textarea
                        placeholder="Branch Description"
                        value={b.detailed_text}
                        onChange={(e) =>
                          handleBranchChange(
                            b.id,
                            "detailed_text",
                            e.target.value
                          )
                        }
                        className="w-full p-1 rounded border border-white/20 bg-black text-white"
                      />
                    </div>
                  ))}
              </div>

              <button
                onClick={() => saveProgram(activeProgram)}
                className="w-full py-2 mt-4 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
              >
                Save Program
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}