'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiUserCheck, FiUserX, FiSearch, FiFilter, FiPlus, FiCheck, FiX, FiAlertTriangle, FiClock } from 'react-icons/fi';
import { getContract } from '@/utils/getContract';
import Link from 'next/link';

const mockData = {
  pendingRequests: [
    { 
      id: 1, 
      user: { 
        name: 'Dr. Sarah Johnson', 
        organization: 'Medical Research Institute',
      },
      address: '0x1234567890abcdef1234567890abcdef12345678',
      type: 'Researcher',
      date: '2 hours ago',
      files: ['genome_sequence_v1.fasta'],
      purpose: 'Cancer research study on genetic markers',
      duration: '3 months'
    },
    { 
      id: 2, 
      user: { 
        name: 'BioCorp Labs', 
        organization: 'Pharmaceutical Research',
      },
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      type: 'Organization',
      date: '1 day ago',
      files: ['genome_sequence_v1.fasta', 'proteomics_data.xlsx'],
      purpose: 'Drug development for genetic disorders',
      duration: '6 months'
    },
  ],
  activePermissions: [
    { 
      id: 1, 
      user: { 
        name: 'Dr. Michael Rodriguez', 
        organization: 'National Genomics Institute',
      },
      address: '0x7890abcdef1234567890abcdef1234567890abcd',
      type: 'Researcher',
      granted: '01/15/2023',
      expires: '07/15/2023',
      files: ['genome_sequence_v1.fasta'],
      accessLevel: 'Read',
      lastAccessed: '5 days ago'
    },
    { 
      id: 2, 
      user: { 
        name: 'GeneTech Solutions', 
        organization: 'Biotechnology Company',
      },
      address: '0x4567890abcdef1234567890abcdef1234567890ab',
      type: 'Organization',
      granted: '03/10/2023',
      expires: '03/10/2024',
      files: ['proteomics_data.xlsx'],
      accessLevel: 'Read & Analyze',
      lastAccessed: '2 weeks ago'
    },
  ]
};

const AccessControlPage = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [request, setRequest] = useState();

  const registerUser = async (userAddress:any) => {
    const contract = await getContract();
    const regUser=userAddress;
    if (!contract || !regUser )return alert("Enter a valid address");
  
    try {
      console.log("Registering user:", contract);
      // const bytes32Address = addressToBytes32(regUser); // Convert address to bytes32
      console.log("Bytes32 Address:", regUser);
      console.log(contract)
      const tx = await contract.registerUser(regUser); // Pass bytes32 to the contract
      await tx.wait();
      console.log("user registered ", tx);
      alert("User registered successfully!");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const grantAccess = async () => {
    const contract = await getContract();
    // cosnt ipfsHash=Response.ipfsHash 
    // const sharedUser=Response.userAddress 
    try{
      if (!contract || !sharedUser) return alert("Enter a valid address");
      const tx = await contract.grantAccess(ipfsHash, sharedUser);
      await tx.wait();
      alert("Access granted!");
    }catch(error){
      console.error("error from grantAccess:", error);
    }
  };

  const revokeAccess = async () => {
    const contract = await getContract();
    // cosnt ipfsHash=Response.ipfsHash 
    // const sharedUser=Response.userAddress 

    try{
      if (!contract || !sharedUser) return alert("Enter a valid address");
      const tx = await contract.revokeAccess(ipfsHash, sharedUser);
      await tx.wait();
      alert("Access revoked!");
    }catch(error){
      console.error("error from revokeAccess:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Access Control</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage permissions for your genomic data</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="dna-button flex items-center space-x-2">
              <FiPlus className="w-4 h-4" />
              <span>Grant New Access</span>
            </button>
          </div>
        </motion.div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="dna-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-dna-blue/10 dark:bg-dna-blue/20 mr-4">
                <FiUserCheck className="w-6 h-6 text-dna-blue" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Active Permissions</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{mockData.activePermissions.length}</h3>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="dna-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-dna-yellow/10 dark:bg-dna-yellow/20 mr-4">
                <FiClock className="w-6 h-6 text-dna-yellow" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Pending Requests</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{mockData.pendingRequests.length}</h3>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="dna-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-dna-green/10 dark:bg-dna-green/20 mr-4">
                <FiUsers className="w-6 h-6 text-dna-green" />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users With Access</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mockData.activePermissions.filter(p => p.type === 'Researcher').length}
                </h3>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="dna-input w-full pl-10"
                placeholder="Search by name or organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <FiFilter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'requests'
                  ? 'border-dna-blue text-dna-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Pending Requests
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'permissions'
                  ? 'border-dna-blue text-dna-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Active Permissions
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
          {/* Pending Requests Tab */}
          {activeTab === 'requests' && (
            <>
              {mockData.pendingRequests.length > 0 ? (
                <div className="space-y-6">
                  {mockData.pendingRequests.map((request) => (
                    <div key={request.id} onClick={() => registerUser(request.address)} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-dna-blue/10 dark:bg-dna-blue/20 flex items-center justify-center text-dna-blue">
                              {request.user.name[0]}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.user.name}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{request.user.organization} • {request.type}</p>
                              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-500">
                                <FiClock className="w-3 h-3 mr-1" />
                                Requested {request.date}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 flex items-center space-x-3">
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-dna-green hover:bg-dna-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dna-green">
                              <FiCheck className="w-4 h-4 mr-2" />
                              Approve
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dna-red">
                              <FiX className="w-4 h-4 mr-2" />
                              Deny
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Request Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Files Requested</p>
                              <ul className="mt-1 space-y-1">
                                {request.files.map((file, index) => (
                                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                                    {file}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Research Purpose</p>
                              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{request.purpose}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Requested Duration</p>
                              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{request.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                  <FiUserCheck className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No pending requests</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    When someone requests access to your genomic data, it will appear here.
                  </p>
                </div>
              )}
            </>
          )}
          
          {/* Active Permissions Tab */}
          {activeTab === 'permissions' && (
            <>
              {mockData.activePermissions.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            User / Organization
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Access Level
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Files
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Duration
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Last Accessed
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {mockData.activePermissions.map((permission) => (
                          <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-dna-blue/10 dark:bg-dna-blue/20 flex items-center justify-center text-dna-blue">
                                  {permission.user.name[0]}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{permission.user.name}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{permission.user.organization}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-dna-green/10 text-dna-green dark:bg-dna-green/20">
                                {permission.accessLevel}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {permission.files.join(', ')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {permission.granted} - {permission.expires}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {permission.lastAccessed}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-dna-red hover:text-dna-red-dark">
                                Revoke
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                  <FiUserX className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No active permissions</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You haven't granted access to your genomic data to anyone yet.
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>
        
        {/* Information Panel */}
        <motion.div 
          className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 flex items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="p-2 bg-blue-100 dark:bg-blue-800/30 rounded-full mr-4">
            <FiAlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-medium text-blue-800 dark:text-blue-400">Understanding Blockchain Access Control</h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              When you grant access to your genomic data, smart contracts are deployed to the blockchain to enforce your permissions. 
              These contracts verify each access attempt cryptographically and maintain an immutable record of all interactions.
            </p>
            <a href="/learn/blockchain-access" className="mt-2 text-sm font-medium text-blue-800 dark:text-blue-400 hover:underline inline-flex items-center">
              Learn more about blockchain security
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccessControlPage; 