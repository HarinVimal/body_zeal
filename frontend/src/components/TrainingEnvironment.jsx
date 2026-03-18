import { motion } from "framer-motion";

/* UPDATED CARDS WITH NEW CONTENT + BETTER IMAGES */
const cards = [
  {
    title: "Training Environment",
    caption: "Well-designed space that enhances focus and performance",
    img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61",
  },
  {
    title: "Clean Ambience",
    caption: "Hygienic and well-maintained workout surroundings",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f",
  },
  {
    title: "Certified Trainers",
    caption: "Guidance from experienced and qualified professionals",
    img: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a",
  },
  {
    title: "New Age Equipment",
    caption: "Modern machines designed for safe and effective training",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  },
  {
    title: "Air Conditioned Workout Zone",
    caption: "Comfortable climate-controlled training environment",
    img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
  },
];

/* DUPLICATE MORE TIMES FOR PERFECT LOOP (NO BREAK) */
const infiniteCards = [...cards, ...cards, ...cards, ...cards];

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
          className="flex gap-10 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {infiniteCards.map((item, i) => (
            <div
              key={i}
              className="relative min-w-[260px] sm:min-w-[280px] h-[340px] sm:h-[360px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <img
                src={`${item.img}?auto=format&fit=crop&w=800&q=80`}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* TEXT */}
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