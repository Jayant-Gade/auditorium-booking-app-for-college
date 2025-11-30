import { API_URL, getAuthHeaders } from './apiConfig';
import { Booking, NewBookingData } from '@/lib/types';

/**
 * Fetches all bookings from the "database". (GET /api/bookings)
 */
export const fetchAllBookingsAPI = async (): Promise<Booking[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'GET',
        headers: headers,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch all bookings');
    }
    return data as Booking[];
};

/**
 * Fetches all bookings for the currently logged-in user. (GET /api/bookings/my)
 */
export const fetchUserBookingsAPI = async (): Promise<Booking[]> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/bookings/my`, {
        method: 'GET',
        headers: headers,
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user bookings');
    }
    return data as Booking[];
};

/**
 * Adds a new booking to the "database". (POST /api/bookings)
 */
export const createBookingAPI = async (
    bookingData: NewBookingData
): Promise<Booking> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
    }
    console.log(data);

    return data as Booking;
};

/**
 * Updates an existing booking. (PUT /api/bookings/:bookingId)
 */
export const updateBookingAPI = async (
    bookingId: string,
    updates: Partial<Booking>
): Promise<Booking> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking');
    }
    return data as Booking;
};

/**
 * Deletes a booking from the "database". (DELETE /api/bookings/:bookingId)
 */
export const deleteBookingAPI = async (bookingId: string): Promise<{ message: string }> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: headers,
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete booking');
    }
    return data; // Returns { message: "Booking deleted successfully" }
};