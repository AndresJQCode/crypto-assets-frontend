import { Skeleton } from "@/components/ui/skeleton";

export const ConnectorDefinitionSkeleton = () => (
	<div className="rounded-lg p-4 bg-white border border-gray-200">
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Skeleton className="w-10 h-10 rounded-lg" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-48" />
				</div>
			</div>
			<div className="flex items-center gap-3">
				<Skeleton className="h-6 w-16" />
				<Skeleton className="h-6 w-20" />
				<Skeleton className="h-8 w-8 rounded" />
			</div>
		</div>
	</div>
);
