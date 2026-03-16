const { processExpoReminders } = require('./notification.service');

const startNotificationScheduler = () => {
    const intervalMs = 60 * 1000;

    const run = async () => {
        try {
            await processExpoReminders();
        } catch (error) {
            console.error('Notification scheduler error:', error.message);
        }
    };

    // Warm-up run at startup and then every minute.
    run();
    const intervalId = setInterval(run, intervalMs);

    return intervalId;
};

module.exports = { startNotificationScheduler };

