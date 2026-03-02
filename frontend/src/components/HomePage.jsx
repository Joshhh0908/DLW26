import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Sidebar, Calendar, LayoutGrid, BookOpen, MessageCircle, 
  UserPlus, Mic, PenTool, PlayCircle, Upload, Flame, Settings, Bookmark,
  ChevronDown, FileText, ArrowUpCircle, Info
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-gray-200 flex flex-col h-full bg-white">
        <div className="flex items-center justify-between p-4 border-b border-transparent">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">🐕</div>
            study thing
          </div>
          <div className="flex gap-2 text-gray-500">
            <Search className="w-5 h-5 cursor-pointer hover:text-gray-800" />
            <Sidebar className="w-5 h-5 cursor-pointer hover:text-gray-800" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="text-gray-600 space-y-1">
            <NavItem icon={<BookOpen size={18}/>} label="My Sets" />
            <NavItem icon={<Calendar size={18}/>} label="Calendar" />
            <NavItem icon={<LayoutGrid size={18}/>} label="Mini Apps" />
          </div>
          
          <div className="my-4 border-t border-gray-100"></div>

          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-xs">📜</div>
              <span className="text-sm font-medium truncate w-24">IWC 117 - De...</span>
            </div>
            <ArrowUpCircle className="w-4 h-4 text-gray-400 rotate-90" />
          </div>

          <div className="text-gray-600 space-y-1">
            <NavItem icon={<BookOpen size={18} className="text-teal-600"/>} label="Study Plan" />
            <NavItem icon={<MessageCircle size={18} className="text-blue-500"/>} label="Chat" />
            <NavItem icon={<UserPlus size={18} className="text-purple-500"/>} label="Tutor Me" />
            <NavItem icon={<Mic size={18} className="text-pink-500"/>} label="Record Lecture" />
            
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-sm">
              <div className="flex items-center gap-3"><PenTool size={18} className="text-teal-500"/> Practice</div>
              <ChevronDown size={14} />
            </div>
            
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-sm">
              <div className="flex items-center gap-3"><PlayCircle size={18} className="text-pink-400"/> Audio & Video</div>
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-2 rounded-xl text-sm font-medium transition-colors">
            <Upload size={16} /> Upload
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-16 flex items-center justify-end px-6 gap-4">
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
            <ArrowUpCircle size={16} /> Upgrade
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50">
            <Info size={16} className="text-gray-600"/>
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full hover:bg-gray-50">
            <Upload size={16} className="text-gray-600"/>
          </button>
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold cursor-pointer">
            G
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 pt-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">🐶</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Good evening, ta!</h1>
              <p className="text-gray-500">Which study set are you working on today?</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <button className="flex items-center gap-2 border-2 border-blue-400 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-medium">
                <PlayCircle size={18} className="text-blue-500 fill-blue-100" />
                <span className="text-xl">📜</span> IWC 117 - Dec...
              </button>
              <button className="flex items-center gap-2 border-2 border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 px-4 py-2 rounded-xl font-medium transition-colors">
                + Add Set
              </button>
            </div>
            <div className="flex items-center gap-4 text-blue-600 font-semibold text-sm">
              <button className="hover:underline">+ Add Set</button>
              <button className="flex items-center gap-1 hover:underline"><BookOpen size={16}/> See All My Sets</button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div 
              className="col-span-2 bg-[#eef2fc] rounded-3xl p-6 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
              onClick={() => navigate('/study')}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 hover:scale-105 transition-transform">
                    <PlayCircle size={24} className="fill-current" />
                  </button>
                  <div className="w-14 h-14 bg-pink-200 rounded-2xl flex items-center justify-center text-2xl border-4 border-white shadow-sm">
                    📜
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">IWC 117 - December 2024</h2>
                    <p className="text-gray-500">1 materials</p>
                  </div>
                </div>
                <div className="flex gap-3 text-gray-600">
                  <Bookmark className="w-6 h-6 cursor-pointer hover:text-gray-900" />
                  <Settings className="w-6 h-6 cursor-pointer hover:text-gray-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ToolCard icon={<PenTool className="text-orange-500"/>} label="0 Tests/Quizzes" />
                <ToolCard icon={<PlayCircle className="text-blue-500"/>} label="0 Explainers" />
                <ToolCard icon={<UserPlus className="text-purple-500"/>} label="0 Tutor Me" />
                <ToolCard icon={<LayoutGrid className="text-pink-500"/>} label="0 Arcade" />
                <ToolCard icon={<BookOpen className="text-emerald-500"/>} label="0 Flashcards" />
                <div className="bg-white/60 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-3 font-medium text-gray-800">
                    <Mic className="text-purple-600"/> 1 Audio Recap
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="col-span-1 flex flex-col gap-6">
              <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Flame className="text-orange-500 fill-orange-500" /> 0 day streak!
                </div>
                <button className="text-sm font-semibold text-gray-500 hover:text-gray-800">View Leaderboard</button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Materials</h3>
                  <button className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center gap-1">
                    + Upload
                  </button>
                </div>
                
                <div className="flex items-start gap-3 mt-4">
                  <FileText className="text-pink-600 w-8 h-8" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">iwc 117 dec 24.pdf</p>
                    <p className="text-xs text-gray-500">Mar 1, 2026</p>
                  </div>
                </div>

                <div className="mt-6 text-right">
                  <button className="text-blue-600 font-semibold text-sm hover:underline">View All</button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Calendar className="text-gray-800" /> Upcoming
                </div>
                <ChevronDown size={20} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable components without TS interfaces
const NavItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer text-sm font-medium">
    {icon}
    <span>{label}</span>
  </div>
);

const ToolCard = ({ icon, label }) => (
  <div className="bg-white/60 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white transition-colors font-medium text-gray-800 shadow-sm border border-transparent hover:border-white">
    {icon}
    <span>{label}</span>
  </div>
);

export default HomePage;