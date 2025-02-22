import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

const PasswordStep = ({ password, updateData, onNext, onBack }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState(password || '');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const requirements = [
        { id: 'length', test: p => p.length >= 8, text: 'At least 8 characters' },
        { id: 'uppercase', test: p => /[A-Z]/.test(p), text: 'One uppercase letter' },
        { id: 'lowercase', test: p => /[a-z]/.test(p), text: 'One lowercase letter' },
        { id: 'number', test: p => /[0-9]/.test(p), text: 'One number' },
        { id: 'match', test: p => p === confirmPassword && p !== '', text: 'Passwords match' }
    ];

    const handleContinue = () => {
        const failedRequirements = requirements.filter(req => !req.test(passwordInput));
        if (failedRequirements.length > 0) {
            setError(failedRequirements[0].text);
            return;
        }
        updateData('password', passwordInput);
        onNext();
    };

    return (
        <motion.div 
            className="w-full max-w-md mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create a password</h1>
                
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={passwordInput}
                            onChange={(e) => {
                                setPasswordInput(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError('');
                        }}
                        placeholder="Confirm password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
                    />

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
                        <ul className="space-y-2">
                            {requirements.map(req => (
                                <li 
                                    key={req.id}
                                    className="flex items-center text-sm"
                                >
                                    {req.test(passwordInput) ? (
                                        <FaCheck className="text-green-500 mr-2" />
                                    ) : (
                                        <FaTimes className="text-gray-300 mr-2" />
                                    )}
                                    <span className={req.test(passwordInput) ? 'text-green-500' : 'text-gray-500'}>
                                        {req.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button 
                        onClick={onBack}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleContinue}
                        className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PasswordStep;
