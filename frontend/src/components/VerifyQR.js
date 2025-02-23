import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyQR = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [verificationStatus, setVerificationStatus] = useState('verifying');
    const [points, setPoints] = useState(0);
    
    useEffect(() => {
        const verifyQRCode = async () => {
            if (!location.state?.qrCode) {
                navigate('/scan');
                return;
            }

            // Clean the QR code and log it
            const cleanQRCode = location.state.qrCode.trim();
            console.log('Sending QR code to backend:', cleanQRCode);

            try {
                const token = localStorage.getItem('token');
                console.log("gg");
                const response = axios.post('http://localhost:5000/api/qr/scan', { qr_code: cleanQRCode }, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Correct format
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true // Correctly placed
                })
                .then(response => {
                    console.log(response.data);
                  })
                  .catch(error => {
                    console.error(error);
                  });
                
                console.log('Backend response:', response.data);
                setVerificationStatus('success');
                setPoints(response.data.points_earned);
            } catch (error) {
                console.error('Error:', error);
                setVerificationStatus(error.response?.status === 429 ? 'cooldown' : 'error');
            }
        };

        verifyQRCode();
    }, [location.state, navigate]);

    const getStatusMessage = () => {
        switch (verificationStatus) {
            case 'verifying':
                return 'Verifying QR code...';
            case 'success':
                return `Success! You earned ${points} points!`;
            case 'cooldown':
                return 'Please wait before scanning this QR code again';
            case 'error':
                return 'Invalid QR code';
            default:
                return 'Something went wrong';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">QR Verification</h2>
                <p className="mb-4">{getStatusMessage()}</p>
                {verificationStatus === 'success' && (
                    <div className="animate-bounce text-4xl mb-4">🎉</div>
                )}
                <button
                    onClick={() => navigate('/scan')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Scan Another QR
                </button>
                <button
                    onClick={() => navigate('/leaderboard')}
                    className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    View Leaderboard
                </button>
            </div>
        </div>
    );
};

export default VerifyQR;
