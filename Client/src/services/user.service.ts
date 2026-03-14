import api from './api';
import type { ExpoSession } from './expo.service';

export interface UserProfileData {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'exhibitor' | 'attendee';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    profile: {
        avatarUrl: string;
        phone: string;
        organization: string;
        bio: string;
        companyName: string;
        companyDescription: string;
        website: string;
        linkedin: string;
        instagram: string;
        supportEmail: string;
    };
}

export interface AttendedExpoRegistration {
    expoId: {
        _id: string;
        title: string;
        theme?: string;
        location: string;
        startDate: string;
        endDate: string;
        status: 'draft' | 'published' | 'completed';
    };
    visitedAt: string;
}

export interface BookedBoothRegistration {
    expoId: {
        _id: string;
        title: string;
        theme?: string;
        location: string;
        startDate: string;
        endDate: string;
        status: 'draft' | 'published' | 'completed';
    };
    boothId: {
        _id: string;
        boothNumber: string;
        row: number;
        col: number;
        status: 'available' | 'reserved' | 'booked' | 'disabled';
    };
    bookedAt: string;
}

export interface BoothApplicationRegistration {
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    reviewedAt?: string;
    rejectionReason?: string;
    expoId?: {
        _id: string;
        title: string;
        theme?: string;
        location: string;
        startDate: string;
        endDate: string;
        status: 'draft' | 'published' | 'completed';
    };
    boothId?: {
        _id: string;
        boothNumber: string;
        row: number;
        col: number;
    };
}

export interface BookmarkedSessionRegistration {
    expoId: {
        _id: string;
        title: string;
        theme?: string;
        location: string;
        startDate: string;
        endDate: string;
        status: 'draft' | 'published' | 'completed';
    };
    session: ExpoSession & { _id: string };
    bookmarkedAt: string;
}

export interface SupportRequestItem {
    _id: string;
    role: 'attendee' | 'exhibitor' | 'admin';
    type: 'support' | 'feedback';
    subject: string;
    message: string;
    status: 'open' | 'in-review' | 'resolved';
    expoId?: {
        _id: string;
        title: string;
        location: string;
        startDate: string;
        endDate: string;
        status: 'draft' | 'published' | 'completed';
    } | null;
    createdAt: string;
    updatedAt: string;
}

export interface RegistrationSummary {
    attendedExpos: AttendedExpoRegistration[];
    bookedBooths: BookedBoothRegistration[];
    boothApplications: BoothApplicationRegistration[];
    bookmarkedSessions: BookmarkedSessionRegistration[];
}

export const getCurrentUserProfile = async () => {
    const response = await api.get('/users/me');
    return response.data as {
        success: boolean;
        data: UserProfileData;
    };
};

export const updateCurrentUserProfile = async (payload: Pick<UserProfileData, 'name' | 'email' | 'profile'>) => {
    const response = await api.put('/users/me', payload);
    return response.data as {
        success: boolean;
        message: string;
        data: UserProfileData;
    };
};

export const getMyRegistrations = async () => {
    const response = await api.get('/users/me/registrations');
    return response.data as {
        success: boolean;
        data: RegistrationSummary;
    };
};

export const getMySessionBookmarks = async (expoId?: string) => {
    const response = await api.get('/users/me/session-bookmarks', {
        params: expoId ? { expoId } : undefined,
    });
    return response.data as {
        success: boolean;
        data: BookmarkedSessionRegistration[];
    };
};

export const addSessionBookmark = async (expoId: string, sessionId: string) => {
    const response = await api.post('/users/me/session-bookmarks', { expoId, sessionId });
    return response.data as {
        success: boolean;
        message: string;
    };
};

export const removeSessionBookmark = async (expoId: string, sessionId: string) => {
    const response = await api.delete(`/users/me/session-bookmarks/${sessionId}`, {
        params: { expoId },
    });
    return response.data as {
        success: boolean;
        message: string;
    };
};

export const getMySupportRequests = async () => {
    const response = await api.get('/users/me/support-requests');
    return response.data as {
        success: boolean;
        data: SupportRequestItem[];
    };
};

export const submitSupportRequest = async (payload: {
    type: 'support' | 'feedback';
    subject: string;
    message: string;
    expoId?: string;
}) => {
    const response = await api.post('/users/me/support-requests', payload);
    return response.data as {
        success: boolean;
        message: string;
        data: SupportRequestItem;
    };
};

