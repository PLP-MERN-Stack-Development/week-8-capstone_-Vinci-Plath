import React from 'react';

export default function Learn() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Learn 📘</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Knowledge is power. Access resources about GBV awareness, your rights, and legal support.
        </p>
        
        <div className="space-y-6">
          {/* Understanding GBV */}
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Understanding GBV
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Learn about different forms of gender-based violence and how to recognize them.
            </p>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              <p>• What is GBV?</p>
              <p>• Types of GBV</p>
              <p>• Warning signs</p>
            </div>
          </div>
          
          {/* Know Your Rights */}
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Know Your Rights
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Information about your legal rights and protections against GBV.
            </p>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              <p>• Legal protections</p>
              <p>• Reporting procedures</p>
              <p>• Support services</p>
            </div>
          </div>
          
          {/* Safety Planning */}
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Safety Planning
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              Steps you can take to increase your safety in different situations.
            </p>
            <div className="text-sm text-green-600 dark:text-green-400">
              <p>• Creating a safety plan</p>
              <p>• Emergency contacts</p>
              <p>• Safe spaces</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Need immediate help?</h3>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            If you're in immediate danger, please contact local emergency services or a trusted support organization.
          </p>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        <p>More educational resources coming soon. Check back for updates!</p>
      </div>
    </div>
  );
}
