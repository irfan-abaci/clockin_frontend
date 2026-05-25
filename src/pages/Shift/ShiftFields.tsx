import React, { useEffect } from 'react';
import FormGroup from '../../components/bootstrap/forms/FormGroup';

const ShiftFields = ({ register, errors, control, getValues, watch, setValue }: any) => {
	const otShift = Boolean(watch('is_ot_shift'));

	useEffect(() => {
		if (otShift) {
			setValue('ot_eligible', false);
			setValue('ot_hours', '');
		}
	}, [otShift, setValue]);

	return (
		<>
			<div className='col-12'>
				<FormGroup label='Name *'>
					<input type='text' className='form-control' {...register('name', { required: true })} />
					{errors?.name?.type === 'required' ? (
						<span style={{ color: 'red' }}>*This field is required</span>
					) : (
						<p />
					)}
				</FormGroup>
			</div>

			<div className='col-12 mb-4'>
				<div className='form-check'>
					<input type='checkbox' className='form-check-input' id='is_ot_shift' {...register('is_ot_shift')} />
					<label className='form-check-label' htmlFor='is_ot_shift'>
						OT shift
					</label>
				</div>
			</div>

			<div className='row'>
				<div className='col-12 col-md-6'>
					<FormGroup label='Start Time *'>
						<input
							type='time'
							step='60'
							className='form-control'
							{...register('start_time', { required: true })}
						/>
						{errors?.start_time?.type === 'required' ? (
							<span style={{ color: 'red' }}>*This field is required</span>
						) : (
							<p />
						)}
					</FormGroup>
				</div>

				<div className='col-12 col-md-6'>
					<FormGroup label='End Time *'>
						<input
							type='time'
							step='60'
							className='form-control'
							{...register('end_time', { required: true })}
						/>
						{errors?.end_time?.type === 'required' ? (
							<span style={{ color: 'red' }}>*This field is required</span>
						) : (
							<p />
						)}
					</FormGroup>
				</div>
			</div>
			<div className='row'>
				<div className='col-12 col-md-6'>
					<FormGroup label='Start Grace Period (mins) *'>
						<input
							type='number'
							min='0'
							className='form-control'
							{...register('start_grace_period_mins', { required: true, valueAsNumber: true })}
						/>
					</FormGroup>
				</div>
				<div className='col-12 col-md-6'>
					<FormGroup label='End Grace Period (mins) *'>
						<input
							type='number'
							min='0'
							className='form-control'
							{...register('end_grace_period_mins', { required: true, valueAsNumber: true })}
						/>
					</FormGroup>
				</div>
			</div>

			<div className='col-12'>
				<FormGroup label='Remarks'>
					<textarea
						className='form-control'
						rows={3}
						{...register('remarks')}
						placeholder='Optional notes for this shift'
					/>
				</FormGroup>
			</div>

			<div className='col-12'>
				<FormGroup label='Minimum hours *'>
					<input
						type='number'
						min='0'
						step='0.01'
						className='form-control'
						placeholder='8.00'
						{...register('minimum_hours', { required: true })}
					/>
					{errors?.minimum_hours?.type === 'required' ? (
						<span style={{ color: 'red' }}>*This field is required</span>
					) : (
						<p />
					)}
				</FormGroup>
			</div>

			<div className='row'>
				<div className='col-12'>
					<FormGroup label='Max OT hours allowed'>
						<input
							type='number'
							min='0'
							step='0.25'
							className='form-control'
							{...register('ot_hours')}
							disabled={otShift}
						/>
					</FormGroup>
				</div>
			</div>

			<div className='row g-2 pt-2'>
				<div className='col-12 col-md-6'>
					<div className='form-check'>
						<input
							type='checkbox'
							className='form-check-input'
							id='ot_eligible'
							{...register('ot_eligible')}
							disabled={otShift}
						/>
						<label
							className={`form-check-label${otShift ? ' text-muted' : ''}`}
							htmlFor='ot_eligible'>
							OT eligible
						</label>
					</div>
				</div>
				<div className='col-12 col-md-6'>
					<div className='form-check'>
						<input type='checkbox' className='form-check-input' id='auto_in' {...register('auto_in')} />
						<label className='form-check-label' htmlFor='auto_in'>
							Auto In
						</label>
					</div>
				</div>
				<div className='col-12 col-md-6'>
					<div className='form-check'>
						<input type='checkbox' className='form-check-input' id='auto_out' {...register('auto_out')} />
						<label className='form-check-label' htmlFor='auto_out'>
							Auto Out
						</label>
					</div>
				</div>
				<div className='col-12 col-md-6'>
					<div className='form-check'>
						<input
							type='checkbox'
							className='form-check-input'
							id='first_in_last_out'
							{...register('first_in_last_out')}
						/>
						<label className='form-check-label' htmlFor='first_in_last_out'>
							First in last out
						</label>
					</div>
				</div>
			</div>
		</>
	);
};

export default ShiftFields;
