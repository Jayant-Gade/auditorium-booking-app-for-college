export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type UserRole = 'student' | 'faculty' | 'admin';

export interface Booking {
    _id: string; // Changed from 'id' to '_id' to match Mongoose
    title: string;
    description?: string;
    date: string; // Should be ISO string (e.g., "2025-11-20T00:00:00.000Z")
    startTime: string; // e.g., "11:00"
    endTime: string; // e.g., "13:00"
    organizerUserId: string; // This will be the user's _id
    organizerName: string;
    organizerEmail: string;
    organizerPhone: string;
    department: string;
    expectedAttendees: number;
    equipmentNeeded: string[];
    status: BookingStatus;
    adminNotes?: string;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

// User interface (matches your auth controller response)
export interface User {
    userId: string; // This is user._id from backend
    name: string;
    email: string;
    phone: string;
    department: string;
    role: UserRole;
}

// Interface for the auth API response
export interface AuthResponse {
    user: User;
    token: string;
}

// State interface for the user slice
export interface UserState {
    currentUser: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

// State interface for the booking slice
export interface BookingState {
    bookings: Booking[];
    userBookings: Booking[];
    calendarBookings: Booking[];
    selectedBooking: Booking | null;
    loading: boolean;
    error: string | null;
    isRestoringSession: boolean;
}

// State interface for the admin slice
export interface AdminState {
    pendingBookings: Booking[];
    approvedBookings: Booking[];
    rejectedBookings: Booking[];
    statistics: {
        totalBookings: number;
        pendingCount: number;
        approvedCount: number;
        rejectedCount: number;
        monthlyBookings: number;
    };
    loading: boolean;
    error: string | null;
}

// Root Redux state
export interface RootState {
    user: UserState;
    bookings: BookingState;
    admin: AdminState;
}

// Type for the data to create a booking (from frontend form)
export interface NewBookingData {
    title: string;
    description?: string;
    date: string;
    startTime: string;
    endTime: string;
    expectedAttendees: number;
    equipmentNeeded: string[];
}