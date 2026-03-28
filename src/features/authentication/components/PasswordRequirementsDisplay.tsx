import { Check, Circle } from "lucide-react";
import { memo } from "react";

interface PasswordRequirement {
	label: string;
	test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
	{ label: "Mín. 8 caracteres", test: (pwd) => pwd.length >= 8 },
	{ label: "Una minúscula", test: (pwd) => /[a-z]/.test(pwd) },
	{ label: "Una mayúscula", test: (pwd) => /[A-Z]/.test(pwd) },
	{ label: "Un número", test: (pwd) => /\d/.test(pwd) },
	{ label: "Un carácter especial", test: (pwd) => /[^a-zA-Z0-9]/.test(pwd) },
];

interface PasswordRequirementsDisplayProps {
	password: string;
}

export const PasswordRequirementsDisplay = memo(function PasswordRequirementsDisplay({
	password,
}: PasswordRequirementsDisplayProps) {
	return (
		<div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
			<p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">La contraseña debe contener:</p>
			<div className="grid grid-cols-2 gap-2">
				{passwordRequirements.map((requirement) => {
					const isValid = requirement.test(password);
					return (
						<div key={requirement.label} className="flex items-center gap-2">
							{isValid ? (
								<Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
							) : (
								<Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />
							)}
							<span
								className={`text-sm ${
									isValid ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
								}`}
							>
								{requirement.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
});
