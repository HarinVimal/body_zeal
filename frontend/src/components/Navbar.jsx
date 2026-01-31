import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg"; // ✅ correct path

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navClass = (active) =>
    `cursor-pointer transition ${
      active ? "text-[#e9b21a]" : "text-white hover:text-[#e9b21a]"
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
            className={navClass(location.pathname === "/" && !location.hash)}
          >
            Home
          </li>

          <li
            onClick={() => goToSection("training-videos")}
            className={navClass(
              location.pathname === "/" &&
                location.hash === "#training-videos"
            )}
          >
            Videos
          </li>

          <li className={navClass(location.pathname === "/gallery")}>
            <Link to="/gallery">Gallery</Link>
          </li>

          <li className={navClass(location.pathname === "/testimonials")}>
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
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-6 space-y-4">
          <p onClick={() => goToSection("hero")} className={navClass(false)}>
            Home
          </p>
          <p
            onClick={() => goToSection("training-videos")}
            className={navClass(false)}
          >
            Videos
          </p>
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
      )}
    </nav>
  );
}
