// hooks/useUserBookings.ts

import { useState, useMemo, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/lib/types';
import { fetchUserBookings } from '@/store/bookingSlice';

export const useUserBookings = () => {
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state: RootState) => state.user);

    // Select data directly from the Redux store
    const { userBookings, loading: bookingsLoading } = useAppSelector(
        (state: RootState) => state.bookings
    );

    const [filter, setFilter] = useState('all');
    const [refreshing, setRefreshing] = useState(false); // Local refresh state

    // --- Data Fetching ---
    useEffect(() => {
        // Fetch bookings when the component mounts or user changes
        if (currentUser) {
            dispatch(fetchUserBookings());
        }
    }, [currentUser, dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (currentUser) {
            await dispatch(fetchUserBookings());
        }
        setRefreshing(false);
    };

    // --- Memoized Filtering ---
    const filteredBookings = useMemo(() => {
        return userBookings.filter((booking) => {
            if (filter === 'all') return true;
            return booking.status === filter;
        });
    }, [userBookings, filter]);

    return {
        filter,
        setFilter,
        refreshing, // This is the local pull-to-refresh state
        loading: bookingsLoading, // This is the Redux loading state
        onRefresh,
        userBookings, // The full list for this user
        filteredBookings, // The filtered list for display
        currentUser,
    };
};