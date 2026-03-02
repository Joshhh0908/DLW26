import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import KnowledgeGraph from './KnowledgeGraph';
import { Layers, Home, Calendar, X, Swords, Shield, BookOpen, Search, Loader2 } from 'lucide-react';
import QuizBattle from './QuizBattle';

// --- THE LAYOUT ENGINE ---
// This function takes messy data from Python and calculates perfect circular X/Y coordinates
const generateDynamicLayout = (rawNodes) => {
  if (!rawNodes || rawNodes.length === 0) return [];

  // 1. Find the Main central node (Fallback to the first node if none is marked 'original')
  const mainNode = rawNodes.find(n => n.type === 'original') || rawNodes[0];
  const subNodes = rawNodes.filter(n => n.id !== mainNode.id);

  // 2. Lock the main node dead in the center of the canvas area
  // (Adjusting X to 400 to account for the sidebar width)
  const centerX = 400; 
  const centerY = 350;
  
  const positionedNodes = [{ ...mainNode, x: centerX, y: centerY }];

  // 3. Arrange all other nodes in a perfect circle around it
  const radius = 220; // How far the outer nodes sit from the center
  const angleStep = (2 * Math.PI) / subNodes.length;

  subNodes.forEach((node, index) => {
    const angle = index * angleStep;
    positionedNodes.push({
      ...node,
      x: centerX + radius * Math.cos(angle), 
      y: centerY + radius * Math.sin(angle)
    });
  });

  return positionedNodes;
};


const StudyDashboard = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [activeNode, setActiveNode] = useState(null);
  
  const [isQuizMode, setIsQuizMode] = useState(location.state?.startInQuizMode || false);

  // New States for fetching data
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- THE API FETCH ---
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // IMPORTANT: Tell your teammate to make sure this route returns { nodes: [], links: [] }
        const response = await fetch('http://localhost:5000/get-graph-data', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const rawData = await response.json();
          
          // Run the raw data through our math function to get X and Y coordinates!
          const nodesWithCoordinates = generateDynamicLayout(rawData.nodes);
          
          setGraphData({ nodes: nodesWithCoordinates, links: rawData.links });
        } else {
          console.error("Failed to fetch graph data");
          // Fallback mock data just in case the backend isn't ready yet!
          loadFallbackData();
        }
      } catch (error) {
        console.error("Network error:", error);
        loadFallbackData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  const loadFallbackData = () => {
    const mockNodes = [
      { id: 'Machine Learning', type: 'original', text: 'Study of algorithms that learn from data.' },
      { id: 'Neural Networks', type: 'added_info', text: 'Computing systems inspired by biological brains.' },
      { id: 'Human Brain', type: 'analogy', text: 'Like a neural network, it processes signals.' }
    ];
    const mockLinks = [
      { source: 'Machine Learning', target: 'Neural Networks', relation: 'precedence' },
      { source: 'Machine Learning', target: 'Human Brain', relation: 'related' }
    ];
    setGraphData({ nodes: generateDynamicLayout(mockNodes), links: mockLinks });
  };

  return (
    <div className="h-screen w-screen bg-[#060B14] font-sans text-white overflow-hidden relative selection:bg-blue-500/30">
      
      {/* --- LEFT SIDEBAR (Always visible) --- */}
      <div className="absolute top-0 left-0 w-64 h-full bg-[#0B1120] border-r border-gray-800/50 flex flex-col justify-between z-30 shadow-2xl">
        {/* ... (Keep your existing sidebar code here!) ... */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white tracking-wide">StudyFetch</span>
          </div>
          <nav className="space-y-2">
            <button onClick={() => navigate('/home')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Home className="w-5 h-5" /> Home
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium border border-blue-500/20">
              <Layers className="w-5 h-5" /> My Sets
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Calendar className="w-5 h-5" /> Study Plan
            </button>
          </nav>
        </div>
      </div>

      {/* --- CONDITIONAL RENDER: SHOW QUIZ OR SHOW GRAPH --- */}
      <div className="absolute top-0 right-0 bottom-0 left-64 overflow-hidden z-10 flex">
        
        {isQuizMode ? (
          
          /* --- FULL SCREEN QUIZ MODE --- */
          <div className="flex-1 w-full h-full">
            <QuizBattle onExit={() => setIsQuizMode(false)} />
          </div>

        ) : (
          
          /* --- NORMAL GRAPH MODE --- */
          <>
            <div className="flex-1 relative overflow-hidden flex items-center justify-center">
              <div className="absolute top-6 left-6 z-30 flex items-center bg-[#0B1120]/80 backdrop-blur-md border border-gray-800 rounded-full px-4 py-2 shadow-lg">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input type="text" placeholder="Search concepts..." className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-64" />
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center text-blue-500 animate-pulse z-20">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" />
                  <h2 className="text-xl font-bold text-white">Generating your Knowledge Map...</h2>
                </div>
              ) : (
                <KnowledgeGraph 
                  graphData={graphData} 
                  onNodeClick={setActiveNode} 
                  selectedNode={activeNode}
                />
              )}
            </div>

            {/* RIGHT SLIDE-OUT PANEL */}
            <div 
              className={`absolute top-0 right-0 h-full w-[400px] bg-[#0B1120]/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-in-out z-40 flex flex-col
                ${activeNode ? 'translate-x-0' : 'translate-x-full'}
              `}
            >
              {activeNode && (
                <>
                  <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                      {activeNode.id}
                    </h2>
                    <button onClick={() => setActiveNode(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                      <X className="w-5 h-5 text-gray-300" />
                    </button>
                  </div>

                  <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="mb-8">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full uppercase tracking-wider mb-4 inline-block border border-blue-500/30">
                        {activeNode.type ? activeNode.type.replace('_', ' ') : 'CONCEPT'}
                      </span>
                      <p className="text-gray-300 leading-relaxed text-sm mt-2">
                        {activeNode.text}
                      </p>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Source Document</span>
                      </div>
                      <div className="bg-[#1A1A1A] border border-gray-700/50 rounded-xl p-5 relative">
                        <div className="text-gray-600 text-4xl absolute top-2 left-2 font-serif opacity-30">"</div>
                        <p className="text-sm leading-loose relative z-10 text-gray-300">
                          <mark className="bg-[#FDE047] text-black px-1.5 py-0.5 rounded font-medium">
                            {activeNode.id}
                          </mark> is essential to understanding the core foundation of this study set.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-t from-[#0B1120] to-transparent shrink-0">
                    <button 
                      onClick={() => setIsQuizMode(true)} 
                      className="w-full relative group overflow-hidden rounded-xl p-[1px]"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <div className="relative flex items-center justify-center gap-3 bg-[#131B2C] hover:bg-[#1A233A] transition-colors rounded-xl px-6 py-4">
                        <Swords className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-white tracking-wide">Challenge this Concept</span>
                        <Shield className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudyDashboard;