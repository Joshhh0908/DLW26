import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KnowledgeGraph from './KnowledgeGraph';
import DocumentViewer from './DocumentViewer';

const mockGraphData = {
  nodes: [
    { id: 'Machine Learning', type: 'original', text: 'Study of algorithms that learn from data.' },
    { id: 'Neural Networks', type: 'added_info', text: 'Computing systems inspired by biological brains.' },
    { id: 'Human Brain', type: 'analogy', text: 'Like a neural network, it processes signals.' }
  ],
  links: [
    { source: 'Machine Learning', target: 'Neural Networks', relation: 'precedence' },
    { source: 'Neural Networks', target: 'Human Brain', relation: 'analogy' },
    { source: 'Machine Learning', target: 'Human Brain', relation: 'related' }
  ]
};

const StudyDashboard = () => {
  const [activeNode, setActiveNode] = useState(null);
  const navigate = useNavigate();

  const handleEntitySelect = (nodeOrString) => {
    const nodeId = typeof nodeOrString === 'string' ? nodeOrString : nodeOrString.id;
    const fullNodeData = mockGraphData.nodes.find(n => n.id === nodeId);
    if (fullNodeData) setActiveNode(fullNodeData);
  };

  return (
    <div className="flex h-screen bg-gray-100 p-4 gap-4">
      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/home')} className="px-4 py-2 bg-white border rounded shadow-sm hover:bg-gray-50 text-sm font-medium">
            &larr; Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold">Knowledge Map</h2>
        </div>
        
        <KnowledgeGraph 
           graphData={mockGraphData} 
           onNodeClick={handleEntitySelect} 
        />
        
        <h2 className="text-2xl font-bold mt-4">Source Document</h2>
        <DocumentViewer 
           text="Machine Learning is the study of algorithms that learn from data. It forms the basis of Neural Networks, which function similarly to the Human Brain."
           searchWords={mockGraphData.nodes.map(n => n.id)}
           onWordClick={handleEntitySelect}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-sm border">
        {activeNode ? (
          <div>
            <h3 className="text-xl font-bold mb-2">{activeNode.id}</h3>
            <span className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full uppercase tracking-wider">
              {activeNode.type.replace('_', ' ')}
            </span>
            
            <div className="mt-6">
              <h4 className="font-semibold text-gray-700 border-b pb-1">Context</h4>
              <p className="mt-2 text-gray-600">{activeNode.text}</p>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-100">
              <h4 className="font-semibold text-blue-800">Knowledge Check</h4>
              <p className="text-sm mt-2 text-blue-900">
                Can you explain how <strong>{activeNode.id}</strong> applies to a real-world scenario?
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Click a node or highlighted word to review.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyDashboard;