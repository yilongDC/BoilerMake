"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import BottomNav from './BottomNav';
import { properties } from '../data/properties';
import MarkerContent from './MarkerContent';
import UserStats from './UserStats';
import { getCurrentUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { BsQrCodeScan } from 'react-icons/bs';
import { isAuthenticated, getToken } from '../utils/auth';  // Add this import
import { FaUser } from 'react-icons/fa'; // Add this import at the top

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function SimpleMap() {
    const navigate = useNavigate();
    const defaultCenter = { lat: 40.427562, lng: -86.912748 }; // Centered on WALC
    const [isLoading, setIsLoading] = useState(true);
    const [currentPosition, setCurrentPosition] = useState(defaultCenter);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [user, setUser] = useState(null);
    const [isAnyPopupOpen, setIsAnyPopupOpen] = useState(false);
    const [userHeading, setUserHeading] = useState(null);

    // Get user location
    useEffect(() => {
        let watchId;
        if (navigator.geolocation) {
            // Get initial position
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

            // Watch position continuously
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setCurrentPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    if (position.coords.heading !== null) {
                        setUserHeading(position.coords.heading);
                    }
                },
                (error) => console.error("Error watching location:", error),
                {
                    enableHighAccuracy: true,
                    maximumAge: 1000,
                    timeout: 5000
                }
            );
        }

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    // Add debug useEffect
    useEffect(() => {
        const token = getToken();
        console.log('Map Debug:', {
            hasToken: !!token,
            tokenValue: token?.substring(0, 10) + '...',  // Show first 10 chars only
            isLoading,
            hasUser: !!user
        });
    }, [isLoading, user]);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getCurrentUser();
                console.log('User data fetched successfully:', !!userData);
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', {
                    status: error.response?.status,
                    message: error.message
                });
                if (error.response?.status === 401) {
                    navigate('/login', { replace: true });
                }
            }
        };

        fetchUser();
        const interval = setInterval(fetchUser, 60000);
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
                        maxZoom={18}
                        minZoom={15.5}
                        defaultZoom={17.2} 
                        center={currentPosition} 
                        tilt={45}
                        mapId={process.env.REACT_APP_PERSONAL_MAP_ID}
                        onLoaded={() => setIsLoading(false)}
                        disableDefaultUI={true}
                        onClick={handleMapClick}
                    >
                        <AdvancedMarker
                            position={currentPosition}
                            zIndex={1000}
                        >
                            <div className="relative">
                                <div 
                                    className="animate-float relative"
                                    style={{
                                        transformOrigin: 'bottom',
                                        transform: 'perspective(100px) rotateX(10deg)',
                                    }}
                                >
                                    <div className="relative flex items-center justify-center">
                                        <div className="w-8 h-8 bg-[#C6DEF1] rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                                            <FaUser className="text-white text-lg w-4 h-4" />
                                        </div>
                                        {userHeading !== null && (
                                            <div 
                                                className="absolute top-1/2 left-1/2 w-12 h-1 bg-[#C6DEF1]"
                                                style={{
                                                    transform: `translate(-25%, -50%) rotate(${userHeading}deg)`,
                                                    opacity: 0.8
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div 
                                        className="absolute -bottom-1 left-1/2 w-6 h-1.5 bg-black/20 rounded-full blur-sm"
                                        style={{ transform: 'translateX(-50%)' }}
                                    />
                                </div>
                            </div>
                        </AdvancedMarker>
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
                    <div className="absolute inset-0 bg-sky-50 flex items-center justify-center" style={{ zIndex: 1000 }}>
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