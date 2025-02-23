import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';

const Scan = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('scanning'); // 'scanning', 'processing', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 550,
            },
            fps: 3,
        });

        scanner.render(success, error);

        async function success(result) {

            scanner.clear();
            setStatus('processing');

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                // First API call for check-in
                const checkInResponse = await fetch('http://127.0.0.1:5000/api/checkin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ locationId: result })
                });

                if (!checkInResponse.ok) {
                    const errorData = await checkInResponse.json();
                    throw new Error(errorData.error || 'Check-in failed');
                }

                const checkInData = await checkInResponse.json();
                
                setStatus('success');
                setMessage(checkInData.message);
                setTimeout(() => navigate('/map'), 2000);
            } catch (error) {
                console.error('Check-in error:', error);
                setStatus('error');
                setMessage(error.message || 'Network error. Please make sure you are connected to the internet.');
            }
        }

        function error(err) {
            console.warn(err);
        }

        return () => {
            scanner.clear();
        };
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#EFEDE6] p-4 relative">
            {/* Back Button */}
            <button 
                onClick={() => navigate('/map')}
                className="absolute top-4 left-4 p-2 text-gray-600 hover:text-[#BFB89B] transition-colors"
            >
                <IoArrowBack size={24} />
            </button>

            <div className="p-6 bg-white rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#BFB89B]">Scan QR Code</h2>
                
                {status === 'scanning' && (
                    <div id="reader" className="overflow-hidden rounded-lg border-2 border-[#BFB89B]/20"></div>
                )}

                {status === 'processing' && (
                    <div className="text-center p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BFB89B] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Processing check-in...</p>
                    </div>
                )}

                {(status === 'success' || status === 'error') && (
                    <div className={`text-center p-6 rounded-lg ${
                        status === 'success' 
                            ? 'bg-[#BFB89B]/10 text-[#BFB89B]' 
                            : 'bg-red-50 text-red-600'
                    }`}>
                        <p className="text-lg font-medium">{message}</p>
                        {status === 'error' && (
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-6 bg-[#BFB89B] text-white px-6 py-2 rounded-full hover:bg-[#ada789] transition-colors shadow-md"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scan;
