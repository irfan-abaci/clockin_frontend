import React, { useState, useEffect, FC } from 'react';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { authAxios } from '../../../../axiosInstance';
import OffCanvasComponent from '../../../OffCanvasComponent';
import Card, {
	CardBody,
} from '../../../bootstrap/Card';
import SaveButton from '../../../CustomComponent/Buttons/SaveButton';
import useToasterNotification from '../../../../hooks/useToasterNotification';
import CustomSpinner from '../../../CustomSpinner/CustomSpinner';
import VehicleFields from '../../Vehicle/VehicleFields';
import { useParams } from 'react-router-dom';

interface EditVehicleProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	tableRef: any;
	title: string;
	vehicleId:any;
  }

const EditVehicle :FC<EditVehicleProps>= ({ isOpen, setIsOpen, tableRef, vehicleId, title }) => {
	const {showErrorNotification}=useToasterNotification()
	const {
		register,
		handleSubmit,
		reset,
		control,
		getValues,
		formState: { errors },
	} = useForm();
	const [waitingForAxios, setwaitingForAxios] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
    const{id}=useParams();

	useEffect(() => {
		if (vehicleId) {
			const url = `api/vehicles/${vehicleId}`;
			authAxios
				.get(url)
				.then((res) => {
					setIsLoading(false);
					reset({
						...res.data,
						status: {
							label: res.data?.meta_data?.status,
							value: res.data?.meta_data?.status,
						},
					});
				})
				.catch((err) => {
					setIsLoading(false);
					showErrorNotification(err)
				});
		}
	 // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [vehicleId]);

	const onSubmit = (data:any) => {
		setwaitingForAxios(true);
		const url = `api/vehicles/${vehicleId}`;
		const payload = {
				tenant:Number(id),
				plate_number:data.plate_number,
				vehicle_brand:data?.vehicle_brand||'',
				vehicle_color:data?.vehicle_color||'' ,
				vehicle_plate_color	:data.vehicle_plate_color,
				vehicle_type:data.vehicle_type,
				meta_data: {
					status: data?.status?.value,
				},
			};	
		authAxios
			.patch(url, payload)
			.then(() => {
				setwaitingForAxios(false);
				tableRef.current.onQueryChange();
				setIsOpen(false);
			})
			.catch((err) => {
				setwaitingForAxios(false);
				showErrorNotification(err)
			});
	};

	return (
		<OffCanvasComponent isOpen={isOpen} placement='end' title={title} setOpen={setIsOpen}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Card>
					<CardBody>
						{isLoading ? (
							<CustomSpinner />
						) : (
							<>
								<VehicleFields register={register} errors={errors} control={control} getValues={getValues} />
								<div className='row m-0'>
									<div className='col-12 p-3'>
										<SaveButton state={waitingForAxios} />
									</div>
								</div>
							</>
						)}
					</CardBody>
				</Card>
			</Form>
		</OffCanvasComponent>
	);
};


export default EditVehicle;
