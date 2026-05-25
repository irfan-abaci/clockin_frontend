export const ATTENDANCE_STATUS_META: Record<string, { label: string; color: string }> = {
	PRESENT: { label: 'Present', color: '#198754' },
	ABSENT: { label: 'Absent', color: '#dc3545' },
	HALF_DAY: { label: 'Half Day', color: '#fd7e14' },
	LEAVE: { label: 'On Leave', color: '#0d6efd' },
	HOLIDAY: { label: 'Holiday', color: '#6f42c1' },
	WEEKEND: { label: 'Weekend', color: '#6c757d' },
	LATE: { label: 'Late', color: '#f0ad4e' },
	SPECIAL_SCHEDULE: { label: 'Special Schedule', color: '#20c997' },
	SCHEDULED: { label: 'Scheduled', color: '#3174ad' },
	ATTENDANCE_REMOVED: { label: 'Attendance removed', color: '#6c757d' },
};

export const ATTENDANCE_REMOVED_META = ATTENDANCE_STATUS_META.ATTENDANCE_REMOVED;

export const isAttendanceDeleted = (data: any): boolean => {
	if (!data || typeof data !== 'object') return false;
	const v = data.attendance_deleted;
	return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';
};

export const attendanceDeletedByLine = (data: any): string | null => {
	if (!isAttendanceDeleted(data)) return null;
	const by = formatAttendanceUserName(data?.attendance_deleted_by);
	return by ? `Removed by ${by}` : null;
};

export const normalizeAttendanceStatusKey = (status: string | undefined) =>
	String(status || '')
		.trim()
		.toUpperCase()
		.replace(/\s+/g, '_');

export const getAttendanceStatusMeta = (status: string | undefined) => {
	const key = normalizeAttendanceStatusKey(status);
	if (!key) return null;
	return (
		ATTENDANCE_STATUS_META[key] || {
			label: key.replace(/_/g, ' '),
			color: '#0d6efd',
		}
	);
};

export const formatAttendanceUserName = (user: any): string => {
	if (user == null) return '';
	if (typeof user === 'string') return user.trim();
	const first = String(user?.first_name || '').trim();
	const last = String(user?.last_name || '').trim();
	const full = [first, last].filter(Boolean).join(' ').trim();
	if (full) return full;
	return String(user?.name || user?.preferred_name || user?.email || '').trim();
};

export const attendanceRowUserId = (row: any): number | null => {
	const u = row?.user;
	if (u == null) return null;
	if (typeof u === 'object' && !Array.isArray(u)) {
		const id = u?.id ?? u?.pk;
		if (id == null || id === '') return null;
		const num = Number(id);
		return Number.isNaN(num) ? null : num;
	}
	const num = Number(u);
	return Number.isNaN(num) ? null : num;
};

export const attendanceRowsFromResponse = (res: any): any[] => {
	const d = res?.data;
	if (Array.isArray(d)) return d;
	if (d && Array.isArray(d.results)) return d.results;
	return [];
};

export const eventsFromAttendanceRow = (row: any): any[] =>
	Array.isArray(row?.events) ? row.events.filter((e: any) => e != null) : [];
