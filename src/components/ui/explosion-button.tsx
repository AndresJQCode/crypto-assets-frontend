import { useState, useRef } from "react";
import { Button } from "./button";
import "./explosion-button.css";

interface ExplosionButtonProps {
	children?: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	className?: string;
	loading?: boolean;
	explosionColor?: string;
	particleCount?: number;
}

export const ExplosionButton = ({
	children,
	onClick,
	disabled = false,
	variant = "default",
	className = "",
	loading = false,
	explosionColor = "#ffffff",
	particleCount = 12,
}: ExplosionButtonProps) => {
	const [isExploding, setIsExploding] = useState(false);
	const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number }>>([]);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const createParticles = (centerX: number, centerY: number) => {
		const newParticles = [];
		for (let i = 0; i < particleCount; i++) {
			const angle = (360 / particleCount) * i;
			newParticles.push({
				id: i,
				x: centerX,
				y: centerY,
				angle: angle,
			});
		}
		return newParticles;
	};

	const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		if (loading || disabled) return;

		// Crear efecto de explosión
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			
			setParticles(createParticles(centerX, centerY));
			setIsExploding(true);

			// Limpiar partículas después de la animación
			setTimeout(() => {
				setIsExploding(false);
				setParticles([]);
			}, 600);
		}

		// Ejecutar función onClick si existe
		if (onClick) {
			await onClick(event);
		}
	};

	return (
		<>
			{/* Partículas de explosión */}
			{isExploding && (
				<div className="explosion-container">
					{particles.map((particle) => (
						<div
							key={particle.id}
							className="explosion-particle"
							style={{
								'--particle-angle': `${particle.angle}deg`,
								'--explosion-color': explosionColor,
								left: `${particle.x}px`,
								top: `${particle.y}px`,
							} as React.CSSProperties}
						/>
					))}
				</div>
			)}

			<Button
				ref={buttonRef}
				onClick={handleClick}
				disabled={disabled || loading}
				variant={variant}
				className={`explosion-button ${isExploding ? "exploding" : ""} ${loading ? "loading" : ""} ${className}`}
			>
				{/* Contenido del botón */}
				<div className="explosion-button-content">
					{loading ? (
						<>
							<div className="loading-spinner" />
							<span>Cargando...</span>
						</>
					) : (
						children
					)}
				</div>
			</Button>
		</>
	);
};
