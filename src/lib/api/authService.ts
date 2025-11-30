import { API_URL, setAuthToken, getAuthHeaders } from './apiConfig';
import { User, AuthResponse, UserRole } from '@/lib/types';

// Type for the login API call
type LoginCredentials = {
    email: string;
    password?: string;
};

// Type for the registration API call
type RegisterData = {
    name: string;
    email: string;
    password?: string;
    phone: string;
    department: string;
    role: UserRole;
};

/**
 * Calls the login endpoint. (POST /api/auth/login)
 */
export const loginAPI = async (
    credentials: LoginCredentials
): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
    }

    const authResponse: AuthResponse = {
        user: {
            userId: data.userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            department: data.department,
            role: data.role,
        },
        token: data.token,
    };

    return authResponse;
};

/**
 * Calls the register endpoint. (POST /api/auth/register)
 */
export const registerAPI = async (
    userData: RegisterData
): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
    }

    const authResponse: AuthResponse = {
        user: {
            userId: data.userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            department: data.department,
            role: data.role,
        },
        token: data.token,
    };

    return authResponse;
};

/**
 * --- NEW FUNCTION ---
 * Fetches the user's profile using the stored token.
 * Calls GET /api/users/me
 */
export const getUserProfileAPI = async (): Promise<User> => {
    const headers = await getAuthHeaders();

    // Check if the token header exists
    if (!headers['Authorization']) {
        throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: headers,
    });

    const data = await response.json();
    if (!response.ok) {
        // This will be caught by the thunk (e.g., if token is expired)
        throw new Error(data.message || 'Session expired. Please login again.');
    }

    // The backend returns the user doc with _id, map it to our User type
    const user: User = {
        userId: data._id, // Map _id to userId
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        role: data.role,
    };
    return user;
};

/**
 * --- UPDATED FUNCTION ---
 * Calls the update user profile endpoint. (PUT /api/users/me)
 */
export const updateUserAPI = async (
    updates: Partial<User>
): Promise<User> => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update user');
    }

    // --- FIX ---
    // Map the backend response (_id) to our frontend User type (userId)
    const userResponse: User = {
        userId: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        department: data.department,
        role: data.role,
    };
    return userResponse;
};