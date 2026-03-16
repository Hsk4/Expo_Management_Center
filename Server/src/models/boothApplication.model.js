const mongoose = require('mongoose');

const boothApplicationSchema = new mongoose.Schema({
    expoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expo',
        required: true
    },
    boothId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booth',
        required: true
    },
    exhibitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyProfile: {
        companyName: { type: String, required: true, trim: true },
        bannerImage: { type: String, default: "" },
        website: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        instagram: { type: String, default: "" },
        description: { type: String, default: "" }
    },
    answers: {
        company_size: {
            type: String,
            required: true
        },
        industry: {
            type: String,
            required: true
        },
        booth_purpose: {
            type: String,
            required: true
        },
        previous_experience: {
            type: String,
            required: true
        },
        expected_visitors: {
            type: String,
            required: false
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid',
    },
    paymentReference: {
        type: String,
        default: '',
    },
    paidAt: {
        type: Date,
    },
    paymentAmount: {
        type: Number,
        min: 0,
        default: 0,
    },
    rejectionReason: {
        type: String,
        required: false
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for faster queries
boothApplicationSchema.index({ expoId: 1, exhibitorId: 1 });
boothApplicationSchema.index({ status: 1 });

module.exports = mongoose.model('BoothApplication', boothApplicationSchema);

