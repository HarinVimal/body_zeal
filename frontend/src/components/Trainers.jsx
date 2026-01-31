import { useState } from "react";
import { motion } from "framer-motion";
import ownerImg from "../assets/Owner.jpg";

export default function Trainers() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section
      id="trainers"
      className="bg-black min-h-screen flex items-center px-6 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto w-full">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Hear it from <span className="text-[#e9b21a]">Our Owner</span>
          </h2>
          <div className="mt-4 w-20 h-1 bg-[#e9b21a]" />
          <p className="mt-6 text-gray-400 max-w-3xl">
            A personal message about discipline, consistency, and the mindset
            behind real transformation at Bodyzeal Fitworks.
          </p>
        </motion.div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT – IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={ownerImg}
              alt="Bodyzeal Owner"
              className="w-full h-[420px] object-cover rounded-xl border border-white/10"
            />

            {/* NAME BAR */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 border border-[#e9b21a]/40 px-5 py-3 rounded-lg">
              <p className="text-white font-semibold">
                Founder & Head Coach
              </p>
              <p className="text-sm text-[#e9b21a]">
                Bodyzeal Fitworks
              </p>
            </div>
          </motion.div>

          {/* RIGHT – TEXT / VIDEO */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {!showVideo && (
              <>
                <p className="text-gray-300 text-lg leading-relaxed">
                  At Bodyzeal Fitworks, fitness is not about shortcuts or
                  temporary motivation. It’s about showing up every day,
                  mastering the fundamentals, and building a body and mindset
                  that lasts a lifetime.
                  <br /><br />
                  Every client trains with purpose. Every program is structured.
                  Every result is earned.
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => setShowVideo(true)}
                  className="inline-flex items-center gap-3 px-7 py-3 rounded-full bg-[#e9b21a] text-black font-semibold tracking-wide hover:bg-yellow-400 transition"
                >
                  ▶ Founder’s Perspective
                </button>
              </>
            )}

            {/* VIDEO – YOUTUBE EMBED */}
            {showVideo && (
              <div className="space-y-4">
                <div className="relative w-full aspect-video border border-[#e9b21a]/30 rounded-xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/E4yD-kn8YO0"
                    title="Founder Message"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <button
                  onClick={() => setShowVideo(false)}
                  className="text-sm text-[#e9b21a] hover:underline"
                >
                  Close message
                </button>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
