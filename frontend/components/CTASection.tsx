'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiLock, FiShield, FiDatabase } from 'react-icons/fi';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with DNA theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-dna-blue/10 to-dna-green/10 dark:from-dna-blue/20 dark:to-dna-green/20 z-0">
        <div className="absolute inset-0 opacity-10">
          {/* DNA Helix Background Pattern */}
          <div className="absolute w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-dna-blue to-transparent"
                style={{ 
                  top: `${(i * 5) + 1}%`,
                  transform: `rotate(${i % 2 === 0 ? 5 : -5}deg)`,
                  opacity: 0.6,
                }}
              />
            ))}
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-dna-green to-transparent"
                style={{ 
                  top: `${(i * 5) + 3}%`,
                  transform: `rotate(${i % 2 === 0 ? -5 : 5}deg)`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* DNA Strand Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative w-20 h-20">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-dna-blue to-dna-green rounded-full opacity-20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="ctaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3490dc" />
                        <stop offset="100%" stopColor="#38a169" />
                      </linearGradient>
                    </defs>
                    <path d="M12 3C8 3 4 5 4 9C4 11.5 5.5 13.5 7 15C8.5 16.5 10 18 10 20C10 21.1 9.1 22 8 22H16C14.9 22 14 21.1 14 20C14 18 15.5 16.5 17 15C18.5 13.5 20 11.5 20 9C20 5 16 3 12 3Z" stroke="url(#ctaGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4.5 9H19.5" stroke="url(#ctaGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 15H17" stroke="url(#ctaGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3V22" stroke="url(#ctaGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Secure Your  Future
            </motion.h2>
            
            <motion.p 
              className="text-xl text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join thousands of researchers, healthcare providers, and individuals who trust GenomicChain for secure, blockchain-protected DNA data management.
            </motion.p>
            
            {/* Feature Icons */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-dna-blue/10 dark:bg-dna-blue/20 flex items-center justify-center mb-3">
                  <FiLock className="w-6 h-6 text-dna-blue" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">End-to-End Encryption</h3>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-dna-green/10 dark:bg-dna-green/20 flex items-center justify-center mb-3">
                  <FiShield className="w-6 h-6 text-dna-green" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Blockchain Security</h3>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-dna-red/10 dark:bg-dna-red/20 flex items-center justify-center mb-3">
                  <FiDatabase className="w-6 h-6 text-dna-red" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Controlled Access</h3>
              </div>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* <Link href="/auth/signup" className="dna-button text-center rounded-xl py-3 px-8 text-lg">
                Get Started For Free
              </Link> */}
              {/* <Link href="/pricing" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-8 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 shadow-md text-center text-lg">
                View Pricing
              </Link> */}
            </motion.div>
            
            {/* Trust Badge */}
            {/* <div className="mt-10 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Trusted by leading research institutions</p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                <span className="text-gray-400 dark:text-gray-500 text-sm">GeneResearch Institute</span>
                <span className="text-gray-400 dark:text-gray-500 text-sm">BioCorp Labs</span>
                <span className="text-gray-400 dark:text-gray-500 text-sm">GeneTech Solutions</span>
                <span className="text-gray-400 dark:text-gray-500 text-sm">MedDNA Analytics</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 