import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Scan = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('scanning'); // 'scanning', 'processing', 'success', 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(success, error);

        async function success(result) {
            scanner.clear();
            setStatus('processing');

            try {
                const response = await fetch('http://127.0.0.1:5000/api/checkin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ locationId: result })
                });

                const data = await response.json();
                
                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message || 'Check-in successful!');
                    setTimeout(() => navigate('/map'), 2000);
                } else {
                    setStatus('error');
                    setMessage(data.error || 'Failed to check in');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Network error. Please try again.');
                console.error('Check-in error:', error);
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">QR Code Scanner</h2>
                
                {status === 'scanning' && (
                    <div id="reader"></div>
                )}

                {status === 'processing' && (
                    <div className="text-center p-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto"></div>
                        <p className="mt-4">Processing check-in...</p>
                    </div>
                )}

                {(status === 'success' || status === 'error') && (
                    <div className={`text-center p-4 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        <p className="text-lg">{message}</p>
                        {status === 'error' && (
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
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
