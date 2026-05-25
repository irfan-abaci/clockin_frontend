import React, { FC, useState } from 'react';
import { Row, Spinner } from 'reactstrap';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';
import usePermissionHook from '../../hooks/userPermissionHook';

interface EmailFormPropTypes {
  register: any;
  errors: any;
  getValues: any;
  trigger: any;
}

const EmailSettings: FC<EmailFormPropTypes> = ({ register, errors,getValues,trigger }) => {
  const {showErrorNotification}=useToasterNotification();
  const [isLoading,setIsLoading]=useState(false);
  const canManageSettings=usePermissionHook('manage_general_settings');

  const saveSettings = async () => {
    const isValid = await trigger(['smtp_host', 'smtp_port', 'smtp_email', 'smtp_password']);

    if (!isValid) return;
    setIsLoading(true)
    const url = '/api/global_config/1'
    const payload={
        smtp_host:getValues('smtp_host'),
        smtp_port:getValues('smtp_port'),
        smtp_email:getValues('smtp_email'),
        smtp_password:getValues('smtp_password'),
    }
    authAxios.patch(url,payload)
        .then(() => {
            setIsLoading(false)
        })
        .catch((err) => {
            showErrorNotification(err)
            setIsLoading(false)

        })
  }
  return (
    <Card className='user-select-none shadow-3d-secondary'>
      <CardHeader>
        <CardLabel icon='Settings' iconColor='secondary'>
          <CardTitle tag='div' className='h5'>Email Settings</CardTitle>
        </CardLabel>
        <CardActions>
          {canManageSettings&&
          <Button
            color='secondary'
            onClick={() => saveSettings()}
            isLight
            icon='Save'
            isDisable={isLoading}

            >
            
            {isLoading ? <Spinner size='sm' /> : 'Save'}
          </Button>}
        </CardActions>
      </CardHeader>
      <CardBody>
        <Row className='mt-3'>
          <div className='col-4 mb-2'>
            <FormGroup label='Mail Driver'>
              <input type='text' className='form-control' style={{ height: '40px' }} value='SMTP' disabled />
            </FormGroup>
          </div>
          <div className='col-4 mb-2'>
            <FormGroup label='Mail Host'>
              <input
                type='text'
                className='form-control'
                style={{ height: '40px' }}
                {...register('smtp_host', {
                  required: true,
                  pattern: /^[\d.a-z-]+\.[a-z]{2,63}$/,
                })}
              />
              {errors.smtp_host?.type === 'required' && (
                <span style={{ color: 'red' }}>*This field is required</span>
              )}
              {errors.smtp_host?.type === 'pattern' && (
                <span style={{ color: 'red' }}>*Please enter a valid host (example: smtp.company.com)</span>
              )}
            </FormGroup>
          </div>
          <div className='col-4 mb-2'>
            <FormGroup label='Mail Port'>
              <input
                type='number'
                className='form-control'
                style={{ height: '40px' }}
                {...register('smtp_port', { required: true })}
              />
              {errors.smtp_port && <span style={{ color: 'red' }}>*This field is required</span>}
            </FormGroup>
          </div>
        </Row>
        <Row className='mt-3 mb-5'>
          <div className='col-6 mb-2'>
            <FormGroup label='Mail From Address'>
              <input
                type='email'
                className='form-control'
                style={{ height: '40px' }}
                {...register('smtp_email', {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
              />
              {errors.smtp_email?.type === 'required' && (
                <span style={{ color: 'red' }}>*This field is required</span>
              )}
              {errors.smtp_email?.type === 'pattern' && (
                <span style={{ color: 'red' }}>Please provide a valid email address</span>
              )}
            </FormGroup>
          </div>
          <div className='col-6' style={{marginBottom:"58px"}}>
            <FormGroup label='Mail Password'>
              <input
                type='password'
                className='form-control'
                style={{ height: '40px' }}
                {...register('smtp_password', { required: true })}
              />
              {errors.smtp_password && <span style={{ color: 'red' }}>*This field is required</span>}
            </FormGroup>
          </div>
        
        </Row>
      
      </CardBody>
    </Card>
  );
};

export default EmailSettings;
