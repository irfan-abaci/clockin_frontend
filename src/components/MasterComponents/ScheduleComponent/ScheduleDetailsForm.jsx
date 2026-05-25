import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import Select from 'react-select';
import FormGroup from '../../bootstrap/forms/FormGroup';
import useSelectStyles from '../../../hooks/useSelectStyle';
import SchedulerCalender from './SchedulerCalender';

const ScheduleTypeOptions = [
	{ label: 'FIXED', value: 'FIXED' },
	{ label: 'FLEXI', value: 'FLEXI' },
];

const ScheduleDetailsForm = ({ control, errors, getValues, register, isEdit }) => {
	const reactSelectStyle = useSelectStyles(false);
	const [events, setEvents] = useState([]);
	const [selectedMonth, setSelectedMonth] = useState(dayjs().startOf('month'));

	const fetchData = () => {};

	return (
		<>
			<div className='col-12 mb-2'>
				<FormGroup label='Schedule name * '>
					<input
						type='text'
						{...register('name', {
							required: true,
						})}
						className='form-control'
						style={{ height: '40px' }}
					/>
					{errors.name?.type && (
						<span style={{ color: 'red' }}>*This field is required</span>
					)}
				</FormGroup>
			</div>
			{/* <div className='col-12  mb-2'>
				<FormGroup label='Door number* '>
					<input
						type='text'
						{...register('door_number', {
							required: true,
						})}
						className='form-control'
						style={{ height: '40px' }}
					/>
					{errors.door_number?.type && (
						<span style={{ color: 'red' }}>*This field is required</span>
					)}
				</FormGroup>
			</div> */}
			<div className='col-12  mb-2'>
				<FormGroup label='Type *'>
					<Controller
						name='type'
						control={control}
						rules={{
							required: true,
						}}
						render={({ field }) => (
							<>
								<Select
									placeholder='Select..'
									onChange={(values) => {
										field.onChange(values);
									}}
									// isDisabled={!differentsite}
									isClearable={false}
									styles={reactSelectStyle}
									options={ScheduleTypeOptions}
									value={getValues('type')}
								/>
								{errors.type && (
									<span style={{ color: 'red' }}>*This field is required</span>
								)}
							</>
						)}
					/>
				</FormGroup>
			</div>

			<div className='col-12  mb-3 mt-3'>
				<FormGroup label='Description'>
					<textarea
						className='form-control'
						{...register('description', {
							required: false,
						})}
						style={{ height: '100px' }}
					/>
				</FormGroup>
			</div>
			{/* {isEdit && (
				<SchedulerCalender
					fetchData={fetchData}
					events={events}
					setSelectedMonth={setSelectedMonth}
					selectedMonth={selectedMonth}
					setEvents={setEvents}
				/>
			)} */}
		</>
	);
};
/* eslint-disable react/forbid-prop-types */
ScheduleDetailsForm.propTypes = {
	control: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
	register: PropTypes.object.isRequired,
	getValues: PropTypes.func.isRequired,
	isEdit: PropTypes.bool,
};
/* eslint-enable react/forbid-prop-types */
ScheduleDetailsForm.defaultProps = {
	isEdit: false,
};
export default ScheduleDetailsForm;
