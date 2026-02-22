import React, { useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileProcess, isProcessing }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileType = file.name.split('.').pop().toLowerCase();
    if (!['txt', 'html', 'xml'].includes(fileType)) {
      alert('Please upload a TXT, HTML, or XML file');
      return;
    }
    
    onFileProcess(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      fileInputRef.current.files = event.dataTransfer.files;
      handleFileUpload(event);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div 
      className="upload-area"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".txt,.html,.xml"
        style={{ display: 'none' }}
      />
      
      {isProcessing ? (
        <div className="processing">
          <div className="spinner"></div>
          <p>Processing your anime list...</p>
        </div>
      ) : (
        <>
          <button 
            onClick={() => fileInputRef.current.click()}
            className="upload-button"
            disabled={isProcessing}
          >
            Choose File
          </button>
          
          <p>or drag and drop your file here</p>
          <p className="file-types">Supported formats: TXT, HTML, XML</p>
        </>
      )}
    </div>
  );
};

export default FileUpload;