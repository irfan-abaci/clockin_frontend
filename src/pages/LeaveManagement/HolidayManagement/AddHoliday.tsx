import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import OffCanvasComponent from '../../../components/OffCanvasComponent';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import SaveButton from '../../../components/CustomComponent/Buttons/SaveButton';
import CustomSpinner from '../../../components/CustomSpinner/CustomSpinner';
import { authAxios } from '../../../axiosInstance';
import useToasterNotification from '../../../hooks/useToasterNotification';
import HolidayFields from './HolidayFields';

const AddHoliday = ({ isOpen, setIsOpen, tableRef, title, id }: any) => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			date: '',
			applicable_to: [],
		},
	});

	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [groupOptions, setGroupOptions] = useState([]);
	const { showErrorNotification } = useToasterNotification();
	const isEdit = Boolean(id);

	useEffect(() => {
		if (!isOpen) return;
		setIsLoading(true);
		const groupsReq = authAxios.get('api/hr/groups?paginate=off');
		const holidayReq = isEdit ? authAxios.get(`/api/hr/public-holidays/${id}/`) : Promise.resolve(null);

		Promise.all([groupsReq, holidayReq])
			.then(([groupsRes, holidayRes]: any) => {
				const groups =
					(groupsRes?.data || []).map((item: any) => ({
						label: item?.name,
						value: item?.id,
					})) || [];
				setGroupOptions(groups);

				const holiday = holidayRes?.data;
				const selectedGroups =
					(holiday?.applicable_to_groups || [])
						.map((group: any) => groups.find((g: any) => g.value === group?.id))
						.filter(Boolean) || [];

				reset({
					name: holiday?.name || '',
					date: holiday?.date || '',
					applicable_to: selectedGroups,
				});
				setIsLoading(false);
			})
			.catch((err) => {
				setIsLoading(false);
				showErrorNotification(err);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen, id, isEdit]);

	const onSubmit = (data: any) => {
		setWaitingForAxios(true);
		const payload = {
			name: data?.name || '',
			date: data?.date || '',
			applicable_to: (data?.applicable_to || []).map((item: any) => item?.value),
		};

		const req = isEdit
			? authAxios.patch(`/api/hr/public-holidays/${id}/`, payload)
			: authAxios.post('/api/hr/public-holidays/', payload);

		req
			.then(() => {
				setWaitingForAxios(false);
				tableRef?.current?.onQueryChange();
				setIsOpen(false);
			})
			.catch((err) => {
				setWaitingForAxios(false);
				showErrorNotification(err);
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
								<HolidayFields
									register={register}
									errors={errors}
									control={control}
									getValues={getValues}
									groupOptions={groupOptions}
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

/* eslint-disable react/forbid-prop-types */
AddHoliday.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	tableRef: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	id: PropTypes.any,
};
/* eslint-enable react/forbid-prop-types */

AddHoliday.defaultProps = {
	id: null,
};

export default AddHoliday;
