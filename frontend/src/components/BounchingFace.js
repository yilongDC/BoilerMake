import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const BouncingFace = forwardRef(({ onAddFace }, ref) => {
  const FACE_RADIUS = 20; // Reduced from 40 to better fit container
  const SCATTER_RADIUS = 100; // Radius within which faces will react to clicks
  const SCATTER_FORCE = 5; // Changed from 10 to 5 for gentler scatter effect
  const VELOCITY_DECAY = 0.9995; // Changed from 0.995 to 0.9995 for much slower decay
  const MIN_VELOCITY = 0.1; // New constant for minimum velocity
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);
  const [faces, setFaces] = useState([
    {
      id: 1,
      position: { x: 100, y: 100 },
      velocity: { vx: 2, vy: 2 },
      figure: `Figure${Math.floor(Math.random() * 6) + 1}`  // Changed to random figure
    }
  ]);
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    createNewFace: () => {
      const container = containerRef.current;
      if (!container) return;
      
      const newFace = {
        id: Date.now(),
        position: { 
          x: container.clientWidth / 2,
          y: container.clientHeight / 2
        },
        velocity: { 
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4
        },
        figure: `Figure${Math.floor(Math.random() * 6) + 1}`
      };
      
      setFaces(prev => [...prev, newFace]);
      if (onAddFace) onAddFace(newFace);
    }
  }));

  const checkCollision = (face1, face2) => {
    const dx = face1.position.x - face2.position.x;
    const dy = face1.position.y - face2.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < FACE_RADIUS * 2) {
      // Collision detected - calculate new velocities
      const angle = Math.atan2(dy, dx);
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      // Rotate velocities
      const vx1 = face1.velocity.vx * cos + face1.velocity.vy * sin;
      const vy1 = face1.velocity.vy * cos - face1.velocity.vx * sin;
      const vx2 = face2.velocity.vx * cos + face2.velocity.vy * sin;
      const vy2 = face2.velocity.vy * cos - face2.velocity.vx * sin;

      // Swap the rotated velocities
      return {
        face1Velocity: {
          vx: vx2 * cos - vy1 * sin,
          vy: vy1 * cos + vx2 * sin
        },
        face2Velocity: {
          vx: vx1 * cos - vy2 * sin,
          vy: vy2 * cos + vx1 * sin
        }
      };
    }
    return null;
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseDown = () => setIsClicked(true);
  const handleMouseUp = () => setIsClicked(false);

  useEffect(() => {
    let animationFrameId;
    const updatePositions = () => {
      const container = containerRef.current;
      if (!container) return;

      const { clientWidth, clientHeight } = container;

      setFaces(prevFaces => {
        const newFaces = [...prevFaces];
        
        // Check collisions between all pairs of faces
        for (let i = 0; i < newFaces.length; i++) {
          for (let j = i + 1; j < newFaces.length; j++) {
            const collision = checkCollision(newFaces[i], newFaces[j]);
            if (collision) {
              newFaces[i].velocity = collision.face1Velocity;
              newFaces[j].velocity = collision.face2Velocity;
            }
          }
        }

        // Update positions and handle mouse interaction
        return newFaces.map(face => {
          let nextX = face.position.x + face.velocity.vx;
          let nextY = face.position.y + face.velocity.vy;
          let newVx = face.velocity.vx;
          let newVy = face.velocity.vy;

          // Add scatter behavior when mouse is clicked
          if (isClicked) {
            const dx = face.position.x - mousePos.x;
            const dy = face.position.y - mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < SCATTER_RADIUS) {
              const angle = Math.atan2(dy, dx);
              const force = (SCATTER_RADIUS - distance) / SCATTER_RADIUS * SCATTER_FORCE;
              newVx += Math.cos(angle) * force;
              newVy += Math.sin(angle) * force;
            }
          } else {
            // Apply velocity decay when not being scattered
            newVx *= VELOCITY_DECAY;
            newVy *= VELOCITY_DECAY;

            // Ensure minimum velocity
            if (Math.abs(newVx) < MIN_VELOCITY && Math.abs(newVy) < MIN_VELOCITY) {
              const randomAngle = Math.random() * Math.PI * 2;
              newVx = Math.cos(randomAngle) * MIN_VELOCITY * 2;
              newVy = Math.sin(randomAngle) * MIN_VELOCITY * 2;
            }
          }

          if (nextX - FACE_RADIUS < 0) {
            nextX = FACE_RADIUS;
            newVx = -face.velocity.vx;
          } else if (nextX + FACE_RADIUS > clientWidth) {
            nextX = clientWidth - FACE_RADIUS;
            newVx = -face.velocity.vx;
          }

          if (nextY - FACE_RADIUS < 0) {
            nextY = FACE_RADIUS;
            newVy = -face.velocity.vy;
          } else if (nextY + FACE_RADIUS > clientHeight) {
            nextY = clientHeight - FACE_RADIUS;
            newVy = -face.velocity.vy;
          }

          return {
            ...face,
            position: { x: nextX, y: nextY },
            velocity: { vx: newVx, vy: newVy }
          };
        });
      });

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos, isClicked]); // Add dependencies

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {faces.map(face => (
        <img
          key={face.id}
          src={`/${face.figure}.svg`}
          alt="Bouncing Icon"
          style={{
            position: 'absolute',
            left: `${Math.max(0, Math.min(face.position.x - FACE_RADIUS, containerRef.current?.clientWidth - FACE_RADIUS * 2))}px`,
            top: `${Math.max(0, Math.min(face.position.y - FACE_RADIUS, containerRef.current?.clientHeight - FACE_RADIUS * 2))}px`,
            width: FACE_RADIUS * 2,
            height: FACE_RADIUS * 2,
          }}
        />
      ))}
    </div>
  );
});

export default BouncingFace;
