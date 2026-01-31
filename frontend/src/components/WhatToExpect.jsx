import { motion } from "framer-motion";

const steps = [
  {
    title: "Initial Assessment",
    desc: "We evaluate your current fitness levels to understand your starting point.",
  },
  {
    title: "Program Guidance",
    desc: "Our trainers help select programs suited to your goals and capability.",
  },
  {
    title: "Trainer Support",
    desc: "Ongoing supervision during workouts to ensure correct form and safety.",
  },
  {
    title: "Structured Routines",
    desc: "Consistent, well-planned workouts focused on long-term results.",
  },
  {
    title: "Progress Monitoring",
    desc: "Training plans adjusted based on progress and performance.",
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
            Your <span className="text-[#e9b21a]">Training Journey</span>
          </h2>
          <p className="mt-4 text-gray-400">
            What to expect when you join Bodyzeal Fitworks
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="glass-card p-6 rounded-xl text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#e9b21a] text-black font-bold">
                {i + 1}
              </div>

              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
