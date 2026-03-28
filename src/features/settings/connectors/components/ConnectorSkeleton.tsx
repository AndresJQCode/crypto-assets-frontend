import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ConnectorSkeleton = () => (
	<Card>
		<CardHeader>
			<div className="flex items-start gap-4">
				<Skeleton className="w-12 h-12 rounded-lg" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-5 w-24" />
					<Skeleton className="h-4 w-full" />
				</div>
			</div>
		</CardHeader>
		<CardContent>
			<div className="flex items-center justify-between">
				<Skeleton className="h-6 w-20" />
				<Skeleton className="h-9 w-24" />
			</div>
		</CardContent>
	</Card>
);

export const ConnectorListSkeleton = () => (
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		<ConnectorSkeleton />
		<ConnectorSkeleton />
	</div>
);
