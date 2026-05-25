import React, { FC, useState } from 'react';
import { Form } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAxios } from '../../../../axiosInstance';
import OffCanvasComponent from '../../../OffCanvasComponent';
import Card, {
	CardBody,
} from '../../../bootstrap/Card';
import SaveButton from '../../../CustomComponent/Buttons/SaveButton';
import useToasterNotification from '../../../../hooks/useToasterNotification';
import ContractFields from './ContractFields';


interface AddContractProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	tableRef: any
	title: string;
  }
const AddContract: FC<AddContractProps> = ({ isOpen, setIsOpen, tableRef, title }) => {
	const {showErrorNotification}=useToasterNotification()
	const {
		register,
		handleSubmit,
		getValues,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm();
    const {id}=useParams()
	const [waitingForAxios, setwaitingForAxios] = useState(false);
	const onSubmit = (data:any) => {
		console.log(data)
		const payload = {
			valid_to: data?.valid_to||'',
			valid_from: data?.valid_from||'',
			floor: data?.floor?.value,
			area: data?.area||'',
			building: data?.building?.id||'',
			tenant_id:Number(id),
			business_space_id: data?.business_space_id?.id||null,
            slot_count: data?.slot_count||'',
		  };		
		setwaitingForAxios(true);
		const url = '/api/tenancies';
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
						<ContractFields 
							register={register} 
							errors={errors} 
							getValues={getValues} 
							control={control} 
							setValue={setValue}
						    watch={watch}
						/>
					<div className='row m-0'>
							<div className='col-12 p-3'>
								<SaveButton state={waitingForAxios} />
							</div>
						</div>
					</CardBody>
				</Card>
			</Form>
		</OffCanvasComponent>
	);
};

export default AddContract;
