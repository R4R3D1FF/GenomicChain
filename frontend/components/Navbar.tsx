'use client';
import { connectWallet } from '@/utils/wallet';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiChevronDown } from 'react-icons/fi';
import {notify} from "@/utils/popups";
import Cookies from 'js-cookie';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [name, setName] = useState('');
  const [tempName, setTempName] = useState('');
  const pathname = usePathname();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetch('/api/auth/get-name', {
      method: 'GET',
      credentials: 'include', // ⬅️ important to include cookies
    })
      .then((res) => {
        if (res.ok) {
          console.log('User is authenticated (JWT cookie is present)');
          return res;
          
        } else {
          console.log('User is NOT authenticated');
          return null;
        }
      })
      .then((res) => {
        if (res && res.ok){
          return res.json();
        }
      })
      .then((res) => {
        if (res && 'name' in res)
          setName(res.name);
      })
      .catch((err) => {
        console.error('Error checking auth:', err);
      });
  }, [name]);

  const handleConnect = async () => {
    const wallet = await connectWallet();
    if (wallet) {
      Cookies.set('walletAddress', wallet.address, { expires: 1 });
      notify("Wallet connected");
      const timeout = setTimeout(() => {
        window.location.href = '/dashboard'; // Redirect to the target page after 5 seconds
      }, 2000);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    // { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];


  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {
        (Cookies.get('walletAddress') && name === '')?
        <div>
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-semibold mb-4">Enter your name</h2>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Your name"
              />
              <button
                onClick={()=>{
                  setName(tempName)
                  fetch('/api/auth/set-name', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json', // Indicate that the body is JSON
                    },
                    body: JSON.stringify({
                      name: tempName,  // Send tempName state as 'name'
                    }),
                    credentials: 'include',
                  });
                  
                }}
                className="w-full dna-button items-center space-x-2 py-2 px-4 rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
          </div>:
          <></>
        }
        <div className="flex justify-between items-center">
          {/* Improved Logo */}
          <Link href="/" className="group flex items-center">
            {/* <span className="text-2xl transition-all duration-300 group-hover:rotate-3 group-hover:scale-110">🧬</span> */}
            <div className="ml-0 transition-all duration-300 group-hover:translate-x-1">
              <span className="font-bold text-xl tracking-tighter bg-gradient-to-r from-dna-blue to-dna-green bg-clip-text text-transparent group-hover:bg-gradient-to-br">Genomic</span>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white group-hover:text-dna-blue dark:group-hover:text-dna-green">Chain</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-dna-blue dark:text-dna-green'
                    : 'text-gray-700 dark:text-gray-300 hover:text-dna-blue dark:hover:text-dna-green'
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              {
                (!Cookies.get('walletAddress'))?
                <button
                  onClick={handleConnect}
                  className="dna-button flex items-center space-x-2 py-2 px-4 rounded-md"
                >
                  Connect Wallet
                </button>
                :
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-dna-blue dark:hover:text-dna-green focus:outline-none"
                  >
                    <FiUser className="h-5 w-5" />
                    <span>Account</span>
                    <FiChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      >
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            <div
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                            >
                              {name}
                            </div>
                            <div
                              className="cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              role="menuitem"
                              onClick={async () => {
                                await Cookies.remove('walletAddress')
                                window.location.href = '/';
                              }}
                            >
                              Sign Out
                            </div>
                            
                          
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            role="menuitem"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </div>
              }
              
            </div>

            {/* <Link
              href="/auth/signup"
              className="dna-button inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium"
            >
              Get Started
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-900 shadow-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block py-2 px-3 rounded-md text-base font-medium ${
                    isActive(link.href)
                      ? 'bg-gray-100 dark:bg-gray-800 text-dna-blue dark:text-dna-green'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-dna-blue dark:hover:text-dna-green'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Account</p>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/auth/login"
                    className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-dna-blue dark:hover:text-dna-green"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-dna-blue dark:hover:text-dna-green"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-dna-blue dark:hover:text-dna-green"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/auth/signup"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-dna-blue to-dna-green hover:from-dna-blue/90 hover:to-dna-green/90"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started
                  </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar; 