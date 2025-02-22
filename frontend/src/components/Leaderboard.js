import React from 'react';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';

const Leaderboard = () => {
    return (
        <motion.div 
            className="min-h-screen bg-gradient-to-b from-sky-50 to-white pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-md mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Community</h1>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Top Hydrators</h2>
                    {/* Add leaderboard content here */}
                </div>
            </div>
            <BottomNav />
        </motion.div>
    );
};

export default Leaderboard;
