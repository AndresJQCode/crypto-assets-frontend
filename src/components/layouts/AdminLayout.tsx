import { Outlet } from "@tanstack/react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar";
import { APP_NAME } from "@/constants/app";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { PermissionsProvider } from "../../contexts/PermissionsContext";
import { AdminHeader } from "./AdminHeader";
import { AdminNavigation } from "./AdminNavigation";

export const AdminLayout = () => {
	// Proteger la ruta admin
	useAuthGuard();

	return (
		<PermissionsProvider>
			<SidebarProvider>
				<Sidebar variant="inset">
					<SidebarHeader>
						<div className="flex justify-center items-center px-4 py-2">
							<span className="font-semibold">{APP_NAME}</span>
						</div>
					</SidebarHeader>

					<SidebarContent>
						<AdminNavigation />
					</SidebarContent>

					<SidebarFooter>
						<div className="m-auto text-xs text-muted-foreground">v1.0.0</div>
					</SidebarFooter>
				</Sidebar>

				<SidebarInset className="min-w-0 overflow-hidden">
					<AdminHeader />
					<main className="flex-1 space-y-4 p-4 pt-6">
						<Outlet />
					</main>
				</SidebarInset>
			</SidebarProvider>
		</PermissionsProvider>
	);
};
