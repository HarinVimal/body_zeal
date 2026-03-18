import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Reviews from "./Reviews";
import AdminGallery from "./AdminGallery";
import AdminMembership from "./AdminMembership";
import AdminPrograms from "./AdminPrograms";
import TrainersApply from "./TrainersApply";

export default function Dashboard() {
  const [active, setActive] = useState("reviews");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ================= PERSIST ACTIVE TAB =================
  useEffect(() => {
    const savedTab = localStorage.getItem("adminActiveTab");
    if (savedTab) {
      setActive(savedTab);
    }
  }, []);

  // ================= SAVE TAB CHANGE =================
  useEffect(() => {
    localStorage.setItem("adminActiveTab", active);
  }, [active]);

  // ================= HANDLE TAB CLICK (AUTO CLOSE MOBILE SIDEBAR) =================
  const handleSetActive = (tab) => {
    setActive(tab);
    setSidebarOpen(false); // close sidebar after selecting item
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">

      {/* ================= MOBILE HEADER ================= */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button onClick={() => setSidebarOpen(true)} className="text-2xl">
          ☰
        </button>
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <div></div>
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:block md:w-64 border-r border-white/10">
        <Sidebar active={active} setActive={setActive} />
      </div>

      {/* ================= MOBILE SIDEBAR (DRAWER) ================= */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          
          {/* OVERLAY */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* DRAWER */}
          <div className="relative w-64 bg-black border-r border-white/10 p-4">
            
            {/* CLOSE BUTTON */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            <Sidebar active={active} setActive={handleSetActive} />
          </div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <main className="flex-1 p-5 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
        {active === "reviews" && <Reviews />}
        {active === "gallery" && <AdminGallery />}
        {active === "membership" && <AdminMembership />}
        {active === "programs" && <AdminPrograms />}
        {active === "trainers" && <TrainersApply />}
      </main>
    </div>
  );
}