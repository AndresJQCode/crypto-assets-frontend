import { useDispatch, useSelector } from "react-redux";
import {
	setPermissionsPagination,
	setProductsPagination,
	setRolesPagination,
	setUsersPagination,
} from "@/redux/slices/pagination.slice";
import type { RootState } from "@/redux/store";

type PaginationType = "users" | "roles" | "permissions" | "products";

export const usePagination = (type: PaginationType) => {
	const dispatch = useDispatch();
	const pagination = useSelector((state: RootState) => state.paginationState[type]);
	const setPagination = (page: number, limit: number) => {
		switch (type) {
			case "users":
				dispatch(setUsersPagination({ page, limit }));
				break;
			case "roles":
				dispatch(setRolesPagination({ page, limit }));
				break;
			case "permissions":
				dispatch(setPermissionsPagination({ page, limit }));
				break;
			case "products":
				dispatch(setProductsPagination({ page, limit }));
				break;
		}
	};

	return {
		page: pagination.page,
		limit: pagination.limit,
		setPagination,
	};
};
