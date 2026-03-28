// Types for general settings

export interface GeneralSettings {
	sendInvitationEmail: boolean;
}

export interface UpdateGeneralSettingsDto {
	sendInvitationEmail?: boolean;
}

export interface GeneralSettingsResponse {
	settings: GeneralSettings;
}
