import React from 'react'
import Select from 'react-select'
import { Controller } from 'react-hook-form';
import FormGroup from '../../bootstrap/forms/FormGroup';
import useSelectStyles from '../../../hooks/useSelectStyle';

const ReactSelectComponent = ({control,name,isMulti,field_name,getValues,errors,options, isRequired,isDisable,isClearable=false}:any) => {
	const reactSelectStyle = useSelectStyles(isMulti);

  return (
    <FormGroup label={name}>
    <Controller
        name={field_name}
        control={control}
        rules={{
            required: isRequired,
        }}
        render={({ field }) => (
            <Select
                placeholder=''
                onChange={(values) => {
                    field.onChange(values);
                }}
                isMulti={isMulti}
                className='react-select'
                isClearable={isClearable}
                styles={reactSelectStyle}
                options={options}
                value={
                    isMulti
                        ? Array.isArray(field.value)
                            ? field.value
                            : field.value
                              ? [field.value]
                              : []
                        : field.value ?? null
                }
                isDisabled={isDisable}
            />
        )}
    />
    {errors[field_name]?.type ? (
        <span style={{ color: 'red' }}>*This field is required</span>
    ) : (
        <p />
    )}
</FormGroup>
  )
}

export default ReactSelectComponent
