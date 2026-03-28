import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
	sendInvitationEmail: boolean;
}

const initialState: SettingsState = {
	sendInvitationEmail: true, // By default, send invitation emails
};

export const settingsSlice = createSlice({
	name: "settings",
	initialState,
	reducers: {
		setSendInvitationEmail: (state, action: PayloadAction<boolean>) => {
			state.sendInvitationEmail = action.payload;
		},
		resetSettingsState: () => {
			return initialState;
		},
	},
});

export const { setSendInvitationEmail, resetSettingsState } = settingsSlice.actions;

export default settingsSlice.reducer;
