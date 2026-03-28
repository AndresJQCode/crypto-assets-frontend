import { cn } from "@/lib/utils";
import type { ConnectorType } from "../types";

interface ConnectorIconProps {
	type?: ConnectorType;
	className?: string;
	size?: "sm" | "md" | "lg";
}

const sizeClasses = {
	sm: "w-8 h-8",
	md: "w-12 h-12",
	lg: "w-16 h-16",
};

export const ConnectorIcon = ({ className, size = "md" }: ConnectorIconProps) => {
	const baseClasses = cn("rounded-lg flex items-center justify-center", sizeClasses[size], className);

	return (
		<div className={cn(baseClasses, "bg-[#f7a600]/10")}>
			<svg viewBox="0 0 32 32" className="w-2/3 h-2/3" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="32" height="32" rx="6" fill="#f7a600" />
				<path d="M8 12h4v8H8zm6 0h4v8h-4zm6 0h4v8h-4z" fill="#fff" />
			</svg>
		</div>
	);
};
