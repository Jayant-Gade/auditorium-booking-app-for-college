import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserState, AuthResponse, UserRole } from '@/lib/types';
import { getUserProfileAPI, loginAPI, registerAPI, updateUserAPI } from '@/lib/api/authService';
import { getAuthToken, setAuthToken } from '@/lib/api/apiConfig'; // Import token helper

// --- Types for Thunk Arguments ---

type LoginCredentials = {
    email: string;
    password?: string;
};

type RegisterData = {
    name: string;
    email: string;
    password?: string;
    phone: string;
    department: string;
    role: UserRole;
};

// --- Asynchronous Thunks ---

export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const data: AuthResponse = await loginAPI(credentials);
            // Save token to AsyncStorage as a side-effect
            await setAuthToken(data.token);
            return data; // Payload will be { user: User, token: string }
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (userData: RegisterData, { rejectWithValue }) => {
        try {
            const data: AuthResponse = await registerAPI(userData);
            // Save token to AsyncStorage as a side-effect
            await setAuthToken(data.token);
            return data; // Payload will be { user: User, token: string }
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    async (updates: Partial<User>, { getState, rejectWithValue }) => {
        try {
            // Note: We don't need getState to get userId if it's not in the 'updates'
            // The backend identifies the user via the token
            const updatedUser = await updateUserAPI(updates);
            return updatedUser;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

/**
 * --- NEW THUNK ---
 * Checks for a token in SecureStore and tries to fetch the user profile.
 * This is run on app load to restore the session.
 */
export const restoreUserSession = createAsyncThunk(
    'user/restoreSession',
    async (_, { rejectWithValue }) => {
        try {
            const token = await getAuthToken();
            if (!token) {
                // No token, so no session to restore.
                return rejectWithValue('No token found');
            }
            // Token found, try to fetch user data
            const user = await getUserProfileAPI();
            // Success! Return the user and the token
            return { user, token };
        } catch (error: any) {
            // Token was invalid or expired. Clear it from storage.
            await setAuthToken(null);
            return rejectWithValue(error.message || 'Session expired');
        }
    }
);
// We make logout an async thunk to clear the token from storage
export const logoutUser = createAsyncThunk('user/logout', async () => {
    await setAuthToken(null);
});

// --- Initial State ---

const initialState: UserState = {
    currentUser: null,
    token: null, // Add token to state
    loading: false,
    error: null,
    isRestoringSession: true, // <-- NEW: Start in restoring state
};

// --- User Slice ---

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Synchronous action to set user/token (e.g., on app load from storage)
        setAuth: (state, action: PayloadAction<AuthResponse>) => {
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Login ---
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.currentUser = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // --- Register ---
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
                state.loading = false;
                state.currentUser = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // --- Update User ---
            .addCase(updateUser.pending, (state) => {
                // You might want a different loading state, e.g., state.profileUpdating
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.currentUser = action.payload; // Update user with new details
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // --- Logout ---
            .addCase(logoutUser.fulfilled, (state) => {
                state.currentUser = null;
                state.token = null;
                state.error = null;
            })

            // --- NEW: Restore Session ---
            .addCase(restoreUserSession.pending, (state) => {
                state.isRestoringSession = true;
                state.loading = true; // Optional: show a global loader
            })
            .addCase(
                restoreUserSession.fulfilled,
                (state, action: PayloadAction<AuthResponse>) => {
                    state.currentUser = action.payload.user;
                    state.token = action.payload.token;
                    state.isRestoringSession = false;
                    state.loading = false;
                }
            )
            .addCase(restoreUserSession.rejected, (state, action) => {
                state.isRestoringSession = false;
                state.loading = false;
                state.currentUser = null;
                state.token = null;
                // We don't set an error message on restore failure
                // as it's a "silent" fail (just means user needs to login)
            });

    },
});

export const { setAuth, clearError } = userSlice.actions;

export default userSlice.reducer;
