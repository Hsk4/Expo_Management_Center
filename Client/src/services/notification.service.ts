import api from './api';

export interface NotificationItem {
    _id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
    updatedAt: string;
    metadata?: {
        expoId?: string;
        supportRequestId?: string;
        boothApplicationId?: string;
    };
}

export const getMyNotifications = async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/notifications/me', { params });
    return response.data as {
        success: boolean;
        data: NotificationItem[];
        page: number;
        limit: number;
        total: number;
        unreadCount: number;
    };
};

export const getUnreadNotificationCount = async () => {
    const response = await api.get('/notifications/me/unread-count');
    return response.data as {
        success: boolean;
        data: { unreadCount: number };
    };
};

export const markNotificationAsRead = async (id: string) => {
    const response = await api.patch(`/notifications/me/${id}/read`);
    return response.data as {
        success: boolean;
        data: NotificationItem;
    };
};

export const markAllNotificationsAsRead = async () => {
    const response = await api.patch('/notifications/me/read-all');
    return response.data as {
        success: boolean;
        message: string;
        data: { modifiedCount: number };
    };
};

