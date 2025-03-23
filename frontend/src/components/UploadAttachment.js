import React, { useState } from "react";

const UploadAttachment = ({ onUpload, taskId }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setError("⚠️ No file selected.");
      setSuccess(null);
      return;
    }

    console.log("🔍 Debug - Current Task ID:", taskId); // Debugging

    if (!taskId) {
      window.alert("⚠️ Please create a task before uploading files.");
      setError("⚠️ Task must be created before uploading.");
      setSuccess(null);
      return;
    }

    // ✅ Validate file type (PNG, JPEG, PDF only)
    const validTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setError("❌ Only PNG, JPEG, and PDF files are allowed.");
      setSuccess(null);
      return;
    }

    // ✅ Clear previous messages and start uploading
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await onUpload(file, taskId); // Call the upload function passed from parent
      setSuccess("✅ File uploaded successfully!");
    } catch (error) {
      setError("❌ Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg w-96">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">📎 Upload Attachment</h2>

      <input
        type="file"
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 
                   file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {/* ✅ Show uploading status */}
      {uploading && <p className="text-blue-600 mt-2">⏳ Uploading...</p>}

      {/* ✅ Show error message */}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* ✅ Show success message */}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
};

export default UploadAttachment;
