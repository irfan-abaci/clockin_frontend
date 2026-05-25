import { useCallback } from 'react';

/** Read a user-facing message from API error payloads (incl. `{ error: { message } }`). */
export const extractApiErrorMessage = (error: any): string => {
	if (error == null) return '';
	if (typeof error === 'string') return error.trim();

	const data = error?.response?.data ?? error?.data ?? error;

	if (typeof data === 'string') return data.trim();
	if (Array.isArray(data)) return data.map(String).join(', ');

	if (data && typeof data === 'object') {
		if (typeof data.message === 'string' && data.message.trim()) {
			return data.message.trim();
		}
		if (typeof data.detail === 'string' && data.detail.trim()) {
			return data.detail.trim();
		}

		const nested = data.error;
		if (typeof nested === 'string' && nested.trim()) {
			return nested.trim();
		}
		if (nested && typeof nested === 'object' && typeof nested.message === 'string') {
			return nested.message.trim();
		}

		const keys = Object.keys(data).filter((k) => !['error', 'code', 'status'].includes(k));
		if (keys.length > 0) {
			const firstKey = keys[0];
			const val = (data as Record<string, unknown>)[firstKey];
			if (Array.isArray(val)) {
				const label = firstKey.replace(/_/g, ' ');
				return `${label} - ${val.join(', ')}`;
			}
			if (typeof val === 'string' && val.trim()) {
				return val.trim();
			}
		}
	}

	if (typeof error?.message === 'string' && error.message.trim()) {
		return error.message.trim();
	}

	return '';
};

const useErrorHandler = () => {
	const handleError = useCallback((error: any): string => {
		const apiMessage = extractApiErrorMessage(error);
		if (apiMessage) return apiMessage;
		return 'Something went wrong. Please check your connection and try again!';
	}, []);

	return { handleError };
};

export default useErrorHandler;
