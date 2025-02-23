import React, { useMemo } from 'react';
import { getRandomFigure } from '../utils/markerUtils';

const Pin = ({ id, figureSrc, isSelected, anyPopupOpen }) => {
  const randomFigure = useMemo(() => figureSrc || getRandomFigure(), [figureSrc]);

  const visibility = anyPopupOpen && !isSelected ? 'opacity-0' : 'opacity-100';
  const zIndex = isSelected ? 'z-[1]' : 'z-[2]';

  return (
    <div className={`relative group ${zIndex} ${visibility} transition-opacity duration-300`}>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full animate-bounce-gentle">
        <div className="w-7 h-7 relative cursor-pointer group">
          {/* Pin head */}
          <div className="absolute top-0 left-0 right-0 h-7 
            flex items-center justify-center
            transition-all duration-300 group-hover:scale-110">
            <img 
              src={`/${randomFigure}`}
              alt="Location marker"
              className="w-7 h-7"
            />
          </div>
          {/* Pin shadow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2
            w-3 h-1 bg-black/20 rounded-full blur-sm
            transition-all duration-300 group-hover:scale-110">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pin;
