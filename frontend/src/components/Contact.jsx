import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrainerInvite() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="relative bg-black py-32 px-6 overflow-hidden">
        {/* BACKGROUND GLOW */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#e9b21a]/10 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#e9b21a]/10 blur-[140px]" />

        <div className="relative max-w-6xl mx-auto text-center">
          {/* HEADING */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Become a{" "}
            <span className="text-[#e9b21a]">Bodyzeal Trainer</span>
          </motion.h2>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-6 text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            We are looking for elite fitness professionals who don’t just train —
            but lead, inspire, and transform lives through discipline,
            professionalism, and results.
          </motion.p>

          {/* FEATURES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid sm:grid-cols-3 gap-6 text-left"
          >
            {[
              {
                title: "Premium Clientele",
                desc: "Work with serious, result-driven members who respect your expertise.",
              },
              {
                title: "Brand-Backed Growth",
                desc: "Build long-term credibility with a trusted and expanding fitness brand.",
              },
              {
                title: "Respect & Stability",
                desc: "Enjoy professional respect, structured systems, and performance rewards.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
              >
                <h4 className="text-lg font-semibold text-[#e9b21a]">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="mt-14"
          >
            <button
              onClick={() => setOpen(true)}
              className="px-10 py-4 rounded-full bg-[#e9b21a] text-black font-semibold text-lg hover:bg-[#d4a318] transition"
            >
              Apply as Trainer
            </button>

            <p className="mt-4 text-xs text-gray-500">
              Applications are reviewed personally by our leadership team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {open && <ApplyModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ================= MODAL FORM ================= */

function ApplyModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    specialization: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const res = await fetch("http://localhost:5001/api/trainers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Application submitted successfully ✅");
        setForm({
          name: "",
          email: "",
          phone: "",
          experience: "",
          specialization: "",
          message: "",
        });
      } else {
        setStatus("Something went wrong ❌");
      }
    } catch {
      setStatus("Server error ❌");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl bg-[#0b0b0b] border border-white/10 rounded-3xl p-8"
      >
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <h3 className="text-2xl font-semibold mb-6">
          Trainer Application
        </h3>

        <div className="space-y-4">
          {[
            ["name", "Full Name"],
            ["email", "Email Address"],
            ["phone", "Phone Number"],
            ["experience", "Years of Experience"],
            ["specialization", "Specialization"],
          ].map(([name, placeholder]) => (
            <input
              key={name}
              name={name}
              placeholder={placeholder}
              value={form[name]}
              onChange={handleChange}
              required
              className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 focus:border-[#e9b21a] outline-none"
            />
          ))}

          <textarea
            name="message"
            rows="4"
            placeholder="Tell us about your certifications & mindset"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full bg-black border border-white/15 rounded-xl px-4 py-3 focus:border-[#e9b21a] outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-3 rounded-full bg-[#e9b21a] text-black font-semibold hover:bg-[#d4a018] transition"
        >
          Submit Application
        </button>

        {status && (
          <p className="mt-4 text-center text-sm text-gray-400">
            {status}
          </p>
        )}
      </motion.form>
    </motion.div>
  );
}
