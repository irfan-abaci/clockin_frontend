import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';
import AbaciLoader from '../../components/AbaciLoader/AbaciLoader';
import EmailFormFields from './Emailsettings';
import EmailSettings from './Emailsettings';
import GeneralSettings from './GeneralSettings';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import { CardTitle } from '../../components/bootstrap/Card';
import DataSettings from './DataSettings';


const Index = () => {

    const {showErrorNotification}=useToasterNotification();
    const [isLoading,setIsLoading]=useState(true)
   const {
        register,
        handleSubmit,
        reset,
        getValues,
        control,
        setValue,
        trigger,
        formState: { errors },
        watch,
    } = useForm();

    useEffect(() => {
        const url = '/api/global_config/1'
        authAxios.get(url)
            .then((res) => {
                reset(res.data)
                // setAppsettings(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                showErrorNotification(err)
                setIsLoading(false)

            })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])




    if(isLoading){
        return <AbaciLoader/>
    }
    return (
        <PageWrapper title='Settings'>
            <SubHeader>
            <SubHeaderLeft>
                <CardTitle tag='div' className='h5'>
                    Settings
                </CardTitle>
            </SubHeaderLeft>
        </SubHeader>
            <div className='row mt-3'>
                <div className='col-6'>
                  <GeneralSettings register={register}errors={errors} getValues={getValues}   trigger={trigger}/>
                  
                </div>
                <div className='col-6'>
                  <EmailSettings register={register}errors={errors} getValues={getValues} trigger={trigger}/>
                </div>
            </div>
            <div className='row mt-3'>  
                <div className='col-6'>
                    <DataSettings register={register}errors={errors} getValues={getValues} trigger={trigger} setValue={setValue} watch={watch}/>
                </div>
            </div>
        </PageWrapper>
    );
}

export default Index;
