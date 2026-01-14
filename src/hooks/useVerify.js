import { useState, useRef, useCallback } from 'react';
import { getMetadataFromPdf } from '@/services/certificateService';

export const useVerify = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [certificateId, setCertificateId] = useState('');
  const [combinedPdfFile, setCombinedPdfFile] = useState(null);
  const [combinedId, setCombinedId] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState(null);
  
  const fileInputRef = useRef(null);
  const combinedFileInputRef = useRef(null);

  /**
   * Calculate SHA-256 hash from PDF file
   */
  const calculateFileHash = useCallback(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }, []);

  /**
   * Handle PDF file selection
   */
  const handlePdfFile = useCallback(async (file) => {
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File quá lớn. Kích thước tối đa là 10MB');
      }
      setPdfFile(file);
    } else {
      throw new Error('Vui lòng chọn file PDF');
    }
  }, []);

  const handlePdfFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        handlePdfFile(file);
      } catch (err) {
        alert(err.message);
      }
    }
  }, [handlePdfFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        handlePdfFile(file);
      } catch (err) {
        alert(err.message);
      }
    }
  }, [handlePdfFile]);

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handle PDF file for combined method
   */
  const handleCombinedPdfFile = useCallback(async (file) => {
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File quá lớn. Kích thước tối đa là 10MB');
      }
      setCombinedPdfFile(file);
    } else {
      throw new Error('Vui lòng chọn file PDF');
    }
  }, []);

  const handleCombinedFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        handleCombinedPdfFile(file);
      } catch (err) {
        alert(err.message);
      }
    }
  }, [handleCombinedPdfFile]);

  const handleClickCombinedUpload = useCallback(() => {
    combinedFileInputRef.current?.click();
  }, []);

  /**
   * Verify by certificate ID
   */
  const handleVerifyId = useCallback(async () => {
    if (!certificateId.trim()) {
      alert('Vui lòng nhập mã chứng chỉ');
      return;
    }

    setIsVerifying(true);
    try {
      console.log('Certificate ID:', certificateId);
      // TODO: Call API to verify with certificate ID
      setTimeout(() => {
        setIsVerifying(false);
        alert(`Tìm kiếm chứng chỉ: ${certificateId}`);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi xác thực');
      setIsVerifying(false);
    }
  }, [certificateId]);

  /**
   * Verify with combined method (PDF + ID)
   */
  const handleVerifyCombined = useCallback(async () => {
    if (!pdfFile || !combinedId.trim()) {
      alert('Vui lòng chọn file PDF và nhập mã chứng chỉ');
      return;
    }

    setIsVerifying(true);
    setVerifyResult(null);
    setVerifyError(null);

    try {
      const metadata = await getMetadataFromPdf(pdfFile, combinedId);
      console.log('API Response:', metadata);
      
      setVerifyResult({
        fileHash: metadata.fileHash,
        metaJson: metadata.metaJson,
        certificateId: combinedId,
        fileName: pdfFile.name
      });
    } catch (error) {
      console.error('Verify error:', error);
      setVerifyError(error.message);
      alert(`❌ Lỗi: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  }, [pdfFile, combinedId]);

  /**
   * Format file size
   */
  const formatFileSize = useCallback((bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }, []);

  /**
   * Reset all verify state
   */
  const resetVerify = useCallback(() => {
    setPdfFile(null);
    setCertificateId('');
    setCombinedPdfFile(null);
    setCombinedId('');
    setVerifyResult(null);
    setVerifyError(null);
    setIsDragging(false);
  }, []);

  return {
    // PDF upload states
    pdfFile,
    setPdfFile,
    fileInputRef,
    handlePdfFileSelect,
    
    // Certificate ID state
    certificateId,
    setCertificateId,
    handleVerifyId,
    
    // Combined method states
    combinedPdfFile,
    setCombinedPdfFile,
    combinedId,
    setCombinedId,
    combinedFileInputRef,
    handleCombinedFileSelect,
    
    // Drag & drop states
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClickUpload,
    handleClickCombinedUpload,
    
    // Verify states
    isVerifying,
    verifyResult,
    verifyError,
    
    // Handlers
    handleVerifyCombined,
    
    // Utilities
    formatFileSize,
    calculateFileHash,
    resetVerify
  };
};

export default useVerify;
