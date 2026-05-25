import React, { useState } from 'react';
import {  Form, Label, Spinner } from 'reactstrap';
import Slider from '@mui/material/Slider';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../components/bootstrap/Modal';
import Button from '../../components/bootstrap/Button';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';

const EditSettings = ({ isOpen, setIsOpen, title, item ,setAppsettings}) => {
	const { handleSubmit } = useForm();
	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const [value, setValue] = useState(item.value);
    const {showErrorNotification}=useToasterNotification();

	const refreshIntervalMarks = [
		{
			value: 1,
			label: '1',
		},
		{
			value: 120,
			label: '120',
		},
	];


	const onSubmit = () => {
		setWaitingForAxios(true);
		const url = `/api/master/settings/${item?.id}`;
		authAxios
			.patch(url, {value})
			.then((res) => {
				setWaitingForAxios(false);
				setIsOpen(false);
				setAppsettings((prev)=>prev.map((data)=>data.id===res.data.id?res.data:data))
			})
			.catch((err) => {
				setWaitingForAxios(false);
				showErrorNotification(err)
			});
	};

	
	const renderContent=()=> {

		return (
			<div className='mb-5'>
				<Label htmlFor='refreshSlider'>
					{`Please Select ${item?.display_name} Range (In ${item?.unit})`}
				</Label>
				<Slider
					id='refreshSlider'
					sx={{ marginTop: '28px',color:'secondary' }}
					aria-label='Default'
					marks={refreshIntervalMarks}
					valueLabelDisplay='on'
					value={value}
					step={1}
					min={1}
					max={120}
					//@ts-ignore
					onChange={(e) => setValue(e.target.value)}
				/>
			</div>
		);
	}

	return (
		<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='lg' isCentered>
			<ModalHeader className='p-4' setIsOpen={setIsOpen}>
				<ModalTitle id='editsettingsmodal'>{title}</ModalTitle>
			</ModalHeader>
			<ModalBody className='p-3'>
				<Form style={{ marginLeft: '20px',marginRight:"20px" }} onSubmit={handleSubmit(onSubmit)}>
					{renderContent()}
					<ModalFooter className='px-4 '>
						<>
							<Button
								color='danger'
								className='me-2'
								onClick={() => setIsOpen(false)}>
								Close
							</Button>
							
							<Button
								color='secondary'
								onClick={() => handleSubmit(onSubmit)()}
								isDisable={waitingForAxios || !value}>
								{waitingForAxios ? <Spinner size='sm' /> : 'Submit'}
							</Button>
						</>
					</ModalFooter>
				</Form>
			</ModalBody>
		</Modal>
	);
};
EditSettings.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	setAppsettings: PropTypes.func.isRequired,
	// Example adjustment for `item` prop to be more specific
	item: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
		PropTypes.object,
		// add other types as needed
	]),
};

// Providing default props for optional props
EditSettings.defaultProps = {
	item: null, // or a more suitable default value
};
export default EditSettings;
