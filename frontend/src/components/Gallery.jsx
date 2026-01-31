import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const branches = ["Nava India", "RS Puram", "Kovaipudur"];
const INITIAL_COUNT = 6;

export default function Gallery() {
  const [branch, setBranch] = useState("Nava India");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMore, setViewMore] = useState(false);

  // ✅ Scroll to top on page load (important for navigation UX)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setLoading(true);
    setViewMore(false);

    fetch(
      `http://localhost:5001/gallery?branch=${encodeURIComponent(branch)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Server not reachable");
        return res.json();
      })
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setImages(sorted);
      })
      .catch((err) => console.error("Gallery fetch error:", err))
      .finally(() => setLoading(false));
  }, [branch]);

  const downloadImage = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bodyzeal-gallery.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const visibleImages = viewMore
    ? images
    : images.slice(0, INITIAL_COUNT);

  return (
    <section className="bg-black py-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl text-center font-bold mb-12 text-white">
          Our <span className="text-[#e9b21a]">Gallery</span>
        </h2>

        {/* FILTER */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setBranch(b)}
              className={`px-6 py-2 rounded-full border transition ${
                branch === b
                  ? "bg-[#e9b21a] text-black"
                  : "border-[#e9b21a] text-[#e9b21a] hover:bg-[#e9b21a] hover:text-black"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-400">Loading images...</p>
        )}

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {visibleImages.map((img) => (
            <motion.div
              key={img.id}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-2xl"
            >
              <img
                src={`http://localhost:5001${img.image_url}`}
                alt="Gallery"
                className="w-full h-72 object-cover"
              />

              <button
                onClick={() =>
                  downloadImage(
                    `http://localhost:5001${img.image_url}`
                  )
                }
                className="absolute bottom-4 right-4 bg-[#e9b21a] px-4 py-1 rounded-full text-black font-semibold"
              >
                Download
              </button>
            </motion.div>
          ))}
        </div>

        {/* VIEW MORE */}
        {!loading && images.length > INITIAL_COUNT && !viewMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setViewMore(true)}
              className="px-8 py-3 bg-[#e9b21a] text-black rounded-full font-semibold hover:scale-105 transition"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
