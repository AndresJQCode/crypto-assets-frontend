import { type LucideIcon, Settings, Shield, User, Users, XIcon } from "lucide-react";
import { useState } from "react";
import { PermissionGuard } from "@/components/permissions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PERMISSIONS } from "@/constants/permissions";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { GeneralSettings } from "../general";
import { ProfileSettings } from "../profile/ProfileSettings";
import { RolesSettings } from "../roles";
import { UsersSettings } from "../users";

interface ConfigurationOption {
	id: string;
	title: string;
	description?: string;
	icon: LucideIcon;
	component: React.ComponentType;
	permission?: {
		resource: string;
		action: string;
	};
	badge?: string;
}

const configurationOptions: ConfigurationOption[] = [
	{
		id: "general",
		title: "General",
		icon: Settings,
		component: GeneralSettings,
	},
	{
		id: "profile",
		title: "Mi perfil",
		icon: User,
		component: ProfileSettings,
	},
	{
		id: "users",
		title: "Usuarios",
		icon: Users,
		component: UsersSettings,
		permission: {
			resource: PERMISSIONS.USERS_READ.resource,
			action: PERMISSIONS.USERS_READ.action,
		},
	},
	{
		id: "roles",
		title: "Roles",
		icon: Shield,
		component: RolesSettings,
		permission: {
			resource: PERMISSIONS.ROLES_CREATE.resource,
			action: PERMISSIONS.ROLES_CREATE.action,
		},
	},
];

interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectOption: (optionId: string) => void;
}

// Componente interno que se monta/desmonta
const SettingsModalContent: React.FC<{
	onClose: () => void;
	onSelectOption: (optionId: string) => void;
}> = ({ onClose, onSelectOption }) => {
	const { user } = useAuth();
	const [selectedOption, setSelectedOption] = useState<string>("general");

	const handleOptionClick = (optionId: string) => {
		setSelectedOption(optionId);
		onSelectOption(optionId);
	};

	const renderContent = () => {
		const selectedConfigOption = configurationOptions.find((option) => option.id === selectedOption);

		if (!selectedConfigOption) {
			return null;
		}

		const ContentComponent = selectedConfigOption.component;
		return <ContentComponent />;
	};

	const renderOption = (option: ConfigurationOption) => {
		const isSelected = selectedOption === option.id;
		const content = (
			<div
				className={cn(
					"flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
					isSelected && "bg-muted",
				)}
				onClick={() => handleOptionClick(option.id)}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleOptionClick(option.id);
					}
				}}
				tabIndex={0}
				role="menuitem"
			>
				<option.icon className="h-5 w-5 text-muted-foreground" />
				<span className="text-sm font-medium">{option.title}</span>
			</div>
		);

		if (option.permission) {
			return (
				<PermissionGuard key={option.id} resource={option.permission.resource} action={option.permission.action}>
					{content}
				</PermissionGuard>
			);
		}

		return <div key={option.id}>{content}</div>;
	};

	return (
		<DialogContent
			className="!w-screen !h-screen !max-w-none !max-h-none !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none !border-0 p-0"
			style={{
				width: "100vw",
				height: "100vh",
				maxWidth: "none",
				maxHeight: "none",
				top: 0,
				left: 0,
				transform: "none",
				borderRadius: 0,
				border: "none",
			}}
			showCloseButton={false}
			aria-describedby="settings-modal-description"
		>
			<DialogTitle className="sr-only">Configuración</DialogTitle>
			<DialogDescription className="sr-only">Configuración</DialogDescription>
			<div className="h-full overflow-y-auto">
				<div className="flex min-h-full">
					{/* Sidebar */}
					<div className="w-80 bg-gray-50 border-r flex flex-col">
						{/* Header con información de la tienda */}
						<div className="p-3 border-b">
							<div className="flex items-center gap-3">
								<div>
									<h2 className="font-bold text-lg">Configuración</h2>
									<p className="text-sm text-gray-500">{user?.email}</p>
								</div>
							</div>
						</div>

						{/* Menú de navegación */}
						<div className="flex-1 p-4">
							<div className="space-y-1">{configurationOptions.map(renderOption)}</div>
						</div>
					</div>

					{/* Content Area */}
					<div className="flex-1 bg-white">
						{/* Botón de cerrar */}
						<div className="absolute top-4 right-4 z-10">
							<Button variant="ghost" size="sm" onClick={onClose}>
								<XIcon className="h-4 w-4" />
							</Button>
						</div>

						{/* Contenido dinámico */}
						{renderContent()}
					</div>
				</div>
			</div>
		</DialogContent>
	);
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSelectOption }) => {
	// Solo renderiza el contenido cuando isOpen es true
	// Esto hace que el componente se monte/desmonte completamente
	if (!isOpen) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={() => {}}>
			<SettingsModalContent onClose={onClose} onSelectOption={onSelectOption} />
		</Dialog>
	);
};
