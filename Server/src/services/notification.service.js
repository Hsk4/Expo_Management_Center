const Notification = require('../models/notification.model');
const User = require('../models/user.model');
const Expo = require('../models/expo.model');

const REMINDER_WINDOWS = [
    { label: '7 days', hours: 168 },
    { label: '3 days', hours: 72 },
    { label: '1 day', hours: 24 },
    { label: '1 hour', hours: 1 },
];

const safeCreate = async (payload) => {
    try {
        return await Notification.create(payload);
    } catch (error) {
        if (error?.code === 11000) return null;
        throw error;
    }
};

const createNotification = async ({ recipientId, type, title, message, metadata = {}, dedupeKey = '' }) => {
    if (!recipientId || !title || !message || !type) return null;
    return safeCreate({ recipientId, type, title, message, metadata, dedupeKey });
};

const createBulkNotifications = async ({ userIds, type, title, message, metadata = {}, dedupeKeyBuilder }) => {
    if (!Array.isArray(userIds) || userIds.length === 0) return 0;

    let createdCount = 0;
    for (const userId of userIds) {
        const dedupeKey = typeof dedupeKeyBuilder === 'function' ? dedupeKeyBuilder(String(userId)) : '';
        const created = await createNotification({ recipientId: userId, type, title, message, metadata, dedupeKey });
        if (created) createdCount += 1;
    }
    return createdCount;
};

const getActiveUserIds = async (filter = {}) => {
    const users = await User.find({ isActive: true, ...filter }).select('_id');
    return users.map((u) => u._id);
};

const notifyUser = async ({ userId, type, title, message, metadata = {}, dedupeKey = '' }) => {
    return createNotification({ recipientId: userId, type, title, message, metadata, dedupeKey });
};

const notifyAdmins = async ({ type, title, message, metadata = {}, dedupeKeyPrefix = '' }) => {
    const adminIds = await getActiveUserIds({ role: 'admin' });
    return createBulkNotifications({
        userIds: adminIds,
        type,
        title,
        message,
        metadata,
        dedupeKeyBuilder: dedupeKeyPrefix ? (userId) => `${dedupeKeyPrefix}:${userId}` : undefined,
    });
};

const notifyAllUsers = async ({ type, title, message, metadata = {}, dedupeKeyPrefix = '' }) => {
    const userIds = await getActiveUserIds();
    return createBulkNotifications({
        userIds,
        type,
        title,
        message,
        metadata,
        dedupeKeyBuilder: dedupeKeyPrefix ? (userId) => `${dedupeKeyPrefix}:${userId}` : undefined,
    });
};

const notifyExpoPublished = async (expo) => {
    if (!expo?._id) return 0;
    return notifyAllUsers({
        type: 'expo-new',
        title: 'New expo added',
        message: `${expo.title} is now available. Check details and register early.`,
        metadata: { expoId: expo._id },
        dedupeKeyPrefix: `expo-new:${expo._id}`,
    });
};

const processExpoReminders = async () => {
    const now = new Date();
    const expos = await Expo.find({ status: 'published', isActive: true, startDate: { $gt: now } }).select('_id title startDate');
    if (expos.length === 0) return 0;

    const userIds = await getActiveUserIds();
    if (userIds.length === 0) return 0;

    let totalCreated = 0;
    for (const expo of expos) {
        const startMs = new Date(expo.startDate).getTime();

        for (const window of REMINDER_WINDOWS) {
            const triggerMs = startMs - window.hours * 60 * 60 * 1000;
            if (now.getTime() < triggerMs) continue;

            const created = await createBulkNotifications({
                userIds,
                type: 'expo-reminder',
                title: `Expo starts in ${window.label}`,
                message: `${expo.title} begins in ${window.label}. Plan your schedule now.`,
                metadata: { expoId: expo._id },
                dedupeKeyBuilder: (userId) => `expo-reminder:${expo._id}:${window.hours}:${userId}`,
            });
            totalCreated += created;
        }
    }

    return totalCreated;
};

module.exports = {
    createNotification,
    notifyUser,
    notifyAdmins,
    notifyAllUsers,
    notifyExpoPublished,
    processExpoReminders,
};
