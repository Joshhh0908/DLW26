import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Layers, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Bell, 
  User, 
  UploadCloud, 
  Network, 
  Swords, 
  LogOut,
  Loader2 // <-- Added a loading spinner icon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference to our hidden file input
  
  const [username, setUsername] = useState('Student');
  const [greeting, setGreeting] = useState('Good evening');
  
  // New States for Drag & Drop
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  // --- DRAG AND DROP LOGIC ---

  const handleDragOver = (e) => {
    e.preventDefault(); // Prevents the browser from opening the PDF in a new tab
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

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
    <div className="flex h-screen bg-[#F4F7FB] font-sans">
      
      {/* --- LEFT SIDEBAR (Unchanged) --- */}
      <div className="w-64 bg-white/60 backdrop-blur-xl border-r border-gray-100 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Layers className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-800">StudyFetch</span>
          </div>

          <nav className="space-y-2">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium transition-colors">
              <Home className="w-5 h-5" />
              Home
            </button>
            <div className="pt-4 pb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">Locked Features</span>
            </div>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-500 cursor-not-allowed transition-colors" title="Upload a document to unlock">
              <Layers className="w-5 h-5 opacity-50" />
              My Sets
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-500 cursor-not-allowed transition-colors" title="Upload a document to unlock">
              <Calendar className="w-5 h-5 opacity-50" />
              Study Plan
            </button>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-gray-500 cursor-not-allowed transition-colors" title="Upload a document to unlock">
              <MessageSquare className="w-5 h-5 opacity-50" />
              Chat
            </button>
          </nav>
        </div>
        <div className="p-6 space-y-2">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-tr from-[#F4F7FB] via-white to-[#FFF4E5]">
        
        <div className="absolute top-6 right-8 flex items-center gap-4 z-10">
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-400 rounded-full"></span>
          </button>
          <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-gray-500 font-bold">
            {username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-12 max-w-5xl mx-auto w-full">
          
          <div className="w-full flex items-end justify-between mb-8">
            <h1 className="text-5xl font-extrabold text-[#A67B5B] tracking-tight">
              {greeting}, {username}!
            </h1>
          </div>

          <div className="flex items-center w-full gap-8">
            <div className="hidden md:flex flex-col items-center justify-center w-32 h-40 bg-white/50 backdrop-blur-sm rounded-2xl border border-white shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <User className="w-8 h-8 text-blue-500" />
               </div>
               <span className="text-sm font-semibold text-gray-600">Ready to Learn?</span>
            </div>

            {/* --- HIDDEN FILE INPUT --- */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              multiple 
              accept=".pdf,.txt,.doc,.docx" // Add or remove file types as needed
            />

            {/* --- INTERACTIVE DROPZONE --- */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current.click()} // Opens the file browser
              className={`flex-1 backdrop-blur-md border-4 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center text-center transition-all shadow-lg 
                ${isDragging 
                  ? 'border-blue-500 bg-blue-50 scale-[1.02]' // Highlight when dragging over
                  : 'border-gray-300 bg-white/80 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer group'
                }
                ${isUploading ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {isUploading ? (
                // Loading State
                <div className="flex flex-col items-center animate-pulse">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing your notes...</h2>
                  <p className="text-xl text-gray-500">Generating knowledge graph</p>
                </div>
              ) : (
                // Normal State
                <>
                  <div className={`w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 transition-transform ${!isDragging && 'group-hover:scale-110'}`}>
                    <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-blue-600' : 'text-blue-400'}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {isDragging ? 'Drop your files here!' : 'Drag & drop your lecture slides or PDFs here,'}
                  </h2>
                  <p className="text-xl text-gray-500">
                    {isDragging ? 'We will take it from here.' : (
                      <>or <span className="text-blue-500 font-semibold underline decoration-2 underline-offset-4">click to browse</span>.</>
                    )}
                  </p>
                </>
              )}
            </div>

          </div>

          <div className="mt-16 flex items-center justify-center gap-12 text-gray-600 font-medium">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-orange-600" />
              </div>
              <span><span className="text-xs font-bold text-orange-500 mr-1">1</span> Upload Notes</span>
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Network className="w-6 h-6 text-blue-600" />
              </div>
              <span><span className="text-xs font-bold text-blue-500 mr-1">2</span> Generate Knowledge Map</span>
            </div>
            <div className="w-16 h-px bg-gray-300"></div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Swords className="w-6 h-6 text-purple-600" />
              </div>
              <span><span className="text-xs font-bold text-purple-500 mr-1">3</span> Battle Concepts</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomePage;