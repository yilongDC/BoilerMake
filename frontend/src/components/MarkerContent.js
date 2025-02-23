import React, { useMemo } from 'react';
import Pin from './Pin';
import { getRandomFigure } from '../utils/markerUtils';

const MarkerContent = ({ property, isSelected, anyPopupOpen }) => {
  const figureSrc = useMemo(() => getRandomFigure(), []);

  if (!isSelected) {
    return (
      <Pin 
        id={property.id} 
        figureSrc={figureSrc} 
        isSelected={isSelected} 
        anyPopupOpen={anyPopupOpen}
      />
    );
  }

  return (
    <div className="relative cursor-pointer group">
      <Pin 
        id={property.id} 
        figureSrc={figureSrc} 
        isSelected={isSelected} 
        anyPopupOpen={anyPopupOpen}
      />
      <div className={`absolute left-1/2 -translate-x-1/2 -translate-y-full 
        transition-all duration-300 ease-out z-[10000]
        ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="bg-[#EFEDE6] backdrop-blur-sm rounded-2xl 
          shadow-lg p-5 min-w-[300px] border border-[#FAF9F3]
          transition-all duration-300 ease-out hover:shadow-xl
          transform motion-safe:hover:scale-[1.01]">
          
          <div className="flex items-start gap-4 mb-4">
            <div className="p-2 rounded-xl flex-shrink-0
              transition-transform duration-300 hover:scale-105">
              <img 
                src={`/${figureSrc}`}
                alt="Location marker"
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 leading-tight mb-1">
                {property.buildingName}
              </h3>
              <p className="text-sm text-blue-600 font-medium">
                {property.id}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed
              animate-[fadeIn_0.3s_ease-in]">
              {property.locationDescription}
            </p>
            
            {property.imageUrl && (
              <div className="relative overflow-hidden rounded-xl shadow-sm
                transition-transform duration-300 hover:scale-[1.02]">
                <img 
                  src={property.imageUrl} 
                  alt={property.buildingName}
                  className="w-full h-36 object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkerContent;
