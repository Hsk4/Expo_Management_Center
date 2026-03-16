import api from './api';

// ─────────────────────────────────────────────
//  EXPO SERVICE
//  Handles all API calls related to expos
// ─────────────────────────────────────────────

export interface ExpoData {
    _id: string;
    title: string;
    description: string;
    theme?: string;
    location: string;
    startDate: string;
    endDate: string;
    status: "draft" | "published" | "completed";
    maxBooths: number;
    maxAttendees: number;
    boothsBookedCount: number;
    attendeesRegisteredCount: number;
    gridRows: number;
    gridCols: number;
    totalBoothsGenerated: number;
    isActive: boolean;
    paymentAmount?: number;
    coverImageUrl?: string;
    layout?: ExpoLayoutConfig;
    sessions?: ExpoSession[];
    createdBy: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateExpoData {
    title: string;
    description: string;
    theme?: string;
    location: string;
    startDate: string;
    endDate: string;
    maxBooths: number;
    maxAttendees: number;
    gridRows: number;
    gridCols: number;
    layout?: ExpoLayoutConfig;
    sessions?: ExpoSession[];
    paymentAmount?: number;
    coverImageUrl?: string;
}

export interface UpdateExpoData extends Partial<CreateExpoData> {}

export interface BoothExhibitorDetails {
    companyName: string;
    contactName?: string;
    contactEmail?: string;
    bannerImage?: string;
    website?: string;
    linkedin?: string;
    instagram?: string;
    description?: string;
}

export interface BoothData {
    _id: string;
    expoId: string;
    boothNumber: string;
    row: number;
    col: number;
    status: "available" | "reserved" | "booked" | "disabled";
    exhibitorId: string | null;
    exhibitorDetails?: BoothExhibitorDetails;
}

export interface AttendedExpoHistoryItem {
    expoId: {
        _id: string;
        title: string;
        theme?: string;
        location: string;
        startDate: string;
        endDate: string;
        status: "draft" | "published" | "completed";
    };
    visitedAt: string;
}

export interface ExpoLayoutBooth {
    boothNumber: string;
    row: number;
    col: number;
    status: "available" | "reserved" | "booked" | "disabled";
}

export interface ExpoLayoutConfig {
    templateType?: string;
    eventType?: string;
    customImageUrl?: string;
    booths: ExpoLayoutBooth[];
    stagePosition?: { x: number; y: number; width: number; height: number };
    foodStallPositions?: { x: number; y: number; label: string }[];
}

export interface ExpoSession {
    _id?: string;
    title: string;
    speaker?: string;
    topic?: string;
    location?: string;
    description?: string;
    startTime: string;
    endTime: string;
    capacity?: number;
}

// Get all expos
export const getAllExpos = async () => {
    const response = await api.get('/expos');
    return response.data;
};

// Get expo by ID
export const getExpoById = async (id: string) => {
    const response = await api.get(`/expos/${id}`);
    return response.data;
};

// Create new expo (admin only)
export const createExpo = async (data: CreateExpoData) => {
    const response = await api.post('/expos', data);
    return response.data;
};

// Update expo (admin only)
export const updateExpo = async (id: string, data: UpdateExpoData) => {
    const response = await api.put(`/expos/${id}`, data);
    return response.data;
};

// Delete expo (admin only)
export const deleteExpo = async (id: string) => {
    const response = await api.delete(`/expos/${id}`);
    return response.data;
};

// Publish expo (admin only)
export const publishExpo = async (id: string) => {
    const response = await api.patch(`/expos/${id}/publish`);
    return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
};

export const attendExpo = async (expoId: string) => {
    const response = await api.post(`/expos/${expoId}/attend`, { seatsBooked: 1 });
    return response.data;
};

export interface PaymentSimulationPayload {
    paymentMethod?: string;
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvv: string;
}

export const attendExpoWithPayment = async (expoId: string, seatsBooked: number, payment: PaymentSimulationPayload) => {
    const response = await api.post(`/expos/${expoId}/attend`, {
        seatsBooked,
        paymentMethod: payment.paymentMethod || 'card',
        cardNumber: payment.cardNumber,
    });
    return response.data as {
        success: boolean;
        message: string;
        data?: { seatsBooked: number; remainingSeats: number };
    };
};

export const getExpoBoothGrid = async (expoId: string) => {
    const response = await api.get(`/expos/${expoId}/booths`);
    return response.data as {
        success: boolean;
        data: {
            expoId: string;
            gridRows: number;
            gridCols: number;
            booths: BoothData[];
        };
    };
};

export const bookBooth = async (expoId: string, boothId: string) => {
    const response = await api.post(`/expos/${expoId}/booths/${boothId}/book`);
    return response.data;
};

export const getAttendedExposHistory = async () => {
    const response = await api.get('/expos/me/attended-history');
    return response.data as {
        success: boolean;
        data: AttendedExpoHistoryItem[];
    };
};

export interface BoothCompanyProfileInput {
    companyName: string;
    bannerImage?: string;
    website?: string;
    linkedin?: string;
    instagram?: string;
    description?: string;
}

export interface BoothApplicationData {
    _id: string;
    status: "pending" | "approved" | "rejected";
    paymentStatus?: "unpaid" | "paid";
    paymentReference?: string;
    paidAt?: string;
    paymentAmount?: number;
    submittedAt: string;
    reviewedAt?: string;
    rejectionReason?: string;
    companyProfile?: {
        companyName?: string;
        bannerImage?: string;
        website?: string;
        linkedin?: string;
        instagram?: string;
        description?: string;
    };
    exhibitorId?: {
        _id?: string;
        name?: string;
        email?: string;
        role?: "attendee" | "exhibitor" | "admin";
    };
    boothId?: {
        _id?: string;
        boothNumber?: string;
        row?: number;
        col?: number;
    };
    expoId?: {
        _id?: string;
        title?: string;
    };
}

// Submit booth application (exhibitor only)
export const submitBoothApplication = async (
    expoId: string,
    boothId: string,
    answers: Record<string, string>,
    companyProfile: BoothCompanyProfileInput
) => {
    const response = await api.post(`/expos/${expoId}/booths/${boothId}/apply`, { answers, companyProfile });
    return response.data;
};

// Get booth applications (admin only)
export const getBoothApplications = async (expoId?: string) => {
    const url = expoId ? `/admin/booth-applications?expoId=${expoId}` : '/admin/booth-applications';
    const response = await api.get(url);
    return response.data as {
        success: boolean;
        count: number;
        data: BoothApplicationData[];
    };
};

// Approve booth application (admin only)
export const approveBoothApplication = async (applicationId: string) => {
    const response = await api.post(`/admin/booth-applications/${applicationId}/approve`);
    return response.data;
};

// Reject booth application (admin only)
export const rejectBoothApplication = async (applicationId: string, reason?: string) => {
    const response = await api.post(`/admin/booth-applications/${applicationId}/reject`, { reason });
    return response.data;
};

export const payBoothApplication = async (applicationId: string, payment: PaymentSimulationPayload) => {
    const response = await api.post(`/expos/booth-applications/${applicationId}/pay`, {
        paymentMethod: payment.paymentMethod || 'card',
        cardNumber: payment.cardNumber,
        cardName: payment.cardName,
        expiry: payment.expiry,
        cvv: payment.cvv,
    });
    return response.data as {
        success: boolean;
        message: string;
        data?: {
            applicationId: string;
            status: 'approved' | 'pending' | 'rejected';
            paymentStatus: 'paid' | 'unpaid';
            paymentReference: string;
            cardLast4: string;
        };
    };
};

