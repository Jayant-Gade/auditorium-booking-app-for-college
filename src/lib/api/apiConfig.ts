import * as SecureStore from 'expo-secure-store';
// --- IMPORTANT ---
// 1. FIND YOUR COMPUTER'S LOCAL IP ADDRESS.
//    - On Windows: Open Command Prompt and type `ipconfig`
//    - On macOS/Linux: Open Terminal and type `ifconfig` or `ip a`
//    - Look for an "IPv4 Address" like 192.168.1.10
// 2. REPLACE 'YOUR_IP_ADDRESS' WITH THAT NUMBER.
// 3. Ensure your backend server is running on port 5000 (or change the port).
//
// DO NOT USE 'localhost' or '127.0.0.1' - your phone cannot access it.
//
const YOUR_IP_ADDRESS = 'localhost'; // <--- REPLACE THIS
const PORT = 3000; // Or whatever port your backend is on
export const API_URL = `http://${YOUR_IP_ADDRESS}:${PORT}/api`;

const TOKEN_KEY = 'userAuthToken';

/**
 * Stores the user's auth token in Encrypted SecureStore.
 */
export const setAuthToken = async (token: string | null) => {
    try {
        if (token) {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        } else {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    } catch (error) {
        console.error('Failed to save auth token to secure store:', error);
    }
};

/**
 * Retrieves the user's auth token from Encrypted SecureStore.
 */
export const getAuthToken = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error('Failed to get auth token from secure store:', error);
        return null;
    }
};

/**
 * Creates a standard set of headers for authenticated API calls.
 */
export const getAuthHeaders = async () => {
    const token = await getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers as HeadersInit;
};
