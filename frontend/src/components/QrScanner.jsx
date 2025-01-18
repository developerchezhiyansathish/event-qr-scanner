import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
import './QrScanner.css';

const QrScanner = () => {
    const [scanResult, setScanResult] = useState('');
    const [message, setMessage] = useState('');
    const [facingMode, setFacingMode] = useState('environment'); // Default to rear camera

    const handleScan = async (data) => {
        if (data) {
            setScanResult(data);

            try {
                const response = await axios.post('https://event-qr-scanner.onrender.com/verify', {
                    uniqueId: JSON.parse(data).uniqueId,
                });

                if (response.data.status === 'verified') {
                    setMessage('✅ Scanned Pass');
                } else if (response.data.status === 'already scanned') {
                    setMessage('⚠️ Pass Already Scanned');
                } else {
                    setMessage('❌ Invalid Pass');
                }
            } catch (error) {
                console.error('Error verifying QR code:', error);
                setMessage('Error verifying QR code');
            }
        }
    };

    const handleError = (error) => {
        console.error('QR Reader Error:', error);
        setMessage('Error accessing camera. Please check permissions.');
    };

    const toggleCamera = () => {
        setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
    };

    return (
        <div className="qr-scanner-container">
            <h1 className="title">QR Code Scanner</h1>
            <div className="qr-reader-container">
                <QrReader
                    constraints={{ facingMode }} // Dynamically set the camera
                    onResult={(result, error) => {
                        if (result) {
                            handleScan(result.text);
                        }
                        if (error) {
                            handleError(error);
                        }
                    }}
                    className="qr-reader"
                />
            </div>
            <button onClick={toggleCamera} className="camera-toggle-btn">
                Switch to {facingMode === 'environment' ? 'Front' : 'Rear'} Camera
            </button>
            {scanResult && <p className="result-message">Scanned Data: {scanResult}</p>}
            {message && <p className="result-message">{message}</p>}
        </div>
    );
};

export default QrScanner;
