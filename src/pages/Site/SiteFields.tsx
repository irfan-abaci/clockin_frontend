import React from 'react';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../components/CustomComponent/Select/ReactSelectComponent';
import CheckboxWithLabel from '../../components/CustomComponent/CheckboxWithLabel';

const siteTypeOptions = [
	{ label: 'Region', value: 'Region' },
	{ label: 'Building', value: 'Building' },
	{ label: 'Floor', value: 'Floor' },
	{ label: 'Section', value: 'Section' },
	{ label: 'Segment', value: 'Segment' },
	{ label: 'Suite', value: 'Suite' },
	{ label: 'Room', value: 'Room' },
];

const SiteFields = ({
	register,
	errors,
	control,
	getValues,
	watch,
	parentSiteOptions,
	authorityOptions,
	timezoneOptions,
}: any) => {
	return (
		<>
			<div className='col-12'>
				<FormGroup label='Site Name *'>
					<input
						type='text'
						className='form-control'
						{...register('name', { required: true })}
					/>
					{errors?.name?.type === 'required' ? (
						<span style={{ color: 'red' }}>*This field is required</span>
					) : (
						<p />
					)}
				</FormGroup>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Site Type *'
					isMulti={false}
					field_name='site_type'
					getValues={getValues}
					errors={errors}
					options={siteTypeOptions}
					isRequired
				/>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Timezone *'
					isMulti={false}
					field_name='timezone'
					getValues={getValues}
					errors={errors}
					options={timezoneOptions}
					isRequired
				/>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Parent Site'
					isMulti={false}
					field_name='parent_site'
					getValues={getValues}
					errors={errors}
					options={parentSiteOptions}
					isRequired={false}
					isClearable
				/>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Authority One'
					isMulti={false}
					field_name='authority_one'
					getValues={getValues}
					errors={errors}
					options={authorityOptions}
					isRequired={false}
					isClearable
				/>
			</div>

			<div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Authority Two'
					isMulti={false}
					field_name='authority_two'
					getValues={getValues}
					errors={errors}
					options={authorityOptions}
					isRequired={false}
					isClearable
				/>
			</div>

			{/* <CheckboxWithLabel
				control={control}
				watch={watch}
				name='is_allow_manual_entry'
				label='Allow Manual Entry'
				size='20px'
			/> */}
		</>
	);
};

export default SiteFields;
