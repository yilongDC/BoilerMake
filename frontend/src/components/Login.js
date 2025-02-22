import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { BsCup } from 'react-icons/bs';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Get email from URL params if it exists
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/main');  // Changed from /dashboard to /main
            } else {
                setError(data.error || 'Invalid email or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Failed to connect to server. Please try again.');
        }
    };

    return (
        <motion.div 
            className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="bg-sky-100 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <BsCup className="w-10 h-10 text-sky-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h1>
                    <p className="text-gray-600">Sign in to continue your journey</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
                            required
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-lg transition"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-sky-500 hover:text-sky-600 text-sm"
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;
