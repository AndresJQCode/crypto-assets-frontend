// Loading skeleton para tabla de órdenes

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const OrderSkeleton = () => {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-32" />
			</CardHeader>
			<CardContent className="space-y-3">
				{Array.from({ length: 10 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="flex items-center space-x-4">
						<Skeleton className="h-12 w-12" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-3/4" />
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
};
