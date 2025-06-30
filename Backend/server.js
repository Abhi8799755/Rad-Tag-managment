require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Red Tag Model
const RedTag = require('./models/RedTag');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Routes
// Add new red tag
app.post('/api/redtags', upload.single('beforePhoto'), async (req, res) => {
    try {
        const { tagNo, area, subArea, dateDetected, detectedBy, description } = req.body;
        
        const newTag = new RedTag({
            tagNo,
            area,
            subArea,
            dateDetected,
            detectedBy,
            description,
            beforePhoto: req.file ? req.file.path : null,
            status: 'pending'
        });

        await newTag.save();
        res.status(201).json(newTag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Remove red tag
app.put('/api/redtags/:tagNo', upload.single('afterPhoto'), async (req, res) => {
    try {
        const { removedBy, dateRemoved, actionTaken } = req.body;
        const tagNo = req.params.tagNo;

        const tag = await RedTag.findOne({ tagNo });
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }

        tag.removedBy = removedBy;
        tag.dateRemoved = dateRemoved;
        tag.actionTaken = actionTaken;
        tag.afterPhoto = req.file ? req.file.path : null;
        tag.status = 'removed';

        await tag.save();
        res.json(tag);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all red tags
app.get('/api/redtags', async (req, res) => {
    try {
        const tags = await RedTag.find().sort({ dateDetected: -1 });
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get dashboard counts
app.get('/api/redtags/counts', async (req, res) => {
    try {
        const total = await RedTag.countDocuments();
        const removed = await RedTag.countDocuments({ status: 'removed' });
        const pending = total - removed;

        const zone71 = await RedTag.countDocuments({ area: 'ZONE 7.1' });
        const zone71Removed = await RedTag.countDocuments({ area: 'ZONE 7.1', status: 'removed' });
        const zone71Pending = zone71 - zone71Removed;

        const zone72 = await RedTag.countDocuments({ area: 'ZONE 7.2' });
        const zone72Removed = await RedTag.countDocuments({ area: 'ZONE 7.2', status: 'removed' });
        const zone72Pending = zone72 - zone72Removed;

        const zone73 = await RedTag.countDocuments({ area: 'ZONE 7.3' });
        const zone73Removed = await RedTag.countDocuments({ area: 'ZONE 7.3', status: 'removed' });
        const zone73Pending = zone73 - zone73Removed;

        res.json({
            total,
            removed,
            pending,
            zones: {
                zone71: { total: zone71, removed: zone71Removed, pending: zone71Pending },
                zone72: { total: zone72, removed: zone72Removed, pending: zone72Pending },
                zone73: { total: zone73, removed: zone73Removed, pending: zone73Pending }
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});