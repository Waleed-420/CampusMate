import { useEffect, useState } from 'react';

const LoadingText = ({ text = 'Loading...' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        const nextText = text.substring(0, (index % text.length) + 1);
        return nextText;
      });

      setIndex((prev) => (prev + 1) % text.length);
    }, 150);

    return () => clearInterval(interval);
  }, [index, text]);

  return (
    <div style={{height:'50vh', display:'flex',justifyContent:'center',alignItems:'center'}} className="loading-text">
      <h2>{displayedText}<span className="blinking-cursor">|</span></h2>
    </div>
  );
};

export default LoadingText;
