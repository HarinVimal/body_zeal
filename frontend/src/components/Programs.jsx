import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/* ================= FALLBACK IMAGE ================= */
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438";

/* ================= COMPONENT ================= */
export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showAll, setShowAll] = useState(false);

  /* ================= FETCH PROGRAMS ================= */
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:5001/api/programs-with-branches"
      );
      setPrograms(res.data || []);
    } catch (err) {
      console.error("Fetch programs error:", err);
      setPrograms([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  /* ================= BRANCH FILTER ================= */
  const branchNames = active
    ? active.branches.map((b) => b.branch_name)
    : [];

  const filteredBranches = active
    ? active.branches.filter((b) =>
        selectedBranch ? b.branch_name === selectedBranch : true
      )
    : [];

  /* ================= VISIBLE PROGRAMS ================= */
  const visiblePrograms = showAll ? programs : programs.slice(0, 6);

  return (
    <section
      id="programs"
      className="bg-black text-white py-16 px-6 scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADING */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            Our <span className="text-[#e9b21a]">Programs</span>
          </h2>
          <p className="mt-4 text-gray-400">
            Structured programs designed to support every fitness goal.
          </p>
        </div>

        {/* PROGRAM GRID */}
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : programs.length === 0 ? (
          <p className="text-center text-gray-400">No programs found.</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {visiblePrograms.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl"
                >
                  <img
                    src={p.img || FALLBACK_IMAGE}
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                    alt={p.title}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-6 flex flex-col h-[230px]">
                    <h3 className="text-xl font-semibold">{p.title}</h3>
                    <p className="mt-3 text-sm text-gray-400 flex-1">
                      {p.short_text}
                    </p>
                    <button
                      onClick={() => {
                        setActive(p);
                        setSelectedBranch(null);
                      }}
                      className="mt-5 w-fit px-6 py-2 rounded-full border border-[#e9b21a] text-[#e9b21a] hover:bg-[#e9b21a] hover:text-black transition"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* VIEW MORE / LESS */}
            {programs.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-3 rounded-full bg-[#e9b21a] text-black font-semibold hover:bg-[#d4a318] transition"
                >
                  {showAll ? "View Less" : "View More Programs"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= DETAILS OVERLAY ================= */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl overflow-y-auto px-6 py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => setActive(null)}
                className="mb-8 text-gray-400 hover:text-white"
              >
                ← Back to Programs
              </button>

              <h3 className="text-4xl font-bold mb-10">{active.title}</h3>

              {/* ================= BRANCH FILTER ================= */}
              {branchNames.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-8">
                  {branchNames.map((bName) => (
                    <button
                      key={bName}
                      onClick={() =>
                        setSelectedBranch(
                          selectedBranch === bName ? null : bName
                        )
                      }
                      className={`px-4 py-2 rounded-full border ${
                        selectedBranch === bName
                          ? "bg-[#e9b21a] text-black border-[#e9b21a]"
                          : "border-white/20 text-white hover:bg-[#e9b21a] hover:text-black transition"
                      }`}
                    >
                      {bName}
                    </button>
                  ))}
                </div>
              )}

              {/* ================= BRANCH DETAILS ================= */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredBranches.map((b, i) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="rounded-2xl overflow-hidden border border-white/10 bg-black"
                  >
                    <img
                      src={b.img || FALLBACK_IMAGE}
                      onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                      alt={b.branch_name}
                      className="h-56 w-full object-cover"
                    />
                    <div className="p-6">
                      <h4 className="text-xl font-semibold mb-3 text-[#e9b21a]">
                        {b.branch_name}
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {b.detailed_text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
