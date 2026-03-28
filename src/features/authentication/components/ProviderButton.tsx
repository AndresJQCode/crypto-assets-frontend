import { Loader2 } from "lucide-react";
import googleLogo from "@/assets/logos/google.svg";
import microsoftLogo from "@/assets/logos/microsoft.svg";
import { Button } from "@/components/ui/button";

interface ProviderButtonProps {
	provider: "microsoft" | "google";
	onClick: () => void;
	loading?: boolean;
	label?: string;
}

export const ProviderButton = ({ provider, label, onClick, loading }: ProviderButtonProps) => {
	const icons = {
		microsoft: <img src={microsoftLogo} alt="Microsoft" className="w-5 h-5" />,
		google: <img src={googleLogo} alt="Google" className="w-5 h-5" />,
	};

	const labels = {
		microsoft: label || "Continuar con Microsoft",
		google: label || "Continuar con Google",
	};

	const colors = {
		microsoft: "hover:bg-blue-50 border-blue-200",
		google: "hover:bg-red-50 border-red-200",
	};

	return (
		<Button
			type="button"
			variant="outline"
			className={`w-full ${colors[provider]}`}
			onClick={onClick}
			disabled={loading}
		>
			{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : icons[provider]}
			<span className="ml-2">{labels[provider]}</span>
		</Button>
	);
};
