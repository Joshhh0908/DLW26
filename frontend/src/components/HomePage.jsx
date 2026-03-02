import React, { useState, useRef } from 'react';
import { 
  Home, Layers, Calendar, Settings, 
  UploadCloud, FileText, Link as LinkIcon, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

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
        navigate('/study');
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
    <div className="flex h-screen w-screen bg-[#060B14] font-sans text-white overflow-hidden relative selection:bg-blue-500/30">
      
      {/* --- SUBTLE BLUE GRID BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to right, rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.07) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }}></div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.pptx,.txt"
        multiple={false}          // you said 1 PDF for now
        className="hidden"
        onChange={handleFileSelect}
      />
      {/* --- MAIN CONTENT AREA (The Dropzone) --- */}
      <div className="absolute inset-0 overflow-y-auto z-10 flex flex-col items-center justify-center p-10">        
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
                        
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-white text-gray-900 hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition-colors shadow-lg disabled:opacity-60"
            >
              {isUploading ? "Uploading..." : "Browse Files"}
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