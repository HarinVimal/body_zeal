import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navClass = (active) =>
    `w-full text-left py-3 px-4 rounded-lg transition ${
      active
        ? "text-[#e9b21a] bg-white/5"
        : "text-white hover:text-[#e9b21a] hover:bg-white/5"
    }`;

  const goToSection = (id) => {
    setOpen(false);

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 w-full z-50 h-20 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
        {/* LOGO */}
        <img
          src={logo}
          alt="Bodyzeal Fitworks"
          className="h-12 w-auto cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* DESKTOP */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          <li
            onClick={() => goToSection("hero")}
            className={`cursor-pointer transition ${
              location.pathname === "/" && !location.hash
                ? "text-[#e9b21a]"
                : "text-white hover:text-[#e9b21a]"
            }`}
          >
            Home
          </li>

          <li
            onClick={() => goToSection("training-videos")}
            className={`cursor-pointer transition ${
              location.pathname === "/" &&
              location.hash === "#training-videos"
                ? "text-[#e9b21a]"
                : "text-white hover:text-[#e9b21a]"
            }`}
          >
            Videos
          </li>

          <li
            className={`cursor-pointer transition ${
              location.pathname === "/gallery"
                ? "text-[#e9b21a]"
                : "text-white hover:text-[#e9b21a]"
            }`}
          >
            <Link to="/gallery">Gallery</Link>
          </li>

          <li
            className={`cursor-pointer transition ${
              location.pathname === "/testimonials"
                ? "text-[#e9b21a]"
                : "text-white hover:text-[#e9b21a]"
            }`}
          >
            <Link to="/testimonials">Testimonials</Link>
          </li>
        </ul>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-white text-3xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => goToSection("hero")}
              className={navClass(location.pathname === "/" && !location.hash)}
            >
              Home
            </button>

            <button
              onClick={() => goToSection("training-videos")}
              className={navClass(
                location.pathname === "/" &&
                  location.hash === "#training-videos"
              )}
            >
              Videos
            </button>

            <Link
              to="/gallery"
              onClick={() => setOpen(false)}
              className={navClass(location.pathname === "/gallery")}
            >
              Gallery
            </Link>

            <Link
              to="/testimonials"
              onClick={() => setOpen(false)}
              className={navClass(location.pathname === "/testimonials")}
            >
              Testimonials
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}