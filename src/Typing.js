import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure App.css is imported

const Typing = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sentences = [
    'Leveraging Artificial Intelligence ⌨️',
    'Achieving more accurate Diagnosis 🩺',
    'Making Difference to Patients lives 🚑',
    'Seeking AI second opinion 🤖',
    'Pioneering in patient Service 👨‍💻',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [forwards, setForwards] = useState(true);
  const [skipCount, setSkipCount] = useState(0);

  const skipDelay = 15;
  const speed = 60;

  useEffect(() => {
    const handleAnimation = () => {
      if (forwards) {
        if (offset >= sentences[currentIndex].length) {
          if (skipCount === skipDelay) {
            setForwards(false);
            setSkipCount(0);
          } else {
            setSkipCount((prevSkipCount) => prevSkipCount + 1);
          }
        }
      } else if (offset === 0) {
        setForwards(true);
        setCurrentIndex((currentIndex + 1) % sentences.length);
      }

      if (skipCount === 0) {
        setOffset((prevOffset) => (forwards ? prevOffset + 1 : prevOffset - 1));
      }
    };

    const intervalId = setInterval(handleAnimation, speed);

    return () => clearInterval(intervalId);
  }, [offset, forwards, skipCount, currentIndex, sentences]);

  return (
    <div className="sentence">
      {sentences[currentIndex].substring(0, offset)}
      <span className="cursor"></span>
    </div>
  );
};

export default Typing;