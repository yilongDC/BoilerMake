import React from 'react';

const MarkerContent = ({ property, isSelected }) => {
  return (
    <div className={`marker ${isSelected ? 'highlight' : ''}`}>
      <div className="marker-content">
        <div className="property bg-white rounded-lg shadow-lg p-2 cursor-pointer transform transition-transform hover:scale-105">
          <div className="font-bold text-lg">{property.buildingName}</div>
          <div className="text-sm">{property.locationDescription}</div>
          {isSelected && (
            <img 
              src={property.imageUrl} 
              alt={property.buildingName}
              className="w-full h-24 object-cover mt-2 rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkerContent;
