import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
	children?: React.ReactNode;
}

/**
 * Componente que navega a la ruta /logout para cerrar sesión
 * Útil cuando quieres mostrar una página de logout con loading
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
	variant = "destructive",
	size = "default",
	className,
	children,
}) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		navigate({ to: "/logout" });
	};

	return (
		<Button variant={variant} size={size} onClick={handleLogout} className={className}>
			<LogOut className="mr-2 h-4 w-4" />
			{children || "Cerrar Sesión"}
		</Button>
	);
};
