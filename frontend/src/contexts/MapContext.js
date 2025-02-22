import React, { createContext, useState } from 'react';

export const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
    const [mapInstance, setMapInstance] = useState(null);

    return (
        <MapContext.Provider value={{ mapInstance, setMapInstance }}>
            {children}
        </MapContext.Provider>
    );
};
