import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRegMap } from 'react-icons/fa';
import { IoTrophy, IoWater } from 'react-icons/io5';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-sky-50 border-t border-gray-200 px-4 py-1">
            <div className="flex justify-around items-center max-w-md mx-auto">
                <button
                    onClick={() => navigate('/leaderboard')}
                    className={`flex flex-col items-center p-1.5 ${isActive('/leaderboard') ? 'text-sky-700' : 'text-gray-600'}`}
                >
                    <IoTrophy className="w-6 h-6" />
                    <span className="text-xs mt-1">Leaderboard</span>
                </button>
                <button
                    onClick={() => navigate('/map')}
                    className={`flex flex-col items-center h-16 w-16 -mt-4 bg-sky-500 rounded-full shadow-lg ${isActive('/map') ? 'bg-sky-600' : ''}`}
                >
                    <FaRegMap className="w-6 h-6 text-white mt-3.5" />
                    <span className="text-xs text-white -mt-0.5">Map</span>
                </button>
                <button
                    onClick={() => navigate('/profile')}
                    className={`flex flex-col items-center p-1.5 ${isActive('/profile') ? 'text-sky-700' : 'text-gray-600'}`}
                >
                    <IoWater className="w-6 h-6" />
                    <span className="text-xs mt-1 mx-4">Profile</span>
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
