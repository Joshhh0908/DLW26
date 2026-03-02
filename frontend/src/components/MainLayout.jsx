import { Outlet, useNavigate } from "react-router-dom";
import { Layers, Home, Calendar, Settings } from "lucide-react";

const MainLayout = () => {
  const navigate = useNavigate(); // <-- hook for programmatic navigation

  return (
    <div className="h-screen w-screen bg-[#060B14] text-white flex overflow-hidden">

      {/* SIDEBAR (Permanent) */}
      <div className="w-64 bg-[#0B1120] border-r border-gray-800/50 flex flex-col justify-between shadow-2xl shrink-0">
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl">StudyFetch</span>
          </div>

          <nav className="space-y-2">
            <button
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 rounded-xl"
              onClick={() => navigate("/home")} // <-- navigate to home
            >
              <Home className="w-5 h-5" /> Home
            </button>

            <button
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 rounded-xl" // navigate to study plan
            >
              <Calendar className="w-5 h-5" /> Study Plan
            </button>
          </nav>
        </div>

        <div className="p-6">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 rounded-xl"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1 h-full overflow-auto relative">
        <Outlet />
      </div>

    </div>
  );
};

export default MainLayout;