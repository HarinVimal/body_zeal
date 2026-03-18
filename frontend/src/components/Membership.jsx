import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_NUMBER = "919943471321"; // 91 + number (NO + sign)
const API_URL = "http://localhost:5001/membership";

export default function Membership() {
  const [branches, setBranches] = useState({});
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH MEMBERSHIPS =================
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("API failed");

        const data = await res.json();

        // Safety normalization
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

    fetchMemberships();
  }, []);

  // ================= WHATSAPP LINK =================
  const getWhatsappLink = (branch) => {
    const message = `Hello, I want to join a membership at ${branch} branch (BodyZeal Fitworks). Please share details.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
  };

  // ================= STATES =================
  if (loading) {
    return (
      <section className="bg-black text-white py-32 text-center">
        Loading membership plans...
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-black text-red-400 py-32 text-center">
        {error}
      </section>
    );
  }

  if (!branches[active]) return null;

  // ================= UI =================
  return (
    <section
      id="membership"
      className="bg-black text-white py-32 px-6 scroll-mt-28"
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADING */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Membership <span className="text-[#e9b21a]">Plans</span>
          </h2>

          <p className="mt-6 text-gray-400">
            Membership pricing varies by location. Select your nearest branch.
          </p>
        </div>

        {/* BRANCH TABS */}
        <div className="flex justify-center gap-4 mb-14 flex-wrap">
          {Object.keys(branches).map((branch) => (
            <button
              key={branch}
              onClick={() => setActive(branch)}
              className={`px-6 py-2 rounded-full border transition ${
                active === branch
                  ? "bg-[#e9b21a] border-[#e9b21a] text-black"
                  : "border-white/20 text-gray-300 hover:border-[#e9b21a]"
              }`}
            >
              {branch}
            </button>
          ))}
        </div>

        {/* PRICING */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 gap-10"
          >
            {/* MEMBERSHIPS */}
            <div className="rounded-2xl border border-white/10 bg-[#171717] shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">
                Gym Memberships
              </h3>

              <ul className="space-y-4">
                {branches[active].memberships.map(
                  ([label, price], i) => (
                    <li
                      key={i}
                      className="flex justify-between text-gray-300 border-b border-white/10 pb-3"
                    >
                      <span>{label}</span>

                      <span className="text-white font-medium">
                        {price}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* ADDONS + CTA */}
            <div className="rounded-2xl border border-white/10 bg-[#171717] shadow-lg p-8 flex flex-col">
              <h3 className="text-2xl font-semibold mb-6">
                Add-On Services
              </h3>

              <ul className="space-y-4 flex-1">
                {branches[active].addons.map(
                  ([label, price], i) => (
                    <li
                      key={i}
                      className="flex justify-between text-gray-300 border-b border-white/10 pb-3"
                    >
                      <span>{label}</span>

                      <span className="text-white font-medium">
                        {price}
                      </span>
                    </li>
                  )
                )}
              </ul>

              {/* WHATSAPP CTA */}
              <a
                href={getWhatsappLink(active)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 w-full text-center px-6 py-4 rounded-full bg-[#e9b21a] text-black font-bold hover:bg-[#d4a318] hover:scale-[1.02] transition flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(233,178,26,0.35)]"
              >
                Join at {active}
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}