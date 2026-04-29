import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2, AlertCircle, Building2, CreditCard, Landmark } from 'lucide-react';

const ManualUpload = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState(null);
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!['csv', 'pdf'].includes(fileExtension)) {
      setError('Please upload a CSV or PDF file');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('statement', file);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/reconciliation/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      
      setUploaded(true);
      
      if (onUploadComplete && data.detectedSubscriptions && data.detectedSubscriptions.length > 0) {
        onUploadComplete(data.detectedSubscriptions);
        alert(`? Found ${data.detectedSubscriptions.length} new subscriptions!`);
      } else if (data.detectedCount > 0) {
        alert(`? Processed! Found ${data.detectedCount} potential subscriptions.`);
      } else {
        alert('File processed. No recurring subscriptions detected.');
      }
      
      setTimeout(() => setUploaded(false), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload statement. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };
  
  return (
    <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant transition-all hover:border-primary/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <Upload className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-on-surface text-lg">Manual Statement Upload</h3>
          <p className="text-sm text-on-surface-variant">
            Upload CSV or PDF bank statements
          </p>
        </div>
      </div>
      
      <div className="border-t border-outline-variant my-4"></div>
      
      <div className="space-y-3 mb-5">
        <p className="text-on-surface-variant text-sm">
          Upload your bank statement to detect subscriptions:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-on-surface-variant ml-2">
          <li>Supports CSV and PDF formats</li>
          <li>Maximum file size: 10MB</li>
          <li>Automatically detects recurring transactions</li>
          <li>Identifies potential subscriptions</li>
        </ul>
      </div>
      
      <label className={`block w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
        uploaded ? 'border-green-500 bg-green-500/10' : 
        error ? 'border-red-500 bg-red-500/10' :
        'border-outline-variant hover:border-primary/50 hover:bg-primary/5'
      }`}>
        <input
          type="file"
          accept=".csv,.pdf,text/csv,application/pdf"
          onChange={handleFileUpload}
          className="hidden"
          disabled={uploading}
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-on-surface-variant">Processing your statement...</span>
            <span className="text-xs text-on-surface-variant">This may take a few seconds</span>
          </div>
        ) : uploaded ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <span className="text-green-500 font-medium">Upload Complete!</span>
            <span className="text-xs text-green-500/70">Detecting subscriptions...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <span className="text-red-500 font-medium">{error}</span>
          </div>
        ) : (
          <>
            <FileText className="w-10 h-10 mx-auto mb-2 text-on-surface-variant opacity-50" />
            <p className="text-on-surface-variant font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              CSV or PDF (Max 10MB)
            </p>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> Chase</span>
              <span className="flex items-center gap-1"><Landmark className="w-3 h-3" /> Bank of America</span>
              <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> Amex</span>
              <span className="flex items-center gap-1">More banks</span>
            </div>
          </>
        )}
      </label>
    </div>
  );
};

export default ManualUpload;

