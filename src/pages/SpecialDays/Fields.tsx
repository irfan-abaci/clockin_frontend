import React from 'react';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../components/CustomComponent/Select/ReactSelectComponent';
import StartDateAndEndDateField from '../../components/CustomComponent/StartDateAndEndDate';

const dayTypeOptions = [
	{ label: 'Holiday', value: 'HOLIDAY' },
	{ label: 'Special schedule', value: 'SPECIAL_SCHEDULE' },
];

const Fields = ({
	register,
	errors,
	control,
	getValues,
	watch,
	setValue,
	dayTypeValue,
	shiftOptions,
}: any) => {
	const selectedDayType = dayTypeValue ?? getValues('day_type')?.value;

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
			<div className='col-12'>
				<StartDateAndEndDateField
					register={register}
					errors={errors}
					watch={watch}
					setValue={setValue}
					startDate='from_date'
					endDate='end_date'
					startDateLabel='From date'
					endDateLabel='End date'
					is_StartDateRequired
					is_EndDateRequired
					isDisable={false}
				/>
			</div>
			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Day Type *'
					isMulti={false}
					field_name='day_type'
					getValues={getValues}
					errors={errors}
					options={dayTypeOptions}
					isRequired
				/>
			</div>
			{selectedDayType === 'SPECIAL_SCHEDULE' ? (
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
			) : null}
			<div className='col-12'>
				<FormGroup label='Notes'>
					<textarea
						rows={3}
						style={{ height: '90px' }}
						className='form-control'
						{...register('notes')}
					/>
				</FormGroup>
			</div>
		</>
	);
};

export default Fields;
