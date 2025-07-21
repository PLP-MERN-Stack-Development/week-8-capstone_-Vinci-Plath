import React from 'react';
import { Link } from 'react-router-dom';

export default function Grow() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Grow 🌱</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Empowering you with resources for economic growth and personal development.
        </p>
        
        <div className="space-y-6">
          {/* Placeholder for Job Boards */}
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Job Boards</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon: Curated job opportunities and career resources.
            </p>
          </div>
          
          {/* Placeholder for Financial Literacy */}
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Financial Literacy</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon: Tools and guides for financial independence.
            </p>
          </div>
          
          {/* Placeholder for Skills Development */}
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Skills Development</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Coming soon: Online courses and skill-building resources.
            </p>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-medium text-indigo-700 dark:text-indigo-300 mb-2">What would you like to see here?</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We're building this section with your needs in mind. Share your suggestions for economic empowerment resources.
          </p>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        <p>More resources coming soon. Check back regularly for updates!</p>
      </div>
    </div>
  );
}
