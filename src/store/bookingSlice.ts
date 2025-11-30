import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking, BookingState, NewBookingData } from '@/lib/types';
import {
    fetchAllBookingsAPI,
    fetchUserBookingsAPI,
    createBookingAPI,
    updateBookingAPI,
    deleteBookingAPI,
    fetchBookingsByMonthAPI,
} from '@/lib/api/bookingService';

// --- Asynchronous Thunks ---

export const fetchAllBookings = createAsyncThunk(
    'bookings/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAllBookingsAPI();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchCalendarBookings = createAsyncThunk(
    'bookings/fetchCalendar',
    async (monthStr: string, { rejectWithValue }) => {
        try {
            return await fetchBookingsByMonthAPI(monthStr);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
export const fetchUserBookings = createAsyncThunk(
    'bookings/fetchUserBookings',
    async (_, { rejectWithValue }) => {
        // We don't need to pass userEmail, the backend gets it from the token
        try {
            return await fetchUserBookingsAPI();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const addBooking = createAsyncThunk(
    'bookings/addBooking',
    async (bookingData: NewBookingData, { rejectWithValue }) => {
        try {
            return await createBookingAPI(bookingData);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBooking = createAsyncThunk(
    'bookings/updateBooking',
    async (booking: Booking, { rejectWithValue }) => {
        try {
            // API needs the ID and the update payload separately
            const { _id, ...updates } = booking;
            return await updateBookingAPI(_id, updates);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteBooking = createAsyncThunk(
    'bookings/deleteBooking',
    async (bookingId: string, { rejectWithValue }) => {
        try {
            await deleteBookingAPI(bookingId);
            return bookingId; // Return the ID for removal from state
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// --- Initial State ---

const initialState: BookingState = {
    bookings: [],
    userBookings: [],
    calendarBookings: [], // <--- CRITICAL: Initialize as empty array
    selectedBooking: null,
    loading: false,
    error: null,
};

// --- Booking Slice ---

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
            state.selectedBooking = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch All Bookings ---
            .addCase(fetchAllBookings.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(fetchAllBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchAllBookings.rejected, (state, action) => {
                state.loading = false; state.error = action.payload as string;
            })

            // --- Fetch User Bookings ---
            .addCase(fetchUserBookings.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
                state.loading = false;
                state.userBookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.loading = false; state.error = action.payload as string;
            })
            // --- Calendar Bookings ---
            .addCase(fetchCalendarBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCalendarBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
                state.loading = false;
                state.calendarBookings = action.payload;
            })
            .addCase(fetchCalendarBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.calendarBookings = []; // Reset on error to prevent undefined
            })
            // --- Add Booking ---
            .addCase(addBooking.pending, (state) => {
                state.loading = true;
            })
            .addCase(addBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                state.loading = false;
                state.bookings.push(action.payload); // Add to admin list
                state.userBookings.push(action.payload); // Add to user list
            })
            .addCase(addBooking.rejected, (state, action) => {
                state.loading = false; state.error = action.payload as string;
            })

            // --- Update Booking ---
            .addCase(updateBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                const updatedBooking = action.payload;
                const index = state.bookings.findIndex(b => b._id === updatedBooking._id);
                if (index !== -1) state.bookings[index] = updatedBooking;

                const userIndex = state.userBookings.findIndex(b => b._id === updatedBooking._id);
                if (userIndex !== -1) state.userBookings[userIndex] = updatedBooking;
            })

            // --- Delete Booking ---
            .addCase(deleteBooking.fulfilled, (state, action: PayloadAction<string>) => {
                const bookingId = action.payload;
                state.bookings = state.bookings.filter(b => b._id !== bookingId);
                state.userBookings = state.userBookings.filter(b => b._id !== bookingId);
            });
    },
});

export const { setSelectedBooking, clearError } = bookingSlice.actions;

export default bookingSlice.reducer;