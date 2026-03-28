import { createSlice } from "@reduxjs/toolkit";
import { AppEmptyState } from "@/types/app.type";

export const appSlice = createSlice({
	name: "app",
	initialState: AppEmptyState,
	reducers: {
		setAppBarTitle: (state, action: { payload: string; type: string }) => {
			return { ...state, appBarTitle: action.payload };
		},
		setAppSidebarOpen: (state, action: { payload: boolean; type: string }) => {
			const newState = { ...state, appSidebarOpen: action.payload };
			return newState;
		},
		resetAppState: () => {
			return AppEmptyState;
		},
	},
});

export const { setAppBarTitle, setAppSidebarOpen, resetAppState } = appSlice.actions;

export default appSlice.reducer;
