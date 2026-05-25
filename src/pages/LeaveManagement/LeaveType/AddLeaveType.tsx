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
import LeaveTypeFields, { CARRY_FORWARD_OPTIONS } from './LeaveTypeFields';
import {
	buildApprovalWorkflowsPayload,
	mapApprovalWorkflowsFromApi,
	validateApprovalWorkflows,
} from './leaveTypeApprovalWorkflowUtils';

const normalizeCarryForwardApiValue = (raw: unknown): string => {
	const v = String(raw ?? 'NONE').trim().toUpperCase();
	if (v === 'UNLIMITED') return 'FULL';
	if (v === 'NONE' || v === 'FULL' || v === 'LIMITED') return v;
	return 'NONE';
};

const carryForwardSelectOption = (raw: unknown) => {
	const value = normalizeCarryForwardApiValue(raw);
	return CARRY_FORWARD_OPTIONS.find((o) => o.value === value) ?? CARRY_FORWARD_OPTIONS[0];
};

const AddLeaveType = ({ isOpen, setIsOpen, tableRef, title, id }: any) => {
	const {
		register,
		handleSubmit,
		reset,
		control,
		getValues,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			code: '',
			description: '',
			days_allowed: '0',
			reset_cycle: null,
			carry_forward: CARRY_FORWARD_OPTIONS[0],
			carry_forward_max_days: '0.0',
			is_paid: false,
			is_comp_off: false,
			requires_document: false,
			clubbing_allowed: false,
			clubbable_with: [] as any[],
			sandwich_applicable: false,
			max_consecutive_days: 1,
			advance_notice_days: 0,
			approval_workflows: [] as any[],
		},
	});

	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [groupOptions, setGroupOptions] = useState([]);
	const [leaveTypeOptions, setLeaveTypeOptions] = useState<any[]>([]);
	const { showErrorNotification, showNotification } = useToasterNotification();
	const isEdit = Boolean(id);

	useEffect(() => {
		if (!isOpen) return;
		setIsLoading(true);
		const groupsReq = authAxios.get('api/hr/groups?paginate=off');
		const leaveTypesListReq = authAxios.get('api/hr/leave-types?paginate=off');
		const leaveTypeReq = isEdit ? authAxios.get(`/api/hr/leave-types/${id}/`) : Promise.resolve(null);

		Promise.all([groupsReq, leaveTypesListReq, leaveTypeReq])
			.then(([groupsRes, leaveTypesListRes, leaveTypeRes]: any) => {
				const groups =
					(groupsRes?.data || []).map((item: any) => ({
						label: item?.name,
						value: item?.id,
					})) || [];
				setGroupOptions(groups);

				const leaveTypesRaw = Array.isArray(leaveTypesListRes?.data)
					? leaveTypesListRes.data
					: leaveTypesListRes?.data?.results || [];
				const allLeaveOpts = leaveTypesRaw.map((lt: any) => ({
					label: [lt?.name, lt?.code].filter(Boolean).join(' — ') || `Leave type ${lt?.id}`,
					value: lt?.id,
					...lt,
				}));
				const clubbableOpts =
					isEdit && id != null
						? allLeaveOpts.filter((o: any) => Number(o.value) !== Number(id))
						: allLeaveOpts;
				setLeaveTypeOptions(clubbableOpts);

				const leaveType = leaveTypeRes?.data;

				const rawClubbable = leaveType?.clubbable_with;
				const clubbableIds: number[] = Array.isArray(rawClubbable)
					? rawClubbable
							.map((x: any) =>
								x != null && typeof x === 'object' ? Number(x.id ?? x.value) : Number(x),
							)
							.filter((n: number) => !Number.isNaN(n))
					: [];
				const selectedClubbable = clubbableOpts.filter((o: any) =>
					clubbableIds.some((lid) => Number(lid) === Number(o.value)),
				);

				reset({
					name: leaveType?.name || '',
					code: leaveType?.code || '',
					description: leaveType?.description || '',
					days_allowed: String(leaveType?.days_allowed ?? '0'),
					reset_cycle: leaveType?.reset_cycle
						? { label: leaveType.reset_cycle, value: leaveType.reset_cycle }
						: null,
					carry_forward: carryForwardSelectOption(leaveType?.carry_forward),
					carry_forward_max_days: String(leaveType?.carry_forward_max_days ?? '0.0'),
					is_paid: Boolean(leaveType?.is_paid),
					is_comp_off: Boolean(leaveType?.is_comp_off),
					requires_document: Boolean(leaveType?.requires_document),
					clubbing_allowed:
						leaveType?.clubbing_allowed === true ||
						leaveType?.clubbing_allowed === 'true' ||
						leaveType?.clubbing_allowed === 1 ||
						leaveType?.clubbing_allowed === '1',
					clubbable_with: selectedClubbable,
					sandwich_applicable: Boolean(leaveType?.sandwich_applicable),
					max_consecutive_days: Number(leaveType?.max_consecutive_days ?? 1),
					advance_notice_days: Number(leaveType?.advance_notice_days ?? 0),
					approval_workflows: mapApprovalWorkflowsFromApi(leaveType?.approval_workflows),
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
		const workflowError = validateApprovalWorkflows(data?.approval_workflows);
		if (workflowError) {
			showNotification('Error', workflowError, 'danger');
			return;
		}

		setWaitingForAxios(true);
		const carryForward = data?.carry_forward?.value || 'NONE';
		const clubbingAllowed = Boolean(data?.clubbing_allowed);
		const clubbableRaw = Array.isArray(data?.clubbable_with) ? data.clubbable_with : [];
		const clubbable_with = clubbingAllowed
			? clubbableRaw
					.map((item: any) => Number(item?.value ?? item))
					.filter((n: number) => !Number.isNaN(n))
			: [];

		const payload = {
			name: data?.name || '',
			code: data?.code || '',
			description: data?.description || '',
			days_allowed: String(data?.days_allowed || '0'),
			reset_cycle: data?.reset_cycle?.value || 'YEARLY',
			carry_forward: carryForward,
			carry_forward_max_days:
				carryForward === 'LIMITED' ? String(data?.carry_forward_max_days || '0.0') : '0',
			is_paid: Boolean(data?.is_paid),
			is_comp_off: Boolean(data?.is_comp_off),
			requires_document: Boolean(data?.requires_document),
			clubbing_allowed: clubbingAllowed,
			clubbable_with,
			sandwich_applicable: Boolean(data?.sandwich_applicable),
			min_days: '0',
			max_consecutive_days: Number(data?.max_consecutive_days || 1),
			advance_notice_days: Number(data?.advance_notice_days || 0),
			applicable_to: (data?.applicable_to || []).map((item: any) => item?.value),
			approval_workflows: buildApprovalWorkflowsPayload(data?.approval_workflows),
		};

		const req = isEdit
			? authAxios.patch(`/api/hr/leave-types/${id}/`, payload)
			: authAxios.post('/api/hr/leave-types/', payload);

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
								<LeaveTypeFields
									register={register}
									errors={errors}
									control={control}
									getValues={getValues}
									watch={watch}
									setValue={setValue}
									groupOptions={groupOptions}
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
AddLeaveType.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	tableRef: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	id: PropTypes.any,
};
/* eslint-enable react/forbid-prop-types */

AddLeaveType.defaultProps = {
	id: null,
};

export default AddLeaveType;
