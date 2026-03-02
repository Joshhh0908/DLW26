import React, { useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const KnowledgeGraph = ({ graphData, onNodeClick }) => {
  const fgRef = useRef();

  const getNodeColor = (node) => {
    switch (node.type) {
      case 'original': return '#3b82f6';
      case 'added_info': return '#10b981';
      case 'analogy': return '#f59e0b';
      default: return '#9ca3af';
    }
  };

  const getLinkColor = (link) => {
    switch (link.relation) {
      case 'precedence': return '#ef4444';
      case 'analogy': return '#f59e0b';
      case 'related': return '#cbd5e1';
      default: return '#cbd5e1';
    }
  };

  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeColor={getNodeColor}
        linkColor={getLinkColor}
        nodeLabel="id"
        onNodeClick={onNodeClick}
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1}
        width={800}
        height={500}
      />
    </div>
  );
};

export default KnowledgeGraph;