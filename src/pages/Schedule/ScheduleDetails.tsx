import React from 'react';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Icon from '../../components/icon/Icon';
import { shiftHoursTargetFromApi } from './ScheduleFields';
import ScheduleAssignedGroupsSection from './ScheduleAssignedGroupsSection';

const DetailRow = ({
	label,
	value,
	fullWidth,
	valueIcon,
}: {
	label: string;
	value?: React.ReactNode;
	fullWidth?: boolean;
	/** Icon shown beside the value (e.g. schedule name). */
	valueIcon?: string;
}) => {
	const hasValue = value != null && value !== '';
	const display = hasValue ? value : '—';

	return (
		<div className={fullWidth ? 'col-12' : 'col-md-6 col-12'}>
			<div
				className='text-muted small text-uppercase fw-semibold'
				style={{ fontSize: '0.8rem', letterSpacing: '0.02em' }}>
				{label}
			</div>
			<div className='fs-6 fw-semibold mt-1 d-flex align-items-center gap-2'>
				{valueIcon && hasValue && (
					<span
						className='d-inline-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
						style={{
							width: '2rem',
							height: '2rem',
							backgroundColor: 'rgba(var(--bs-warning-rgb), 0.12)',
						}}>
						<Icon icon={valueIcon} size='lg' color='warning' />
					</span>
				)}
				<span>{display}</span>
			</div>
		</div>
	);
};

const formatShifts = (schedule: any) => {
	if (Array.isArray(schedule?.shifts) && schedule.shifts.length) {
		const names = schedule.shifts
			.map((shift: any) => shift?.name || shift?.shift_name)
			.filter(Boolean);
		if (names.length) return names.join(', ');
	}
	return (
		schedule?.shift_details?.name ||
		schedule?.shift_details?.shift_name ||
		schedule?.shift_name ||
		''
	);
};

const dayMeta: Record<string, { label: string; bg: string; color: string }> = {
	MON: { label: 'Mon', bg: '#e7f1ff', color: '#0d6efd' },
	TUE: { label: 'Tue', bg: '#e8f7ee', color: '#198754' },
	WED: { label: 'Wed', bg: '#fff3e6', color: '#fd7e14' },
	THU: { label: 'Thu', bg: '#f3e8ff', color: '#6f42c1' },
	FRI: { label: 'Fri', bg: '#e6f7f9', color: '#0f6d7a' },
	SAT: { label: 'Sat', bg: '#fff0f3', color: '#d63384' },
	SUN: { label: 'Sun', bg: '#f8f9fa', color: '#495057' },
};

const renderApplicableDays = (days: any) => {
	if (!Array.isArray(days) || days.length === 0) return undefined;
	return (
		<div className='d-flex flex-wrap gap-2'>
			{days.map((rawDay: any) => {
				const key = String(rawDay || '').toUpperCase();
				const meta = dayMeta[key] || {
					label: key || '—',
					bg: '#eef2f7',
					color: '#344054',
				};
				return (
					<span
						key={key}
						className='fw-semibold d-inline-flex align-items-center justify-content-center rounded-circle'
						style={{
							backgroundColor: meta.bg,
							color: meta.color,
							fontSize: '0.8rem',
							width: '2.8rem',
							height: '2.8rem',
						}}>
						{meta.label}
					</span>
				);
			})}
		</div>
	);
};

type ScheduleDetailsProps = {
	schedule: any | null;
	scheduleId?: string | number | null;
	onGroupsChanged?: () => void;
};

const ScheduleDetails = ({ schedule, scheduleId, onGroupsChanged }: ScheduleDetailsProps) => {
	if (!schedule) {
		return null;
	}

	return (
		<div className='row g-4 align-items-stretch'>
			<div className='col-lg-7'>
				<Card className='h-100'>
					<CardHeader>
						<CardLabel icon='Schedule' iconColor='warning'>
							<CardTitle tag='div' className='h5 text-warning mb-0'>
								Schedule details
							</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody className='pt-0'>
						<div className='row g-4'>
							<DetailRow
								label='Schedule name'
								value={schedule?.name}
								valueIcon='Title'
								fullWidth
							/>
							<DetailRow label='Shift(s)' value={formatShifts(schedule)} />
							<DetailRow label='Start date' value={schedule?.start_date} />
							<DetailRow label='End date' value={schedule?.end_date} />
							<DetailRow
								label='Applicable days'
								value={renderApplicableDays(schedule?.applicable_days)}
							/>
							<DetailRow
								label='Max OT hours (per day)'
								value={
									schedule?.ot_hours != null && String(schedule.ot_hours).trim() !== ''
										? String(schedule.ot_hours)
										: undefined
								}
							/>
							<DetailRow
								label='Shift hours target'
								value={
									schedule?.shift_hours_target != null &&
									String(schedule.shift_hours_target).trim() !== ''
										? shiftHoursTargetFromApi(schedule.shift_hours_target).label
										: undefined
								}
							/>
							<DetailRow
								label='Minimum target hours'
								value={
									schedule?.minimum_target_hours != null &&
									String(schedule.minimum_target_hours).trim() !== ''
										? String(schedule.minimum_target_hours)
										: undefined
								}
							/>
							<DetailRow label='Notes' value={schedule?.notes} />
						</div>
					</CardBody>
				</Card>
			</div>
			<div className='col-lg-5'>
				<ScheduleAssignedGroupsSection
					scheduleId={scheduleId ?? schedule?.id}
					groups={schedule?.assigned_groups}
					onChanged={onGroupsChanged}
				/>
			</div>
		</div>
	);
};

export default ScheduleDetails;
