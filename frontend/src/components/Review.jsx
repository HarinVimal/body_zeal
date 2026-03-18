import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Review() {
  const [form, setForm] = useState({
    name: "",
    rating: 0,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5001/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      setForm({ name: "", rating: 0, message: "" });

      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-black text-white py-28 px-6">
      <div className="max-w-4xl mx-auto">

        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Share Your <span className="text-[#e9b21a]">Experience</span>
          </h2>

          <p className="mt-4 text-gray-400">
            Your feedback helps us grow stronger 💪
          </p>
        </motion.div>

        {/* REVIEW CARD */}
        <motion.form
          onSubmit={submitReview}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-[#171717] border border-white/10 rounded-3xl p-10 shadow-xl"
        >
          {/* NAME */}
          <input
            required
            placeholder="Your Name"
            className="w-full mb-5 px-5 py-4 rounded-xl bg-[#0f0f0f] border border-white/20 focus:border-[#e9b21a] outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* STAR RATING */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setForm({ ...form, rating: star })}
                className={`text-3xl transition ${
                  star <= form.rating ? "text-[#e9b21a]" : "text-gray-600"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* MESSAGE */}
          <textarea
            required
            rows="4"
            placeholder="Write your experience..."
            className="w-full mb-6 px-5 py-4 rounded-xl bg-[#0f0f0f] border border-white/20 focus:border-[#e9b21a] outline-none"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || form.rating === 0}
            className="w-full py-4 rounded-full bg-[#e9b21a] text-black font-semibold text-lg hover:bg-[#d4a318] transition"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>

          {/* SUCCESS MESSAGE */}
          <AnimatePresence>
            {success && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-green-400 text-center"
              >
                Review submitted successfully.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.form>
      </div>

      {/* FOOTER */}
      <p className="mt-24 text-center text-sm text-gray-500">
        © 2025 Bodyzeal Fitworks. All rights reserved.
      </p>
    </section>
  );
}