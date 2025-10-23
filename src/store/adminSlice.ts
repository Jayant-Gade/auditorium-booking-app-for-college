import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from './bookingSlice';

interface AdminState {
  pendingBookings: Booking[];
  approvedBookings: Booking[];
  rejectedBookings: Booking[];
  conflictingBookings: { booking: Booking; conflicts: Booking[] }[];
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

const initialState: AdminState = {
  pendingBookings: [],
  approvedBookings: [],
  rejectedBookings: [],
  conflictingBookings: [],
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

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setPendingBookings: (state, action: PayloadAction<Booking[]>) => {
      state.pendingBookings = action.payload;
    },
    setApprovedBookings: (state, action: PayloadAction<Booking[]>) => {
      state.approvedBookings = action.payload;
    },
    setRejectedBookings: (state, action: PayloadAction<Booking[]>) => {
      state.rejectedBookings = action.payload;
    },
    setConflictingBookings: (state, action: PayloadAction<{ booking: Booking; conflicts: Booking[] }[]>) => {
      state.conflictingBookings = action.payload;
    },
    approveBooking: (state, action: PayloadAction<{ id: string; adminNotes?: string }>) => {
      const booking = state.pendingBookings.find(b => b.id === action.payload.id);
      if (booking) {
        booking.status = 'approved';
        booking.adminNotes = action.payload.adminNotes;
        booking.updatedAt = new Date().toISOString();
        state.approvedBookings.push(booking);
        state.pendingBookings = state.pendingBookings.filter(b => b.id !== action.payload.id);
      }
    },
    rejectBooking: (state, action: PayloadAction<{ id: string; adminNotes?: string }>) => {
      const booking = state.pendingBookings.find(b => b.id === action.payload.id);
      if (booking) {
        booking.status = 'rejected';
        booking.adminNotes = action.payload.adminNotes;
        booking.updatedAt = new Date().toISOString();
        state.rejectedBookings.push(booking);
        state.pendingBookings = state.pendingBookings.filter(b => b.id !== action.payload.id);
      }
    },
    updateStatistics: (state, action: PayloadAction<AdminState['statistics']>) => {
      state.statistics = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPendingBookings,
  setApprovedBookings,
  setRejectedBookings,
  setConflictingBookings,
  approveBooking,
  rejectBooking,
  updateStatistics,
  setLoading,
  setError,
} = adminSlice.actions;

export default adminSlice.reducer;