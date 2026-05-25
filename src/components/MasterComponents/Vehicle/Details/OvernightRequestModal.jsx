import React, { useState } from 'react';
import { Button, Form, Spinner } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { authAxios } from '../../../../axiosInstance';
import SaveButton from '../../../../components/CustomComponent/Buttons/SaveButton';
import useToasterNotification from '../../../../hooks/useToasterNotification';
import { useParams } from 'react-router-dom';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import { useSelector } from 'react-redux';
const OvernightRequestModal = ({ isOpen, setIsOpen, tableRef, title }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm();
    const [waitingForAxios, setwaitingForAxios] = useState(false);
    const { showErrorNotification, showSuccessNotification } = useToasterNotification();
    // @ts-ignore - JSX file doesn't support TypeScript annotations
    const vehicleDetails = useSelector((state) => state?.VehicleSlice?.vehicle_details);
    const startTime = watch('start_time');
    const onSubmit = (data) => {
        console.log(data);
        setwaitingForAxios(true);
        const url = 'api/overnight_parking_requests';
        
        // Format datetime strings to ISO format
        const formattedStartTime = data.start_time ? new Date(data.start_time).toISOString() : null;
        const formattedEndTime = data.end_time ? new Date(data.end_time).toISOString() : null;

        const payload = {
            vehicle_id: Number(vehicleDetails?.id),
            user: Number(vehicleDetails?.linked_user?.id),
            start_time: formattedStartTime,
            end_time: formattedEndTime,
            request_text: data.request_text || '',
        };

        authAxios
            .post(url, payload)
            .then(() => {
                setwaitingForAxios(false);
                reset();
                tableRef.current?.onQueryChange();
                setIsOpen(false);
                showSuccessNotification('Overnight request created successfully');
            })
            .catch((err) => {
                setwaitingForAxios(false);
                showErrorNotification(err);
            });
    };

    const handleClose = () => {
        reset();
        setIsOpen(false);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            setIsOpen={handleClose} 
            size='lg' 
            isCentered
            titleId='overnight-request-title'
        >
            <ModalHeader setIsOpen={handleClose}>
                <ModalTitle id='overnight-request-title'>{title}</ModalTitle>
            </ModalHeader>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody className='p-4'>
                    <div className='row g-3'>
                        <div className='col-6'>
                            <FormGroup
                                id='start_time'
                                label='Start Time *'
                            >
                                <input
                                    type='datetime-local'
                                    id='start_time'
                                    className={`form-control ${errors.start_time ? 'is-invalid' : ''}`}
                                    {...register('start_time', {
                                        required: 'Start time is required',
                                    })}
                                />
                                {errors.start_time && (
                                    <div className='invalid-feedback'>
                                        {errors.start_time.message?.toString() || 'This field is required'}
                                    </div>
                                )}
                            </FormGroup>
                        </div>

                        <div className='col-6'>
                            <FormGroup
                                id='end_time'
                                label='End Time *'
                            >
                                <input
                                    type='datetime-local'
                                    id='end_time'
                                    className={`form-control ${errors.end_time ? 'is-invalid' : ''}`}
                                    min={startTime || undefined}
                                    {...register('end_time', {
                                        required: 'End time is required',
                                        validate: (value) => {
                                            if (startTime && value && new Date(value) <= new Date(startTime)) {
                                                return 'End time must be after start time';
                                            }
                                            return true;
                                        },
                                    })}
                                />
                                {errors.end_time && (
                                    <div className='invalid-feedback'>
                                        {errors.end_time.message?.toString() || 'This field is required'}
                                    </div>
                                )}
                            </FormGroup>
                        </div>

                        <div className='col-12'>
                            <FormGroup
                                id='request_text'
                                label='Request Text '
                            >
                                <textarea
                                    id='request_text'
                                    name='request_text'
                                    rows={4}
                                    style={{height: '100px'}}
                                    className='form-control'
                                    placeholder='Enter your request details...'
                                    {...register('request_text')}
                                />
                            </FormGroup>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className='p-4'>
                    <div className='col-1'>
                    <Button type='submit'  className='w-100' color='warning' >{waitingForAxios ? <Spinner size='sm' /> : 'Save'}</Button>
                    </div>
                    <Button type='button' onClick={handleClose}>Close</Button>
                </ModalFooter>
            </Form>
            </Modal>
        
    );
};
export default OvernightRequestModal;
