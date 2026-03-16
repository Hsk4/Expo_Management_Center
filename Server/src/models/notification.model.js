const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    type: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [140, 'Title must be less than 140 characters'],
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: [500, 'Message must be less than 500 characters'],
    },
    metadata: {
        expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', default: null },
        supportRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportRequest', default: null },
        boothApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'BoothApplication', default: null },
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true,
    },
    readAt: {
        type: Date,
        default: null,
    },
    dedupeKey: {
        type: String,
        default: '',
        trim: true,
    },
}, {
    timestamps: true,
});

notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index(
    { dedupeKey: 1 },
    { unique: true, partialFilterExpression: { dedupeKey: { $type: 'string', $ne: '' } } }
);

module.exports = mongoose.model('Notification', notificationSchema);

