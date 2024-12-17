"use client";
import React, { useState } from 'react';

interface FileUploadProps {
  onFileLoad: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileLoad }) => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => setFileContent(event.target?.result as string);
      reader.onerror = () => setError('Error reading the file');
      reader.readAsText(file);
    } else {
      setError('Invalid file format. Please upload a .txt file.');
      setFileContent(null);
    }
  };

  const handleSubmit = () => {
    if (fileContent) {
        onFileLoad(fileContent);
    } else {
      setError('Please upload a file before submitting.');
    }
  };

  return (
    <div className="p-4">
      <input type="file" accept=".txt" onChange={handleFileChange} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default FileUpload;
