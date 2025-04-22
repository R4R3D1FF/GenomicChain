'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiUsers, FiServer, FiLock } from 'react-icons/fi';

const AboutPage = () => {
  const stats = [
    { 
      label: 'Users', 
      value: '50,000+', 
      icon: <FiUsers className="h-6 w-6" />,
      description: 'Researchers, healthcare providers and patients trusted our platform'
    },
    { 
      label: 'DNA Sequences', 
      value: '2M+', 
      icon: <FiServer className="h-6 w-6" />,
      description: 'Securely stored and accessible only to authorized parties'
    },
    { 
      label: 'Security Score', 
      value: '99.9%', 
      icon: <FiLock className="h-6 w-6" />,
      description: 'Industry-leading security protocols and blockchain verification'
    }
  ];

  const values = [
    {
      title: 'Security First',
      description: 'We believe your genetic information deserves the highest level of protection. Our security-first approach guides everything we do.'
    },
    {
      title: 'Transparency',
      description: 'We\'re transparent about how we store and protect your data, with auditable blockchain verification for every action.'
    },
    {
      title: 'Innovation',
      description: 'We continuously innovate to stay ahead of security threats and provide cutting-edge features for genomic data management.'
    },
    {
      title: 'Accessibility',
      description: 'We make advanced genomic data tools accessible to researchers, healthcare providers, and individuals without compromising security.'
    }
  ];

  return (
    <div className="py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              To make genetic information storage <span className="text-dna-blue font-semibold">secure</span>, <span className="text-dna-green font-semibold">private</span>, and <span className="text-purple-600 font-semibold">accessible</span> only to authorized parties through blockchain technology.
            </p>
          </motion.div>
          
          <motion.div
            className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-dna-blue/10 to-dna-green/10">
              <div className="text-center">
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Stats Section */}
        <motion.div 
          className="max-w-6xl mx-auto mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md"
              >
                <div className="flex items-center mb-4 text-dna-blue">
                  {stat.icon}
                  <h3 className="text-gray-500 dark:text-gray-400 text-lg ml-2">{stat.label}</h3>
                </div>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
                <p className="text-gray-600 dark:text-gray-300">{stat.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Our Values Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={value.title}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <FiCheckCircle className="h-6 w-6 text-dna-green mr-3" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{value.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="max-w-5xl mx-auto text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Join us in transforming genomic data security
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience the future of secure DNA storage with blockchain verification.
          </p>
          {/* <Link 
            href="/auth/signup" 
            className="dna-button inline-flex items-center text-white py-3 px-8 rounded-md text-lg font-medium"
          >
            Get Started <FiArrowRight className="ml-2" />
          </Link> */}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage; 