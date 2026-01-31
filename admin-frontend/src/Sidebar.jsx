export default function Sidebar({ active, setActive }) {
  const menu = ["reviews", "gallery", "membership", "programs", "trainers"]; // Added "trainers"

  return (
    <aside className="w-64 min-h-screen bg-black border-r border-white/10 p-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-10">
        Bodyzeal Admin
      </h2>

      {menu.map((item) => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className={`block w-full text-left mb-4 px-4 py-3 rounded transition ${
            active === item
              ? "bg-yellow-400 text-black"
              : "text-white hover:bg-white/10"
          }`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </aside>
  );
}
