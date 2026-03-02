import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import KnowledgeGraph from './KnowledgeGraph';
import { Layers, Home, Calendar, X, Swords, Shield, BookOpen, Search } from 'lucide-react';
import QuizBattle from './QuizBattle';

function generateLeftToRightLayout(nodes, links) {
  if (!nodes?.length) return [];

  const nodeIds = nodes.map(n => n.id);
  const idToNode = new Map(nodes.map(n => [n.id, { ...n }]));

  // Build indegree + adjacency
  const indegree = new Map(nodeIds.map(id => [id, 0]));
  const adj = new Map(nodeIds.map(id => [id, []]));

  for (const { source, target } of (links || [])) {
    if (!indegree.has(source) || !indegree.has(target)) continue;
    adj.get(source).push(target);
    indegree.set(target, indegree.get(target) + 1);
  }

  // Kahn topo order + compute "level"
  const level = new Map(nodeIds.map(id => [id, 0]));
  const queue = [];
  for (const [id, deg] of indegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  // if there are cycles or no roots, just treat all as roots
  if (queue.length === 0) queue.push(...nodeIds);

  while (queue.length) {
    const u = queue.shift();
    for (const v of adj.get(u) || []) {
      level.set(v, Math.max(level.get(v), level.get(u) + 1));
      indegree.set(v, indegree.get(v) - 1);
      if (indegree.get(v) === 0) queue.push(v);
    }
  }

  // Group nodes by level
  const layers = new Map();
  for (const id of nodeIds) {
    const L = level.get(id) ?? 0;
    if (!layers.has(L)) layers.set(L, []);
    layers.get(L).push(id);
  }

  const numLayers = layers.size;
  const maxLayerSize = Math.max(...Array.from(layers.values()).map(a => a.length));

  // Assign coordinates
  const availableW = window.innerWidth - 256 - 80; // sidebar + padding
  const availableH = window.innerHeight - 120;      // padding

  const xSpacing = Math.max(220, availableW / Math.max(numLayers - 1, 1));
  const ySpacing = Math.max(170, availableH / Math.max(maxLayerSize - 1, 1));

  const startX = 140;
  const startY = 120;

  // Center each layer vertically relative to the biggest layer

  for (const [L, ids] of layers.entries()) {
    ids.sort(); // stable-ish
    const layerHeight = (ids.length - 1) * ySpacing;
    const totalHeight = (maxLayerSize - 1) * ySpacing;
    const yOffset = (totalHeight - layerHeight) / 2;

    ids.forEach((id, i) => {
      const n = idToNode.get(id);
      n.x = startX + L * xSpacing;
      n.y = startY + yOffset + i * ySpacing;
      idToNode.set(id, n);
    });
  }

  return nodeIds.map(id => idToNode.get(id));
}

const StudyDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeNode, setActiveNode] = useState(null);
  const [isQuizMode, setIsQuizMode] = useState(location.state?.startInQuizMode || false);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    const payload = location.state?.studySet;
    if (!payload) return;

    const rawNodes = (payload.nodes || []).map((n) => ({
      id: n.name,
      type: "original",
      summary: Array.isArray(n.summary) ? n.summary.join(" ") : n.summary,
      equations: n.equations ?? [],
    }));

    const links = (payload.prereq || []).map((e) => ({
      source: e.source,
      target: e.target,
    }));

    const nodesWithCoordinates = generateLeftToRightLayout(rawNodes, links);

    setGraphData({ nodes: nodesWithCoordinates, links });
  }, [location.state]);

  if (!graphData) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#060B14] text-white">
        <h2 className="text-xl font-bold">No Study Set Selected</h2>
      </div>
    );
  }

  return (

      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-auto z-10 flex">
        {isQuizMode ? (
          <div className="flex-1 w-full h-full">
            <QuizBattle onExit={() => setIsQuizMode(false)} />
          </div>
        ) : (
          <div className="flex-1 overflow-auto relative">
            <div style={{ width: 3000, height: 2000, position: "relative" }}>
              <KnowledgeGraph
                graphData={graphData}
                onNodeClick={setActiveNode}
                selectedNode={activeNode}
                disablePan
              />
            </div>
          </div>
        )}
      </div>
      );
};

export default StudyDashboard;