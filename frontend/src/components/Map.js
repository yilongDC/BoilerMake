"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import BottomNav from './BottomNav';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function SimpleMap() {
    const defaultCenter = { lat: 37.7749, lng: -122.4194 };
    const [isLoading, setIsLoading] = useState(true);
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);

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

    return (
        <div className="relative h-screen">
            <div className="h-[calc(100vh-64px)] relative">
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                    <Map 
                        defaultZoom={18} 
                        center={currentPosition} 
                        tilt={55}
                        fullscreenControl={false} 
                        mapId={process.env.REACT_APP_PERSONAL_MAP_ID}
                        onTilesLoaded={() => setIsLoading(false)}
                    />
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