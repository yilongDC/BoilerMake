import React from 'react';
import { motion } from 'framer-motion';
import { FaRunning, FaWalking, FaCouch } from 'react-icons/fa';

const ActivityStep = ({ activity, updateData, onNext, onBack }) => {
    const activities = [
        {
            id: 'sedentary',
            icon: <FaCouch size={24} />,
            title: 'Sedentary',
            description: 'Little to no regular exercise'
        },
        {
            id: 'moderate',
            icon: <FaWalking size={24} />,
            title: 'Moderate',
            description: 'Exercise 3-5 times a week'
        },
        {
            id: 'active',
            icon: <FaRunning size={24} />,
            title: 'Active',
            description: 'Daily exercise or intense training'
        }
    ];

    const handleSelect = (activityLevel) => {
        updateData('activityLevel', activityLevel);
    };

    return (
        <motion.div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">How active are you?</h1>
                
                <div className="space-y-4 mb-6">
                    {activities.map(item => (
                        <motion.button
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelect(item.id)}
                            className={`w-full p-4 rounded-xl border-2 transition flex items-center space-x-4 ${
                                activity === item.id
                                    ? 'border-sky-500 bg-sky-50'
                                    : 'border-gray-200 hover:border-sky-200'
                            }`}
                        >
                            <div className={`p-3 rounded-full ${
                                activity === item.id ? 'bg-sky-200' : 'bg-gray-100'
                            }`}>
                                {React.cloneElement(item.icon, {
                                    className: activity === item.id ? 'text-sky-500' : 'text-gray-400'
                                })}
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className={`font-semibold ${
                                    activity === item.id ? 'text-sky-500' : 'text-gray-700'
                                }`}>
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <button 
                        onClick={onBack}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                        Back
                    </button>
                    <button 
                        onClick={onNext}
                        disabled={!activity}
                        className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
                            activity ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ActivityStep;
