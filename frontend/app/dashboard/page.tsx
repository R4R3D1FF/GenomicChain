'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiDownload, FiUsers, FiFile, FiLock, FiUnlock, FiActivity, FiBarChart2, FiAlertTriangle,FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import UploadModal from '@/components/UploadModal';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {notify} from "../../utils/popups";
import {connectWallet} from "../../utils/wallet";
import { getContract } from '@/utils/getContract';

interface FileMetaData {
  owner: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  timestamp: string;
  ipfsHash: string;
}

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [files, setFiles] = useState<FileMetaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileMetaData | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [CID, setCID] = useState<string | null>(null);

  const formatFileSize = (size: string) => {
    try {
      const bytes = BigInt(size);
      if (bytes < BigInt(1024)) return `${bytes} B`;
      if (bytes < BigInt(1024) * BigInt(1024)) return `${Number(bytes) / 1024} KB`;
      if (bytes < BigInt(1024) * BigInt(1024) * BigInt(1024)) return `${Number(bytes) / (1024 * 1024)} MB`;
      return `${Number(bytes) / (1024 * 1024 * 1024)} GB`;
    } catch (e) {
      return size;
    }
  };

  const isOwner = (file: FileMetaData) => {
    return file.owner.toLowerCase() === walletAddress.toLowerCase();
  };

  const handleConnect = async () => {
    const wallet = await connectWallet();
    if (wallet) {
        setWalletAddress(wallet.address);
        notify("Wallet connected");
        console.log("Getting contract...");
        const contract = await getContract();
        setContract(contract);
        console.log("Contract instance:", contract);
    }
  };
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const filesData = await contract.getAllFiles();
      setFiles(filesData);
    } catch (error) {
      console.error("Error fetching files:", error);
      notify("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (file: FileMetaData) => {
    if (!isOwner(file)) {
      notify("You can only download your own files");
      return;
    }
    try {
      setSelectedFile(file);
      console.log("IPFS Hash:", file.ipfsHash);
      setCID(null);
      await getFileCID(file.ipfsHash);
      if (CID) {
        confirmDownload();
      }
    } catch (error) {
      console.error("Download error:", error);
      notify("Error preparing download");
    }
  };

  const getFileCID = async (ipfsHash: string) => {
    try {
      console.log("Fetching CID for hash:", ipfsHash);
      const cid = await contract.getFile(ipfsHash);
      console.log("Retrieved CID:", cid);
      if (cid) {
        setCID(cid);
      } else {
        console.error("Invalid CID received:", cid);
        notify("Invalid file CID received");
      }
    } catch (error: any) {
      console.error("Error getting CID:", error);
      if (error.message && error.message.includes("Access denied")) {
        notify("You don't have access to this file");
      } else {
        notify("Error getting file CID");
      }
    }
  };

  const confirmDownload = () => {
    if (!selectedFile) {
      notify("No file selected");
      return;
    }
    if (!CID) {
      notify("File CID not available - please try again");
      return;
    }
    console.log("Downloading file with CID:", CID);
    const pinataGateway = "https://emerald-acute-goat-495.mypinata.cloud/ipfs/";
    const downloadUrl = `${pinataGateway}${CID}`;
    window.open(downloadUrl, '_blank');
    setSelectedFile(null);
    setCID(null);
  };

  useEffect(() => {
    if (walletAddress && contract) {
      fetchFiles();
    }
  }, [walletAddress, contract]);

  useEffect(() => {
    if (selectedFile && CID) {
      confirmDownload();
    }
  }, [CID, selectedFile]);

  const handleRefresh = async () => {
    if (!walletAddress || !contract) {
      notify("Please connect your wallet first");
      return;
    }

    try {
      setIsRefreshing(true);
      await fetchFiles();
      notify("Files refreshed successfully");
    } catch (error) {
      console.error("Error refreshing files:", error);
      notify("Error refreshing files");
    } finally {
      setIsRefreshing(false);
    }
  };

return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
    <UploadModal
      isOpen={isUploadModalOpen}
      onClose={() => setIsUploadModalOpen(false)}
      onUploadSuccess={() => fetchFiles()}
    />

    {selectedFile && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-medium mb-4">Download File</h3>
          <p>Download {selectedFile.fileName} from Pinata IPFS?</p>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-4 py-2 rounded-md border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmDownload}
              className="px-4 py-2 rounded-md bg-dna-blue text-white"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    )}

<div className="container mx-auto px-4 py-8">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your DNA data securely on blockchain</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={handleRefresh}
              className="dna-button flex items-center space-x-2 py-2 px-4 rounded-md"
              disabled={isRefreshing}
            >
              <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Files</span>
            </button>
            <button
              className="dna-button flex items-center space-x-2 py-2 px-4 rounded-md"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <FiUpload className="w-4 h-4" />
              <span>Upload DNA Data</span>
            </button>

            {!walletAddress && (
              <button
                onClick={handleConnect}
                className="dna-button flex items-center space-x-2 py-2 px-4 rounded-md"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="dna-card bg-gradient-to-br from-dna-blue/5 to-dna-blue/10 dark:from-dna-blue/10 dark:to-dna-blue/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-dna-blue/20 dark:bg-dna-blue/30 mr-4">
              <FiFile className="w-6 h-6 text-dna-blue" />
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Stored Files</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{files.length}</h3>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Size: <span className="font-medium text-gray-700 dark:text-gray-300">
                {formatFileSize(files.reduce((acc, file) => {
                  try {
                    return acc + BigInt(file.fileSize);
                  } catch {
                    return acc;
                  }
                }, BigInt(0)).toString())}
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div 
            className="dna-card bg-gradient-to-br from-dna-green/5 to-dna-green/10 dark:from-dna-green/10 dark:to-dna-green/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-dna-green/20 dark:bg-dna-green/30 mr-4">
                <FiUsers className="w-6 h-6 text-dna-green" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Access Requests</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{}</h3>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Link href="/access-control" className="text-dna-green hover:underline">Review and respond →</Link>
              </p>
            </div>
          </motion.div>

        {/* ... other stat cards remain the same ... */}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('files')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'files'
                ? 'border-dna-blue text-dna-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            My Files
          </button>
          {/* ... other tabs remain the same ... */}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'files' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stored DNA Data</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchFiles()}
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-blue flex items-center"
                  disabled={loading}
                >
                  <FiRefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Access
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        Connect Wallet
                      </td>
                    </tr>
                  ) : files.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        No files found
                      </td>
                    </tr>
                  ) : (
                    files.map((file, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{file.fileName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{file.fileType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.fileSize)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{file.timestamp}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isOwner(file)
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              : 'bg-dna-green/10 text-dna-green dark:bg-dna-green/20'
                          }`}>
                            {isOwner(file) ? (
                              <FiLock className="mr-1 w-3 h-3" />
                            ) : (
                              <FiUsers className="mr-1 w-3 h-3" />
                            )}
                            {isOwner(file) ? 'Private' : 'Shared'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            {isOwner(file) && (
                              <button
                                onClick={() => handleDownload(file)}
                                className="text-dna-blue hover:text-dna-blue-dark"
                                title="Download"
                              >
                                <FiDownload className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                              {isOwner(file) ? (
                                <FiUnlock className="w-4 h-4" />
                              ) : (
                                <FiLock className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-medium">{files.length}</span> files
              </div>
            </div>
          </div>
        )}
        
        {/* ... other tab contents remain the same ... */}
      </motion.div>
      
      {/* Notification Panel */}
      {/* ... remains the same ... */}
    </div>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Slide}
    />
  </div>
);
};

export default DashboardPage;