import { configureStore } from '@reduxjs/toolkit';

// Import reducers using the aliased path
import bookingReducer from '@/store/bookingSlice';
import userReducer from '@/store/userSlice';
import adminReducer from '@/store/adminSlice';

export const store = configureStore({
    reducer: {
        bookings: bookingReducer,
        user: userReducer,
        admin: adminReducer,
    },
    // Adding middleware to disable serializableCheck can be helpful
    // if you're not using it and want to avoid warnings.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;