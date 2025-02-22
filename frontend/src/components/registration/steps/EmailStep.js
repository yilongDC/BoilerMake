import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaApple, FaFacebook } from 'react-icons/fa';
import { BsCup } from 'react-icons/bs';

const EmailStep = ({ email, updateData, onNext }) => {
    const [emailInput, setEmailInput] = useState(email);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleContinue = async () => {
        setError('');
        
        if (!emailInput) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(emailInput)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            // Check if email exists
            const response = await fetch(`http://127.0.0.1:5000/api/auth/check-email?email=${emailInput}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.exists) {
                // Redirect to login if email exists
                window.location.href = `/login?email=${emailInput}`;
            } else {
                updateData('email', emailInput);
                onNext();
            }
        } catch (error) {
            if (error instanceof TypeError && error.message === "Failed to fetch") {
                console.error("Network error:", error);
                alert("Network error. Please check your internet connection and ensure the server is running.");
            } else {
                console.error("Could not check email:", error);
                alert("Failed to check email. Please try again later.");
            }
        }
    };

    return (
        <motion.div 
            className="w-full max-w-md mx-auto px-4 h-screen flex items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8 w-full">
                <div className="text-center mb-8">
                    <div className="bg-sky-100 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <BsCup className="w-10 h-10 text-sky-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Journey to Drinking More Water
                    </h1>
                    <p className="text-gray-600">Let's get started with your email</p>
                </div>

                <div className="relative w-full mb-4">
                    <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => {
                            setEmailInput(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter your email"
                        className={`w-full px-4 py-3 rounded-lg border ${
                            error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-sky-400'
                        } focus:ring-2 ${
                            error ? 'focus:ring-red-100' : 'focus:ring-sky-100'
                        } outline-none transition`}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                </div>

                <button
                    onClick={handleContinue}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition mb-8"
                >
                    Continue
                </button>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500">or continue with</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <FcGoogle className="w-5 h-5 mr-3" />
                        <span className="text-gray-600">Continue with Google</span>
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <FaApple className="w-5 h-5 mr-3" />
                        <span className="text-gray-600">Continue with Apple</span>
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                        <FaFacebook className="w-5 h-5 mr-3 text-blue-600" />
                        <span className="text-gray-600">Continue with Facebook</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default EmailStep;
