import React, { useEffect, useState } from 'react';

const Toast = ({ message, isVisible, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    if (isVisible) {
      setTimeLeft(3);
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      const countdownInterval = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0));
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [isVisible, onClose]);

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`transform transition-all duration-500 ease-in-out 
          bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between
          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center">
          <span>{message}</span>
          <span className="ml-3 text-sm opacity-70">({timeLeft}s)</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;