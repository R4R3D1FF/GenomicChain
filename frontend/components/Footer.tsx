import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiFacebook, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-r from-dna-blue to-dna-green rounded-full opacity-80"></div>
                <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-dna-blue to-dna-green text-xl">🧬</span>
                </div>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">GenomicChain</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Secure blockchain-based DNA data storage platform with end-to-end encryption and granular access control.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-dna-blue dark:text-gray-400 dark:hover:text-dna-green">
                <span className="sr-only">Twitter</span>
                <FiTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-dna-blue dark:text-gray-400 dark:hover:text-dna-green">
                <span className="sr-only">Facebook</span>
                <FiFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-dna-blue dark:text-gray-400 dark:hover:text-dna-green">
                <span className="sr-only">LinkedIn</span>
                <FiLinkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-dna-blue dark:text-gray-400 dark:hover:text-dna-green">
                <span className="sr-only">GitHub</span>
                <FiGithub className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">
                  Platform
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/#features" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Features
                    </Link>
                  </li>
                  {/* <li>
                    <Link href="/pricing" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Pricing
                    </Link>
                  </li> */}
                  <li>
                    <Link href="/security" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link href="/api-docs" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      API Documentation
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/help" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/status" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      System Status
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/partners" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Partners
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/privacy" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookie-policy" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/compliance" className="text-base text-gray-600 dark:text-gray-400 hover:text-dna-blue dark:hover:text-dna-green">
                      GDPR & HIPAA Compliance
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        {/* <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mt-12 lg:flex lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wider uppercase">
              Subscribe to our newsletter
            </h3>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 lg:max-w-md">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-2 text-base text-gray-900 dark:text-white placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-dna-blue dark:focus:ring-dna-green focus:border-dna-blue dark:focus:border-dna-green"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-dna-blue to-dna-green hover:from-dna-blue/90 hover:to-dna-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dna-blue"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div> */}
        
        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="mailto:info@genomicchain.io" className="text-gray-500 hover:text-dna-blue dark:text-gray-400 dark:hover:text-dna-green flex items-center">
              <FiMail className="h-5 w-5 mr-2" />
              <span>info@genomicchain.io</span>
            </a>
          </div>
          <p className="mt-8 text-base text-gray-500 dark:text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} GenomicChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 