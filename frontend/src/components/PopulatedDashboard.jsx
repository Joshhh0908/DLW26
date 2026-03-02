import React, { useState } from 'react';
import { 
  Home, Layers, Calendar, MessageSquare, Settings, 
  Bell, Flame, Play, Network, Plus, ChevronDown, Sparkles, X, Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PopulatedDashboard = ({ studySets: realStudySets }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // -------------------------------
  // PLACEHOLDER STUDY SET DISPLAY
  // -------------------------------
  const mockStudySets = [
    { title: "Operating Systems", progress: 45, mastered: 20 },
  ];

  const setsToDisplay = realStudySets?.length > 0 && realStudySets[0].title !== 'Test' 
    ? realStudySets 
    : mockStudySets;

  // -------------------------------
  // PLACEHOLDER GRAPH DATA (LIVES HERE)
  // -------------------------------
  const placeholderGraphs = {
    "Operating Systems": {
      nodes: [
        { id: 'Operating Systems', type: 'original', text: 'Software managing hardware resources.' },
        { id: 'Processes', type: 'added_info', text: 'Running instances of programs.' },
        { id: 'Threads', type: 'added_info', text: 'Lightweight units of execution.' }
      ],
      links: [
        { source: 'Operating Systems', target: 'Processes', relation: 'manages' },
        { source: 'Processes', target: 'Threads', relation: 'contains' }
      ]
    }
  };
  const graph = {
    
  }

  // -------------------------------
  // FAKE FIRESTORE FETCH
  // -------------------------------
  const fakeFetchStudySet = async (title) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(placeholderGraphs[title]);
      }, 500); // simulate network delay
    });
  };

  // -------------------------------
  // OPEN STUDY SET
  // -------------------------------
  const handleOpenStudySet = async (set, startQuiz = false) => {
    const graphData = await fakeFetchStudySet(set.title);

    navigate('/study', {
      state: {
        topicTitle: set.title,
        graphData: graphData,
        startInQuizMode: startQuiz
      }
    });
  };
  const handleOpenKnowledgeGraph = async (set) => {
  // Fetch or get placeholder graph data
  const graphData = await fakeFetchStudySet(set.title);

  navigate('/knowledge', {
    state: {
      topicTitle: set.title,
      graphData,
    }
  });
};
  const recentActivity = [
    { id: 1, type: 'add', text: 'Added "Operating Systems" node', time: '10 minutes ago', icon: <Plus className="w-4 h-4 text-gray-400" /> },
    { id: 2, type: 'reminder', text: 'Upcoming Study Reminder: 4 PM', time: '2 hours ago', icon: <Calendar className="w-4 h-4 text-red-400" /> },
  ];

  return (
    <div className="flex h-screen bg-[#060B14] font-sans text-white overflow-hidden relative selection:bg-blue-500/30">
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.07) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }}></div>


      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">

        <div className="p-10 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {setsToDisplay.map((set, index) => (
              <div 
                key={index} 
                onClick={() => handleOpenStudySet(set, false)}
                className="bg-white rounded-[20px] p-6 shadow-xl flex flex-col justify-between min-h-[240px] transform transition-transform hover:scale-[1.02] cursor-pointer"
              >
                <div>
                  <h3 className="text-[#111827] font-black text-[17px] leading-tight mb-4 line-clamp-2 pr-4">{set.title}</h3>
                </div>
                
                <div className="flex justify-around mt-4 pt-2">
                  
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenStudySet(set, true);
                    }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#FFEAA7] flex items-center justify-center border-2 border-[#FCD34D]">
                      <Play className="w-6 h-6 text-[#1F2937] ml-1 fill-[#1F2937]" />
                    </div>
                    <span className="text-[13px] font-bold text-[#4B5563]">Quick Quiz</span>
                  </div>

                
                  <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenKnowledgeGraph(set); // <-- now navigates to KnowledgeGraph
                }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center border-2 border-[#E5E7EB]">
                  <Network className="w-6 h-6 text-[#1F2937]" />
                </div>
                <span className="text-[13px] font-bold text-[#4B5563]">View Map</span>
              </div>

                </div>
              </div>
            ))}
            <div className="bg-[#0B1120]/50 border-2 border-dashed border-gray-600 rounded-[20px] p-6 flex flex-col items-center justify-center min-h-[240px] transform transition-all hover:scale-[1.02] hover:border-blue-400 hover:bg-[#0B1120] cursor-pointer group shadow-lg">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors mb-4 border border-blue-500/20">
                <Plus className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-gray-400 font-bold group-hover:text-white transition-colors">Create New Set</h3>
              <p className="text-xs text-gray-500 mt-2 text-center">Upload a PDF or paste text to generate a knowledge map</p>
            </div>

          </div>
        </div>

        {/* Floating LLM Chatbot Widget */}
        <div className="absolute bottom-10 right-10 flex flex-col items-end z-50">
          {isChatOpen && (
            <div className="mb-4 w-80 bg-[#0B1120]/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="font-bold text-white text-sm">AI Study Assistant</span>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-64 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
                <div className="bg-white/10 p-3 rounded-xl rounded-tl-sm self-start text-sm text-gray-200 max-w-[85%]">
                  Hi there! I notice you're studying Operating Systems. Do you want me to quiz you on Critical Regions?
                </div>
              </div>
              <div className="p-3 border-t border-gray-700/50 bg-[#060B14]">
                <div className="flex items-center bg-white/5 border border-gray-700 rounded-full px-4 py-2">
                  <input type="text" placeholder="Ask a question..." className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500" />
                  <button className="text-blue-400 hover:text-blue-300 transition-colors ml-2">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-transform hover:scale-110 
              ${isChatOpen ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/30'}`}
          >
            {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          </button>
        </div>
      </div>
          </div>
        
  );
};

export default PopulatedDashboard;