import { APPROVER_TYPE_OPTIONS } from './LeaveTypeApprovalWorkflow';

export const mapApprovalWorkflowsFromApi = (raw: unknown) => {
	if (!Array.isArray(raw)) return [];
	return [...raw]
		.filter((w) => String(w?.approver_type ?? '').trim().toUpperCase() !== 'SPECIFIC_USER')
		.sort((a, b) => Number(a?.level ?? 0) - Number(b?.level ?? 0))
		.map((w) => {
			const typeKey = String(w?.approver_type ?? '')
				.trim()
				.toUpperCase();
			const approver_type =
				APPROVER_TYPE_OPTIONS.find((o) => o.value === typeKey) ?? {
					label: typeKey.replace(/_/g, ' '),
					value: typeKey,
				};

			return {
				approver_type,
				mandatory: Boolean(w?.mandatory),
			};
		});
};

export const buildApprovalWorkflowsPayload = (rows: unknown): any[] => {
	if (!Array.isArray(rows)) return [];
	return rows
		.map((row: any, idx) => {
			const approver_type = String(row?.approver_type?.value ?? row?.approver_type ?? '')
				.trim()
				.toUpperCase();
			if (!approver_type || approver_type === 'SPECIFIC_USER') return null;

			return {
				level: idx + 1,
				approver_type,
				mandatory: Boolean(row?.mandatory),
			};
		})
		.filter(Boolean);
};

export const validateApprovalWorkflows = (rows: unknown): string | null => {
	if (!Array.isArray(rows) || rows.length === 0) return null;
	for (let i = 0; i < rows.length; i += 1) {
		const row = rows[i] as any;
		const approver_type = String(row?.approver_type?.value ?? row?.approver_type ?? '')
			.trim()
			.toUpperCase();
		if (!approver_type) {
			return `Level ${i + 1}: select an approver type.`;
		}
	}
	return null;
};
