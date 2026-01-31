import { useEffect, useRef, useState } from "react";

const branches = ["Nava India", "RS Puram", "Kovaipudur"];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [branch, setBranch] = useState("Nava India");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fileRef = useRef(null);

  const fetchImages = async () => {
    try {
      const res = await fetch("http://localhost:5001/admin/gallery");
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error("Fetch failed");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    const file = fileRef.current?.files[0];
    if (!file) return;

    setLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("branch", branch);

    try {
      const res = await fetch("http://localhost:5001/admin/gallery", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setImages((prev) => [data, ...prev]);
        setSuccess("Image uploaded successfully");
        setPreview(null);
        fileRef.current.value = "";

        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(data.error || "Upload failed");
        setTimeout(() => setError(""), 2000);
      }
    } catch {
      setError("Server error");
      setTimeout(() => setError(""), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-4xl font-bold text-yellow-400 mb-10">
        Gallery Manager
      </h1>

      {/* CARD */}
      <div className="max-w-2xl bg-[#0f0f0f] border border-white/10 rounded-3xl p-8 shadow-xl">
        {/* BRANCH FILTER */}
        <p className="mb-4 text-sm text-gray-400">Select Branch</p>
        <div className="flex gap-3 mb-6 flex-wrap">
          {branches.map((b) => (
            <button
              key={b}
              onClick={() => setBranch(b)}
              className={`px-5 py-2 rounded-full border transition ${
                branch === b
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* UPLOAD BOX */}
        <div className="border border-dashed border-yellow-400/50 rounded-2xl p-6 text-center">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setPreview(URL.createObjectURL(e.target.files[0]))
            }
            className="hidden"
            id="fileUpload"
          />

          <label
            htmlFor="fileUpload"
            className="cursor-pointer inline-block bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Choose Image
          </label>

          <p className="mt-3 text-sm text-gray-400">
            JPG, PNG, WEBP supported
          </p>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-6 mx-auto w-48 h-48 object-cover rounded-2xl border border-white/10"
            />
          )}
        </div>

        {/* UPLOAD BUTTON */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>

        {/* STATUS MESSAGES */}
        {success && (
          <p className="mt-4 text-green-400 text-center">{success}</p>
        )}
        {error && (
          <p className="mt-4 text-red-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
