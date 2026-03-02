import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Layers, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Bell, 
  Flame,
  Play,
  Network,
  Plus,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PopulatedDashboard = ({ studySets: realStudySets }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('Student');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  // Mock data tailored to your study topics
  const mockStudySets = [
    { title: "Operating Systems: Interrupts & DMA", progress: 100 },
    { title: "International Economics: Ricardo-Viner", progress: 80 },
    { title: "Korean Studies: Modern Society", progress: 60 },
    { title: "Behavioral Economics", progress: 60 },
    { title: "Operating Systems: Semaphores & Race Conditions", progress: 50 },
    { title: "Software Engineering Project Specs", progress: 80 },
  ];
  const studySets = realStudySets?.length > 0 ? realStudySets : mockStudySets;
  
  const recentActivity = [
    { id: 1, type: 'add', text: 'Added "Semaphores" node', time: '21 minutes ago', icon: <Plus className="w-4 h-4 text-gray-400" /> },
    { id: 2, type: 'reminder', text: 'Upcoming Study Reminder: 2 PM', time: '31 minutes ago', icon: <Calendar className="w-4 h-4 text-red-400" /> },
    { id: 3, type: 'reminder', text: 'Upcoming Study Reminder: 2 PM', time: '1 hour ago', icon: <Calendar className="w-4 h-4 text-gray-400" /> },
  ];

  return (
    <div className="flex h-screen bg-[#0B1120] font-sans text-white overflow-hidden">
      
      {/* --- LEFT SIDEBAR --- */}
      <div className="w-64 bg-[#111827] border-r border-gray-800 flex flex-col justify-between z-20">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white">StudyFetch</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600/20 text-blue-400 rounded-xl font-medium transition-colors">
              <Home className="w-5 h-5" />
              Home
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-200 transition-colors">
              <Layers className="w-5 h-5" />
              My Sets
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-200 transition-colors">
              <Calendar className="w-5 h-5" />
              Study Plan
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-200 transition-colors">
              <MessageSquare className="w-5 h-5" />
              Chat
            </button>
          </nav>
        </div>

        <div className="p-6 space-y-2">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-200 transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col relative overflow-y-auto subtle-grid-bg">
        
        {/* Top Header / Stats */}
        <div className="p-10 pb-4">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Flame className="w-16 h-16 text-orange-500 fill-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Daily Streak</span>
                <span className="text-5xl font-bold text-white leading-none">7</span>
              </div>
            </div>

            <div className="h-16 w-px bg-gray-700"></div>

            <div className="flex flex-col">
              <span className="text-5xl font-bold text-white leading-none mb-1">125</span>
              <span className="text-gray-400 font-medium">Concepts Mastered</span>
            </div>
          </div>
        </div>

        {/* Study Sets Grid */}
        <div className="p-10 pt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Study Sets</h2>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Study Sets <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studySets.map((set, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg flex flex-col justify-between transform transition-all hover:scale-[1.02] cursor-pointer" onClick={() => navigate('/study')}>
                <div>
                  <h3 className="text-gray-900 font-bold text-lg leading-tight mb-4">{set.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-full bg-blue-100 rounded-full h-2.5 mr-4">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${set.progress}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{set.progress}% Mastered</span>
                  </div>
                </div>
                
                <div className="flex justify-around mt-6 border-t border-gray-100 pt-4">
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center border-2 border-transparent group-hover:border-yellow-400 transition-colors">
                      <Play className="w-5 h-5 text-yellow-600 ml-1" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">Quick Quiz</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-transparent group-hover:border-blue-400 transition-colors">
                      <Network className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">View Map</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDEBAR (Recent Activity) --- */}
      <div className="w-80 bg-[#111827] border-l border-gray-800 flex flex-col z-20">
        <div className="p-6 flex items-center justify-between">
          <h2 className="font-bold text-lg text-white">Recent Activity</h2>
          <div className="flex items-center gap-3">
            <button className="relative">
              <Bell className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-bold border border-gray-500">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex-1 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-10 top-2 bottom-0 w-px bg-gray-700"></div>
          
          <div className="space-y-6 relative">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start">
                <div className="relative z-10 w-8 h-8 rounded-full bg-[#1F2937] border-2 border-[#111827] flex items-center justify-center shrink-0">
                  {activity.icon}
                </div>
                <div className="bg-[#1F2937] rounded-xl p-3 flex-1">
                  <p className="text-sm font-medium text-gray-200">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add a subtle background grid via embedded CSS for the main content area */}
      <style dangerouslySetInnerHTML={{__html: `
        .subtle-grid-bg {
          background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}} />
    </div>
  );
};

export default PopulatedDashboard;