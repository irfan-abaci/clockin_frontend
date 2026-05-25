import React from 'react';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../../components/CustomComponent/Select/ReactSelectComponent';

const HolidayFields = ({ register, errors, control, getValues, groupOptions }: any) => {
	return (
		<div className='row'>
			<div className=' col-12 mb-2'>
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
				<FormGroup label='Date *'>
					<input
						type='date'
						className='form-control'
						{...register('date', { required: true })}
					/>
					{errors?.date?.type && <span style={{ color: 'red' }}>*This field is required</span>}
				</FormGroup>
			</div>

			<div className='col-12 mb-2'>
				<ReactSelectComponent
					control={control}
					name='Applicable  Groups'
					isMulti
					field_name='applicable_to'
					getValues={getValues}
					errors={errors}
					options={groupOptions}
					isRequired={false}
				/>
			</div>
		</div>
	);
};

export default HolidayFields;
