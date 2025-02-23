import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoWater, IoTrophy } from 'react-icons/io5';
import { FaMapMarkerAlt } from 'react-icons/fa';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around items-center max-w-md mx-auto">
                <button
                    onClick={() => navigate('/map')}
                    className={`flex flex-col items-center p-2 ${isActive('/map') ? 'text-sky-500' : 'text-gray-600'}`}
                >
                    <FaMapMarkerAlt className="w-8 h-8" />
                </button>
                <button
                    onClick={() => navigate('/main')}
                    className={`flex flex-col items-center p-2 -mt-6 bg-sky-500 rounded-full shadow-lg ${isActive('/main') ? 'bg-sky-600' : ''}`}
                >
                    <IoWater className="w-12 h-12 text-white" />
                </button>
                <button
                    onClick={() => navigate('/leaderboard')}
                    className={`flex flex-col items-center p-2 ${isActive('/leaderboard') ? 'text-sky-500' : 'text-gray-600'}`}
                >
                    <IoTrophy className="w-9 h-9" />
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
