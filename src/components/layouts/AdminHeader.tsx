import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogoutButton } from "@/features/authentication/components";
import { useAuth } from "@/hooks/useAuth";

export const AdminHeader = () => {
	const { user } = useAuth();

	const getUserInitials = () => {
		if (user?.name) {
			return `${user.name.charAt(0)}`.toUpperCase();
		}
		if (user?.email) {
			return user.email.charAt(0).toUpperCase();
		}
		return "U";
	};

	const getUserDisplayName = () => {
		if (user?.name) {
			return `${user.name}`;
		}
		if (user?.email) {
			return user.email;
		}
		return "Usuario";
	};

	return (
		<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator orientation="vertical" className="mr-2 h-4" />

			{/* Espaciado flexible */}
			<div className="flex-1" />

			{/* Acciones del header */}
			<div className="flex items-center gap-2">
				{/* Notificaciones */}
				<Button variant="ghost" size="icon" className="relative">
					<Bell className="h-4 w-4" />
					<span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
						3
					</span>
				</Button>

				<Separator orientation="vertical" className="h-4" />

				{/* Usuario */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="gap-2">
							<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
								{getUserInitials()}
							</div>
							<span className="hidden md:inline-block">{getUserDisplayName()}</span>
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-72 p-0">
						{/* Card del perfil */}
						<div className="p-4 border-b">
							<div className="flex items-center space-x-3">
								<div className="flex-1 min-w-0">
									<p className="text-md text-gray-700 truncate">{user?.email}</p>
									<p className="text-md text-gray-700 truncate">
										{user?.roles && user.roles.length > 0 ? (
											<span>{user.roles.join(", ")}</span>
										) : (
											<span>Sin roles asignados</span>
										)}
									</p>
								</div>
							</div>
						</div>

						{/* Botón de cerrar sesión */}
						<div className="p-2">
							<DropdownMenuItem asChild>
								<LogoutButton
									variant="ghost"
									size="sm"
									className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-md"
								>
									Cerrar Sesión
								</LogoutButton>
							</DropdownMenuItem>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
};
