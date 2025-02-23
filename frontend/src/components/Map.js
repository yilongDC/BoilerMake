"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import BottomNav from './BottomNav';
import { properties } from '../data/properties';
import MarkerContent from './MarkerContent';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function SimpleMap() {
    const defaultCenter = { lat: 40.427562, lng: -86.912748 }; // Centered on WALC
    const [isLoading, setIsLoading] = useState(true);
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [points, setPoints] = useState(50); // Example points value
    const [water, setWater] = useState(4); // Example water value

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
        setSelectedMarker(selectedMarker?.id === property.id ? null : property);
    };

    return (
        <div className="relative w-full h-screen">
            {/* Profile Section with Stats */}
            <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10 flex items-center gap-6">
                <img
                    src="/default-avatar.png"
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
                />
                <div className="flex-1 min-w-[200px]">
                    <div className="mb-2">
                        <div className="flex justify-between mb-1">
                            <span>Points: {points}</span>
                            <span>{points}/100</span>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${points}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span>Water: {water}L</span>
                            <span>{water}/8L</span>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${(water/8) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

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