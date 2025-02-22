import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NameStep = ({ name, updateData, onNext, onBack }) => {
    const [nameInput, setNameInput] = useState(name);

    const handleContinue = () => {
        if (nameInput.trim()) {
            updateData('name', nameInput.trim());
            onNext();
        }
    };

    return (
        <motion.div 
            className="w-full max-w-md mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">What's your name?</h1>
                
                <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition mb-6"
                    autoFocus
                />
                
                <div className="flex space-x-4">
                    <button 
                        onClick={onBack}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleContinue}
                        disabled={!nameInput.trim()}
                        className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
                            nameInput.trim() ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default NameStep;
