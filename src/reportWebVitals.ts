import type { Metric } from "web-vitals";

/**
 * Reports Web Vitals metrics for performance monitoring
 *
 * Metrics reported:
 * - CLS (Cumulative Layout Shift): Visual stability
 * - INP (Interaction to Next Paint): Responsiveness
 * - FCP (First Contentful Paint): Loading performance
 * - LCP (Largest Contentful Paint): Loading performance
 * - TTFB (Time to First Byte): Server response time
 */
const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
	if (onPerfEntry && onPerfEntry instanceof Function) {
		import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
			onCLS(onPerfEntry);
			onINP(onPerfEntry);
			onFCP(onPerfEntry);
			onLCP(onPerfEntry);
			onTTFB(onPerfEntry);
		});
	}
};

/**
 * Log Web Vitals to console in development
 */
export const logWebVitals = () => {
	if (import.meta.env.DEV) {
		reportWebVitals((metric) => {
			console.log(`[Web Vitals] ${metric.name}:`, {
				value: metric.value,
				rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
				delta: metric.delta,
			});
		});
	}
};

export default reportWebVitals;
