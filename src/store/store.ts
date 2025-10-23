import { configureStore } from '@reduxjs/toolkit';
import bookingReducer from './bookingSlice';
import userReducer from './userSlice';
import adminReducer from './adminSlice';

export const store = configureStore({
  reducer: {
    bookings: bookingReducer,
    user: userReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;