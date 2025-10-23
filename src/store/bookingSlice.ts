import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Booking {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  department: string;
  expectedAttendees: number;
  equipmentNeeded: string[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingState {
  bookings: Booking[];
  userBookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  userBookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    addBooking: (state, action: PayloadAction<Booking>) => {
      state.bookings.push(action.payload);
      state.userBookings.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
      const userIndex = state.userBookings.findIndex(booking => booking.id === action.payload.id);
      if (userIndex !== -1) {
        state.userBookings[userIndex] = action.payload;
      }
    },
    deleteBooking: (state, action: PayloadAction<string>) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
      state.userBookings = state.userBookings.filter(booking => booking.id !== action.payload);
    },
    setUserBookings: (state, action: PayloadAction<Booking[]>) => {
      state.userBookings = action.payload;
    },
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload;
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
  setBookings,
  addBooking,
  updateBooking,
  deleteBooking,
  setUserBookings,
  setSelectedBooking,
  setLoading,
  setError,
} = bookingSlice.actions;

export default bookingSlice.reducer;