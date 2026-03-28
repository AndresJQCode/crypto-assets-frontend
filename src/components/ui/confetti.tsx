import { useEffect, useState } from "react";
import Confetti from "react-confetti";

interface ConfettiEffectProps {
	show: boolean;
	duration?: number;
	onComplete?: () => void;
	originX?: number;
	originY?: number;
}

export const ConfettiEffect = ({ 
	show, 
	duration = 3000, 
	onComplete, 
	originX, 
	originY 
}: ConfettiEffectProps) => {
	const [windowDimensions, setWindowDimensions] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		const updateDimensions = () => {
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);

		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	useEffect(() => {
		if (show) {
			const timer = setTimeout(() => {
				onComplete?.();
			}, duration);

			return () => clearTimeout(timer);
		}
	}, [show, duration, onComplete]);

	if (!show) return null;

	// Si se proporcionan coordenadas de origen, usar confeti desde esa posición
	if (originX !== undefined && originY !== undefined) {
		return (
			<Confetti
				width={windowDimensions.width}
				height={windowDimensions.height}
				recycle={false}
				numberOfPieces={150}
				gravity={0.5}
				initialVelocityY={15}
				initialVelocityX={5}
				confettiSource={{
					x: originX,
					y: originY,
					w: 10,
					h: 10,
				}}
				colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]}
			/>
		);
	}

	// Confeti de pantalla completa (comportamiento original)
	return (
		<Confetti
			width={windowDimensions.width}
			height={windowDimensions.height}
			recycle={false}
			numberOfPieces={200}
			gravity={0.3}
			initialVelocityY={20}
			colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]}
		/>
	);
};
