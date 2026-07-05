import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet, CheckCircle } from 'lucide-react';
import './CrmStyles.css';

const DataUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [resultMsg, setResultMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    setErrorMsg('');
    setResultMsg('');
    
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const token = localStorage.getItem('crm_token');
      const response = await fetch('http://localhost:5000/api/crm/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // Note: Content-Type is intentionally omitted so browser sets boundary
      });

      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error(`Critical Server HTML Error: ${responseText.slice(0, 80)}`);
      }

      if (response.ok) {
        setResultMsg(data.message);
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploading(false);
    }
  }, []);

  const onDropRejected = useCallback((fileRejections) => {
    if (fileRejections.length > 0) {
      setErrorMsg(`File rejected: ${fileRejections[0].errors[0].message}. Ensure it is a pure .csv or .xlsx file.`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    onDropRejected,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.csv', '.xls'],
      'text/csv': ['.csv'],
      'application/csv': ['.csv']
    },
    maxFiles: 1
  });

  return (
    <div className="crm-container">
      <h3>Bulk Lead Importer</h3>
      <div 
        {...getRootProps()} 
        className={`dropzone-container ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="upload-progress">
            <UploadCloud className="dropzone-icon animate-pulse" />
            <p>Scanning and importing to Database... (Check terminal if stuck)</p>
          </div>
        ) : resultMsg ? (
          <div className="upload-progress">
            <CheckCircle className="dropzone-icon" />
            <p>{resultMsg}</p>
          </div>
        ) : (
          <>
            <FileSpreadsheet className="dropzone-icon" />
            <p className="dropzone-text">
              {isDragActive 
                ? "Drop the Outscraper file exactly here ..." 
                : "Drag & drop your .xlsx or .csv file here, or click to select"}
            </p>
            <span className="dropzone-subtext">Ensures duplicate checking & maps automatically</span>
          </>
        )}
      </div>
      
      {errorMsg && <div className="security-notice" style={{marginTop: '1rem'}}>{errorMsg}</div>}
    </div>
  );
};

export default DataUploader;
