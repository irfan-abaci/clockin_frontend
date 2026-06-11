import type { CSSProperties } from 'react';

export type DashboardTone = {
	color: string;
	bg: string;
	fill: string;
};

const tone = (color: string, rgb: string): DashboardTone => ({
	color,
	bg: `rgba(${rgb}, 0.12)`,
	fill: `rgba(${rgb}, 0.35)`,
});

export const DASHBOARD_ATTENDANCE_THEME = {
	present: tone('var(--bs-success)', 'var(--bs-success-rgb)'),
	absent: tone('var(--bs-danger)', 'var(--bs-danger-rgb)'),
	leave: tone('var(--bs-info)', 'var(--bs-info-rgb)'),
	clockIn: tone('var(--bs-warning)', 'var(--bs-warning-rgb)'),
	clockOut: tone('var(--bs-primary)', 'var(--bs-primary-rgb)'),
	schedules: tone('var(--bs-primary)', 'var(--bs-primary-rgb)'),
} as const;

export const DASHBOARD_LEAVE_THEME = {
	pending: tone('var(--bs-primary)', 'var(--bs-primary-rgb)'),
	approved: tone('var(--bs-success)', 'var(--bs-success-rgb)'),
	rejected: tone('var(--bs-danger)', 'var(--bs-danger-rgb)'),
	cancelled: tone('var(--bs-danger)', 'var(--bs-danger-rgb)'),
	total: tone('var(--bs-warning)', 'var(--bs-warning-rgb)'),
} as const;

export const dashboardStatStyle = (t: DashboardTone): CSSProperties =>
	({
		['--hr-stat-accent' as string]: t.color,
		['--hr-stat-bg' as string]: t.bg,
	});
