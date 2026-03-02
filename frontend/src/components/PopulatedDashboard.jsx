import React, { useState, useRef } from 'react';
import { 
  Home, Layers, Calendar, MessageSquare, Settings, 
  Bell, Flame, Play, Network, Plus, ChevronDown, Sparkles, X, Send,
  UploadCloud, FileText, Link as LinkIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Upload Modal ────────────────────────────────────────────────────────────
const UploadModal = ({ onClose, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) uploadFiles(e.dataTransfer.files);
  };
  const handleFileSelect = (e) => {
    if (e.target.files?.length > 0) uploadFiles(e.target.files);
  };

  const uploadFiles = async (files) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('notes', file));
      const token = localStorage.getItem('token');
      const res = await fetch('/api/upload-notes', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onUploadSuccess(data);
      } else {
        alert(data?.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Could not connect to backend server.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(6, 11, 20, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl bg-[#0B1120] border border-gray-700/60 rounded-[28px] shadow-2xl p-10 flex flex-col items-center">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-4 border border-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">
            Create a New Study Set
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Upload your course materials and our AI will generate an interactive Knowledge Map and Quiz.
          </p>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.pptx,.txt"
          multiple={false}
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full rounded-[20px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-12 cursor-pointer group
            ${isDragging
              ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
              : 'border-gray-600 bg-[#060B14]/60 hover:border-blue-400 hover:bg-[#060B14]'
            }
          `}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300
            ${isDragging ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)]' : 'bg-gray-800 group-hover:bg-blue-600 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'}
          `}>
            <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">Drag & Drop your files here</h3>
          <p className="text-gray-500 text-sm mb-6">Supports PDF, DOCX, PPTX, and TXT (Max 50MB)</p>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            disabled={isUploading}
            className="bg-white text-gray-900 hover:bg-gray-200 px-6 py-2.5 rounded-full font-bold text-sm transition-colors shadow-lg disabled:opacity-60"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Uploading...
              </span>
            ) : "Browse Files"}
          </button>
        </div>

        {/* Alternative inputs */}
        <div className="grid grid-cols-2 gap-4 w-full mt-5">
          <button className="bg-[#060B14]/60 hover:bg-[#060B14] border border-gray-700 hover:border-blue-500/50 p-4 rounded-2xl flex items-center gap-3 transition-all group">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-sm">Paste Text</h4>
              <p className="text-xs text-gray-500">Copy & paste notes directly</p>
            </div>
          </button>

          <button className="bg-[#060B14]/60 hover:bg-[#060B14] border border-gray-700 hover:border-red-500/50 p-4 rounded-2xl flex items-center gap-3 transition-all group">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20 flex-shrink-0">
              <LinkIcon className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white text-sm">Link a Video</h4>
              <p className="text-xs text-gray-500">Paste a YouTube URL</p>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const PopulatedDashboard = ({ studySets: realStudySets, onStudySetsUpdate }) => {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setsToDisplay = realStudySets || [];

  const fetchStudySetGraph = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/study-sets/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return await res.json();
  };

  const handleOpenStudySet = async (set, startQuiz = false) => {
    const data = await fetchStudySetGraph(set.id);
    navigate("/study", {
      state: {
        studySet: data.graph,
        startInQuizMode: startQuiz,
        title: data.title
      }
    });
  };

  const handleOpenKnowledgeGraph = async (set) => {
    const data = await fetchStudySetGraph(set.id);
    navigate("/study", {
      state: {
        studySet: data.graph,
        startInQuizMode: false,
        title: data.title
      }
    });
  };

  // Called when upload succeeds — navigate to the new study set
  const handleUploadSuccess = (data) => {
    setIsModalOpen(false);
    // Optionally refresh the dashboard list
    if (onStudySetsUpdate) onStudySetsUpdate();
    // Navigate directly into the new study set
    navigate("/study", {
      state: {
        studySet: { nodes: data.nodes, prereq: data.prereq, related: data.related },
        startInQuizMode: false,
        title: data.title
      }
    });
  };

  return (
    <div className="flex h-screen bg-[#060B14] font-sans text-white overflow-hidden relative selection:bg-blue-500/30">
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.07) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }}></div>

      {/* Upload Modal */}
      {isModalOpen && (
        <UploadModal
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

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
                    onClick={(e) => { e.stopPropagation(); handleOpenStudySet(set, true); }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#FFEAA7] flex items-center justify-center border-2 border-[#FCD34D]">
                      <Play className="w-6 h-6 text-[#1F2937] ml-1 fill-[#1F2937]" />
                    </div>
                    <span className="text-[13px] font-bold text-[#4B5563]">Quick Quiz</span>
                  </div>

                  <div
                    onClick={(e) => { e.stopPropagation(); handleOpenKnowledgeGraph(set); }}
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

            {/* Create New Set card — now opens modal */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0B1120]/50 border-2 border-dashed border-gray-600 rounded-[20px] p-6 flex flex-col items-center justify-center min-h-[240px] transform transition-all hover:scale-[1.02] hover:border-blue-400 hover:bg-[#0B1120] cursor-pointer group shadow-lg"
            >
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
