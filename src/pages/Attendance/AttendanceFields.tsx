import React from 'react';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import type { FieldErrors, UseFormGetValues } from 'react-hook-form';

export type AttendanceFormValues = {
	date: string;
	clock_in: string;
	clock_out: string;
	break_out: string;
	break_in: string;
	remarks: string;
};

const parseTimeOnDate = (dateStr: string, timeStr: string): number | null => {
	if (!dateStr || !timeStr?.trim()) return null;
	const normalized = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
	const ms = new Date(`${dateStr}T${normalized}`).getTime();
	if (Number.isNaN(ms)) return null;
	return ms;
};

const FieldError = ({ message }: { message?: string }) =>
	message ? <span style={{ color: 'red' }}>{message}</span> : <p />;

type AttendanceFieldsProps = {
	register: any;
	errors: FieldErrors<AttendanceFormValues>;
	getValues: UseFormGetValues<AttendanceFormValues>;
	/** Only show validation messages after the user tries to submit */
	isSubmitted: boolean;
};

const AttendanceFields = ({ register, errors, getValues, isSubmitted }: AttendanceFieldsProps) => {
	const err = (name: keyof AttendanceFormValues) =>
		isSubmitted ? (errors?.[name]?.message as string | undefined) : undefined;

	return (
		<>
			<div className='col-12'>
				<FormGroup label='Date *'>
					<input
						type='date'
						className='form-control'
						{...register('date', {
							required: 'Date is required',
						})}
					/>
					<FieldError message={err('date')} />
				</FormGroup>
			</div>

			<div className='col-12'>
				<FormGroup label='Clock In *'>
					<input type='time' className='form-control' step={60} {...register('clock_in')} />
				</FormGroup>
			</div>

			<div className='col-12'>
				<FormGroup label='Clock Out *'>
					<input
						type='time'
						className='form-control'
						step={60}
						{...register('clock_out', {
							required: 'Clock out is required',
							validate: (value: string) => {
								const day = getValues('date');
								const cin = getValues('clock_in');
								if (!cin?.trim()) return 'Clock in is required';
								if (!day || !value) return true;
								const tIn = parseTimeOnDate(day, cin);
								const tOut = parseTimeOnDate(day, value);
								if (tIn == null || tOut == null) return 'Invalid clock out time';
								if (tOut <= tIn) return 'Clock out must be after clock in';
								return true;
							},
						})}
					/>
					<FieldError message={err('clock_out')} />
				</FormGroup>
			</div>

			<div className='col-12'>
				<FormGroup label='Break Out *'>
					<input
						type='time'
						className='form-control'
						step={60}
						{...register('break_out', {
							required: 'Break out is required',
							validate: (value: string) => {
								const day = getValues('date');
								const cin = getValues('clock_in');
								const cout = getValues('clock_out');
								if (!day || !cin?.trim() || !cout?.trim()) return true;
								const tStart = parseTimeOnDate(day, cin);
								const tEnd = parseTimeOnDate(day, cout);
								if (tStart == null || tEnd == null) return 'Invalid time';
								if (tEnd <= tStart) return true;
								const tBo = parseTimeOnDate(day, value);
								if (tBo == null) return true;
								if (tBo < tStart || tBo > tEnd)
									return 'Break out must fall within clock in and clock out';
								return true;
							},
						})}
					/>
					<FieldError message={err('break_out')} />
				</FormGroup>
			</div>

			<div className='col-12'>
				<FormGroup label='Break In *'>
					<input
						type='time'
						className='form-control'
						step={60}
						{...register('break_in', {
							required: 'Break in is required',
							validate: (value: string) => {
								const day = getValues('date');
								const breakOut = getValues('break_out');
								const cin = getValues('clock_in');
								const cout = getValues('clock_out');
								if (!day || !cin?.trim() || !cout?.trim()) return true;
								const tStart = parseTimeOnDate(day, cin);
								const tEnd = parseTimeOnDate(day, cout);
								if (tStart == null || tEnd == null) return 'Invalid time';
								if (tEnd <= tStart) return true;
								const tBo = parseTimeOnDate(day, breakOut);
								const tBi = parseTimeOnDate(day, value);
								if (tBo == null || tBi == null) return true;
								if (tBi < tStart || tBi > tEnd)
									return 'Break in must fall within clock in and clock out';
								if (tBi <= tBo) return 'Break in must be after break out';
								return true;
							},
						})}
					/>
					<FieldError message={err('break_in')} />
				</FormGroup>
			</div>

			<div className='col-12'>
				<FormGroup label='Remarks'>
					<textarea style={{ height: '100px' }} rows={3} className='form-control' {...register('remarks')} />
				</FormGroup>
			</div>
		</>
	);
};

export default AttendanceFields;
