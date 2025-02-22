import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Scan = () => {
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        });

        scanner.render(success, error);

        function success(result) {
            scanner.clear();
            setScanResult(result);
            // Navigate to verification page with QR code
            navigate('/verify', { state: { qrCode: result } });
        }

        function error(err) {
            console.warn(err);
        }

        return () => {
            scanner.clear();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-center">QR Code Scanner</h2>
                {scanResult ? (
                    <div className="text-center">
                        <p>Success! QR Code detected:</p>
                        <p className="font-mono bg-gray-100 p-2 rounded mt-2">{scanResult}</p>
                    </div>
                ) : (
                    <div id="reader"></div>
                )}
            </div>
        </div>
    );
};

export default Scan;
