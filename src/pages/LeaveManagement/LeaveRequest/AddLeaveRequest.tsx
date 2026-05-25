import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import OffCanvasComponent from '../../../components/OffCanvasComponent';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import SaveButton from '../../../components/CustomComponent/Buttons/SaveButton';
import CustomSpinner from '../../../components/CustomSpinner/CustomSpinner';
import { authAxios, authAxiosFileUpload } from '../../../axiosInstance';
import useToasterNotification from '../../../hooks/useToasterNotification';
import LeaveRequestField from './LeaveRequestField';

const todayLocalDateString = () => {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const appendFormField = (formData: FormData, key: string, value: unknown) => {
	if (value != null && value !== '') {
		formData.append(key, String(value));
	}
};

const buildLeaveRequestFormData = (data: any): FormData => {
	const formData = new FormData();
	appendFormField(formData, 'leave_type', data?.leave_type?.value);
	appendFormField(formData, 'from_date', data?.from_date);
	appendFormField(formData, 'to_date', data?.to_date);
	appendFormField(formData, 'from_session', data?.from_session?.value || 'FULL');
	appendFormField(formData, 'to_session', data?.to_session?.value || 'FULL');
	appendFormField(formData, 'reason', data?.reason);
	return formData;
};

const AddLeaveRequest = ({ isOpen, setIsOpen, tableRef, title, id }: any) => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		getValues,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		defaultValues: {
			leave_type: null,
			from_date: todayLocalDateString(),
			to_date: todayLocalDateString(),
			from_session: null,
			to_session: null,
			reason: '',
		},
	});

	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [leaveTypeOptions, setLeaveTypeOptions] = useState([]);
	const { showErrorNotification } = useToasterNotification();
	const isEdit = Boolean(id);

	useEffect(() => {
		if (!isOpen) return;
		setIsLoading(true);
		const leaveTypesReq = authAxios.get('/api/hr/leave-types/?paginate=off');
		const leaveRequestReq = isEdit ? authAxios.get(`/api/hr/leave-requests/${id}/`) : Promise.resolve(null);

		Promise.all([leaveTypesReq, leaveRequestReq])
			.then(([leaveTypesRes, leaveReqRes]: any) => {
				const leaveTypesData = Array.isArray(leaveTypesRes?.data)
					? leaveTypesRes.data
					: leaveTypesRes?.data?.results || [];
				const options =
					leaveTypesData.map((item: any) => ({
						label: item?.name || item?.code || `Leave Type ${item?.id}`,
						value: item?.id,
					})) || [];
				setLeaveTypeOptions(options);

				const leaveReq = leaveReqRes?.data;
				const leaveTypeId =
					leaveReq?.leave_type?.id ??
					leaveReq?.leave_type?.value ??
					leaveReq?.leave_type_id ??
					leaveReq?.leave_type ??
					null;
				const selectedLeaveType =
					options.find((opt: any) => String(opt.value) === String(leaveTypeId)) ||
					(leaveReq?.leave_type?.id
						? {
								label:
									leaveReq?.leave_type?.name ||
									leaveReq?.leave_type?.code ||
									`Leave Type ${leaveReq?.leave_type?.id}`,
								value: leaveReq?.leave_type?.id,
						  }
						: null);
				const sessionToOption = (value: string) =>
					value ? { label: value, value } : null;

				reset(
					isEdit
						? {
								leave_type: selectedLeaveType,
								from_date: leaveReq?.from_date || todayLocalDateString(),
								to_date: leaveReq?.to_date || todayLocalDateString(),
								from_session: sessionToOption(leaveReq?.from_session),
								to_session: sessionToOption(leaveReq?.to_session),
								reason: leaveReq?.reason || '',
						  }
						: {
								leave_type: null,
								from_date: todayLocalDateString(),
								to_date: todayLocalDateString(),
								from_session: null,
								to_session: null,
								reason: '',
						  },
				);
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
		const formData = buildLeaveRequestFormData(data);

		const req = isEdit
			? authAxiosFileUpload.patch(`/api/hr/leave-requests/${id}/`, formData)
			: authAxiosFileUpload.post('/api/hr/leave-requests/', formData);

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
								<LeaveRequestField
									register={register}
									errors={errors}
									control={control}
									getValues={getValues}
									setValue={setValue}
									watch={watch}
									leaveTypeOptions={leaveTypeOptions}
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
AddLeaveRequest.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	tableRef: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	id: PropTypes.any,
};
/* eslint-enable react/forbid-prop-types */

AddLeaveRequest.defaultProps = {
	id: null,
};

export default AddLeaveRequest;
