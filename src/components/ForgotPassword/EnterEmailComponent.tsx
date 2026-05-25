import React, { FC } from 'react'
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';

interface EnterEmailComponentPropType{
    formik:any;
}

const EnterEmailComponent:FC<EnterEmailComponentPropType> = ({formik}) => {
    const {values,touched,errors,isValid,handleChange,handleBlur,setErrors,setFieldValue} = formik
    const handleUsername = ({ target: { value } }: any) => {
        const trimmedValue = value.replace(/\s+/g, ''); // Remove spaces from the input
        // Manually update the formik field value
        setFieldValue('email', trimmedValue);
    };
    return(
    <>
        {/* <div className='text-center h3 fw-bold mt-3 '>Forgot Password</div> */}
        <div className='text-center h5 text-muted mb-5 mt-2'>Enter your registerd email ID !</div>

        <div className='col-12'>
            <FormGroup
                id='email'
                isFloating
                label='Email Address'
                >
                <Input
                    autoComplete='username'
                    value={values.email}
                    isTouched={touched.email}
                    invalidFeedback={errors.email}
                    isValid={isValid}
                    // onChange={handleChange}
                    onChange={(e) => {
                       handleChange(e);  // First, update Formik's state normally
                        handleUsername(e);  // Then apply your custom logic to remove spaces
                      }}
                    onBlur={handleBlur}
                    onFocus={() => {
                        setErrors({});
                    }}
                />
            </FormGroup>
            <br />
        </div>
    </>
)}

export default EnterEmailComponent