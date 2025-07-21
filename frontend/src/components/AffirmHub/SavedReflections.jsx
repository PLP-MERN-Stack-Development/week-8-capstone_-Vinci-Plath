import React, { useState } from 'react';
import { format } from 'date-fns';

const SavedReflections = ({ reflections = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReflection, setSelectedReflection] = useState(null);
  
  // Filter reflections based on search term
  const filteredReflections = reflections.filter(reflection =>
    reflection.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group reflections by date
  const groupedReflections = filteredReflections.reduce((groups, reflection) => {
    const date = format(new Date(reflection.date), 'MMMM d, yyyy');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reflection);
    return groups;
  }, {});
  
  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this reflection? This cannot be undone.')) {
      const updatedReflections = reflections.filter(ref => ref.id !== id);
      localStorage.setItem('affirm_reflections', JSON.stringify(updatedReflections));
      window.location.reload(); // Refresh to update the list
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-2 text-indigo-600 dark:text-indigo-400">
          Saved Reflections
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Review your journey of hope and growth.
        </p>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your reflections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Reflections List */}
        {filteredReflections.length === 0 ? (
          <div className="text-center py-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-300">
              {searchTerm ? 'No matching reflections found' : 'No reflections yet'}
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {searchTerm 
                ? 'Try a different search term.' 
                : 'Your reflections will appear here once you save them.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedReflections).map(([date, dateReflections]) => (
              <div key={date} className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {date}
                </h3>
                <div className="space-y-3">
                  {dateReflections.map((reflection) => (
                    <div 
                      key={reflection.id}
                      onClick={() => setSelectedReflection(reflection)}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-gray-700 dark:text-gray-200 line-clamp-2">
                          {reflection.text}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {format(new Date(reflection.date), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Reflection Detail Modal */}
      {selectedReflection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(new Date(selectedReflection.date), 'MMMM d, yyyy')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(selectedReflection.date), 'h:mm a')}
                </p>
              </div>
              <button 
                onClick={() => setSelectedReflection(null)}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto mb-4">
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-line">
                {selectedReflection.text}
              </p>
            </div>
            
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={(e) => {
                  handleDelete(selectedReflection.id, e);
                  setSelectedReflection(null);
                }}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedReflection(null)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedReflections;
