import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Chip from '@mui/material/Chip';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { authAxios } from '../../axiosInstance';
import AbaciLoader from '../../components/AbaciLoader/AbaciLoader';
import useToasterNotification from '../../hooks/useToasterNotification';
import { allRoutesObject } from '../../routes/RoutesMenu';
import { statusColorCodes } from '../../helpers/constants';
import {
	DASHBOARD_LEAVE_THEME,
	dashboardStatStyle,
	type DashboardTone,
} from './dashboardTheme';

type LeaveStatusCounts = Record<string, number | undefined>;

export type LeaveTypeSummary = {
	leave_type_id?: number;
	id?: number;
	leave_type_name?: string;
	name?: string;
	total?: number;
	total_requests?: number;
	counts?: LeaveStatusCounts;
};

export type RecentLeaveRequest = {
	id?: number;
	user_name?: string;
	employee_name?: string;
	user?: { name?: string; first_name?: string; last_name?: string };
	leave_type_name?: string;
	leave_type?: { name?: string };
	from_date?: string;
	to_date?: string;
	status?: string;
};

export type LeaveRequestsSummary = {
	total_requests?: number;
	total?: number;
	total_counts?: LeaveStatusCounts;
	counts?: LeaveStatusCounts;
	by_leave_type?: LeaveTypeSummary[];
	leave_types?: LeaveTypeSummary[];
	recent_requests?: RecentLeaveRequest[];
	requests?: RecentLeaveRequest[];
};

const LEAVE_STATUS_ORDER = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as const;

const LEAVE_STATUS_LABELS: Record<string, string> = {
	PENDING: 'Pending',
	APPROVED: 'Approved',
	REJECTED: 'Rejected',
	CANCELLED: 'Cancelled',
};

const leaveStatusTheme = (status: string): DashboardTone => {
	const key = String(status || '').trim().toUpperCase();
	const hex = statusColorCodes?.[key];
	const map: Record<string, DashboardTone> = {
		PENDING: DASHBOARD_LEAVE_THEME.pending,
		APPROVED: DASHBOARD_LEAVE_THEME.approved,
		REJECTED: DASHBOARD_LEAVE_THEME.rejected,
		CANCELLED: DASHBOARD_LEAVE_THEME.cancelled,
	};
	if (map[key]) return map[key];
	return {
		color: hex ?? 'var(--bs-secondary-color)',
		bg: hex ? `${hex}22` : 'rgba(var(--bs-secondary-rgb), 0.12)',
		fill: hex ? `${hex}59` : 'rgba(var(--bs-secondary-rgb), 0.35)',
	};
};

const normalizeStatusKey = (status: string) =>
	String(status || '')
		.trim()
		.toUpperCase()
		.replace(/\s+/g, '_');

const countFromMap = (counts: LeaveStatusCounts | undefined, key: string) => {
	const v = counts?.[key];
	return typeof v === 'number' && !Number.isNaN(v) ? v : 0;
};

const resolveCounts = (data: LeaveRequestsSummary | null) =>
	data?.total_counts ?? data?.counts ?? {};

const resolveTotal = (data: LeaveRequestsSummary | null, counts: LeaveStatusCounts) => {
	if (typeof data?.total_requests === 'number') return data.total_requests;
	if (typeof data?.total === 'number') return data.total;
	return LEAVE_STATUS_ORDER.reduce((sum, key) => sum + countFromMap(counts, key), 0);
};

const resolveLeaveTypes = (data: LeaveRequestsSummary | null): LeaveTypeSummary[] => {
	const list = data?.by_leave_type ?? data?.leave_types;
	return Array.isArray(list) ? list : [];
};

const resolveRecentRequests = (data: LeaveRequestsSummary | null): RecentLeaveRequest[] => {
	const list = data?.recent_requests ?? data?.requests;
	return Array.isArray(list) ? list : [];
};

const leaveTypeName = (row: LeaveTypeSummary) =>
	row.leave_type_name ?? row.name ?? '—';

const leaveTypeTotal = (row: LeaveTypeSummary) => {
	if (typeof row.total === 'number') return row.total;
	if (typeof row.total_requests === 'number') return row.total_requests;
	const counts = row.counts ?? {};
	return LEAVE_STATUS_ORDER.reduce((sum, key) => sum + countFromMap(counts, key), 0);
};

const requestEmployeeName = (row: RecentLeaveRequest) => {
	if (row.user_name) return row.user_name;
	if (row.employee_name) return row.employee_name;
	const u = row.user;
	if (u && typeof u === 'object') {
		const full = [u.first_name, u.last_name].filter(Boolean).join(' ').trim();
		return full || u.name || '—';
	}
	return '—';
};

const requestLeaveTypeName = (row: RecentLeaveRequest) =>
	row.leave_type_name ?? row.leave_type?.name ?? '—';

type StatCardProps = {
	label: string;
	value: number;
	tone: DashboardTone;
	icon: React.ReactNode;
};

const StatCard = ({ label, value, tone, icon }: StatCardProps) => (
	<div className='hr-dashboard__stat-card' style={dashboardStatStyle(tone)}>
		<div className='hr-dashboard__stat-icon'>{icon}</div>
		<div className='hr-dashboard__stat-value'>{value}</div>
		<div className='hr-dashboard__stat-label'>{label}</div>
	</div>
);

type ProgressRowProps = {
	label: string;
	value: number;
	total: number;
	tone: DashboardTone;
};

const ProgressRow = ({ label, value, total, tone }: ProgressRowProps) => {
	const pct = total > 0 ? Math.round((value / total) * 100) : 0;
	return (
		<div className='hr-dashboard__progress-row'>
			<div className='hr-dashboard__progress-head'>
				<span style={{ color: tone.color }}>{label}</span>
				<span className='text-muted'>
					{value} <span className='fw-normal'>({pct}%)</span>
				</span>
			</div>
			<div className='hr-dashboard__progress-track'>
				<div
					className='hr-dashboard__progress-fill'
					style={{ width: `${pct}%`, backgroundColor: tone.fill }}
				/>
			</div>
		</div>
	);
};

const DashboardLeaveRequestsSummary = () => {
	const { showErrorNotification } = useToasterNotification();
	const showErrorRef = useRef(showErrorNotification);
	showErrorRef.current = showErrorNotification;

	const [summary, setSummary] = useState<LeaveRequestsSummary | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchSummary = useCallback(() => {
		let cancelled = false;
		setLoading(true);
		authAxios
			.get<LeaveRequestsSummary>('/api/hr/dashboard/leave-requests-summary/')
			.then((res) => {
				if (!cancelled) setSummary(res.data ?? null);
			})
			.catch((err) => {
				if (!cancelled) {
					setSummary(null);
					showErrorRef.current(err);
				}
			})
			.finally(() => {
				setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		const cleanup = fetchSummary();
		return cleanup;
	}, [fetchSummary]);

	if (loading && !summary) {
		return (
			<div className='hr-dashboard mt-4'>
				<div className='d-flex justify-content-center py-4'>
					<AbaciLoader />
				</div>
			</div>
		);
	}

	const counts = resolveCounts(summary);
	const total = resolveTotal(summary, counts);
	const leaveTypes = resolveLeaveTypes(summary);
	const recentRequests = resolveRecentRequests(summary);

	const statusKeys = [
		...LEAVE_STATUS_ORDER,
		...Object.keys(counts)
			.map(normalizeStatusKey)
			.filter((k) => k && !LEAVE_STATUS_ORDER.includes(k as (typeof LEAVE_STATUS_ORDER)[number])),
	];

	const statusRows = statusKeys.map((key) => ({
		key,
		label: LEAVE_STATUS_LABELS[key] ?? key.replace(/_/g, ' '),
		value: countFromMap(counts, key),
		theme: leaveStatusTheme(key),
	}));

	const statCards: StatCardProps[] = [
		{
			label: 'Total requests',
			value: total,
			tone: DASHBOARD_LEAVE_THEME.total,
			icon: <PendingActionsOutlinedIcon />,
		},
		...LEAVE_STATUS_ORDER.map((key) => ({
			label: LEAVE_STATUS_LABELS[key] ?? key,
			value: countFromMap(counts, key),
			tone: leaveStatusTheme(key),
			icon:
				key === 'APPROVED' ? (
					<CheckCircleOutlineIcon />
				) : key === 'PENDING' ? (
					<PendingActionsOutlinedIcon />
				) : (
					<CancelOutlinedIcon />
				),
		})),
	];

	return (
		<div className='hr-dashboard mt-4 pt-2'>
			<div className='d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3'>
				<div className='hr-dashboard__section-title mb-0'>
					<EventBusyOutlinedIcon fontSize='small' />
					Leave requests
				</div>
				<Link to={allRoutesObject.LeaveRequests.path} className='hr-dashboard__view-link mt-0'>
					View all
					<ArrowForwardIcon sx={{ fontSize: '1rem' }} />
				</Link>
			</div>

			{summary ? (
				<>
					<div className='hr-dashboard__stat-row'>
						{statCards.map((stat) => (
							<StatCard key={stat.label} {...stat} />
						))}
					</div>

					{total > 0 ? (
						<div className='row g-3 mb-4'>
							<div className={classNames(leaveTypes.length > 0 ? 'col-lg-6' : 'col-12')}>
								<div className='hr-dashboard__panel'>
									<div className='hr-dashboard__panel-title'>By status</div>
									{statusRows.map(({ key, label, value, theme }) => (
										<ProgressRow
											key={key}
											label={label}
											value={value}
											total={total}
											tone={theme}
										/>
									))}
								</div>
							</div>
							{leaveTypes.length > 0 ? (
								<div className='col-lg-6'>
									<div className='hr-dashboard__panel'>
										<div className='hr-dashboard__panel-title'>By leave type</div>
										{leaveTypes.map((row, i) => {
											const typeCounts = row.counts ?? {};
											const typeTotal = leaveTypeTotal(row);
											const pending = countFromMap(typeCounts, 'PENDING');
											return (
												<div
													key={row.leave_type_id ?? row.id ?? i}
													className='hr-dashboard__progress-row'>
													<div className='hr-dashboard__progress-head'>
														<span className='text-warning fw-semibold'>
															{leaveTypeName(row)}
														</span>
														<span className='text-muted'>{typeTotal}</span>
													</div>
													<div className='d-flex flex-wrap gap-2'>
														{pending > 0 ? (
															<Chip
																size='small'
																label={`Pending: ${pending}`}
																sx={{
																	fontWeight: 600,
																	color: leaveStatusTheme('PENDING').color,
																	bgcolor: leaveStatusTheme('PENDING').bg,
																}}
															/>
														) : null}
														{countFromMap(typeCounts, 'APPROVED') > 0 ? (
															<Chip
																size='small'
																label={`Approved: ${countFromMap(typeCounts, 'APPROVED')}`}
																sx={{
																	fontWeight: 600,
																	color: leaveStatusTheme('APPROVED').color,
																	bgcolor: leaveStatusTheme('APPROVED').bg,
																}}
															/>
														) : null}
													</div>
												</div>
											);
										})}
									</div>
								</div>
							) : null}
						</div>
					) : null}

					{recentRequests.length > 0 ? (
						<>
							<div className='hr-dashboard__section-title'>Recent requests</div>
							<div className='hr-dashboard__panel p-0 overflow-hidden'>
								<div className='table-responsive'>
									<table className='table table-modern table-hover mb-0'>
										<thead>
											<tr>
												<th>Employee</th>
												<th>Leave type</th>
												<th>From</th>
												<th>To</th>
												<th>Status</th>
											</tr>
										</thead>
										<tbody>
											{recentRequests.map((row, i) => {
												const statusKey = normalizeStatusKey(row.status ?? '');
												const theme = leaveStatusTheme(statusKey);
												return (
													<tr key={row.id ?? i}>
														<td className='fw-semibold'>{requestEmployeeName(row)}</td>
														<td>{requestLeaveTypeName(row)}</td>
														<td>{row.from_date || '—'}</td>
														<td>{row.to_date || '—'}</td>
														<td>
															<Chip
																size='small'
																label={row.status || '—'}
																sx={{
																	fontWeight: 600,
																	color: theme.color,
																	bgcolor: theme.bg,
																}}
															/>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							</div>
						</>
					) : null}
				</>
			) : !loading ? (
				<p className='text-muted mb-0'>No leave request summary available.</p>
			) : null}
		</div>
	);
};

export default DashboardLeaveRequestsSummary;
