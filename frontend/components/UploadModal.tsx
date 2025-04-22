'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import {pinata} from '../utils/pinata.js'
import { getContract } from "../utils/getContract";
import { hashCID } from "../utils/generateHash";
import { ethers } from 'ethers';
import { CID } from 'ipfs-http-client';
import { uploadCid } from 'pinata';


interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}


const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  // const [ipfsHash, setIpfsHash] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [Cid, setCid] = useState('');
  const [timeStamp, setTimeStamp] = useState('');
  let ipfsHash:any;

  const uploadToIPFS = async () => {
    try {
        if (!file) {
            throw new Error("No file selected for upload.");
        }
        const upload = await pinata.upload.public.file(file);
        console.log("File uploaded to IPFS:", upload);

        const cid = upload.cid;
        console.log("CID is this:", cid);
        await setCid(cid);
        const hashedCID =await hashCID(cid);

        console.log("before")
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log("after")
        ipfsHash = hashedCID;
        console.log("from function",ipfsHash)

        console.log("CID:", cid);
    } catch (error) {
        console.error("Error uploading to IPFS:", error);
    }
};

const uploadFile = async () => {
  try {
    if (!ipfsHash || !fileName || !fileType) {
      throw new Error("Missing required file information");
    }
    console.log("Getting contract...");
    const contract = await getContract();
    console.log("Contract instance:", contract);
    const paymentAmount = ethers.parseEther("0.1");
    console.log("IPFS Hash:", ipfsHash);
    
    console.log("File details:", { fileName, ipfsHash, Cid, fileType, fileSize, timeStamp });
    const tx = await contract.uploadFile(
      ipfsHash,
      fileName,
      Cid,
      fileType,
      fileSize,
      timeStamp,
      { value: paymentAmount }
    );
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    if (receipt.status === 1) {
      console.log("Transaction successful");
      const data = await contract.getAllFiles();
      console.log("All files:", data);
      return true;
    } else {
      throw new Error("Transaction failed");
    }
  } catch (error) {
    console.error("Error during uploadFile:", error);
    throw error;
  }
};

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const selectedFile = files[0];
    // Check file type if needed
    // if (!selectedFile.type.includes('fastq') && !selectedFile.type.includes('fasta')) return;
    setFile(selectedFile);
    setFileSize(selectedFile.size);
    const time = Math.floor(Date.now() / 1000);
    const timeUTC = new Date(time * 1000).toUTCString();
    setTimeStamp(timeUTC);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : Math.round(newProgress);
        });
      }, 300);
      await uploadToIPFS();
      await uploadFile();
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploaded(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploaded(false);
  };

  const handleClose = () => {
    resetUpload();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Upload DNA Data
              </h2>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {!isUploaded ? (
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Securely upload your genomic data files. We support various formats including FASTQ, FASTA, VCF, BAM and more.
                  </p>
                  <div className="mb-6 space-y-4">
                  <div>
                    <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      File Name
                    </label>
                    <input
                      type="text"
                      id="fileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="Enter a name for your file"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-dna-blue focus:border-dna-blue dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      File Type
                    </label>
                    <select
                      id="fileType"
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-dna-blue focus:border-dna-blue dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a file type</option>
                      <option value="medical-records">Medical Records</option>
                      <option value="genomic-data">Genomic Data</option>
                      <option value="transcriptomic-data">Transcriptomic Data</option>
                      <option value="proteomic-data">Proteomic Data</option>
                      <option value="epigenomic-data">Epigenomic Data</option>
                      <option value="metabolomic-data">Metabolomic Data</option>
                      <option value="microbiome-data">Microbiome Data</option>
                      <option value="pharmacogenomic-data">Pharmacogenomic Data</option>
                      <option value="forensic-evidence">Forensic Evidence</option>
                      <option value="single-cell-omics">Single-cell Omics</option>
                      <option value="functional-genomics">Functional Genomics</option>
                    </select>
                  </div>
                </div>
                  <div
                    className={`p-6 border-2 border-dashed rounded-lg ${isDragging
                      ? 'border-dna-blue bg-blue-50 dark:bg-blue-900/10' 
                      : 'border-gray-300 dark:border-gray-600'}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center py-6">
                      {!file ? (
                        <>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-16 w-16 text-gray-400 mb-4"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={1.5}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Drag & Drop your DNA file here
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-4">
                            or click to browse your files
                          </p>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="dna-button py-2 px-4 rounded-md text-sm"
                          >
                            Browse Files
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".fastq,.fq,.fasta,.fa,.vcf,.bam"
                          />
                        </>
                      ) : (
                        <div className="w-full">
                          <div className="flex items-center mb-4">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-10 w-10 text-dna-blue mr-4" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={1.5} 
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                              />
                            </svg>
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                {file.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                            <button 
                              onClick={resetUpload}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-5 w-5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M6 18L18 6M6 6l12 12" 
                                />
                              </svg>
                            </button>
                          </div>

                          {isUploading ? (
                            <div className="w-full">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Uploading...
                                </span>
                                <span className="text-sm font-medium text-dna-blue">
                                  {uploadProgress}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-dna-blue to-dna-green h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={handleUpload}
                              className="dna-button py-2 px-4 rounded-md text-sm w-full mt-4"
                            >
                              Upload Now
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Supported File Formats
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <li>FASTQ files (.fastq, .fq)</li>
                      <li>FASTA files (.fasta, .fa)</li>
                      <li>Variant call format (.vcf)</li>
                      <li>Binary alignment map (.bam)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-8 w-8 text-green-600 dark:text-green-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Upload Complete!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Your DNA data has been successfully uploaded to our secure blockchain.
                    You can now manage and control access to your genomic data.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={handleClose}
                      className="dna-button py-2 px-4 rounded-md text-sm"
                    >
                      Close
                    </button>
                    <button
                      onClick={resetUpload}
                      className="bg-transparent text-gray-900 dark:text-white py-2 px-4 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all duration-300 text-sm"
                    >
                      Upload Another File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;