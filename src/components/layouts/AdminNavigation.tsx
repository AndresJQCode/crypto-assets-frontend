import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, Coins, LayoutDashboard, ListOrdered, type LucideIcon, Plug, Settings } from "lucide-react";
import { useState } from "react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { PERMISSIONS, type SimplePermission } from "@/constants/permissions";
import { ROUTES } from "@/constants/routes";
import { usePermissions } from "@/contexts/usePermissions";
import { SettingsModal } from "@/features/settings";
import { PermissionGuard } from "../permissions";

// Tipos para la navegación
interface NavigationSubItem {
	title: string;
	url: string;
	permission: SimplePermission;
}

interface NavigationItem {
	title: string;
	url: string;
	icon: LucideIcon;
	permission: SimplePermission;
	subItems?: NavigationSubItem[];
	isModal?: boolean;
}

interface NavigationSection {
	title: string;
	items: NavigationItem[];
}

const navigationItems: NavigationSection[] = [
	{
		title: "Panel Principal",
		items: [
			{
				title: "Dashboard",
				url: ROUTES.DASHBOARD,
				icon: LayoutDashboard,
				permission: PERMISSIONS.DASHBOARD_READ,
			},
		],
	},
	{
		title: "Conectores",
		items: [
			{
				title: "Conectores",
				url: ROUTES.CONNECTORS_DEFINITIONS,
				icon: Plug,
				permission: PERMISSIONS.CONNECTORS_READ,
			},
		],
	},
	{
		title: "Activos Digitales",
		items: [
			{
				title: "Activos",
				url: ROUTES.DIGITAL_ASSETS,
				icon: Coins,
				permission: PERMISSIONS.DASHBOARD_READ,
			},
			{
				title: "Órdenes",
				url: ROUTES.DIGITAL_ASSETS_ORDERS,
				icon: ListOrdered,
				permission: PERMISSIONS.DASHBOARD_READ,
			},
		],
	},
	{
		title: "Configuración",
		items: [
			{
				title: "Configuración",
				url: "#",
				icon: Settings,
				permission: PERMISSIONS.SETTINGS_READ,
				isModal: true,
			},
		],
	},
];

export const AdminNavigation = () => {
	const location = useLocation();
	const [openMenus, setOpenMenus] = useState<string[]>([]);
	const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
	const { hasAnyPermission } = usePermissions();

	const toggleMenu = (title: string) => {
		setOpenMenus((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]));
	};

	const handleConfigClick = () => {
		setIsConfigModalOpen(true);
	};

	const handleConfigOptionSelect = (_optionId: string) => {
		// Aquí puedes manejar la selección de opciones si es necesario
		// Option selected: _optionId
	};

	// Función para verificar si una sección debe mostrarse
	const shouldShowSection = (section: NavigationSection): boolean => {
		// Obtener todos los permisos de la sección
		const sectionPermissions = section.items.map((item) => ({
			resource: item.permission.resource,
			action: item.permission.action,
		}));

		// Verificar si el usuario tiene al menos un permiso de la sección
		return hasAnyPermission(sectionPermissions);
	};

	const isActive = (url: string) => {
		const currentPath = location.pathname;

		// Coincidencia exacta
		return currentPath === url;
	};

	const isParentActive = (subItems: { url: string }[]) => {
		return subItems.some((item) => isActive(item.url));
	};

	return (
		<>
			<div className="space-y-2">
				{navigationItems
					.filter((section) => shouldShowSection(section))
					.map((section) => (
						<SidebarGroup key={section.title}>
							<SidebarGroupLabel className="text-xs uppercase tracking-wider">{section.title}</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{section.items.map((item) => (
										<PermissionGuard
											key={item.title}
											resource={item.permission.resource}
											action={item.permission.action}
										>
											<SidebarMenuItem>
												{item.subItems ? (
													<>
														<SidebarMenuButton
															onClick={() => toggleMenu(item.title)}
															isActive={isParentActive(item.subItems)}
															className="w-full justify-between"
														>
															<div className="flex items-center gap-2">
																<item.icon className="h-4 w-4" />
																<span>{item.title}</span>
															</div>
															<ChevronRight
																className={`h-4 w-4 transition-transform ${
																	openMenus.includes(item.title) ? "rotate-90" : ""
																}`}
															/>
														</SidebarMenuButton>
														{openMenus.includes(item.title) && (
															<SidebarMenuSub>
																{item.subItems.map((subItem) => (
																	<PermissionGuard
																		key={subItem.title}
																		resource={subItem.permission.resource}
																		action={subItem.permission.action}
																	>
																		<SidebarMenuSubItem>
																			<SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
																				<Link to={subItem.url}>{subItem.title}</Link>
																			</SidebarMenuSubButton>
																		</SidebarMenuSubItem>
																	</PermissionGuard>
																))}
															</SidebarMenuSub>
														)}
													</>
												) : (
													<SidebarMenuButton
														asChild={!item.isModal}
														isActive={isActive(item.url)}
														onClick={item.isModal ? handleConfigClick : undefined}
													>
														{item.isModal ? (
															<div className="flex items-center gap-2 cursor-pointer">
																<item.icon className="h-4 w-4" />
																<span>{item.title}</span>
															</div>
														) : (
															<Link to={item.url}>
																<item.icon className="h-4 w-4" />
																<span>{item.title}</span>
															</Link>
														)}
													</SidebarMenuButton>
												)}
											</SidebarMenuItem>
										</PermissionGuard>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
			</div>

			{isConfigModalOpen && (
				<SettingsModal
					isOpen={isConfigModalOpen}
					onClose={() => setIsConfigModalOpen(false)}
					onSelectOption={handleConfigOptionSelect}
				/>
			)}
		</>
	);
};
