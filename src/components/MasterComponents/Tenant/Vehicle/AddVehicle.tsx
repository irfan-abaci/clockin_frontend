import React, { FC, useState } from 'react';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { authAxios } from '../../../../axiosInstance';
import OffCanvasComponent from '../../../OffCanvasComponent';
import Card, {
	CardBody,
} from '../../../bootstrap/Card';
import SaveButton from '../../../CustomComponent/Buttons/SaveButton';
import useToasterNotification from '../../../../hooks/useToasterNotification';
import VehicleFields from '../../Vehicle/VehicleFields';
import { useParams } from 'react-router-dom';


interface AddVehicleProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	tableRef: any
	title: string;
  }
const AddVehicle: FC<AddVehicleProps> = ({ isOpen, setIsOpen, tableRef, title }) => {
	const {showErrorNotification}=useToasterNotification()
	const {
		register,
		handleSubmit,
		control,
		getValues,
		formState: { errors },
	} = useForm();
	const {id}=useParams();
	const [waitingForAxios, setwaitingForAxios] = useState(false);
	
	 const onSubmit = (data:any) => {
		setwaitingForAxios(true);
		const url = `api/vehicles?tenant_id=${id}`;
		const payload = {
			...data,
			meta_data: {
				status: data?.status?.value,
			},
		}
		authAxios
			.post(url, payload)
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
					<VehicleFields 
					  register={register} 
					  errors={errors}  
					  control={control}
					  getValues={getValues}
					/>
					<div className='row m-0'>
						<div className='col-12 p-3'>
							<SaveButton 
							  state={waitingForAxios}
							 />
						</div>
					</div>
				</CardBody>
			  </Card>
			</Form>
		</OffCanvasComponent>
	);
};

export default AddVehicle;
