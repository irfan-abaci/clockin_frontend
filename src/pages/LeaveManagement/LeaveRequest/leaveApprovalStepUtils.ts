export type LeaveApprovalStep = {
	id?: number;
	level?: number;
	status?: string;
	approver_type?: string;
	approver_type_display?: string;
	approver_role?: string;
	approver_role_display?: string;
	acted_by?: { id?: number; name?: string; email?: string } | string | null;
	acted_at?: string | null;
	remarks?: string | null;
	is_current?: boolean;
};

export type LeaveApprovalStepsMeta = {
	leaveRequestId?: number;
	currentApprovalLevel?: number;
};

const META_KEYS = new Set(['id', 'current_approval_level']);

const isApprovalStep = (value: unknown): value is LeaveApprovalStep =>
	value != null &&
	typeof value === 'object' &&
	('level' in value ||
		'status' in value ||
		'approver_type' in value ||
		'approver_type_display' in value ||
		'approver_role' in value ||
		'approver_role_display' in value ||
		'is_current' in value);

const stepsFromNumericKeys = (obj: Record<string, unknown>): LeaveApprovalStep[] =>
	Object.entries(obj)
		.filter(([key, value]) => /^\d+$/.test(key) && isApprovalStep(value))
		.sort(([a], [b]) => Number(a) - Number(b))
		.map(([, value]) => value as LeaveApprovalStep);

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

export const approvalStepApproverLabel = (step?: LeaveApprovalStep | null) =>
	step?.approver_type_display?.trim() ||
	step?.approver_role_display?.trim() ||
	(step?.approver_type?.trim() ? formatApproverType(step.approver_type) : null) ||
	(step?.approver_role?.trim() ? formatApproverType(step.approver_role) : null) ||
	actedByLabel(step?.acted_by) ||
	(step?.level != null ? `Level ${step.level}` : 'Approver');

export const sortApprovalSteps = (steps?: LeaveApprovalStep[]) => {
	if (!Array.isArray(steps)) return [];
	return [...steps].sort((a, b) => Number(a?.level ?? 0) - Number(b?.level ?? 0));
};

export const parseApprovalStepsResponse = (
	data: unknown,
): { steps: LeaveApprovalStep[]; meta: LeaveApprovalStepsMeta } => {
	const meta: LeaveApprovalStepsMeta = {};

	if (Array.isArray(data)) {
		const arr = data as LeaveApprovalStep[] & LeaveApprovalStepsMeta & Record<string, unknown>;
		if (typeof arr.id === 'number') meta.leaveRequestId = arr.id;
		if (typeof arr.current_approval_level === 'number') {
			meta.currentApprovalLevel = arr.current_approval_level;
		}
		return { steps: arr.filter(isApprovalStep), meta };
	}

	if (data && typeof data === 'object') {
		const obj = data as Record<string, unknown>;

		if (typeof obj.id === 'number') meta.leaveRequestId = obj.id;
		if (typeof obj.current_approval_level === 'number') {
			meta.currentApprovalLevel = obj.current_approval_level;
		}

		for (const key of ['approval_steps', 'steps', 'results', 'data'] as const) {
			const nested = obj[key];
			if (Array.isArray(nested)) {
				return { steps: nested.filter(isApprovalStep) as LeaveApprovalStep[], meta };
			}
		}

		const numericSteps = stepsFromNumericKeys(obj);
		if (numericSteps.length > 0) return { steps: numericSteps, meta };

		const objectSteps = Object.entries(obj)
			.filter(([key, value]) => !META_KEYS.has(key) && isApprovalStep(value))
			.map(([, value]) => value as LeaveApprovalStep);
		if (objectSteps.length > 0) return { steps: objectSteps, meta };
	}

	return { steps: [], meta };
};

export const normalizeApprovalStepsResponse = (data: unknown): LeaveApprovalStep[] =>
	parseApprovalStepsResponse(data).steps;

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
