import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
// Import the typed dispatch
import { useAppDispatch } from '@/store/hooks';
// Import the REAL thunks
import { loginUser, registerUser } from '@/store/userSlice';
import { UserRole } from '@/lib/types';

export const useAuth = () => {
    const dispatch = useAppDispatch(); // Use the typed dispatch

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Keep password in local state
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState<UserRole>('student');

    // UI state
    const [loading, setLoading] = useState(false);
    const [showRoleDialog, setShowRoleDialog] = useState(false);

    /**
     * Handles user login.
     */
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }
        setLoading(true);

        // Dispatch the thunk with the credentials
        try {
            await dispatch(loginUser({ email, password })).unwrap();
            // .unwrap() will throw an error if the thunk is rejected

            // On success, the root layout will handle the redirect
            router.replace('/(tabs)/home');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Validates registration form and opens role dialog.
     */
    const handleRegister = () => {
        if (!email || !password || !name || !phone || !department) {
            Alert.alert('Error', 'Please fill all required fields.');
            return;
        }
        // All fields valid, show role selection
        setShowRoleDialog(true);
    };

    /**
     * Confirms registration and logs the user in.
     */
    const confirmRegistration = async () => {
        setShowRoleDialog(false);
        setLoading(true);

        try {
            // Dispatch the thunk with the full registration data
            await dispatch(
                registerUser({
                    name,
                    email,
                    password, // Send the password
                    phone,
                    department,
                    role,
                })
            ).unwrap();

            // On success, root layout will handle redirect
            router.replace('/(tabs)/home');
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message || 'Could not create account');
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        name,
        setName,
        phone,
        setPhone,
        department,
        setDepartment,
        role,
        setRole,
        loading,
        showRoleDialog,
        setShowRoleDialog,
        handleLogin,
        handleRegister,
        confirmRegistration,
    };
};
