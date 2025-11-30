// hooks/useHomeDashboard.ts

import { useMemo } from "react";
import { useSelector } from "react-redux";
// Adjust paths as needed
import { RootState } from "@/store/store";
import { Booking, User } from "@/lib/types";

export const useHomeDashboard = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { bookings } = useSelector((state: RootState) => state.bookings);

  const todayBookings = useMemo(() => {
    const today = new Date().toDateString();
    return bookings.filter(
      (booking: Booking) => new Date(booking.date).toDateString() === today
    );
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    return bookings
      .filter((booking: Booking) => {
        const bookingDate = new Date(booking.date);
        return bookingDate > today && booking.status === "approved";
      })
      .slice(0, 3); // Get first 3
  }, [bookings]);

  const stats = useMemo(() => {
    return {
      approvedBookings: bookings.filter((b: Booking) => b.status === "approved")
        .length,
      pendingBookings: bookings.filter((b: Booking) => b.status === "pending")
        .length,
      userBookings: bookings.filter(
        (b: Booking) => b.organizerEmail === currentUser?.email
      ).length,
    };
  }, [bookings, currentUser]);

  return {
    currentUser: currentUser as User | null,
    todayBookings,
    upcomingBookings,
    stats,
  };
};
