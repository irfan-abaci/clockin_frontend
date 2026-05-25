import React, { useMemo } from 'react';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';

type Shift = {
	id?: number | string;
	name?: string;
	shift_name?: string;
	start_time?: string;
	end_time?: string;
};

type ScheduleShiftsTimelineProps = {
	shifts?: Shift[];
};

const SHIFT_COLORS = ['#3174ad', '#198754', '#fd7e14', '#6f42c1', '#0d6efd', '#d63384', '#0f6d7a'];

const HOUR_LABELS = Array.from({ length: 25 }, (_, i) => i);

const parseTimeToMinutes = (raw?: string): number | null => {
	if (raw == null) return null;
	const s = String(raw).trim();
	if (!s) return null;
	const [hPart, mPart] = s.split(':');
	const h = Number(hPart);
	const m = Number(mPart ?? 0);
	if (Number.isNaN(h) || Number.isNaN(m)) return null;
	return h * 60 + m;
};

const formatTime = (raw?: string) => {
	const mins = parseTimeToMinutes(raw);
	if (mins == null) return '—';
	const h = Math.floor(mins / 60) % 24;
	const m = mins % 60;
	const hh = String(h).padStart(2, '0');
	const mm = String(m).padStart(2, '0');
	return `${hh}:${mm}`;
};

const formatDuration = (start?: string, end?: string) => {
	const sm = parseTimeToMinutes(start);
	const em = parseTimeToMinutes(end);
	if (sm == null || em == null) return '—';
	let diff = em - sm;
	if (diff <= 0) diff += 24 * 60;
	const h = Math.floor(diff / 60);
	const m = diff % 60;
	if (m === 0) return `${h}h`;
	return `${h}h ${m}m`;
};

const ScheduleShiftsTimeline = ({ shifts }: ScheduleShiftsTimelineProps) => {
	const list = useMemo(
		() => (Array.isArray(shifts) ? shifts.filter(Boolean) : []),
		[shifts],
	);

	if (list.length === 0) return null;

	const totalMinutes = 24 * 60;

	return (
		<Card>
			<CardHeader>
				<CardLabel icon='AccessTime' iconColor='warning'>
					<CardTitle tag='div' className='h5'>
						Shifts
					</CardTitle>
				</CardLabel>
			</CardHeader>
			<CardBody>
				<div className='d-flex flex-column gap-3'>
					<div className='d-flex' style={{ paddingLeft: '12rem' }}>
						<div className='position-relative w-100' style={{ height: 18 }}>
							{HOUR_LABELS.map((h) => (
								<div
									key={h}
									className='position-absolute text-muted'
									style={{
										left: `${(h / 24) * 100}%`,
										transform: 'translateX(-50%)',
										fontSize: '0.65rem',
										whiteSpace: 'nowrap',
									}}>
									{String(h).padStart(2, '0')}:00
								</div>
							))}
						</div>
					</div>

					{list.map((shift, idx) => {
						const startMin = parseTimeToMinutes(shift?.start_time);
						const endMin = parseTimeToMinutes(shift?.end_time);
						const color = SHIFT_COLORS[idx % SHIFT_COLORS.length];
						const label = shift?.name || shift?.shift_name || `Shift ${shift?.id ?? idx + 1}`;

						const segments: { left: number; width: number }[] = [];
						if (startMin != null && endMin != null) {
							if (endMin > startMin) {
								segments.push({
									left: (startMin / totalMinutes) * 100,
									width: ((endMin - startMin) / totalMinutes) * 100,
								});
							} else {
								segments.push({
									left: (startMin / totalMinutes) * 100,
									width: ((totalMinutes - startMin) / totalMinutes) * 100,
								});
								segments.push({ left: 0, width: (endMin / totalMinutes) * 100 });
							}
						}

						return (
							<div key={shift?.id ?? `${label}-${idx}`} className='d-flex align-items-center'>
								<div
									className='flex-shrink-0'
									style={{ width: '12rem', paddingRight: '0.75rem' }}>
									<div className='fw-semibold text-dark text-truncate' title={label}>
										{label}
									</div>
									<div className='text-muted small'>
										{formatTime(shift?.start_time)} – {formatTime(shift?.end_time)}
										<span className='ms-2 fw-semibold'>
											{formatDuration(shift?.start_time, shift?.end_time)}
										</span>
									</div>
								</div>
								<div
									className='position-relative w-100 rounded-pill'
									style={{
										height: 18,
										background: '#f1f3f5',
										border: '1px solid #e9ecef',
									}}>
									{segments.map((seg, i) => (
										<div
											key={`${shift?.id ?? idx}-seg-${i}`}
											className='position-absolute top-0 bottom-0 rounded-pill'
											style={{
												left: `${seg.left}%`,
												width: `${seg.width}%`,
												background: color,
												opacity: 0.9,
											}}
										/>
									))}
									{Array.from({ length: 23 }).map((_, h) => (
										<div
											key={`tick-${shift?.id ?? idx}-${h}`}
											className='position-absolute top-0 bottom-0'
											style={{
												left: `${((h + 1) / 24) * 100}%`,
												width: 1,
												background: '#e9ecef',
											}}
										/>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</CardBody>
		</Card>
	);
};

export default ScheduleShiftsTimeline;
