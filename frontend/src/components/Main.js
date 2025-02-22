import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsCup, BsGear } from 'react-icons/bs';
import { IoWater } from 'react-icons/io5';
import { FaMapMarkerAlt } from 'react-icons/fa';
import BottomNav from './BottomNav';

const Main = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <motion.div 
            className="min-h-screen bg-gradient-to-b from-sky-50 to-white pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-md mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <BsCup className="w-8 h-8 text-sky-500" />
                        <h1 className="text-xl font-bold text-gray-800">WaterTracker</h1>
                    </div>
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <BsGear className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Water Tracking Card */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Today's Progress</h2>
                            <IoWater className="w-6 h-6 text-sky-500" />
                        </div>
                        <div className="bg-sky-50 rounded-lg p-4 mb-4">
                            <div className="text-center">
                                <span className="text-3xl font-bold text-sky-500">0/8</span>
                                <p className="text-gray-600">cups of water</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                                <div className="bg-sky-500 h-2.5 rounded-full w-0"></div>
                            </div>
                        </div>
                        <button
                            onClick={() => {/* Add water intake */}}
                            className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition"
                        >
                            Add Water
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/map')}
                            className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-3 hover:bg-gray-50 transition"
                        >
                            <FaMapMarkerAlt className="w-6 h-6 text-sky-500" />
                            <span className="font-medium text-gray-800">Find Water</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-3 hover:bg-gray-50 transition"
                        >
                            <IoWater className="w-6 h-6 text-sky-500" />
                            <span className="font-medium text-gray-800">History</span>
                        </button>
                    </div>
                </div>
            </div>
            <BottomNav />
        </motion.div>
    );
};

export default Main;
