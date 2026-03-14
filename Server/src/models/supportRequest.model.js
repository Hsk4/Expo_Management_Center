const mongoose = require('mongoose');

const supportRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        enum: ['attendee', 'exhibitor', 'admin'],
        required: true,
    },
    type: {
        type: String,
        enum: ['support', 'feedback'],
        default: 'support',
        required: true,
    },
    subject: {
        type: String,
        trim: true,
        required: [true, 'Subject is required'],
        minlength: [3, 'Subject must be at least 3 characters long'],
        maxlength: [120, 'Subject must be less than 120 characters long'],
    },
    message: {
        type: String,
        trim: true,
        required: [true, 'Message is required'],
        minlength: [10, 'Message must be at least 10 characters long'],
        maxlength: [1500, 'Message must be less than 1500 characters long'],
    },
    expoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expo',
        default: null,
    },
    status: {
        type: String,
        enum: ['open', 'in-review', 'resolved'],
        default: 'open',
    },
}, {
    timestamps: true,
});

supportRequestSchema.index({ userId: 1, createdAt: -1 });
supportRequestSchema.index({ status: 1, type: 1 });

module.exports = mongoose.model('SupportRequest', supportRequestSchema);

