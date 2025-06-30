const mongoose = require('mongoose');

const redTagSchema = new mongoose.Schema({
    tagNo: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    subArea: {
        type: String,
        required: true
    },
    dateDetected: {
        type: Date,
        required: true
    },
    detectedBy: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    beforePhoto: {
        type: String
    },
    removedBy: {
        type: String
    },
    dateRemoved: {
        type: Date
    },
    actionTaken: {
        type: String
    },
    afterPhoto: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'removed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RedTag', redTagSchema);