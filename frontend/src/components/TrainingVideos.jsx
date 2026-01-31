import { motion } from "framer-motion";

export default function TrainingVideos() {
  return (
    <section
      id="training-videos"
      className="bg-black py-32 px-6 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Training <span className="text-[#e9b21a]">Videos</span>
          </h2>

          <p className="mt-6 text-gray-400 max-w-lg">
            Watch our professional gym training sessions designed to help you
            improve strength, endurance, and technique. New videos are added
            regularly to keep you motivated.
          </p>

          <ul className="mt-6 space-y-3 text-gray-400">
            <li>✔ Strength & Conditioning</li>
            <li>✔ Functional Training</li>
            <li>✔ Fat Loss Workouts</li>
            <li>✔ Beginner to Advanced Levels</li>
          </ul>

          <p className="mt-6 text-sm text-gray-500">
            Powered by our official YouTube training playlist.
          </p>
        </motion.div>

        {/* RIGHT VIDEO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden border border-[#e9b21a]/30 shadow-[0_0_40px_rgba(233,178,26,0.15)]"
        >
          <iframe
            className="w-full h-[320px] md:h-[420px]"
            src="https://www.youtube.com/embed/videoseries?list=PLgh_MPV0DUi60K_4bhf7WCJXizMYsyO-R"
            title="BodyZeal Fitworks Training Videos"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}
