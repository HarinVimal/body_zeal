import { motion } from "framer-motion";

const cards = [
  {
    title: "Gym Interior",
    caption: "Clean interiors designed for focused training",
    img: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74",
  },
  {
    title: "Training Zones",
    caption: "Professional-grade equipment for structured workouts",
    img: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77",
  },
  {
    title: "Workout Floor",
    caption: "Spacious layouts supporting safe and efficient movement",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  },
  {
    title: "Cleanliness & Ambience",
    caption: "Well-maintained spaces promoting comfort and consistency",
    img: "https://images.unsplash.com/photo-1546483875-ad9014c88eba",
  },
];

// duplicate once (this is enough)
const infiniteCards = [...cards, ...cards];

export default function TrainingEnvironment() {
  return (
    <section className="bg-black text-white py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold">
          Training <span className="text-[#e9b21a]">Environment</span>
        </h2>
        <p className="mt-6 text-gray-400">
          Designed spaces that support discipline, safety and consistency.
        </p>
      </div>

      {/* SLIDER */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-10"
          animate={{ x: [0, -1280] }}
          transition={{
            duration: 18,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {infiniteCards.map((item, i) => (
            <div
              key={i}
              className="relative min-w-[280px] h-[360px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img
                src={`${item.img}?auto=format&fit=crop&w=800&q=80`}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-0 p-5">
                <h4 className="text-lg font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-300 mt-1">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
