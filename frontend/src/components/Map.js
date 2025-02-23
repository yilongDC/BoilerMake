"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import BottomNav from './BottomNav';
import { properties } from '../data/properties';
import MarkerContent from './MarkerContent';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function SimpleMap() {
    const defaultCenter = { lat: 40.4289616, lng: -86.922324 };
    const [isLoading, setIsLoading] = useState(true);
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);
    const [selectedMarker, setSelectedMarker] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setIsLoading(false);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setIsLoading(false);
        }
    }, []);

    const handleMarkerClick = (property) => {
        setSelectedMarker(selectedMarker === property ? null : property);
    };

    return (
        <div className="h-screen">
            <div className="h-screen">
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                    <Map 
                        defaultZoom={17} 
                        center={currentPosition} 
                        tilt={45}
                        mapId={process.env.REACT_APP_PERSONAL_MAP_ID}
                        onLoaded={() => setIsLoading(false)}
                        disableDefaultUI={true}
                    >
                        {properties.map((property) => (
                            <AdvancedMarker
                                key={property.id}
                                position={property.position}
                                onClick={() => handleMarkerClick(property)}
                            >
                                <MarkerContent 
                                    property={property}
                                    isSelected={selectedMarker?.id === property.id}
                                />
                            </AdvancedMarker>
                        ))}
                    </Map>
                </APIProvider>
                {isLoading && (
                    <div className="absolute inset-0 bg-white flex items-center justify-center" style={{ zIndex: 1000 }}>
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                            <p className="mt-4 text-gray-600">Loading map...</p>
                        </div>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
}

export default SimpleMap;