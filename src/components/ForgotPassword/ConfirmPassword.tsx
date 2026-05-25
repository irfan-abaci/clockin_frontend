import React, { FC } from 'react'
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';

interface ConfirmPasswordPropType{
  formik:any
}

const ConfirmPassword:FC<ConfirmPasswordPropType> = ({formik}) => {

  const {values,touched,errors,isValid,handleChange,handleBlur} = formik
  return (
    <>
      <div className='text-center h3 fw-bold mt-3'>Forgot Password</div>
        <div className='text-center h5 text-muted mb-4 mt-1'>Create new password !</div>
    <div className='col-12'>
       
        <FormGroup id='newPassword' isFloating label='New Password'>
            <Input
                type='password'
                autoComplete='new-password'
                value={values.newPassword}
                isTouched={touched.newPassword}
                invalidFeedback={errors.newPassword}
                isValid={isValid}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </FormGroup>
        <FormGroup
            id='confirmPassword'
            isFloating
            label='Confirm Password'
            className='mt-4'>
            <Input
                type='password'
                autoComplete='new-password'
                value={values.confirmPassword}
                isTouched={touched.confirmPassword}
                invalidFeedback={errors.confirmPassword}
                isValid={isValid}
                onChange={handleChange}
                onBlur={handleBlur}
            />
        </FormGroup>
    </div>
   
    </>
  )
}
export default ConfirmPassword