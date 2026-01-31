import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Reviews from "./Reviews";
import AdminGallery from "./AdminGallery";
import AdminMembership from "./AdminMembership";
import AdminPrograms from "./AdminPrograms"; // Programs tab
import TrainersApply from "./TrainersApply"; // Trainer Applications tab

export default function Dashboard() {
  const [active, setActive] = useState("reviews");

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

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* SIDEBAR */}
      <Sidebar active={active} setActive={setActive} />

      {/* CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        {active === "reviews" && <Reviews />}
        {active === "gallery" && <AdminGallery />}
        {active === "membership" && <AdminMembership />}
        {active === "programs" && <AdminPrograms />}
        {active === "trainers" && <TrainersApply />} {/* Added Trainers tab */}
      </main>
    </div>
  );
}
