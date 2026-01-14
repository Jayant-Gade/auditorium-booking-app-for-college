// hooks/useAdminBookings.ts

import { useState, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState, Booking, BookingStatus } from '@/lib/types';
import {
    fetchAdminDashboard,
    approveBooking,
    rejectBooking,
    unapproveBooking, // Add this
} from '@/store/adminSlice';

export const useAdminBookings = () => {
    const dispatch = useAppDispatch();

    // --- Selectors ---
    const { currentUser } = useAppSelector((state: RootState) => state.user);
    const {
        pendingBookings,
        approvedBookings,
        rejectedBookings,
        statistics,
        loading: adminLoading,
    } = useAppSelector((state: RootState) => state.admin);

    // Select all bookings for conflict checking
    const { bookings: allBookings } = useAppSelector((state: RootState) => state.bookings);

    const isAdmin = currentUser?.role === 'admin';

    // --- Dialog State ---
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showActionDialog, setShowActionDialog] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'unapprove'>('approve');
    const [adminNotes, setAdminNotes] = useState('');

    // --- Data Fetching ---
    useEffect(() => {
        // Fetch admin data when component mounts (if admin)
        if (isAdmin) {
            dispatch(fetchAdminDashboard());
        }
    }, [isAdmin, dispatch]);

    // --- Logic Functions ---
    const getCurrentBookings = (activeTab: string): Booking[] => {
        switch (activeTab) {
            case 'pending':
                return pendingBookings;
            case 'approved':
                return approvedBookings;
            case 'rejected':
                return rejectedBookings;
            default:
                return [];
        }
    };

    const checkConflicts = (booking: Booking): Booking[] => {
        return allBookings.filter(
            (b: Booking) =>
                b._id !== booking._id &&
                b.date === booking.date &&
                b.status === 'approved' &&
                ((booking.startTime >= b.startTime && booking.startTime < b.endTime) ||
                    (booking.endTime > b.startTime && booking.endTime <= b.endTime) ||
                    (booking.startTime <= b.startTime && booking.endTime >= b.endTime))
        );
    };

    // --- Action Handlers ---
    const handleAction = (booking: Booking, action: 'approve' | 'reject' | 'unapprove') => {
        setSelectedBooking(booking);
        setActionType(action);
        setShowActionDialog(true);
        setAdminNotes(booking.adminNotes || '');
    };
    const confirmAction = async () => {
        if (!selectedBooking) return;

        let thunkToDispatch;
        if (actionType === 'approve') thunkToDispatch = approveBooking;
        else if (actionType === 'reject') thunkToDispatch = rejectBooking;
        else thunkToDispatch = unapproveBooking; // Handle unapprove

        try {
            await dispatch(
                thunkToDispatch({ bookingId: selectedBooking._id, adminNotes })
            ).unwrap();

            Alert.alert('Success', `Booking moved to ${actionType === 'unapprove' ? 'pending' : actionType + 'ed'} successfully!`);
        } catch (error: any) {
            Alert.alert('Action Failed', error.message || 'Could not process request');
        } finally {
            setShowActionDialog(false);
            setSelectedBooking(null);
            setAdminNotes('');
        }
    };
    return {
        isAdmin,
        stats: statistics, // Pass stats from Redux
        loading: adminLoading,
        getCurrentBookings,
        checkConflicts,
        handleAction,
        confirmAction,
        showActionDialog,
        setShowActionDialog,
        actionType,
        adminNotes,
        setAdminNotes,
    };
};