import React, { FC, useState } from 'react';
import { Row, Spinner } from 'reactstrap';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import useToasterNotification from '../../hooks/useToasterNotification';
import { authAxios } from '../../axiosInstance';
import ContactNumberField from '../../components/CustomComponent/Fields/ContactNumberField';
import usePermissionHook from '../../hooks/userPermissionHook';

interface EmailFormPropTypes {
  register: any;
  errors: any;
  getValues: any;
  trigger: any;

}

const GeneralSettings: FC<EmailFormPropTypes> = ({ register, errors, getValues, trigger }) => {

  const { showErrorNotification } = useToasterNotification();
  const [isLoading, setIsLoading] = useState(false);
  const canManageSettings = usePermissionHook('manage_general_settings');
  const saveSettings = async () => {
    const isValid = await trigger(['support_description', 'support_email', 'support_phone']);

    if (!isValid) return;
    setIsLoading(true)
    const url = '/api/global_config/1'
    const payload = {
      support_description: getValues('support_description'),
      support_email: getValues('support_email'),
      support_phone: getValues('support_phone'),
      total_slots: getValues('total_slots'),
      total_available_to_tenants: getValues('total_available_to_tenants'),
    }
    authAxios.patch(url, payload)
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
          <CardTitle tag='div' className='h5 text-warning'>General Settings</CardTitle>
        </CardLabel>
        <CardActions>
          {canManageSettings &&
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
          <div className='col-6 '>
            <FormGroup label='Support Email'>
              <input
                type='email'
                className='form-control'
                style={{ height: '40px' }}
                {...register('support_email', {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                })}
              />
              {errors.support_email?.type === 'required' && (
                <span style={{ color: 'red' }}>*This field is required</span>
              )}
              {errors.support_email?.type === 'pattern' && (
                <span style={{ color: 'red' }}>*Please enter a valid host (example: smtp.company.com)</span>
              )}
            </FormGroup>
          </div>
          <div className='col-6 '>
            <ContactNumberField
              label="Support Phone Number "
              field_name="support_phone"
              required
              register={register}
              errors={errors}
            />
          </div>

        </Row>
        <Row className='mt-3'>
          <div className='col-6 '>
            <FormGroup label='Total Parking'>
              <input
                type='number'
                className='form-control'
                style={{ height: '40px' }}
                {...register('total_slots', {
                  required: true,
                })}
              />
              {errors.total_slots?.type === 'required' && (
                <span style={{ color: 'red' }}>*This field is required</span>
              )}

            </FormGroup>
          </div>
          <div className='col-6 '>
            <FormGroup label='Total Tenant Parking'>
              <input
                type='number'
                className='form-control'
                style={{ height: '40px' }}
                {...register('total_available_to_tenants', {
                  required: true,
                })}
              />
              {errors.total_available_to_tenants?.type === 'required' && (
                <span style={{ color: 'red' }}>*This field is required</span>
              )}

            </FormGroup>
          </div>

        </Row>

        <div className='col-12 mt-4'>
          <FormGroup label="Support Description">
            <textarea
              className='form-control'
              rows='4'
              {...register("support_description")}
            />
          </FormGroup>
        </div>
      </CardBody>
    </Card>
  );
};

export default GeneralSettings;
