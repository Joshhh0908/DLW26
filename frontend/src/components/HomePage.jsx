import React, { useState } from 'react';
import { 
  Home, Layers, Calendar, Settings, 
  UploadCloud, FileText, Link as LinkIcon, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);

  // Simple drag-and-drop handlers for visual feedback
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  // --- API UPLOAD LOGIC ---

  const uploadFiles = async (files) => {
    setIsUploading(true);

    // Create a FormData object (This is how browsers send files to servers)
    const formData = new FormData();
    formData.append('username', username);
    
    // Your teammate's code looks for a list of files called "notes"
    Array.from(files).forEach((file) => {
      formData.append('notes', file);
    });

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/notes-uploading', {
        method: 'POST',
        headers: {
          // We MUST send the token, or the @token_required route will block us
          'Authorization': `Bearer ${token}` 
          // Note: Do NOT set 'Content-Type' manually when sending FormData!
        },
        body: formData
      });

      if (response.ok) {
        // Success! Send the user to the study dashboard to see their graph
        navigate('/study'); 
      } else {
        alert("There was a problem uploading your files. Please try again.");
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Could not connect to the backend server. Is Flask running?");
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#060B14] font-sans text-white overflow-hidden relative selection:bg-blue-500/30">
      
      {/* --- SUBTLE BLUE GRID BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.07) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }}></div>

      {/* --- LEFT SIDEBAR (Standardized across app) --- */}
      <div className="absolute top-0 left-0 w-64 h-full bg-[#0B1120] border-r border-gray-800/50 flex flex-col justify-between z-30 shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-white tracking-wide">StudyFetch</span>
          </div>

          <nav className="space-y-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl font-medium border border-blue-500/20 transition-all shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]">
              <Home className="w-5 h-5" /> Home
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Layers className="w-5 h-5" /> My Sets
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <Calendar className="w-5 h-5" /> Study Plan
            </button>
          </nav>
        </div>

        <div className="p-6">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Settings className="w-5 h-5" /> Settings
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA (The Dropzone) --- */}
      <div className="absolute top-0 right-0 bottom-0 left-64 overflow-y-auto z-10 flex flex-col items-center justify-center p-10">
        
        <div className="max-w-3xl w-full flex flex-col items-center">
          
          {/* Header Text */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-6 border border-blue-500/20">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-4">
              What are we learning today?
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Upload your course materials, and our AI will generate an interactive Knowledge Map and Quiz Battle to test your retention.
            </p>
          </div>

          {/* Massive Dropzone Area */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-full rounded-[32px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-16 cursor-pointer group shadow-2xl
              ${isDragging 
                ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
                : 'border-gray-600 bg-[#0B1120]/60 backdrop-blur-md hover:border-blue-400 hover:bg-[#0B1120]/90'
              }
            `}
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-300
              ${isDragging ? 'bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)]' : 'bg-gray-800 group-hover:bg-blue-600 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'}
            `}>
              <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Drag & Drop your files here</h3>
            <p className="text-gray-500 mb-8 font-medium">Supports PDF, DOCX, PPTX, and TXT (Max 50MB)</p>
            
            <button className="bg-white text-gray-900 hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition-colors shadow-lg">
              Browse Files
            </button>
          </div>

          {/* Alternative Input Methods */}
          <div className="grid grid-cols-2 gap-6 w-full mt-8">
            <button className="bg-[#0B1120]/60 hover:bg-[#0B1120] border border-gray-700 hover:border-blue-500/50 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 transition-all group">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white">Paste Text</h4>
                <p className="text-sm text-gray-500">Copy & paste notes directly</p>
              </div>
            </button>

            <button className="bg-[#0B1120]/60 hover:bg-[#0B1120] border border-gray-700 hover:border-red-500/50 backdrop-blur-md p-6 rounded-2xl flex items-center gap-4 transition-all group">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500/20">
                <LinkIcon className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white">Link a Video</h4>
                <p className="text-sm text-gray-500">Paste a YouTube URL</p>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;