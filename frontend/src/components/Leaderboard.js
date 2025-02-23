import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BottomNav from './BottomNav';
import { getLeaderboard } from '../services/api';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard();
                setLeaders(data);
                setLoading(false);
            } catch (err) {
                console.error('Leaderboard error:', err);
                setError('Failed to load leaderboard');
                setLoading(false);
            }
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-6">
                <div className="text-red-500 text-center">{error}</div>
                <BottomNav />
            </div>
        );
    }

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
                    <div className="space-y-4">
                        {leaders.map((user, index) => (
                            <div 
                                key={user._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full
                                        ${index === 0 ? 'bg-yellow-400' :
                                          index === 1 ? 'bg-gray-300' :
                                          index === 2 ? 'bg-amber-600' : 'bg-blue-100'}`}>
                                        <span className="font-bold">{index + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{user.name}</h3>
                                        <p className="text-sm text-gray-500">{user.takenWater}ml today</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-blue-600">{user.points}</span>
                                    <span className="text-gray-500 text-sm ml-1">pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <BottomNav />
        </motion.div>
    );
};

export default Leaderboard;
