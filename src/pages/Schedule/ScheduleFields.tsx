import React from 'react';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../components/CustomComponent/Select/ReactSelectComponent';
import StartDateAndEndDateField from '../../components/CustomComponent/StartDateAndEndDate';

export const SHIFT_HOURS_TARGET_OPTIONS = [
	{ label: 'Daily', value: 'DAILY' },
	{ label: 'Weekly', value: 'WEEKLY' },
];

export const shiftHoursTargetFromApi = (raw: unknown) => {
	const v = String(raw ?? 'DAILY')
		.trim()
		.toUpperCase();
	return SHIFT_HOURS_TARGET_OPTIONS.find((o) => o.value === v) ?? SHIFT_HOURS_TARGET_OPTIONS[0];
};

const applicableDayOptions = [
	{ label: 'MON', value: 'MON' },
	{ label: 'TUE', value: 'TUE' },
	{ label: 'WED', value: 'WED' },
	{ label: 'THU', value: 'THU' },
	{ label: 'FRI', value: 'FRI' },
	{ label: 'SAT', value: 'SAT' },
	{ label: 'SUN', value: 'SUN' },
];

const ScheduleFields = ({
	register,
	errors,
	control,
	getValues,
	watch,
	setValue,
	shiftOptions,
}: any) => {
	return (
		<>
			<div className='col-12'>
				<FormGroup label='Name *'>
					<input type='text' className='form-control' {...register('name', { required: true })} />
					{errors?.name?.type === 'required' ? <span style={{ color: 'red' }}>*This field is required</span> : <p />}
				</FormGroup>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Shifts'
					isMulti
					field_name='shifts'
					getValues={getValues}
					errors={errors}
					options={shiftOptions}
					isRequired={false}
					isClearable
				/>
			</div>
			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Applicable Days *'
					isMulti
					field_name='applicable_days'
					getValues={getValues}
					errors={errors}
					options={applicableDayOptions}
					isRequired
				/>
			</div>
			<div className='col-12'>
				<FormGroup label='Priority *'>
					<input
						type='number'
						className='form-control'
						min='0'
						{...register('priority_choice_number', { required: true, valueAsNumber: true })}
					/>
				</FormGroup>
			</div>
			
			<div className='col-12'>
				<StartDateAndEndDateField
					register={register}
					errors={errors}
					watch={watch}
					setValue={setValue}
					startDate='start_date'
					endDate='end_date'
					startDateLabel='Start Date'
					endDateLabel='End Date'
					is_StartDateRequired
					is_EndDateRequired
					isDisable={false}
				/>
			</div>
			

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Shift hours target *'
					isMulti={false}
					field_name='shift_hours_target'
					getValues={getValues}
					errors={errors}
					options={SHIFT_HOURS_TARGET_OPTIONS}
					isRequired
				/>
			</div>
			<div className='col-12'>
				<FormGroup label='Minimum target hours *'>
					<input
						type='number'
						min='0'
						step='0.01'
						className='form-control'
						{...register('minimum_target_hours', { required: true, valueAsNumber: true })}
					/>
					{errors?.minimum_target_hours?.type === 'required' ? (
						<span style={{ color: 'red' }}>*This field is required</span>
					) : (
						<p />
					)}
				</FormGroup>
			</div>
			<div className='col-12'>
				<FormGroup label='Notes ' >
					<textarea style={{height:'100px'}} rows={3} className='form-control' {...register('notes', { required: false })} />
					{errors?.notes?.type === 'required' ? (
						<span style={{ color: 'red' }}>*This field is required</span>
					) : (
						<p />
					)}
				</FormGroup>
			</div>
			<div className='col-12'>
				<FormGroup label='Max OT hours allowed (per day)'>
					<input
						type='number'
						min='0'
						step='0.25'
						className='form-control'
						{...register('ot_hours')}
					/>
				</FormGroup>
			</div>
		</>
	);
};

export default ScheduleFields;
