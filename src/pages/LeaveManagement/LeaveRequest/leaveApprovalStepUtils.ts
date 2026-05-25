export type LeaveApprovalStep = {
	id?: number;
	level?: number;
	status?: string;
	approver_type?: string;
	approver_type_display?: string;
	acted_by?: { name?: string; email?: string } | string | null;
	acted_at?: string | null;
	remarks?: string | null;
	is_current?: boolean;
};

export const STEP_DOT_COLORS: Record<string, string> = {
	APPROVED: '#46BCAA',
	REJECTED: '#F35421',
	CANCELLED: '#F35421',
	PENDING: '#ADB5BD',
	SKIPPED: '#ADB5BD',
};

export const formatApproverType = (raw?: string) =>
	String(raw ?? '')
		.trim()
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase()) || 'Approver';

export const actedByLabel = (actedBy: LeaveApprovalStep['acted_by']) => {
	if (!actedBy) return null;
	if (typeof actedBy === 'string') return actedBy;
	return actedBy?.name || actedBy?.email || null;
};

export const sortApprovalSteps = (steps?: LeaveApprovalStep[]) => {
	if (!Array.isArray(steps)) return [];
	return [...steps].sort((a, b) => Number(a?.level ?? 0) - Number(b?.level ?? 0));
};

export const formatActedAt = (raw?: string | null) => {
	if (!raw) return null;
	const d = new Date(raw);
	if (Number.isNaN(d.getTime())) return String(raw);
	return d.toLocaleString(undefined, {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};
