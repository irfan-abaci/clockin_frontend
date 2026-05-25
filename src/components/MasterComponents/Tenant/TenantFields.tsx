import React from 'react'
import FormGroup from '../../bootstrap/forms/FormGroup'
import ReactSelectComponent from '../../CustomComponent/Select/ReactSelectComponent';
import { statusTypeChoices } from '../../../helpers/constants';
import ContactNumberField from '../../CustomComponent/Fields/ContactNumberField';
import CheckboxWithLabel from '../../CustomComponent/CheckboxWithLabel';

const TenantFields = ({register,errors,getValues,control,watch,isEdit}:any) => {

  return (
   <>
   <div className='row'>
   <div className={isEdit?'col-6':'col-12'}>
			<FormGroup label="Tenant ID *">
				<input
					type='text'
					className='form-control'
					{...register("tenant_id", {
						required: true,
						
					})}
				/>
             {errors?.tenant_id?.type==="required" ? (
					<span style={{ color: 'red' }}>*This field is required</span>
				):<p/>}
			</FormGroup>
	</div>
   <div className={isEdit?'col-6':'col-12'}>
			<FormGroup label="Tenant name *">
				<input
					type='text'
					className='form-control'
					{...register("tenant_name", {
						required: true,
						
					})}
				/>
             {errors?.tenant_name?.type==="required" ? (
					<span style={{ color: 'red' }}>*This field is required</span>
				):<p/>}
			</FormGroup>
	</div>

   </div>

<div className='row'>
<div className={isEdit?'col-6':'col-12'}>
			<FormGroup label="Tenant type * ">
				<input
					type='text'
					className='form-control'
					{...register("tenant_type", {
						required: true,
						
					})}
				/>
             {errors?.tenant_type?.type==="required" ? (
					<span style={{ color: 'red' }}>*This field is required</span>
				):<p/>}
			</FormGroup>
	</div>
   
<div className={isEdit?'col-6':'col-12'}>
     <ReactSelectComponent
        control={control}
        name='Status *'
        isMulti={false}
        field_name='status'
        getValues={getValues}
        errors={errors}
        options={statusTypeChoices}
        isRequired
      />
	  </div>			

<div className={isEdit?'col-6 ':'col-12'}>
         <ContactNumberField
            label="Primary contact *"
            field_name="tenant_contact_phone"
            required
            register={register}
            errors={errors}
          />
	{/* <FormGroup label="Primary contact *">
		<input
			type='text'
			className='form-control'
			{...register("tenant_contact_phone", {
				required: true,
				minLength:10
			})}
			onWheel={(e:any) => e.target.blur()}
			onKeyDown={(evt) => {
				const invalidKeys = ['e', 'E', '=', '.'];
				if (invalidKeys.includes(evt.key) || evt.key === 'ArrowDown') {
					evt.preventDefault();
				}
			}}
			onInput={(e:any) => {
				const input = e.target 
				input.value = input.value.replace(/[^0-9()+]/g, '');
				}}
			maxLength='15'            
		/>
		{errors?.tenant_contact_phone?.type ? (
			<span style={{ color: 'red' }}>{errors?.tenant_contact_phone	?.type==="minLength"?"*Required minimum 10 digits":"*This field is required"}</span>):<p/>}
		
	</FormGroup> */}
	</div>
</div>

	<CheckboxWithLabel 
		control ={control}
		watch={watch}
		name='global_access'
		label='Global access'
		size='15px'
	/>

	<div className='col-12'>
			<FormGroup label="Remarks">
				<textarea
					type='text'
					className='form-control'
					{...register("description", {
						required: false,
						
					})}
					style={{height:"100px"}}
				/>
             {errors?.description?.type==="required" ? (
					<span style={{ color: 'red' }}>*This field is required</span>
				):<p/>}
			</FormGroup>
	</div>

	
   </>
  )
}

export default TenantFields
