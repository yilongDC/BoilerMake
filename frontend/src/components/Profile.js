import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BsPersonCircle, BsGear } from 'react-icons/bs';
import { IoWater } from 'react-icons/io5';
import BottomNav from './BottomNav';
import { getUserProfile } from '../services/api';
import BouncingFace from './BounchingFace';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserProfile();
                console.log('Fetched user data:', data);
                setUserData(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to load profile data. Please try again later.');
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const calculateBottles = (totalML, takenML) => {
        const BOTTLE_SIZE = 500; // 500ml per bottle
        const remainingML = (totalML * 1000) - takenML;
        return Math.ceil(remainingML / BOTTLE_SIZE);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="text-red-500 text-center">{error}</div>
                <BottomNav />
            </div>
        );
    }

    return (
        <motion.div 
            className="min-h-screen bg-gray-50 pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-md mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <BsGear className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <BsPersonCircle className="w-8 h-8 text-gray-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{userData?.name || 'No Name'}</h2>
                            <p className="text-gray-600">{userData?.email || 'No Email'}</p>
                        </div>
                    </div>
                </div>

                {/* Water Progress Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">Today's Progress</h2>
                        <IoWater className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                        <div className="text-center">
                            <span className="text-3xl font-bold text-gray-800">
                                {(userData?.takenWater / 1000).toFixed(1)}/{userData?.daily_water_intake}L
                            </span>
                            <p className="text-gray-600 mt-1">
                                {calculateBottles(userData?.daily_water_intake || 0, userData?.takenWater || 0)} bottles remaining
                            </p>
                        </div>
                        <div className="w-full bg-white rounded-full h-2.5 mt-4 overflow-hidden">
                            <motion.div 
                                className="bg-gray-600 h-2.5 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((userData?.takenWater / (userData?.daily_water_intake * 1000)) * 100, 100)}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            ></motion.div>
                        </div>
                    </div>
                </div>

                {/* Bouncing Face Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden h-64 border border-gray-300">
                    <BouncingFace />
                </div>
            </div>
            <BottomNav />
        </motion.div>
    );
};

export default Profile;
