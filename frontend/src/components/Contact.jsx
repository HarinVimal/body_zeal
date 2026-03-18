import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrainerInvite() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="relative bg-black py-32 px-6 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#e9b21a]/10 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#e9b21a]/10 blur-[140px]" />

        <div className="relative max-w-6xl mx-auto text-center">
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
                className="bg-[#171717] border border-white/10 rounded-2xl p-6 shadow-lg"
              >
                <h4 className="text-lg font-semibold text-[#e9b21a]">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </motion.div>

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

      <AnimatePresence>
        {open && <ApplyModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ================= MODAL FORM WITH VALIDATION ================= */

function ApplyModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    specialization: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/\d/.test(form.name)) {
      newErrors.name = "Name should not contain numbers";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const phonePattern = /^\d{10}$/;
    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phonePattern.test(form.phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!form.experience) {
      newErrors.experience = "Experience is required";
    } else if (!/^\d+$/.test(form.experience)) {
      newErrors.experience = "Experience must be a number";
    } else if (Number(form.experience) > 50) {
      newErrors.experience = "Experience cannot exceed 50 years";
    }

    if (!form.specialization.trim()) {
      newErrors.specialization = "Specialization is required";
    } else if (form.specialization.length < 3) {
      newErrors.specialization = "Specialization is too short";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setStatus("Fix the errors before submitting ❌");
      return;
    }

    setStatus("Submitting...");

    try {
      const res = await fetch("http://localhost:5001/api/trainers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Application submitted successfully !");

        setForm({
          name: "",
          email: "",
          phone: "",
          experience: "",
          specialization: "",
          message: "",
        });

        setErrors({});

        // AUTO CLOSE MODAL AFTER SUCCESS
        setTimeout(() => {
          onClose();
        }, 1500);
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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl bg-[#171717] border border-white/10 rounded-3xl p-8 shadow-xl"
      >
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
            <div key={name}>
              <input
                name={name}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                className="w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-4 py-3 focus:border-[#e9b21a] outline-none"
              />
              {errors[name] && (
                <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div>
            <textarea
              name="message"
              rows="4"
              placeholder="Tell us about your certifications & mindset"
              value={form.message}
              onChange={handleChange}
              className="w-full bg-[#0f0f0f] border border-white/15 rounded-xl px-4 py-3 focus:border-[#e9b21a] outline-none resize-none"
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">{errors.message}</p>
            )}
          </div>
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