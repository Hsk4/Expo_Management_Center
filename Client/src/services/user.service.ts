import api from './api';

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

export interface RegistrationSummary {
    attendedExpos: AttendedExpoRegistration[];
    bookedBooths: BookedBoothRegistration[];
    boothApplications: BoothApplicationRegistration[];
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

