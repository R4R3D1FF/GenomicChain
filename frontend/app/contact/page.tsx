'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiAlertCircle } from 'react-icons/fi';

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    organization: '',
    phone: ''
  });

  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: false,
      message: 'Sending your message...'
    });
    
    // Mock API call
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
      });
      
      // Reset form after successful submission
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
        organization: '',
        phone: ''
      });
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: 'Email',
      description: 'Our friendly team is here to help.',
      contact: 'contact@genomicchain.com'
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: 'Phone',
      description: 'Mon-Fri from 8am to 5pm.',
      contact: '+1 (555) 000-0000'
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: 'Office',
      description: 'Come say hello at our headquarters.',
      contact: 'Address'
    }
  ];

  const inquiryTypes = [
    'General Inquiry',
    'Sales',
    'Technical Support',
    'Partnership Opportunity',
    'Press & Media',
    'Career Opportunities',
    'Other'
  ];

  return (
    <div className="py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Have questions about GenomicChain? We're here to help.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-dna-blue/10 text-dna-blue mb-4">
                {method.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {method.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                {method.description}
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {method.contact}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          <motion.div 
            className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
            
            {formStatus.submitted && (
              <div className={`mb-6 p-4 rounded-md ${formStatus.success ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                <p className="flex items-center">
                  {formStatus.success ? (
                    <FiSend className="mr-2 h-5 w-5" />
                  ) : (
                    <FiAlertCircle className="mr-2 h-5 w-5" />
                  )}
                  {formStatus.message}
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-dna-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-dna-blue focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    value={formState.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-dna-blue focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-dna-blue focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-dna-blue focus:border-transparent outline-none"
                >
                  <option value="" disabled>Select an inquiry type</option>
                  {inquiryTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-dna-blue focus:border-transparent outline-none resize-none"
                />
              </div>
              
              <button
                type="submit"
                className="dna-button py-3 px-6 text-white rounded-md font-medium"
                disabled={formStatus.submitted && !formStatus.success}
              >
                {formStatus.submitted && !formStatus.success ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Office Hours</h2>
              <ul className="space-y-3">
                <li className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Monday - Friday:</span>
                  <span>8:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Saturday:</span>
                  <span>Closed</span>
                </li>
                <li className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Sunday:</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
            
            <div className="rounded-xl overflow-hidden shadow-md h-80 bg-gray-200">
              {/* In a real application, this would be a map component like Google Maps or Mapbox */}
              <div className="h-full w-full flex items-center justify-center bg-gray-300 dark:bg-gray-700">
                <div className="text-center p-4">
                  <FiMapPin className="h-10 w-10 text-dna-blue mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Address
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 