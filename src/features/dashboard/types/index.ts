import { z } from "zod";

// Schema Zod para validación de respuestas API
export const dashboardMetricSchema = z.object({
	name: z.string(),
	value: z.union([z.string(), z.number()]),
	color: z.string(),
	icon: z.string().optional(),
});

export const dashboardMetricsArraySchema = z.array(dashboardMetricSchema);

// Tipo inferido del schema
export type DashboardMetric = z.infer<typeof dashboardMetricSchema>;
