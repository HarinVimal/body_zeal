import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ================= AVATAR LOGIC ================= */
const getAvatar = (name) => {
  if (!name) return "/avatars/male.png";

  const femaleHints = ["a", "i", "e"];
  const lastChar = name.trim().toLowerCase().slice(-1);

  return femaleHints.includes(lastChar)
    ? "https://api.dicebear.com/7.x/lorelei/svg?seed=female"
    : "https://api.dicebear.com/7.x/lorelei/svg?seed=male";
};

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH SAFE REVIEWS ================= */
  useEffect(() => {
    fetch("http://localhost:5001/api/testimonials")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Testimonials error:", err))
      .finally(() => setLoading(false));
  }, []);

  /* ================= OVERALL RATING ================= */
  const overallRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <section
      id="testimonials"
      className="bg-black pt-36 pb-32 px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* ================= HEADER ================= */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Real Member <span className="text-[#e9b21a]">Experiences</span>
        </motion.h2>

        <p className="text-center text-gray-400 mb-16">
          Honest feedback from people who train, sweat, and grow at BodyZeal Fitworks
        </p>

        {/* ================= OVERALL SCORE ================= */}
        {!loading && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center mb-24"
          >
            <div className="text-7xl font-extrabold text-[#e9b21a]">
              {overallRating}
            </div>

            <div className="flex text-2xl mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(overallRating)
                      ? "text-[#e9b21a]"
                      : "text-gray-700"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <p className="mt-4 text-gray-400 text-sm tracking-wide">
              Based on {reviews.length}+ verified member reviews
            </p>
          </motion.div>
        )}

        {/* ================= STATES ================= */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading member stories…
          </p>
        )}

        {!loading && reviews.length === 0 && (
          <p className="text-center text-gray-500">
            No reviews available yet
          </p>
        )}

        {/* ================= TESTIMONIAL LIST ================= */}
        <div className="space-y-16">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="flex gap-6 items-start"
            >
              {/* AVATAR */}
              <img
                src={getAvatar(r.name)}
                alt={r.name}
                className="w-14 h-14 rounded-full border border-[#e9b21a]/40"
              />

              {/* CONTENT */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex text-lg">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span
                        key={idx}
                        className={
                          idx < r.rating
                            ? "text-[#e9b21a]"
                            : "text-gray-700"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-200 text-lg leading-relaxed max-w-3xl">
                  “{r.message}”
                </p>

                <div className="mt-4 text-sm font-semibold tracking-wide text-[#e9b21a]">
                  {r.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
