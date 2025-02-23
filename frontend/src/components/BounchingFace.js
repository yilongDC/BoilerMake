import React, { useState, useEffect, useRef } from 'react';

const BouncingFace = () => {
  const FACE_RADIUS = 40;
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const velocityRef = useRef({ vx: 2, vy: 2 });
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const updatePosition = () => {
      const container = containerRef.current;
      if (!container) return;

      const { clientWidth, clientHeight } = container;
      const { x, y } = position;
      const { vx, vy } = velocityRef.current;

      let nextX = x + vx;
      let nextY = y + vy;

      // Bounce off left/right
      if (nextX - FACE_RADIUS < 0) {
        nextX = FACE_RADIUS;
        velocityRef.current.vx = -vx;
      } else if (nextX + FACE_RADIUS > clientWidth) {
        nextX = clientWidth - FACE_RADIUS;
        velocityRef.current.vx = -vx;
      }

      // Bounce off top/bottom
      if (nextY - FACE_RADIUS < 0) {
        nextY = FACE_RADIUS;
        velocityRef.current.vy = -vy;
      } else if (nextY + FACE_RADIUS > clientHeight) {
        nextY = clientHeight - FACE_RADIUS;
        velocityRef.current.vy = -vy;
      }

      setPosition({ x: nextX, y: nextY });
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Use the public URL for your SVG */}
      <img
        src="/Figure1.svg" // This references public/Figure1.svg
        alt="Bouncing Icon"
        style={{
          position: 'absolute',
          left: position.x - FACE_RADIUS,
          top: position.y - FACE_RADIUS,
          width: FACE_RADIUS * 2,
          height: FACE_RADIUS * 2,
        }}
      />
    </div>
  );
};

export default BouncingFace;
