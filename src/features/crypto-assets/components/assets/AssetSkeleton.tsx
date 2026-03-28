// Loading skeleton para la lista de activos

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const AssetSkeleton = () => {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-32" />
			</CardHeader>
			<CardContent className="space-y-3">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="flex items-center space-x-4">
						<Skeleton className="h-12 w-12 rounded-full" />
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
