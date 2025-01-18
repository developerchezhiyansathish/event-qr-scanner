// src/components/QrCodeGenerator.jsx
import React, { useState } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code'; // Importing the react-qr-code library
import './QrCodeGenerator.css';
import Header from './Header';

const QrCodeGenerator = () => {
    const [seatNumber, setSeatNumber] = useState('');
    const [qrData, setQrData] = useState(null); // Store QR data instead of the QR code string
    const eventName = 'Deva Concerts - Madurai';
    const eventDate = '18 Jan 2024';

    const handleGenerateQrCode = async () => {
        try {
            const response = await axios.post('http://localhost:3001/generate', {
                eventName,
                eventDate,
                seatNumber,
            });

            // Set the QR data from the response
            setQrData(response.data.qrData); // Assuming the server returns the QR data
        } catch (error) {
            console.error('Error generating QR code:', error.response?.data || error.message);
        }
    };

    const handleDownloadQrCode = () => {
        const svg = document.getElementById('qr-code-svg'); // Get the SVG element
        const svgData = new XMLSerializer().serializeToString(svg); // Serialize the SVG element
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' }); // Create a blob
        const url = URL.createObjectURL(svgBlob); // Create a URL for the blob

        const link = document.createElement('a');
        link.href = url;
        // Set the download filename to include "DevaConcert" and the input seat number
        link.download = `DevaConcert_${seatNumber}.svg`; 
        link.click();

        // Clean up
        URL.revokeObjectURL(url);
    };

    return (
        <>

        <Header/>
        
        <div className="qr-generator-container">
            <h1 className="title">Event QR Code Generator</h1>
            <div className="form-container">
                <label>Seat Number</label>
                <input
                    type="text"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                />

                <button onClick={handleGenerateQrCode} className="generate-button">
                    Generate QR Code
                </button>
            </div>

            {qrData && (
                <div className="qr-code-container">
                    <h3>Your QR Code</h3>
                    <QRCode
                        id="qr-code-svg" // Assign ID for SVG download
                        value={JSON.stringify(qrData)} // Pass the QR data as a JSON string
                        size={256}
                        bgColor="#ffffff"
                        fgColor="#000000"
                    />
                    <button onClick={handleDownloadQrCode} className="download-button">
                        Download QR Code
                    </button>
                </div>
            )}
        </div>

        </>
    );
};

export default QrCodeGenerator;
