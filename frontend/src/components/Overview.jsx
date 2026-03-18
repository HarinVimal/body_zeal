import { motion } from "framer-motion";

export default function Overview() {
  return (
    <section className="relative bg-black text-white py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            A Thoughtful Approach to{" "}
            <span className="text-[#e9b21a]">Fitness Training</span>
          </h2>

          <p className="mt-6 text-gray-300 leading-relaxed">
            Bodyzeal Fitworks was created for individuals who value consistency,
            proper guidance, and sustainable fitness development. We emphasise
            correct movement, structured programming, and long-term health.
          </p>

          <p className="mt-4 text-gray-400">
            Across all branches, we follow the same disciplined training philosophy
            to deliver a reliable and consistent experience.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            <li>✔ Structured training systems</li>
            <li>✔ Consistent coaching standards</li>
            <li>✔ Long-term fitness focus</li>
          </ul>
        </motion.div>

        {/* RIGHT FLOATING IMAGE CARDS */}
        <div className="relative h-[320px] sm:h-[380px] md:h-[420px]">

          {/* Card 1 */}
          <motion.img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
            alt="Gym Interior"
            className="absolute top-0 left-4 sm:left-8 w-44 sm:w-52 md:w-56 h-60 sm:h-68 md:h-72 object-cover rounded-xl shadow-xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Card 2 */}
          <motion.img
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=80"
            alt="Workout Floor"
            className="absolute top-16 sm:top-20 right-0 w-52 sm:w-60 md:w-64 h-72 sm:h-76 md:h-80 object-cover rounded-xl shadow-2xl"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
          />

          {/* Card 3 (HIDDEN IN MOBILE) */}
          <motion.img
            src="https://images.unsplash.com/photo-1554284126-aa88f22d8b74?auto=format&fit=crop&w=800&q=80"
            alt="Equipment"
            className="hidden md:block absolute bottom-0 left-20 md:left-24 w-48 md:w-52 h-60 md:h-64 object-cover rounded-xl shadow-lg"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />

        </div>
      </div>
    </section>
  );
}