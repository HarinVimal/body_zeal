import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMembership() {
  const [branches, setBranches] = useState({});
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH MEMBERSHIPS =================
  useEffect(() => {
    const loadMemberships = async () => {
      try {
        const res = await fetch("http://localhost:5001/membership");
        if (!res.ok) throw new Error("API error");

        const data = await res.json();

        // ✅ SAFETY: ensure arrays exist
        Object.keys(data).forEach((branch) => {
          data[branch].memberships = Array.isArray(data[branch].memberships)
            ? data[branch].memberships
            : [];
          data[branch].addons = Array.isArray(data[branch].addons)
            ? data[branch].addons
            : [];
        });

        setBranches(data);
        setActive(Object.keys(data)[0] || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load membership plans");
      } finally {
        setLoading(false);
      }
    };

    loadMemberships();
  }, []);

  // ================= HELPERS =================
  const updateField = (type, index, field, value) => {
    setBranches((prev) => {
      const updated = { ...prev };
      updated[active] = {
        ...updated[active],
        [type]: updated[active][type].map((row, i) =>
          i === index
            ? field === "label"
              ? [value, row[1]]
              : [row[0], value]
            : row
        ),
      };
      return updated;
    });
  };

  const addRow = (type) => {
    setBranches((prev) => ({
      ...prev,
      [active]: {
        ...prev[active],
        [type]: [...prev[active][type], ["New Plan", "0"]],
      },
    }));
  };

  const removeRow = (type, index) => {
    setBranches((prev) => ({
      ...prev,
      [active]: {
        ...prev[active],
        [type]: prev[active][type].filter((_, i) => i !== index),
      },
    }));
  };

  // ================= SAVE =================
  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:5001/admin/membership/${active}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberships: branches[active].memberships,
            addons: branches[active].addons,
          }),
        }
      );

      if (!res.ok) throw new Error("Save failed");
      alert("Membership updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes ❌");
    } finally {
      setSaving(false);
    }
  };

  // ================= STATES =================
  if (loading)
    return <div className="text-center text-white py-32">Loading...</div>;

  if (error)
    return <div className="text-center text-red-400 py-32">{error}</div>;

  if (!branches[active]) return null;

  // ================= UI =================
  return (
    <section className="bg-black text-white py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* BRANCH TABS */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {Object.keys(branches).map((b) => (
            <button
              key={b}
              onClick={() => setActive(b)}
              className={`px-6 py-2 rounded-full border ${
                active === b
                  ? "bg-[#e9b21a] text-black"
                  : "border-white/20 text-gray-300"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="grid md:grid-cols-2 gap-10"
          >

            {/* MEMBERSHIPS */}
            <div className="border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl mb-6 text-[#e9b21a]">Gym Memberships</h3>

              {branches[active]?.memberships.map((m, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <input
                    value={m[0]}
                    onChange={(e) =>
                      updateField("memberships", i, "label", e.target.value)
                    }
                    className="flex-1 bg-black border px-3 py-2 rounded"
                  />
                  <input
                    value={m[1]}
                    onChange={(e) =>
                      updateField("memberships", i, "price", e.target.value)
                    }
                    className="w-28 bg-black border px-3 py-2 rounded"
                  />
                  <button onClick={() => removeRow("memberships", i)}>✕</button>
                </div>
              ))}

              <button onClick={() => addRow("memberships")}>
                + Add Membership
              </button>
            </div>

            {/* ADDONS */}
            <div className="border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl mb-6 text-[#e9b21a]">Add-On Services</h3>

              {branches[active]?.addons.map((a, i) => (
                <div key={i} className="flex gap-3 mb-4">
                  <input
                    value={a[0]}
                    onChange={(e) =>
                      updateField("addons", i, "label", e.target.value)
                    }
                    className="flex-1 bg-black border px-3 py-2 rounded"
                  />
                  <input
                    value={a[1]}
                    onChange={(e) =>
                      updateField("addons", i, "price", e.target.value)
                    }
                    className="w-28 bg-black border px-3 py-2 rounded"
                  />
                  <button onClick={() => removeRow("addons", i)}>✕</button>
                </div>
              ))}

              <button onClick={() => addRow("addons")}>
                + Add Add-On
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-14">
          <button
            onClick={saveChanges}
            disabled={saving}
            className="px-10 py-4 rounded-full bg-[#e9b21a] text-black"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
