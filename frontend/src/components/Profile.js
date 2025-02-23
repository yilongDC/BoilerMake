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
            <div className="min-h-screen bg-gradient-to-b from-[#F4F3EE] to-white flex items-center justify-center">
                <div className="text-[#CB997E]">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#F4F3EE] to-white flex items-center justify-center">
                <div className="text-[#E6BEAE]">{error}</div>
            </div>
        );
    }

    return (
        <motion.div 
            className="h-screen bg-gradient-to-b from-[#F4F3EE] to-white overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="h-full max-w-md mx-auto p-6 grid grid-rows-[auto_auto_auto_1fr]">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <BsPersonCircle className="w-8 h-8 text-[#CB997E]" />
                        <h1 className="text-xl font-bold text-[#2C3639]">Profile</h1>
                    </div>
                    <button
                        onClick={() => navigate('/settings')}
                        className="p-2 rounded-full hover:bg-[#F4F3EE]"
                    >
                        <BsGear className="w-6 h-6 text-[#CB997E]" />
                    </button>
                </div>

                {/* Profile Info */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-[#DFDBCD]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 bg-[#F4F3EE] rounded-full flex items-center justify-center">
                            <BsPersonCircle className="w-12 h-12 text-[#CB997E]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#2C3639]">{userData?.name || 'No Name'}</h2>
                            <p className="text-[#5C6B73]">{userData?.email || 'No Email'}</p>
                        </div>
                    </div>
                </div>

                {/* Water Progress Card */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-[#DFDBCD]">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#2C3639]">Today's Progress</h2>
                        <IoWater className="w-6 h-6 text-[#E6BEAE]" />
                    </div>
                    <div className="bg-[#F4F3EE] rounded-lg p-4">
                        <div className="text-center">
                            <span className="text-3xl font-bold text-[#CB997E]">
                                {(userData?.takenWater / 1000).toFixed(1)}/{userData?.daily_water_intake}L
                            </span>
                            <p className="text-[#5C6B73] mt-1">
                                {calculateBottles(userData?.daily_water_intake || 0, userData?.takenWater || 0)} bottles remaining
                            </p>
                        </div>
                        <div className="w-full bg-white rounded-full h-2.5 mt-4">
                            <div 
                                className="bg-[#E6BEAE] h-2.5 rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${Math.min((userData?.takenWater / (userData?.daily_water_intake * 1000)) * 100, 100)}%` 
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Bouncing Face Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden h-64 border border-[#DFDBCD]">
                    <BouncingFace />
                </div>
            </div>
            <BottomNav />
        </motion.div>
    );
};

export default Profile;
