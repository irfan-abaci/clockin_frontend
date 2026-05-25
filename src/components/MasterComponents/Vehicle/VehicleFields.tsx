import React from 'react';
import FormGroup from '../../bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../CustomComponent/Select/ReactSelectComponent';

const VehicleFields = ({ register, errors, isEdit = false, control, getValues }: any) => {
  const statusList = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Unknown', value: 'Unknown' },
  ];
  return (
    <>
      <div className="col-12">
        <FormGroup label="Vehicle plate number *">
          <input
            type="text"
            className="form-control"
            {...register('plate_number', { required: true })}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            }}
          />
          {errors?.plate_number?.type === 'required' ? (
            <span style={{ color: 'red' }}>*This field is required</span>
          ) : (
            <p />
          )}
        </FormGroup>

      </div>
      <div className="col-12">
        <FormGroup label="Vehicle brand *">
          <input
            type="text"
            className="form-control"
            {...register('vehicle_brand', { required: true })}
          />
          {errors?.vehicle_brand?.type === 'required' ? (
            <span style={{ color: 'red' }}>*This field is required</span>
          ) : (
            <p />
          )}
        </FormGroup>
      </div>
      <div className="col-12">
        <FormGroup label="Vehicle type *">
          <input
            type="text"
            className="form-control"
            {...register('vehicle_type', { required: true })}
          />
          {errors?.vehicle_type?.type === 'required' ? (
            <span style={{ color: 'red' }}>*This field is required</span>
          ) : (
            <p />
          )}
        </FormGroup>
      </div>

      <div className="col-12">
        <FormGroup label="Plate color *">
          <input
            type="text"
            className="form-control"
            {...register('vehicle_plate_color', { required: true })}
          />
          {errors?.vehicle_plate_color?.type === 'required' ? (
            <span style={{ color: 'red' }}>*This field is required</span>
          ) : (
            <p />
          )}
        </FormGroup>
      </div>

      <div className="col-12">
        <FormGroup label="Vehicle color *">
          <input
            type="text"
            className="form-control"
            {...register('vehicle_color', { required: true })}
          />
          {errors?.vehicle_color?.type === 'required' ? (
            <span style={{ color: 'red' }}>*This field is required</span>
          ) : (
            <p />
          )}
        </FormGroup>
      </div>
      <div className='col-12'>
				<ReactSelectComponent
					control={control}
					name='Status '
					isMulti={false}
					field_name='status'
					getValues={getValues}
					errors={errors}
					options={statusList}
					isRequired
				/>
			</div>
    </>
  );
};

export default VehicleFields;
