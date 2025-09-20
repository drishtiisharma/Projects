import React, { useRef } from 'react';
import useBackgroundAnimation from '../../hooks/useBackgroundAnimation';
import './BackgroundAnimation.css';

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);
  useBackgroundAnimation(canvasRef);

  return (
    <canvas 
      ref={canvasRef} 
      className="background-animation"
    />
  );
};

export default BackgroundAnimation;