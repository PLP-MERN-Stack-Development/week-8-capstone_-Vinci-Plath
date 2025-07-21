import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Sample quotes from inspiring African women
const QUOTES = [
  {
    text: "The power you have is to be the best version of yourself you can be, so you can create a better world.",
    author: "Lupita Nyong'o"
  },
  {
    text: "You don't have to be perfect to inspire others. Let people get inspired by how you deal with your imperfections.",
    author: "Chimamanda Ngozi Adichie"
  },
  {
    text: "If you want to go fast, go alone. If you want to go far, go together.",
    author: "African Proverb"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Ellen Johnson Sirleaf"
  },
  {
    text: "You can never go back and change the beginning, but you can start where you are and change the ending.",
    author: "Tsitsi Dangarembga"
  }
];

const AffirmHubHome = ({ onSaveReflection, onViewReflections }) => {
  const [reflection, setReflection] = useState('');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveReflection = () => {
    if (!reflection.trim()) return;
    
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onSaveReflection(reflection);
      setReflection('');
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Quote Carousel */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <motion.div
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <blockquote className="text-lg italic text-gray-700 dark:text-gray-200 mb-2">
            "{QUOTES[currentQuoteIndex].text}"
          </blockquote>
          <p className="text-right text-sm text-gray-500 dark:text-gray-400">
            — {QUOTES[currentQuoteIndex].author}
          </p>
        </motion.div>
        
        {/* Dots indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {QUOTES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuoteIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentQuoteIndex 
                  ? 'bg-indigo-600 w-6' 
                  : 'bg-gray-300 dark:bg-gray-600'
              } transition-all duration-300`}
              aria-label={`View quote ${index + 1} of ${QUOTES.length}`}
            />
          ))}
        </div>
      </div>

      {/* Reflection Input */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Daily Reflection
        </h2>
        <p className="text-gray-600 mb-4">
          What gave you hope today?
        </p>
        
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 
                   focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                   bg-white text-gray-900"
          rows={4}
        />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveReflection}
            disabled={!reflection.trim() || isSaving}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              !reflection.trim() || isSaving
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Reflection'}
          </button>
          
          <button
            onClick={onViewReflections}
            className="px-6 py-2.5 border border-indigo-600 text-indigo-600 
                     rounded-lg font-medium hover:bg-indigo-50 
                     transition-colors shadow-sm hover:shadow"
          >
            View Saved Reflections
          </button>
        </div>
        
        {saveSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            ✓ Reflection saved successfully!
          </div>
        )}
      </div>

    </div>
  );
};

export default AffirmHubHome;
