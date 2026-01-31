import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center text-center px-6 pt-24 overflow-hidden"
    >
      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY FOR READABILITY */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 max-w-4xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
          Training Built on{" "}
          <span className="text-[#e9b21a] drop-shadow-[0_0_12px_rgba(233,178,26,0.6)]">
            Structure
          </span>
          , Not Shortcuts
        </h1>

        <p className="mt-6 text-lg text-gray-300">
          Structured training, consistent coaching, and disciplined workout
          environments designed for long-term fitness.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a href="#membership">
            <button className="px-6 py-3 bg-[#e9b21a] hover:bg-[#e9b21a]/90 transition rounded-lg shadow-lg text-black font-semibold">
              View Membership Plans
            </button>
          </a>

          <a href="#programs">
            <button className="px-6 py-3 border border-[#e9b21a] text-white hover:bg-[#e9b21a]/20 transition rounded-lg">
              Explore Programs
            </button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
