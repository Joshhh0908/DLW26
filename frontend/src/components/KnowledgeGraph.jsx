import React, { useState, useRef } from 'react';

const KnowledgeGraph = ({ graphData, onNodeClick, selectedNode }) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (!graphData || !graphData.nodes) {
    return <div className="text-white p-10">Loading graph data...</div>;
  }

  const handleMouseDown = (e) => {
    if (e.target.id === 'canvas-container') {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const getNodeStyles = (type) => {
    switch(type) {
      case 'original': return { color: 'orange', shadow: 'rgba(249,115,22,0.5)', glow: 'border-orange-500' };
      case 'added_info': return { color: 'blue', shadow: 'rgba(59,130,246,0.5)', glow: 'border-blue-500' };
      case 'analogy': return { color: 'yellow', shadow: 'rgba(234,179,8,0.5)', glow: 'border-yellow-400' };
      default: return { color: 'purple', shadow: 'rgba(168,85,247,0.5)', glow: 'border-purple-500' };
    }
  };

  return (
    <div 
      id="canvas-container"
      // Bulletproof CSS sizing
      className={`absolute inset-0 w-full h-full overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        backgroundPosition: `${pan.x}px ${pan.y}px`
      }}
    >
      {/* The pannable layer */}
      <div className="absolute inset-0 w-full h-full transform-gpu transition-transform duration-75 ease-out" style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
        
        {/* SVG Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
            </marker>
          </defs>
          {graphData.links?.map((link, i) => {
            const fromNode = graphData.nodes.find(n => n.id === link.source);
            const toNode = graphData.nodes.find(n => n.id === link.target);
            if (!fromNode || !toNode) return null;
            return (
              <line key={i} x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke="#3B82F6" strokeWidth="3" strokeOpacity="0.6" markerEnd="url(#arrowhead)" className="animate-pulse" />
            );
          })}
        </svg>

        {/* HTML Nodes */}
        {graphData.nodes?.map((node) => {
          const styles = getNodeStyles(node.type);
          return (
            <div
              key={node.id}
              onClick={() => onNodeClick(node)}
              className={`absolute w-36 h-36 rounded-full border-[3px] bg-[#0B1120] flex items-center justify-center text-center cursor-pointer transition-all duration-300
                ${styles.glow} ${selectedNode?.id === node.id ? 'scale-110 z-20' : 'hover:scale-105 z-10'}
              `}
              style={{
                left: node.x,
                top: node.y,
                boxShadow: `0 0 25px ${styles.shadow}, inset 0 0 15px ${styles.shadow}`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <span className="font-bold text-sm text-white tracking-wide px-4 drop-shadow-md">
                {node.id}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KnowledgeGraph;