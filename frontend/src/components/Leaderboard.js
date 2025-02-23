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
            <div className="min-h-screen bg-sky-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-sky-50 p-6">
                <div className="text-red-500 text-center">{error}</div>
                <BottomNav />
            </div>
        );
    }

    return (
        <motion.div 
            className="min-h-screen bg-gray-50 pb-20" // plain off white background
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="max-w-md mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Community
                </h1>
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Top Hydrators</h2>
                    <div className="space-y-4">
                        {leaders.map((user, index) => (
                            <div 
                                key={user._id}
                                className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-full
                                        ${index === 0 ? 'bg-amber-400 text-white' :
                                          index === 1 ? 'bg-slate-300 text-white' :
                                          index === 2 ? 'bg-amber-700 text-white' : 'bg-gray-300 text-gray-800'}`}>
                                        <span className="font-bold">{index + 1}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.takenWater}ml today</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-gray-800">{user.points}</span>
                                    <span className="text-gray-600 text-sm ml-1">pts</span>
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
