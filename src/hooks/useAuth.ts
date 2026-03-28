import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AuthResponse, AuthUser } from "@/features/authentication/types";
import {
	loginFailure,
	loginStart,
	loginSuccess,
	logout,
	refreshTokenFailure,
	refreshTokenStart,
	refreshTokenSuccess,
	registerFailure,
	registerStart,
	registerSuccess,
	setAuthState,
	updateUser,
} from "@/redux/slices/auth.slice";
import type { RootState } from "@/redux/store";

export const useAuth = () => {
	const dispatch = useDispatch();
	const authState = useSelector((state: RootState) => state.authState);

	// Acciones de login
	const startLogin = useCallback(() => {
		dispatch(loginStart());
	}, [dispatch]);

	const failureLogin = useCallback(() => {
		dispatch(loginFailure());
	}, [dispatch]);

	const successLogin = useCallback(
		(authResponse: AuthResponse) => {
			dispatch(loginSuccess(authResponse));
		},
		[dispatch],
	);

	// Acciones de logout
	const performLogout = useCallback(() => {
		dispatch(logout());
	}, [dispatch]);

	// Acciones de registro
	const startRegister = useCallback(() => {
		dispatch(registerStart());
	}, [dispatch]);

	const successRegister = useCallback(
		(authResponse: AuthResponse) => {
			dispatch(registerSuccess(authResponse));
		},
		[dispatch],
	);

	const failureRegister = useCallback(() => {
		dispatch(registerFailure());
	}, [dispatch]);

	// Acciones de refresh token
	const startRefreshToken = useCallback(() => {
		dispatch(refreshTokenStart());
	}, [dispatch]);

	const successRefreshToken = useCallback(
		(tokens: { accessToken: string; refreshToken?: string }) => {
			dispatch(refreshTokenSuccess(tokens));
		},
		[dispatch],
	);

	const failureRefreshToken = useCallback(() => {
		dispatch(refreshTokenFailure());
	}, [dispatch]);

	// Acciones de actualización de usuario
	const performUpdateUser = useCallback(
		(user: AuthUser) => {
			dispatch(updateUser(user));
		},
		[dispatch],
	);

	// Acción para establecer el estado de autenticación
	const performSetAuthState = useCallback(
		(authData: { user: AuthUser; accessToken: string; refreshToken?: string }) => {
			dispatch(setAuthState(authData));
		},
		[dispatch],
	);

	return {
		// Estado
		user: authState.user,
		accessToken: authState.accessToken,
		refreshToken: authState.refreshToken,
		isAuthenticated: authState.isAuthenticated,
		isLoading: authState.isLoading,
		// Acciones
		startLogin,
		successLogin,
		failureLogin,
		performLogout,
		startRegister,
		successRegister,
		failureRegister,
		startRefreshToken,
		successRefreshToken,
		failureRefreshToken,
		performUpdateUser,
		performSetAuthState,
	};
};
