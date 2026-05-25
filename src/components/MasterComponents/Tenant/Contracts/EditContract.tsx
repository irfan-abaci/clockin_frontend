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
import ContractFields from './ContractFields';
import { useParams } from 'react-router-dom';
import { reactSelectValueGenerator } from '../../../../helpers/functions';

interface EditContractProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	tableRef: any;
	title: string;
	contractID:any;
  }

const EditContract :FC<EditContractProps>= ({ isOpen, setIsOpen, tableRef, contractID, title }) => {
	const {showErrorNotification}=useToasterNotification()
	const {
		register,
		handleSubmit,
		reset,
		getValues,
		watch,
		setValue,
		control,
		formState: { errors },
	} = useForm();
	const [waitingForAxios, setwaitingForAxios] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
    const {id}=useParams();

	useEffect(() => {

		if (contractID) {
			const url = `api/tenancies/${contractID}`;
			authAxios
				.get(url)
				.then((res) => {
					setIsLoading(false);
					reset({...res.data,
						business_space_id:res?.data?.business_space?{...res.data.business_space,label:res.data?.business_space?.preferred_name,value:res.data?.business_space.id,}:null,
						building:reactSelectValueGenerator(res?.data?.business_space?.building , 'name') || '',
						floor:res?.data?.business_space?.floor? {value:res.data.business_space.floor,label:`Floor ${res.data.business_space.floor}`}:'',
						space_area:res?.data?.business_space?.space_area||'',
					});
				})
				.catch((err) => {
					setIsLoading(false);
					showErrorNotification(err)
				});
		}
	 // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contractID]);

	const onSubmit = (data:any) => {
		setwaitingForAxios(true);
		const url = `/api/tenancies/${contractID}`;
		
		const payload = {
			// valid_to: data?.valid_to||'',
			// valid_from: data?.valid_from||'',
			floor: String(data?.floor?.value)||'',
			area: data?.area||'',
			building_id: data?.building?.id||'',
			tenant_id:Number(id),
			business_space_id: data?.business_space_id?.id||null,
            slot_count: data?.slot_count||'',
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
								<ContractFields 
									register={register} 
									errors={errors} 
									getValues={getValues} 
									control={control} 
									setValue={setValue}
									watch={watch}
									isEdit
									/>	
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


export default EditContract;
