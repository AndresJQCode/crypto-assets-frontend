/**
 * reCAPTCHA Enterprise - script loader and token execution.
 * Uses the official Google API: enterprise.js and grecaptcha.enterprise.execute(siteKey, { action }).
 * @see https://cloud.google.com/recaptcha-enterprise/docs
 */

declare global {
	interface Window {
		grecaptcha?: {
			enterprise: {
				ready: (callback: () => void) => void;
				execute: (siteKey: string, options: { action: string }) => Promise<string>;
			};
		};
	}
}

const RECAPTCHA_ENTERPRISE_SCRIPT_URL = "https://www.google.com/recaptcha/enterprise.js";

let scriptLoadPromise: Promise<void> | null = null;

/**
 * Loads the reCAPTCHA Enterprise script once. Safe to call multiple times.
 * @param siteKey - Site key for reCAPTCHA Enterprise (used in script URL render param)
 */
export function loadRecaptchaEnterpriseScript(siteKey: string): Promise<void> {
	if (typeof window === "undefined") {
		return Promise.resolve();
	}

	if (window.grecaptcha?.enterprise) {
		return Promise.resolve();
	}

	if (scriptLoadPromise) {
		return scriptLoadPromise;
	}

	const existing = document.querySelector(`script[src^="${RECAPTCHA_ENTERPRISE_SCRIPT_URL}"]`);
	if (existing) {
		scriptLoadPromise = new Promise((resolve) => {
			const check = () => {
				if (window.grecaptcha?.enterprise) {
					resolve();
					return;
				}
				setTimeout(check, 50);
			};
			check();
		});
		return scriptLoadPromise;
	}

	scriptLoadPromise = new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = `${RECAPTCHA_ENTERPRISE_SCRIPT_URL}?render=${encodeURIComponent(siteKey)}`;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			scriptLoadPromise = null;
			reject(new Error("Failed to load reCAPTCHA Enterprise script"));
		};
		document.head.appendChild(script);
	});

	return scriptLoadPromise;
}

/**
 * Returns a reCAPTCHA Enterprise token for the given action.
 * Loads the script if needed, then calls grecaptcha.enterprise.execute(siteKey, { action }).
 * Token expires after 2 minutes; send it to your backend for verification.
 *
 * @param siteKey - reCAPTCHA Enterprise site key
 * @param action - Action name (e.g. 'LOGIN', 'REGISTER', 'FORGOT_PASSWORD')
 * @returns The token string, or undefined if script/execute fails or key is missing
 */
export async function getRecaptchaEnterpriseToken(
	siteKey: string | undefined,
	action: string,
): Promise<string | undefined> {
	if (!siteKey || siteKey.trim() === "") {
		return undefined;
	}

	try {
		await loadRecaptchaEnterpriseScript(siteKey);
	} catch (error) {
		console.error("reCAPTCHA Enterprise: failed to load script", error);
		return undefined;
	}

	const grecaptcha = window.grecaptcha?.enterprise;
	if (!grecaptcha) {
		return undefined;
	}

	return new Promise((resolve) => {
		grecaptcha.ready(() => {
			grecaptcha
				.execute(siteKey, { action })
				.then(resolve)
				.catch((err: unknown) => {
					console.error("reCAPTCHA Enterprise: execute failed", err);
					resolve(undefined);
				});
		});
	});
}
