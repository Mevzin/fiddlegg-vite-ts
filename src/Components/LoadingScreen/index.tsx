import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      
      setTimeout(() => setAnimationClass('fade-in'), 10);
    } else {
      setAnimationClass('fade-out');
      
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  const letters = ['F', 'I', 'D', 'D', 'L', 'E', '.', 'G', 'G'];

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50 ${animationClass}`}>
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-8">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="text-6xl md:text-8xl font-bold text-white transition-all duration-300"
              style={{
                animation: `letterPulse 0.6s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;