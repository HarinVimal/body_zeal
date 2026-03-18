import { motion } from "framer-motion";

import crossfit from "../assets/5114235.png"; // ✅ NEW ICON
import generative from "../assets/generative.png";
import shower from "../assets/shower.png";
import workout from "../assets/workout.png";
import zumba from "../assets/zumba.png";

const highlights = [
  {
    title: "Outdoor CrossFit",
    icon: crossfit, // ✅ FIXED
    desc: "High-energy outdoor training designed to build strength, stamina and endurance.",
  },
  {
    title: "AI Studio",
    icon: generative,
    desc: "Advanced AI powered workout guidance to track and improve your performance.",
  },
  {
    title: "Steam & Shower",
    icon: shower,
    desc: "Relax and recover with modern steam and shower facilities after intense workouts.",
  },
  {
    title: "Personal Training",
    icon: workout, // ✅ FIXED
    desc: "Expert trainers providing personalized workout plans tailored to your goals.",
  },
  {
    title: "Zumba",
    icon: zumba,
    desc: "Fun dance-based fitness sessions that burn calories while keeping workouts exciting.",
  },
];

export default function WhatToExpect() {
  return (
    <section className="bg-black text-white py-28 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Gym <span className="text-[#e9b21a]">Highlights</span>
          </h2>

          <p className="mt-4 text-gray-400">
            Experience the best training environment at Bodyzeal Fitworks
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {highlights.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-[#0f0f0f] border border-gray-800 rounded-2xl p-8 text-center transition hover:border-[#e9b21a] hover:shadow-[0_0_20px_rgba(233,178,26,0.4)]"
            >
              
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#e9b21a] p-4">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-lg text-white mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400">
                {item.desc}
              </p>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}