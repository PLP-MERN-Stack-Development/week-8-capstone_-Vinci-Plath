import React, { useState } from 'react';

export default function Heal() {
  const [activeTab, setActiveTab] = useState('breathing');
  
  const breathingExercises = [
    {
      id: '4-7-8',
      name: '4-7-8 Breathing',
      description: 'Calm your mind and reduce anxiety with this simple technique.',
      steps: [
        'Breathe in quietly through your nose for 4 seconds',
        'Hold your breath for 7 seconds',
        'Exhale completely through your mouth for 8 seconds',
        'Repeat the cycle 3-4 times'
      ]
    },
    {
      id: 'box',
      name: 'Box Breathing',
      description: 'A powerful technique used by Navy SEALs to stay calm and focused.',
      steps: [
        'Inhale through your nose for 4 seconds',
        'Hold your breath for 4 seconds',
        'Exhale slowly for 4 seconds',
        'Hold your breath again for 4 seconds',
        'Repeat for several minutes'
      ]
    }
  ];
  
  const affirmations = [
    "I am stronger than I think.",
    "I choose to focus on what I can control.",
    "I am worthy of love and respect.",
    "My feelings are valid and important.",
    "I am healing and growing every day.",
    "I have the power to create positive change in my life.",
    "I am surrounded by love and support.",
    "I trust myself to make good decisions."
  ];
  
  const [currentAffirmation, setCurrentAffirmation] = useState(
    affirmations[Math.floor(Math.random() * affirmations.length)]
  );
  
  const getNewAffirmation = () => {
    const currentIndex = affirmations.indexOf(currentAffirmation);
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * affirmations.length);
    } while (newIndex === currentIndex && affirmations.length > 1);
    
    setCurrentAffirmation(affirmations[newIndex]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Heal 🧘🏾‍♀️</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Nurture your emotional and mental well-being with these healing resources.
        </p>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'breathing'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Breathing Exercises
          </button>
          <button
            onClick={() => setActiveTab('affirmations')}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === 'affirmations'
                ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Daily Affirmations
          </button>
        </div>
        
        {/* Tab Content */}
        {activeTab === 'breathing' ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Guided Breathing Exercises
            </h3>
            
            {breathingExercises.map((exercise) => (
              <div key={exercise.id} className="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-700 dark:text-indigo-300">{exercise.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{exercise.description}</p>
                <ul className="space-y-2 text-sm">
                  {exercise.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-200">{step}</span>
                    </li>
                  ))}
                </ul>
                
                {exercise.id === '4-7-8' && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-indigo-100 dark:border-gray-600">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Tip:</span> Practice this technique twice daily for best results. It's particularly helpful before sleep or during stressful moments.
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Safety Note</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                If you feel lightheaded or uncomfortable during any breathing exercise, stop immediately and return to normal breathing.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="max-w-md mx-auto bg-indigo-50 dark:bg-gray-700 rounded-xl shadow-md overflow-hidden p-6">
              <div className="min-h-32 flex items-center justify-center">
                <p className="text-lg text-gray-800 dark:text-white italic">"{currentAffirmation}"</p>
              </div>
              
              <button
                onClick={getNewAffirmation}
                className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                New Affirmation
              </button>
              
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">How to use affirmations:</h4>
                <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1 text-left">
                  <li>1. Read the affirmation out loud</li>
                  <li>2. Close your eyes and repeat it silently</li>
                  <li>3. Visualize the statement being true for you</li>
                  <li>4. Notice how it makes you feel</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        <p>Take time to care for your mental and emotional well-being every day.</p>
      </div>
    </div>
  );
}
