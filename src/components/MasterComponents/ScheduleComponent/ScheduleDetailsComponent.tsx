import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../bootstrap/Card';
import Button from '../../bootstrap/Button';
import ScheduleDetailsForm from './ScheduleDetailsForm';
import ScheduleDayDetails from './ScheduleDayDetails';
import ScheduleTable from './ScheduleTable';

const ScheduleDetailsComponent = ({ handleComments }: any) => {
	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const [activeSection, setActiveSection] = useState<'details' | 'day' | 'table'>('details');

	const {
		register,
		control,
		handleSubmit,
		getValues,
		reset,
		formState: { errors },
	} = useForm();

	 const onSubmit = (data: any) => {
		setWaitingForAxios(true);
		setTimeout(() => setWaitingForAxios(false), 500);
	};

	return (
		<Card stretch tag='form'>
			<CardHeader>
				<CardLabel icon='PendingActions' iconColor='success'>
					<CardTitle tag='div' className='h5'>
						Schedule Details
					</CardTitle>
				</CardLabel>
				<CardActions >
					<div className='d-flex gap-2'>
					<Button color='light' isLight className='w-100' onClick={() => handleComments?.()}>
						Comments
					</Button>

					<Button
						icon='Save'
						color='info'
						isOutline
						className='w-100'
						isDisable={waitingForAxios}
						onClick={() => handleSubmit(onSubmit)()}>
						{waitingForAxios ? 'Saving...' : 'Save'}
					</Button>
					</div>
				</CardActions>
			</CardHeader>
			<CardBody isScrollable>
				<div className='d-flex gap-2 mb-3'>
					<Button color={activeSection === 'details' ? 'info' : 'light'} onClick={() => setActiveSection('details')}>
						Details
					</Button>
					<Button color={activeSection === 'day' ? 'info' : 'light'} onClick={() => setActiveSection('day')}>
						Day Details
					</Button>
					<Button color={activeSection === 'table' ? 'info' : 'light'} onClick={() => setActiveSection('table')}>
						Table
					</Button>
				</div>
				<Card stretch>
					<CardHeader>
						<CardLabel icon='Edit' iconColor='warning'>
							<CardTitle tag='div' className='h5'>
								Schedule
							</CardTitle>
						</CardLabel>
					</CardHeader>
					<CardBody className='d-flex flex-column gap-3 ' isScrollable>
						{activeSection === 'details' && (
							<ScheduleDetailsForm
								control={control}
								register={register}
								errors={errors}
								getValues={getValues}
								isEdit
							/>
						)}
						{activeSection === 'day' && <ScheduleDayDetails handleComments={handleComments} />}
						{activeSection === 'table' && <ScheduleTable />}
					</CardBody>
				</Card>
			</CardBody>
		</Card>
	);
};
export default ScheduleDetailsComponent;
