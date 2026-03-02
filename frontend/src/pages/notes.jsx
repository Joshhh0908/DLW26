// notes.jsx
import "./notes.css";
import { useState } from "react";

const Notes = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    if (!files.length) {
      setStatus("Please select at least one file.");
      return;
    }

    try {
      console.log("Sending fetch request...");

      const formData = new FormData();
      // backend should use request.files.getlist("notes") if Flask
      files.forEach((f) => formData.append("notes", f));

      const token = localStorage.getItem("token");

      const res = await fetch("/api/upload-notes", {
        method: "POST",
        // DO NOT set Content-Type for FormData
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      // backend might return json or text
      const data = await res.json();

      console.log("UPLOAD STATUS:", res.status);
      console.log("UPLOAD RESPONSE:", data); // <-- shows your huge array in DevTools

      if (res.ok) {
        setStatus("Upload successful!");
        setFiles([]);
        console.log("Server response:", data);
      } else {
        // if json error shape is {error: "..."}
        const msg =
          (typeof data === "object" && data?.error) ||
          (typeof data === "string" && data) ||
          "Upload failed.";
        setStatus(msg);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setStatus("Server error.");
    }
  };

  return (
    <div className="notes-page">
      <div className="notes-card">
        <h2>Upload Notes</h2>

        <form onSubmit={handleSubmit}>
          <input type="file" multiple onChange={handleFileChange} />

          {files.length > 0 && (
            <div className="file-list">
              {files.map((f) => (
                <div className="file-item" key={`${f.name}-${f.lastModified}`}>
                  <span className="file-name">{f.name}</span>
                  <span className="file-size">
                    ({Math.ceil(f.size / 1024)} KB)
                  </span>
                </div>
              ))}
            </div>
          )}

          <button type="submit">Upload</button>
        </form>

        {status && <div className="notes-status">{status}</div>}
      </div>
    </div>
  );
};

export default Notes;