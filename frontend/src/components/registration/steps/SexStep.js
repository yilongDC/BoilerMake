import React from 'react';
import { motion } from 'framer-motion';
import { FaMars, FaVenus } from 'react-icons/fa';

const SexStep = ({ sex, updateData, onNext, onBack }) => {
    const handleSelect = (selectedSex) => {
        updateData('sex', selectedSex);
    };

    return (
        <motion.div 
            className="w-full max-w-md mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">What's your biological sex?</h1>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect('male')}
                        className={`p-6 rounded-xl border-2 transition flex flex-col items-center ${
                            sex === 'male'
                                ? 'border-sky-500 bg-sky-50'
                                : 'border-gray-200 hover:border-sky-200'
                        }`}
                    >
                        <FaMars className={`w-8 h-8 mb-2 ${sex === 'male' ? 'text-sky-500' : 'text-gray-400'}`} />
                        <span className={sex === 'male' ? 'text-sky-500' : 'text-gray-600'}>Male</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect('female')}
                        className={`p-6 rounded-xl border-2 transition flex flex-col items-center ${
                            sex === 'female'
                                ? 'border-sky-500 bg-sky-50'
                                : 'border-gray-200 hover:border-sky-200'
                        }`}
                    >
                        <FaVenus className={`w-8 h-8 mb-2 ${sex === 'female' ? 'text-sky-500' : 'text-gray-400'}`} />
                        <span className={sex === 'female' ? 'text-sky-500' : 'text-gray-600'}>Female</span>
                    </motion.button>
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
                        disabled={!sex}
                        className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
                            sex ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SexStep;
