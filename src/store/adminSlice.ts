import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, Booking } from '@/lib/types';
import {
    fetchAdminData,
    approveBookingAPI,
    rejectBookingAPI, unapproveBookingAPI,
    updateBookingAdminAPI,
} from '@/lib/api/adminService';

// Type for the dashboard API response
type AdminDashboardData = {
    pendingBookings: Booking[];
    approvedBookings: Booking[];
    rejectedBookings: Booking[];
    statistics: AdminState['statistics'];
};

// --- Asynchronous Thunks ---

export const fetchAdminDashboard = createAsyncThunk(
    'admin/fetchDashboard',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchAdminData();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const approveBooking = createAsyncThunk(
    'admin/approveBooking',
    async (
        payload: { bookingId: string; adminNotes?: string },
        { rejectWithValue }
    ) => {
        try {
            // The API returns the updated booking
            return await approveBookingAPI(payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const rejectBooking = createAsyncThunk(
    'admin/rejectBooking',
    async (
        payload: { bookingId: string; adminNotes?: string },
        { rejectWithValue }
    ) => {
        try {
            // The API returns the updated booking
            return await rejectBookingAPI(payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// New Unapprove Thunk
export const unapproveBooking = createAsyncThunk(
    'admin/unapproveBooking',
    async (payload: { bookingId: string; adminNotes?: string }, { rejectWithValue }) => {
        try {
            return await unapproveBookingAPI(payload);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateAdminBooking = createAsyncThunk(
    'admin/updateBooking',
    async ({ bookingId, data }: { bookingId: string; data: Partial<Booking> }, { rejectWithValue }) => {
        try {
            return await updateBookingAdminAPI(bookingId, data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
// --- Initial State ---

const initialState: AdminState = {
    pendingBookings: [],
    approvedBookings: [],
    rejectedBookings: [],
    statistics: {
        totalBookings: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        monthlyBookings: 0,
    },
    loading: false,
    error: null,
};

// --- Admin Slice ---

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch Admin Dashboard ---
            .addCase(fetchAdminDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchAdminDashboard.fulfilled,
                (state, action: PayloadAction<AdminDashboardData>) => {
                    state.loading = false;
                    state.pendingBookings = action.payload.pendingBookings;
                    state.approvedBookings = action.payload.approvedBookings;
                    state.rejectedBookings = action.payload.rejectedBookings;
                    state.statistics = action.payload.statistics;
                }
            )
            .addCase(fetchAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // --- Approve Booking ---
            .addCase(approveBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                const updatedBooking = action.payload;
                // Remove from pending
                state.pendingBookings = state.pendingBookings.filter(
                    (b) => b._id !== updatedBooking._id
                );
                // Add to approved
                state.approvedBookings.push(updatedBooking);
                // Update stats (or we could refetch the dashboard)
                state.statistics.pendingCount -= 1;
                state.statistics.approvedCount += 1;
            })
            .addCase(approveBooking.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // --- Reject Booking ---
            .addCase(rejectBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                const updatedBooking = action.payload;
                // Remove from pending
                state.pendingBookings = state.pendingBookings.filter(
                    (b) => b._id !== updatedBooking._id
                );
                // Add to rejected
                state.rejectedBookings.push(updatedBooking);
                // Update stats
                state.statistics.pendingCount -= 1;
                state.statistics.rejectedCount += 1;
            })
            .addCase(unapproveBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                const updatedBooking = action.payload; // This is now data.booking
                state.approvedBookings = state.approvedBookings.filter(b => b._id !== updatedBooking._id);
                state.pendingBookings.push(updatedBooking);

                // Update stats
                state.statistics.approvedCount -= 1;
                state.statistics.pendingCount += 1;
            })
            .addCase(updateAdminBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
                const updated = action.payload;

                // Update the booking in whichever list it belongs to
                const updateInList = (list: Booking[]) =>
                    list.map(b => b._id === updated._id ? updated : b);

                if (updated.status === 'pending') {
                    state.pendingBookings = updateInList(state.pendingBookings);
                } else if (updated.status === 'approved') {
                    state.approvedBookings = updateInList(state.approvedBookings);
                } else {
                    state.rejectedBookings = updateInList(state.rejectedBookings);
                }
            })
            .addCase(rejectBooking.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = adminSlice.actions;

export default adminSlice.reducer;