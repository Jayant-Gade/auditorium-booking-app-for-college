import { API_URL, getAuthHeaders } from './apiConfig';
import { Booking, AdminState } from '@/lib/types';

// Type for the dashboard API response
type AdminDashboardData = {
    pendingBookings: Booking[];
    approvedBookings: Booking[];
    rejectedBookings: Booking[];
    statistics: AdminState['statistics'];
};

/**
 * Fetches all admin data for the dashboard. (GET /api/admin/dashboard)
 */
export const fetchAdminData = async (): Promise<AdminDashboardData> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/dashboard`, {
        method: 'GET',
        headers: headers,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch admin dashboard');
    }
    return data as AdminDashboardData;
};

/**
 * Approves a booking. (PATCH /api/admin/:bookingId/approve)
 */
export const approveBookingAPI = async ({
    bookingId,
    adminNotes,
}: {
    bookingId: string;
    adminNotes?: string;
}): Promise<Booking> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/${bookingId}/approve`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ adminNotes }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to approve booking');
    }
    return data as Booking;
};

/**
 * Rejects a booking. (PATCH /api/admin/:bookingId/reject)
 */
export const rejectBookingAPI = async ({
    bookingId,
    adminNotes,
}: {
    bookingId: string;
    adminNotes?: string;
}): Promise<Booking> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/${bookingId}/reject`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ adminNotes }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to reject booking');
    }
    return data as Booking;
};

export const unapproveBookingAPI = async ({
    bookingId,
    adminNotes,
}: {
    bookingId: string;
    adminNotes?: string;
}): Promise<Booking> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/${bookingId}/unapprove`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ adminNotes }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to unapprove booking');
    }

    // Updated to return data.booking to match your backend res.json structure
    return data.booking as Booking;
};
export const updateBookingAdminAPI = async (
    bookingId: string,
    updateData: {
        title?: string;
        description?: string;
        date?: string;
        startTime?: string;
        endTime?: string;
        adminNotes?: string;
    }
): Promise<Booking> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/admin/${bookingId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updateData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking');
    }
    return data as Booking;
};