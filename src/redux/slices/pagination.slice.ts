import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface PaginationState {
	users: {
		page: number;
		limit: number;
	};
	roles: {
		page: number;
		limit: number;
	};
	permissions: {
		page: number;
		limit: number;
	};
	products: {
		page: number;
		limit: number;
	};
}

const initialState: PaginationState = {
	users: {
		page: 1,
		limit: 1,
	},
	roles: {
		page: 1,
		limit: 10,
	},
	permissions: {
		page: 1,
		limit: 10,
	},
	products: {
		page: 1,
		limit: 10,
	},
};

export const paginationSlice = createSlice({
	name: "pagination",
	initialState,
	reducers: {
		setUsersPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
			state.users = action.payload;
		},
		setRolesPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
			state.roles = action.payload;
		},
		setPermissionsPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
			state.permissions = action.payload;
		},
		setProductsPagination: (state, action: PayloadAction<{ page: number; limit: number }>) => {
			state.products = action.payload;
		},
		resetPagination: (state) => {
			state.users = initialState.users;
			state.roles = initialState.roles;
			state.permissions = initialState.permissions;
			state.products = initialState.products;
		},
	},
});

export const {
	setUsersPagination,
	setRolesPagination,
	setPermissionsPagination,
	setProductsPagination,
	resetPagination,
} = paginationSlice.actions;

export default paginationSlice.reducer;
