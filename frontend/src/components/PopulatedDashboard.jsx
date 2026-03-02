import React, { useState } from 'react';
import { 
  Home, Layers, Calendar, MessageSquare, Settings, 
  Bell, Flame, Play, Network, Plus, ChevronDown, Sparkles, X, Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PopulatedDashboard = ({ studySets: realStudySets }) => {
  const navigate = useNavigate();
  
  // State for the new LLM Chatbot
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Updated Mock Data: Just one set for Linear Algebra
  const mockStudySets = [
    { title: "Linear Algebra: Eigenvectors & Matrices", progress: 45, mastered: 20 },
  ];

  const setsToDisplay = realStudySets?.length > 0 && realStudySets[0].title !== 'Test' 
    ? realStudySets 
    : mockStudySets;

  const recentActivity = [
    { id: 1, type: 'add', text: 'Added "Linear Transformations" node', time: '10 minutes ago', icon: <Plus className="w-4 h-4 text-gray-400" /> },
    { id: 2, type: 'reminder', text: 'Upcoming Study Reminder: 4 PM', time: '2 hours ago', icon: <Calendar className="w-4 h-4 text-red-400" /> },
    { id: 3, type: 'reminder', text: 'Completed Matrix Multiplication', time: 'Yesterday', icon: <span className="text-gray-400 text-xs font-bold">A</span> },
  ];

  return (
    <div className="flex h-screen bg-[#060B14] font-sans text-white overflow-hidden relative selection:bg-blue-500/30">
      
      {/* The Subtle Blue Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.07) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }}></div>

      {/* --- LEFT SIDEBAR --- */}
      <div className="w-64 bg-[#0B1120] border-r border-gray-800/50 flex flex-col justify-between z-20 shadow-2xl shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white tracking-wide">StudyFetch</span>
          </div>

          <nav className="space-y-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium border border-blue-500/20 transition-all hover:bg-blue-600/20">
              <Home className="w-5 h-5" /> Home
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Layers className="w-5 h-5" /> My Sets
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Calendar className="w-5 h-5" /> Study Plan
            </button>
          </nav>
        </div>

        <div className="p-6">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
        
        {/* Top Header / Stats */}
        <div className="p-10 pb-6 pt-12">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-4">
              <Flame className="w-16 h-16 text-orange-500 fill-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]" />
              <div className="flex flex-col">
                <span className="text-white text-[15px] font-bold tracking-wide mb-1">Daily Streak</span>
                <span className="text-[54px] font-black text-white leading-none tracking-tighter">7</span>
              </div>
            </div>

            <div className="h-16 w-px bg-gray-700/80"></div>

            <div className="flex flex-col justify-center">
              <span className="text-[40px] font-black text-white leading-none mb-2 tracking-tight">125</span>
              <span className="text-gray-400 font-medium text-[15px]">Concepts Mastered</span>
            </div>
          </div>
        </div>

        {/* Study Sets Grid */}
        <div className="p-10 pt-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-wide">Study Sets</h2>
            <button className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">
              Study Sets <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* The Actual Study Sets */}
            {setsToDisplay.map((set, index) => (
              <div 
                key={index} 
                onClick={() => navigate('/study')}
                className="bg-white rounded-[20px] p-6 shadow-xl flex flex-col justify-between min-h-[240px] transform transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <div>
                  <h3 className="text-[#111827] font-black text-[17px] leading-tight mb-4 line-clamp-2 pr-4">{set.title}</h3>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex-1 bg-[#E1E8F0] rounded-full h-[6px]">
                      <div className="bg-[#3B82F6] h-[6px] rounded-full" style={{ width: `${set.progress || 0}%` }}></div>
                    </div>
                    <span className="text-[13px] font-bold text-[#4B5563]">{set.progress || 0}%</span>
                  </div>
                  <p className="text-[13px] font-bold text-[#111827] mt-1">{set.mastered || 0}% Mastered</p>
                </div>
                
                {/* FIX APPLIED HERE: 
                  Using a strict <div> with no background styling to dodge global <button> CSS conflicts! 
                */}
                <div className="flex justify-around mt-4 pt-2">
                  <div className="flex flex-col items-center gap-2 group cursor-pointer bg-transparent">
                    <div className="w-14 h-14 rounded-full bg-[#FFEAA7] flex items-center justify-center border-2 border-[#FCD34D] group-hover:bg-[#FDE68A] transition-colors shadow-sm">
                      <Play className="w-6 h-6 text-[#1F2937] ml-1 fill-[#1F2937]" />
                    </div>
                    <span className="text-[13px] font-bold text-[#4B5563]">Quick Quiz</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 group cursor-pointer bg-transparent">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-[#E5E7EB] group-hover:border-[#93C5FD] transition-colors shadow-sm">
                      <Network className="w-6 h-6 text-[#1F2937]" />
                    </div>
                    <span className="text-[13px] font-bold text-[#4B5563]">View Map</span>
                  </div>
                </div>
              </div>
            ))}

            {/* --- NEW: "Add Study Set" Card --- */}
            <div className="bg-[#0B1120]/50 border-2 border-dashed border-gray-600 rounded-[20px] p-6 flex flex-col items-center justify-center min-h-[240px] transform transition-all hover:scale-[1.02] hover:border-blue-400 hover:bg-[#0B1120] cursor-pointer group shadow-lg">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors mb-4 border border-blue-500/20">
                <Plus className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-gray-400 font-bold group-hover:text-white transition-colors">Create New Set</h3>
              <p className="text-xs text-gray-500 mt-2 text-center">Upload a PDF or paste text to generate a knowledge map</p>
            </div>

          </div>
        </div>

        {/* --- NEW: Floating LLM Chatbot Widget --- */}
        <div className="absolute bottom-10 right-10 flex flex-col items-end z-50">
          
          {/* Expanded Chat Window */}
          {isChatOpen && (
            <div className="mb-4 w-80 bg-[#0B1120]/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
              
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="font-bold text-white text-sm">AI Study Assistant</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="h-64 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                <div className="bg-white/10 p-3 rounded-xl rounded-tl-sm self-start text-sm text-gray-200 max-w-[85%]">
                  Hi there! I notice you're studying Linear Algebra. Do you want me to quiz you on Eigenvectors?
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-gray-700/50 bg-[#060B14]">
                <div className="flex items-center bg-white/5 border border-gray-700 rounded-full px-4 py-2">
                  <input 
                    type="text" 
                    placeholder="Ask a question..." 
                    className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
                  />
                  <button className="text-blue-400 hover:text-blue-300 transition-colors ml-2">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Button */}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-transform hover:scale-110 
              ${isChatOpen ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/30'}`}
          >
            {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR (Recent Activity) --- */}
      <div className="w-[340px] bg-[#0B1120] border-l border-gray-800/50 flex flex-col z-20 shadow-2xl shrink-0">
        <div className="p-8 pb-6 flex items-center justify-between">
          <h2 className="font-bold text-lg text-white">Recent Activity</h2>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#0B1120]"></span>
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">
              A
            </div>
          </div>
        </div>

        <div className="p-8 pt-0 flex-1 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[47px] top-4 bottom-0 w-px bg-gray-700/50"></div>
          
          <div className="space-y-6 relative">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start">
                <div className="relative z-10 w-8 h-8 rounded-full bg-[#1F2937] border-4 border-[#0B1120] flex items-center justify-center shrink-0 shadow-sm mt-1">
                  {activity.icon}
                </div>
                <div className="bg-[#1F2937]/50 border border-gray-700/50 rounded-xl p-4 flex-1 hover:bg-[#1F2937] transition-colors cursor-pointer">
                  <p className="text-[14px] font-medium text-gray-200 leading-tight mb-1.5">{activity.text}</p>
                  <p className="text-xs text-gray-500 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulatedDashboard;