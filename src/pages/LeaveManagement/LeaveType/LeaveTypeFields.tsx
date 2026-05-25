import React, { useEffect } from 'react';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../../components/CustomComponent/Select/ReactSelectComponent';
import LeaveTypeApprovalWorkflow from './LeaveTypeApprovalWorkflow';

const resetCycleOptions = [
	{ label: 'YEARLY', value: 'YEARLY' },
	{ label: 'MONTHLY', value: 'MONTHLY' },
	{ label: 'QUARTERLY', value: 'QUARTERLY' },
	{ label: 'NONE', value: 'NONE' },
];

/** Matches API `CARRY_FORWARD_TYPE` choices. */
export const CARRY_FORWARD_OPTIONS: { label: string; value: string }[] = [
	{ label: 'No Carry Forward', value: 'NONE' },
	{ label: 'Full Balance', value: 'FULL' },
	{ label: 'Limited Days', value: 'LIMITED' },
];

const LeaveTypeFields = ({
	register,
	errors,
	control,
	getValues,
	watch,
	setValue,
	groupOptions,
	leaveTypeOptions,
}: any) => {
	const clubbingAllowed = Boolean(watch('clubbing_allowed'));

	useEffect(() => {
		if (!clubbingAllowed) {
			setValue('clubbable_with', [], { shouldDirty: true, shouldValidate: false });
		}
	}, [clubbingAllowed, setValue]);

	return (
		<div className='row'>
			<div className='col-md-12 col-12 mb-2'>
				<FormGroup label='Name *'>
					<input
						type='text'
						className='form-control'
						{...register('name', { required: true })}
					/>
					{errors?.name?.type && <span style={{ color: 'red' }}>*This field is required</span>}
				</FormGroup>
			</div>
			<div className=' col-12 mb-2'>
				<FormGroup label='Code *'>
					<input
						type='text'
						className='form-control'
						{...register('code', { required: true })}
					/>
					{errors?.code?.type && <span style={{ color: 'red' }}>*This field is required</span>}
				</FormGroup>
			</div>

			<div className='col-md-6 col-12 mb-2'>
				<FormGroup label='Days Allowed *'>
					<input
						type='number'
						step='0.5'
						min='0'
						className='form-control'
						{...register('days_allowed', { required: true })}
					/>
					{errors?.days_allowed?.type && (
						<span style={{ color: 'red' }}>*This field is required</span>
					)}
				</FormGroup>
			</div>
            <div className='col-md-6 col-12 mb-2'>
				<FormGroup label='Advance Notice Days'>
					<input
						type='number'
						min='0'
						className='form-control'
						{...register('advance_notice_days')}
					/>
				</FormGroup>
			</div>
			<div className='col-md-12 col-12 mb-2'>
				<ReactSelectComponent
					control={control}
					name='Reset Cycle *'
					isMulti={false}
					field_name='reset_cycle'
					getValues={getValues}
					errors={errors}
					options={resetCycleOptions}
					isRequired
				/>
			</div>
			<div className='col-md-12 col-12 mb-2'>
				<ReactSelectComponent
					control={control}
					name='Carry Forward *'
					isMulti={false}
					field_name='carry_forward'
					getValues={getValues}
					errors={errors}
					options={CARRY_FORWARD_OPTIONS}
					isRequired
				/>
			</div>
			<div className='col-md-12 col-12 mb-2'>
				<FormGroup label='Carry Forward Max Days'>
					<input
						type='number'
						step='0.5'
						min='0'
						className='form-control'
						{...register('carry_forward_max_days')}
						disabled={watch('carry_forward')?.value !== 'LIMITED'}
					/>
				</FormGroup>
			</div>
        

			<div className='col-md-12 col-12 mb-2'>
				<FormGroup label='Max Consecutive Days'>
					<input
						type='number'
						min='1'
						className='form-control'
						{...register('max_consecutive_days')}
					/>
				</FormGroup>
			</div>

			

			
            <div className='col-12 mb-2'>
				<FormGroup label='Description'>
					<textarea className='form-control' rows={3} {...register('description')} />
				</FormGroup>
			</div>

			<div className='col-md-12 col-12 mb-2 d-flex align-items-center'>
				<input type='checkbox' className='me-2' {...register('is_paid')} />
				<span>Paid</span>
			</div>
			<div className='col-md-12 col-12 mb-2 d-flex align-items-center'>
				<input type='checkbox' className='me-2' {...register('is_comp_off')} />
				<span>Compensatory Off</span>
			</div>
			<div className='col-md-12 col-12 mb-2 d-flex align-items-center'>
				<input type='checkbox' className='me-2' {...register('requires_document')} />
				<span>Requires Document</span>
			</div>
			<div className='col-md-12 col-12 mb-2 d-flex align-items-center'>
				<input type='checkbox' className='me-2' {...register('sandwich_applicable')} />
				<span>Sandwich rule</span>
			</div>
			<div className='col-md-12 col-12 mb-2 d-flex align-items-center'>
				<input type='checkbox' className='me-2' {...register('clubbing_allowed')} />
				<span>Clubbing allowed</span>
			</div>
			<div className='col-md-12 col-12 mb-2'>
				<ReactSelectComponent
					control={control}
					name='Clubbable with'
					isMulti
					field_name='clubbable_with'
					getValues={getValues}
					errors={errors}
					options={leaveTypeOptions || []}
					isRequired={false}
					isDisable={!clubbingAllowed}
					isClearable
				/>
			</div>

			<LeaveTypeApprovalWorkflow
				control={control}
				register={register}
				errors={errors}
				getValues={getValues}
			/>
		</div>
	);
};

export default LeaveTypeFields;
