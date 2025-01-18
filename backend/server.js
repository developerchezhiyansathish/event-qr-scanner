import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import QRCode from 'qrcode';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

// QR Schema
const qrSchema = new mongoose.Schema({
    uniqueId: { type: String, unique: true, required: true },
    eventName: { type: String, required: true },
    eventDate: { type: String, required: true },
    seatNumber: { type: String, required: true },
    qrCode: { type: String, required: true },
    isScanned: { type: Boolean, default: false },
});

const QR = mongoose.model('QR', qrSchema);

// Function to generate a unique 6-digit ID
const generateUniqueId = async () => {
    let uniqueId;
    let exists = true;

    while (exists) {
        uniqueId = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit number
        const existingQR = await QR.findOne({ uniqueId });
        exists = !!existingQR;
    }

    return uniqueId;
};

// Endpoint to generate QR code
app.post('/generate', async (req, res) => {
    const { eventName, eventDate, seatNumber } = req.body;

    if (!eventName || !eventDate || !seatNumber) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const uniqueId = await generateUniqueId();
        const qrData = { uniqueId, eventName, eventDate, seatNumber };
        const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

        const qr = new QR({ uniqueId, eventName, eventDate, seatNumber, qrCode });
        await qr.save();

        res.status(200).json({ qrCode, qrData });
    } catch (error) {
        console.error('Error generating QR Code:', error);
        res.status(500).json({ error: 'Error generating QR Code' });
    }
});

// Endpoint to verify QR code
app.post('/verify', async (req, res) => {
    const { uniqueId } = req.body;

    if (!uniqueId) {
        return res.status(400).json({ error: 'Unique ID is required' });
    }

    try {
        const qrRecord = await QR.findOne({ uniqueId });

        if (!qrRecord) {
            return res.status(404).json({ status: 'invalid' });
        }

        if (qrRecord.isScanned) {
            return res.status(200).json({ status: 'already scanned' });
        }

        qrRecord.isScanned = true;
        await qrRecord.save();

        res.status(200).json({ status: 'verified' });
    } catch (error) {
        console.error('Error verifying QR Code:', error);
        res.status(500).json({ error: 'Error verifying QR Code' });
    }
});

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
