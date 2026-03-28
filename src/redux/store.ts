import { combineReducers, configureStore, type Reducer, type UnknownAction } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, persistReducer, persistStore, REGISTER, REHYDRATE } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import type { AppState } from "@/types";
import { appSlice, authSlice, paginationSlice, settingsSlice } from "./slices";
import type { AuthState } from "./slices/auth.slice";
import type { PaginationState } from "./slices/pagination.slice";
import type { SettingsState } from "./slices/settings.slice";

const createNoopStorage = () => {
	return {
		getItem(_key: string) {
			return Promise.resolve(null);
		},
		setItem(_key: string, value: string) {
			return Promise.resolve(value);
		},
		removeItem(_key: string) {
			return Promise.resolve();
		},
	};
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export interface AppStore {
	appState: AppState;
	authState: AuthState;
	paginationState: PaginationState;
	settingsState: SettingsState;
}

const whitelist: (keyof AppStore)[] = ["appState", "authState", "paginationState", "settingsState"];

const persistConfig = {
	key: "root",
	whitelist,
	storage,
};

const appReducer = combineReducers({
	appState: appSlice,
	authState: authSlice,
	paginationState: paginationSlice,
	settingsState: settingsSlice,
});

export type RootState = ReturnType<typeof appReducer>;

const rootReducer: Reducer = (state: RootState, action: UnknownAction) => {
	return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
	devTools: process.env.NODE_ENV !== "production",
});

const persistor = persistStore(store);

export { store, persistor };
