import { authAxios } from '../../axiosInstance';

export type AssignedGroupRow = {
	id: number;
	name: string;
};

export const normalizeAssignedGroups = (groups: unknown): AssignedGroupRow[] => {
	if (!Array.isArray(groups)) return [];
	const seen = new Set<number>();
	const rows: AssignedGroupRow[] = [];
	for (const g of groups) {
		if (g == null || typeof g !== 'object' || Array.isArray(g)) continue;
		const o = g as Record<string, unknown>;
		const id = Number(o.id ?? o.group_id ?? o.pk);
		const name = String(o.name || o.group_name || o.title || '').trim();
		if (Number.isNaN(id) || !name || seen.has(id)) continue;
		seen.add(id);
		rows.push({ id, name });
	}
	return rows;
};

const scheduleIdsFromGroup = (group: Record<string, unknown>): number[] => {
	const raw = group?.schedules ?? group?.schedule_ids ?? [];
	if (!Array.isArray(raw)) return [];
	return raw
		.map((item) => {
			if (item == null) return NaN;
			if (typeof item === 'object' && !Array.isArray(item)) {
				return Number((item as Record<string, unknown>).id);
			}
			return Number(item);
		})
		.filter((n) => !Number.isNaN(n));
};

export const assignScheduleToGroup = async (groupId: number, scheduleId: number) => {
	const res = await authAxios.get(`api/hr/groups/${groupId}/`);
	const group = res?.data ?? {};
	const existing = scheduleIdsFromGroup(group);
	if (existing.includes(scheduleId)) return;
	await authAxios.patch(`api/hr/groups/${groupId}/`, {
		schedules: [...existing, scheduleId],
	});
};

export const unassignScheduleFromGroup = async (groupId: number, scheduleId: number) => {
	const res = await authAxios.get(`api/hr/groups/${groupId}/`);
	const group = res?.data ?? {};
	const existing = scheduleIdsFromGroup(group);
	await authAxios.patch(`api/hr/groups/${groupId}/`, {
		schedules: existing.filter((id) => id !== scheduleId),
	});
};
