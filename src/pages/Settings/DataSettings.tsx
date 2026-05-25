import React, { FC, useState } from 'react';
import { Spinner } from 'reactstrap';
import Slider from '@mui/material/Slider';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';
import usePermissionHook from '../../hooks/userPermissionHook';

interface DataSettingsPropTypes {
  register: any;
  errors: any;
  getValues: any;
  trigger: any;
  setValue: any;
  watch: any;
}

const DataSettings: FC<DataSettingsPropTypes> = ({ register, errors, getValues, trigger, setValue, watch }) => {
  const { showErrorNotification } = useToasterNotification();
  const [isLoading, setIsLoading] = useState(false);
  const canManageSettings = usePermissionHook('manage_general_settings');
  
  const dataRetentionDays = watch('data_retention_days') || 30;
  const autoExitDays = watch('auto_exit_days') || 30;

  const dataRetentionMarks = [
    {
      value: 1,
      label: '1',
    },
    {
      value: 90,
      label: '90',
    },
    {
      value: 180,
      label: '180',
    },
    {
      value: 365,
      label: '365',
    },
  ];

  const saveSettings = async () => {
    setIsLoading(true);
    const url = '/api/global_config/1';
    const normalizeDayValue = (value: unknown): number | null => {
      const parsedValue = Number(value);
      if (!Number.isFinite(parsedValue)) return null;
      if (parsedValue < 1 || parsedValue > 365) return null;
      return parsedValue;
    };

    const payload: { data_retention_days?: number; auto_exit_days?: number } = {};
    const retentionDays = normalizeDayValue(getValues('data_retention_days'));
    const autoExitDays = normalizeDayValue(getValues('auto_exit_days'));

    if (retentionDays !== null) payload.data_retention_days = retentionDays;
    if (autoExitDays !== null) payload.auto_exit_days = autoExitDays;

    if (Object.keys(payload).length === 0) {
      setIsLoading(false);
      return;
    }

    authAxios
      .patch(url, payload)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        showErrorNotification(err);
        setIsLoading(false);
      });
  };

  const handleSliderChange = (event: Event,key: string, newValue: number | number[]) => {
    setValue(key, newValue as number);
  };

  return (
    <Card className='user-select-none shadow-3d-secondary'>
      <CardHeader>
        <CardLabel icon='Settings' iconColor='secondary'>
          <CardTitle tag='div' className='h5'>Data Settings</CardTitle>
        </CardLabel>
        <CardActions>
          {canManageSettings && (
            <Button
              color='secondary'
              onClick={() => saveSettings()}
              isLight
              icon='Save'
              isDisable={isLoading}
            >
              {isLoading ? <Spinner size='sm' /> : 'Save'}
            </Button>
          )}
        </CardActions>
      </CardHeader>
      <CardBody>
        <div className='mt-4 mb-4'>
          <FormGroup label={`Data Retention Days : ${dataRetentionDays} days`}>
            <input
              type='hidden'
              {...register('data_retention_days', {
                required: true,
                min: 1,
                max: 365,
              })}
            />
            <div style={{ padding: '20px 10px' }}>
              <Slider
                sx={{ marginTop: '28px', color: 'secondary' }}
                aria-label='Data Retention Days'
                marks={dataRetentionMarks}
                valueLabelDisplay='on'
                value={dataRetentionDays}
                step={1}
                min={1}
                max={365}
                onChange={(event, newValue) => handleSliderChange(event, 'data_retention_days', newValue)}
              />
              {/* <div style={{ marginTop: '10px', textAlign: 'center', color: '#6c757d' }}>
                Current value: <strong>{dataRetentionDays} days</strong>
              </div> */}
            </div>
            {errors.data_retention_days && (
              <span style={{ color: 'red' }}>*This field is required</span>
            )}
          </FormGroup>
        </div>
        <div className='mt-4 mb-4'>
          <FormGroup label={`Auto Exit Days : ${autoExitDays} days`}>
            <input
              type='hidden'
              {...register('auto_exit_days', {
                required: true,
                min: 1,
                max: 365,
              })}
            />
            <div style={{ padding: '20px 10px' }}>
              <Slider
                sx={{ marginTop: '28px', color: 'secondary' }}
                aria-label='Auto Exit Days'
                marks={dataRetentionMarks}
                valueLabelDisplay='on'
                value={autoExitDays}
                step={1}
                min={1}
                max={365}
                onChange={(event, newValue) => handleSliderChange(event, 'auto_exit_days', newValue as number)}
              />
              {/* <div style={{ marginTop: '10px', textAlign: 'center', color: '#6c757d' }}>
                Current value: <strong>{dataRetentionDays} days</strong>
              </div> */}
            </div>
            {errors.auto_exit_days && (
              <span style={{ color: 'red' }}>*This field is required</span>
            )}
          </FormGroup>
        </div>
      </CardBody>
    </Card>
  );
};

export default DataSettings;
