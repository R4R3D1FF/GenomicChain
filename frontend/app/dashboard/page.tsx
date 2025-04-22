'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiDownload, FiUsers, FiFile, FiLock, FiUnlock, FiActivity, FiBarChart2, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';
import UploadModal from '@/components/UploadModal';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {notify} from "../../utils/popups";
import {connectWallet} from "../../utils/wallet";


const mockData = {
  totalFiles: 12,
  totalSize: '2.4 GB',
  accessRequests: 3,
  recentActivity: [
    { id: 1, type: 'upload', file: 'genome_sequence_v2.fasta', date: '2 hours ago', user: 'You' },
    { id: 2, type: 'access_granted', file: 'genome_sequence_v1.fasta', date: '1 day ago', user: 'Dr. Sarah Johnson' },
    { id: 3, type: 'download', file: 'genome_sequence_v1.fasta', date: '1 day ago', user: 'Dr. Sarah Johnson' },
    { id: 4, type: 'access_revoked', file: 'proteomics_data.xlsx', date: '3 days ago', user: 'Medical Research Lab' },
  ],
  storedFiles: [
    { id: 1, name: 'genome_sequence_v2.fasta', size: '1.2 GB', date: '2 hours ago', access: 'Private', type: 'Genome Sequence' },
    { id: 2, name: 'genome_sequence_v1.fasta', size: '1.1 GB', date: '10/15/2023', access: 'Shared (2)', type: 'Genome Sequence' },
    { id: 3, name: 'proteomics_data.xlsx', size: '45 MB', date: '09/28/2023', access: 'Private', type: 'Proteomics Data' },
    { id: 4, name: 'medical_history.pdf', size: '12 MB', date: '08/05/2023', access: 'Shared (1)', type: 'Medical Records' },
  ]
};
// const mockData = {
//   totalFiles: 12,
//   totalSize: '2.4 GB',
//   accessRequests: 3,
//   recentActivity: [
//     { id: 1, type: 'upload', file: 'genome_sequence_v2.fasta', date: '2 hours ago', user: 'You' },
//     { id: 2, type: 'access_granted', file: 'genome_sequence_v1.fasta', date: '1 day ago', user: 'Dr. Sarah Johnson' },
//     { id: 3, type: 'download', file: 'genome_sequence_v1.fasta', date: '1 day ago', user: 'Dr. Sarah Johnson' },
//     { id: 4, type: 'access_revoked', file: 'proteomics_data.xlsx', date: '3 days ago', user: 'Medical Research Lab' },
//   ],
//   storedFiles: [
//     { id: 1, name: 'genome_sequence_v2.fasta', size: '1.2 GB', date: '2 hours ago', access: 'Private', type: 'Genome Sequence' },
//     { id: 2, name: 'genome_sequence_v1.fasta', size: '1.1 GB', date: '10/15/2023', access: 'Shared (2)', type: 'Genome Sequence' },
//     { id: 3, name: 'proteomics_data.xlsx', size: '45 MB', date: '09/28/2023', access: 'Private', type: 'Proteomics Data' },
//     { id: 4, name: 'medical_history.pdf', size: '12 MB', date: '08/05/2023', access: 'Shared (1)', type: 'Medical Records' },
//   ]
// };

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('files');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnect = async () => {
    const wallet = await connectWallet();
    if (wallet) {
        setWalletAddress(wallet.address);
        notify("Wallet connected");
    }
};
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
      
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
              className="dna-button flex items-center space-x-2 py-2 px-4 rounded-md"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <FiUpload className="w-4 h-4" />
              <span>Upload DNA Data</span>
            </button>
            {!walletAddress && <button
                onClick={handleConnect}
                className="dna-button flex items-center space-x-2 py-2 px-4 rounded-md"
            >
                Connect Wallet
            </button>}
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{mockData.totalFiles}</h3>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Size: <span className="font-medium text-gray-700 dark:text-gray-300">{mockData.totalSize}</span>
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
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{mockData.accessRequests}</h3>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Link href="/access-control" className="text-dna-green hover:underline">Review and respond →</Link>
              </p>
            </div>
          </motion.div>
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
            <button
              onClick={() => setActiveTab('recent')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'recent'
                  ? 'border-dna-blue text-dna-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Recent Activity
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-dna-blue text-dna-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Analytics
            </button>
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
                  {/* <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-blue">
                    Filter
                  </button>
                  <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-blue">
                    Sort
                  </button> */}
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
                    {mockData.storedFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{file.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{file.size}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">{file.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            file.access.includes('Private') 
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' 
                              : 'bg-dna-green/10 text-dna-green dark:bg-dna-green/20'
                          }`}>
                            {file.access.includes('Private') ? (
                              <FiLock className="mr-1 w-3 h-3" />
                            ) : (
                              <FiUsers className="mr-1 w-3 h-3" />
                            )}
                            {file.access}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button className="text-dna-blue hover:text-dna-blue-dark" title="Download">
                              <FiDownload className="w-4 h-4" />
                            </button>
                            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                              {file.access.includes('Private') ? (
                                <FiUnlock className="w-4 h-4" />
                              ) : (
                                <FiLock className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-medium">{mockData.storedFiles.length}</span> of <span className="font-medium">{mockData.totalFiles}</span> files
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'recent' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockData.recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 flex items-start">
                    <div className={`p-2 rounded-full mr-4 ${
                      activity.type === 'upload' ? 'bg-dna-blue/10 text-dna-blue' :
                      activity.type === 'download' ? 'bg-dna-green/10 text-dna-green' :
                      activity.type === 'access_granted' ? 'bg-dna-yellow/10 text-dna-yellow' :
                      'bg-dna-red/10 text-dna-red'
                    }`}>
                      {activity.type === 'upload' ? <FiUpload className="w-5 h-5" /> :
                       activity.type === 'download' ? <FiDownload className="w-5 h-5" /> :
                       activity.type === 'access_granted' ? <FiUnlock className="w-5 h-5" /> :
                       <FiLock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        {activity.type === 'upload' ? 'uploaded' :
                         activity.type === 'download' ? 'downloaded' :
                         activity.type === 'access_granted' ? 'was granted access to' :
                         'was revoked access from'}
                        {' '}
                        <span className="font-medium">{activity.file}</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.date}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                      <span className="sr-only">View details</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/transactions" className="text-dna-blue hover:underline text-sm font-medium">
                  View all activity →
                </Link>
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Usage Analytics</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-12">
                  <FiBarChart2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Analytics Dashboard Coming Soon</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                    We're building a comprehensive analytics dashboard to give you insights into your DNA data usage patterns.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Notification Panel */}
        <motion.div 
          className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 flex items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full mr-4">
            <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
          </div>
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-500">Backup Security Key</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
              You haven't backed up your security key yet. This key is essential for recovering access to your encrypted DNA data.
            </p>
            <button className="mt-2 text-sm font-medium text-yellow-800 dark:text-yellow-500 hover:underline">
              Backup Now
            </button>
          </div>
        </motion.div>
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