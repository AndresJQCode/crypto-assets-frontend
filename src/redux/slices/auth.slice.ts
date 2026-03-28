import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, AuthUser } from "@/features/authentication/types";

export interface AuthState {
	user: AuthUser | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const initialState: AuthState = {
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isLoading: false,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		// Acciones de login
		loginStart: (state) => {
			state.isLoading = true;
		},
		loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
			state.isLoading = false;
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken || null;
			state.isAuthenticated = true;
		},
		loginFailure: (state) => {
			state.isLoading = false;
		},

		// Acciones de logout
		logout: (state) => {
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.isAuthenticated = false;
			state.isLoading = false;
		},

		// Acciones de registro
		registerStart: (state) => {
			state.isLoading = true;
		},
		registerSuccess: (state, action: PayloadAction<AuthResponse>) => {
			state.isLoading = false;
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken || null;
			state.isAuthenticated = true;
		},
		registerFailure: (state) => {
			state.isLoading = false;
		},

		// Acciones de refresh token
		refreshTokenStart: (state) => {
			state.isLoading = true;
		},
		refreshTokenSuccess: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
			state.isLoading = false;
			state.accessToken = action.payload.accessToken;
			if (action.payload.refreshToken) {
				state.refreshToken = action.payload.refreshToken;
			}
		},
		refreshTokenFailure: (state) => {
			state.isLoading = false;
		},

		// Acciones de actualización de usuario
		updateUser: (state, action: PayloadAction<AuthUser>) => {
			state.user = { ...state.user, ...action.payload };
		},

		// Acción para establecer el estado de autenticación desde el localStorage
		setAuthState: (state, action: PayloadAction<{ user: AuthUser; accessToken: string; refreshToken?: string }>) => {
			state.user = action.payload.user;
			state.accessToken = action.payload.accessToken;
			state.refreshToken = action.payload.refreshToken || null;
			state.isAuthenticated = true;
			state.isLoading = false;
		},
	},
});

export const {
	loginStart,
	loginSuccess,
	loginFailure,
	logout,
	registerStart,
	registerSuccess,
	registerFailure,
	refreshTokenStart,
	refreshTokenSuccess,
	refreshTokenFailure,
	updateUser,
	setAuthState,
} = authSlice.actions;

export default authSlice.reducer;
