"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import BottomNav from './BottomNav';
import { properties } from '../data/properties';
import MarkerContent from './MarkerContent';
import UserStats from './UserStats';
import { getCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { BsQrCodeScan } from 'react-icons/bs'; // Add this import

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function SimpleMap() {
    const navigate = useNavigate();
    const defaultCenter = { lat: 40.427562, lng: -86.912748 }; // Centered on WALC
    const [isLoading, setIsLoading] = useState(true);
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [user, setUser] = useState(null);
    const [isAnyPopupOpen, setIsAnyPopupOpen] = useState(false);

    // Get user location
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

    // Fetch user data
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchUser();
        const interval = setInterval(fetchUser, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [navigate]);

    const handleMarkerClick = (property) => {
        const newSelectedMarker = selectedMarker?.id === property.id ? null : property;
        setSelectedMarker(newSelectedMarker);
        setIsAnyPopupOpen(!!newSelectedMarker);
    };

    const handleMapClick = () => {
        setSelectedMarker(null);
        setIsAnyPopupOpen(false);
    };

    return (
        <div className="relative w-full h-screen">
            {/* User Stats */}
            <div className="absolute top-4 left-4 z-10">
                <UserStats user={user} />
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
                        onClick={handleMapClick}
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
                                    anyPopupOpen={isAnyPopupOpen}
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

            {/* Floating QR Scan Button */}
            <button
                onClick={() => navigate('/scan')}
                className="fixed bottom-20 right-6 w-14 h-14 bg-sky-500 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-sky-600 transition-colors"
            >
                <BsQrCodeScan className="w-6 h-6 text-white" />
            </button>

            <BottomNav />
        </div>
    );
}

export default SimpleMap;