import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import KnowledgeGraph from './KnowledgeGraph';
import { X } from 'lucide-react';
import QuizBattle from './QuizBattle';

function generateLeftToRightLayout(nodes, links) {
  if (!nodes?.length) return [];

  const nodeIds = nodes.map(n => n.id);
  const idToNode = new Map(nodes.map(n => [n.id, { ...n }]));

  const indegree = new Map(nodeIds.map(id => [id, 0]));
  const adj = new Map(nodeIds.map(id => [id, []]));

  for (const { source, target } of (links || [])) {
    if (!indegree.has(source) || !indegree.has(target)) continue;
    adj.get(source).push(target);
    indegree.set(target, indegree.get(target) + 1);
  }

  const level = new Map(nodeIds.map(id => [id, 0]));
  const queue = [];

  for (const [id, deg] of indegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  if (queue.length === 0) queue.push(...nodeIds);

  while (queue.length) {
    const u = queue.shift();
    for (const v of adj.get(u) || []) {
      level.set(v, Math.max(level.get(v), level.get(u) + 1));
      indegree.set(v, indegree.get(v) - 1);
      if (indegree.get(v) === 0) queue.push(v);
    }
  }

  const layers = new Map();
  for (const id of nodeIds) {
    const L = level.get(id) ?? 0;
    if (!layers.has(L)) layers.set(L, []);
    layers.get(L).push(id);
  }

  const numLayers = layers.size;
  const maxLayerSize = Math.max(...Array.from(layers.values()).map(a => a.length));

  const availableW = window.innerWidth - 256 - 80;
  const availableH = window.innerHeight - 120;

  const xSpacing = Math.max(220, availableW / Math.max(numLayers - 1, 1));
  const ySpacing = Math.max(170, availableH / Math.max(maxLayerSize - 1, 1));

  const startX = 140;
  const startY = 120;

  for (const [L, ids] of layers.entries()) {
    ids.sort();
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
  const location = useLocation();

  const [isQuizMode, setIsQuizMode] = useState(location.state?.startInQuizMode || false);
  const [graphData, setGraphData] = useState(null);
  const [popupContent, setPopupContent] = useState(null);
  const popupRef = useRef(null);

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

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupContent(null);
      }
    }

    if (popupContent) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupContent]);

  if (!graphData) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#060B14] text-white">
        <h2 className="text-xl font-bold">No Study Set Selected</h2>
      </div>
    );
  }

  const openPopup = (event, title, summary) => {
    const popupWidth = 420;
    const popupHeight = 300;

    let x = event.clientX + 15;
    let y = event.clientY + 15;

    if (x + popupWidth > window.innerWidth) {
      x = window.innerWidth - popupWidth - 20;
    }

    if (y + popupHeight > window.innerHeight) {
      y = window.innerHeight - popupHeight - 20;
    }

    setPopupContent({
      title,
      summary,
      x,
      y
    });
  };

  return (
    <div className="absolute inset-0 overflow-auto z-10 flex">
      {isQuizMode ? (
        <div className="flex-1 w-full h-full">
          <QuizBattle onExit={() => setIsQuizMode(false)} />
        </div>
      ) : (
        <div className="flex-1 overflow-auto relative">
          <div style={{ width: 3000, height: 2000, position: "relative" }}>
            <KnowledgeGraph
              graphData={graphData}
              onNodeClick={(node, event) => {
                openPopup(event, node.id, node.summary);
              }}
              onLinkClick={(link, event) => {
                openPopup(
                  event,
                  `${link.source} → ${link.target}`,
                  `${link.target} is related to ${link.source} because ${link.target} is derived from ${link.source}.`
                );
              }}
              disablePan
            />
          </div>

          {popupContent && (
            <div
              ref={popupRef}
              className="fixed bg-[#0F172A] text-white p-6 rounded-xl shadow-2xl border border-slate-600 w-[420px] max-h-[300px] overflow-y-auto z-50"
              style={{
                left: popupContent.x,
                top: popupContent.y
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">{popupContent.title}</h3>
                <button
                  onClick={() => setPopupContent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-sm text-gray-300 text-justify leading-relaxed">
                {popupContent.summary || "No summary available."}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyDashboard;  