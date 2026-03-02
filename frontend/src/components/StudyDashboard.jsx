import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import KnowledgeGraph from './KnowledgeGraph';
import { Layers, Home, Calendar, X, Swords, Shield, BookOpen, Search } from 'lucide-react';
import QuizBattle from './QuizBattle';

const generateDynamicLayout = (rawNodes) => {
  if (!rawNodes || rawNodes.length === 0) return [];

  const mainNode = rawNodes.find(n => n.type === 'original') || rawNodes[0];
  const subNodes = rawNodes.filter(n => n.id !== mainNode.id);

  const centerX = 400; 
  const centerY = 350;
  
  const positionedNodes = [{ ...mainNode, x: centerX, y: centerY }];

  const radius = 220;
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
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (location.state?.graphData) {
      const rawData = location.state.graphData;

      const nodesWithCoordinates = generateDynamicLayout(rawData.nodes);

      setGraphData({
        nodes: nodesWithCoordinates,
        links: rawData.links
      });
    }
  }, [location.state]);

  if (!graphData) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#060B14] text-white">
        <h2 className="text-xl font-bold">No Study Set Selected</h2>
      </div>
    );
  }

  return (
    
      

      <div className="absolute top-0 right-0 bottom-0 overflow-hidden z-10 flex">
        {isQuizMode ? (
          <div className="flex-1 w-full h-full">
            <QuizBattle onExit={() => setIsQuizMode(false)} />
          </div>
        ) : (
          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <KnowledgeGraph 
              graphData={graphData} 
              onNodeClick={setActiveNode} 
              selectedNode={activeNode}
            />
          </div>
        )}
      </div>
      );
};

export default StudyDashboard;