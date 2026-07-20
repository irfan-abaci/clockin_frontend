import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { DateRange } from 'react-date-range';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import ReactSelectComponent from '../../../components/CustomComponent/Select/ReactSelectComponent';
import Popovers from '../../../components/bootstrap/customPopoverForDateRange';
import { authAxios } from '../../../axiosInstance';
import {
	DASHBOARD_LEAVE_THEME,
	dashboardStatStyle,
} from '../../Dashboard/dashboardTheme';
const sessionOptions = [
	{ label: 'FULL', value: 'FULL' },
	{ label: 'FIRST HALF', value: 'FIRST_HALF' },
	{ label: 'SECOND HALF', value: 'SECOND_HALF' },
];

const LeaveRequestField = ({
	register,
	errors,
	control,
	getValues,
	setValue,
	watch,
	leaveTypeOptions,
}: any) => {
	const leave_type_select = watch('leave_type');
	const [leaveBalanceOptions, setLeaveBalanceOptions] = useState<any>({});
	const [popoverOpen, setPopoverOpen] = useState(false);
	const fromDate = watch('from_date');
	const toDate = watch('to_date');
	const displayRangeValue =
		fromDate && toDate
			? `${dayjs(fromDate).format('M/D/YYYY')} - ${dayjs(toDate).format('M/D/YYYY')}`
			: '';

	const selectionRange = {
		startDate: fromDate ? dayjs(fromDate).toDate() : new Date(),
		endDate: toDate ? dayjs(toDate).toDate() : fromDate ? dayjs(fromDate).toDate() : new Date(),
		key: 'selection',
	};

	const handleDateRangeChange = (item: any) => {
		const startDate = item?.selection?.startDate ? dayjs(item.selection.startDate) : null;
		const endDate = item?.selection?.endDate ? dayjs(item.selection.endDate) : startDate;
		const from = startDate?.format('YYYY-MM-DD') || '';
		const to = endDate?.format('YYYY-MM-DD') || from;
		setValue('from_date', from, { shouldDirty: true, shouldValidate: true });
		setValue('to_date', to, { shouldDirty: true, shouldValidate: true });
	};

	useEffect(() => {
		if (!leave_type_select) {
			setLeaveBalanceOptions({});
			return;
		}

		authAxios
			.get('/api/hr/leave-balances/')
			.then((res) => {
				const balance = res.data?.balances?.find(
					(item: any) => item.leave_type === leave_type_select?.label,
				);
				setLeaveBalanceOptions(balance || {});
			})
			.catch(() => {
				setLeaveBalanceOptions({});
			});
	}, [leave_type_select]);

	const usedBalance = Number(leaveBalanceOptions?.used ?? 0);
	const remainingBalance = Number(leaveBalanceOptions?.remaining ?? 0);

	return (
		<div className='row'>
			<div className='col-12 mb-2'>
				<ReactSelectComponent
					control={control}
					name='Leave Type *'
					isMulti={false}
					field_name='leave_type'
					getValues={getValues}
					errors={errors}
					options={leaveTypeOptions}
					isRequired
				/>
			</div>
			{leave_type_select && (
				<div className='col-12 mb-2'>
					<div className='rounded-3 border border-secondary border-opacity-25 p-3'>
						<div className='d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3'>
							<span className='text-warning fw-semibold small text-uppercase'>
								{leave_type_select?.label} balance
							</span>
							<span className='text-muted small'>Current leave year</span>
						</div>
						<div className='hr-dashboard'>
							<div className='hr-dashboard__stat-row mb-0'>
								<div
									className='hr-dashboard__stat-card'
									style={dashboardStatStyle(DASHBOARD_LEAVE_THEME.pending)}>
									<div className='hr-dashboard__stat-icon'>
										<EventBusyOutlinedIcon fontSize='small' />
									</div>
									<div className='hr-dashboard__stat-value'>{usedBalance}</div>
									<div className='hr-dashboard__stat-label'>Used</div>
								</div>
								<div
									className='hr-dashboard__stat-card'
									style={dashboardStatStyle(DASHBOARD_LEAVE_THEME.approved)}>
									<div className='hr-dashboard__stat-icon'>
										<CheckCircleOutlineIcon fontSize='small' />
									</div>
									<div className='hr-dashboard__stat-value'>{remainingBalance}</div>
									<div className='hr-dashboard__stat-label'>Remaining</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			<div className='col-12 mb-2'>
				<FormGroup label='Date Range *'>
					<input type='hidden' {...register('from_date', { required: true })} />
					<input type='hidden' {...register('to_date', { required: true })} />
					<Popovers
						placement='bottom-start'
						popoverOpen={popoverOpen}
						setPopoverOpen={setPopoverOpen}
						className='mw-100 overflow-hidden'
						bodyClassName='p-0'
						trigger='click'
						desc={
							<div className='p-2'>
								<DateRange
									ranges={[selectionRange]}
									onChange={handleDateRangeChange}
									moveRangeOnFirstSelection={false}
									rangeColors={[String(import.meta.env.VITE_API_SECONDARY_COLOR)]}
									showDateDisplay={false}
									direction='horizontal'
								/>
							</div>
						}>
						<button type='button' className='form-control text-start'>
							{displayRangeValue || 'Select date range'}
						</button>
					</Popovers>
					{(errors?.from_date?.type || errors?.to_date?.type) && (
						<span style={{ color: 'red' }}>*Please select a date range</span>
					)}
				</FormGroup>
			</div>
			<div className='col-md-6 col-12 mb-2'>
				<ReactSelectComponent
					control={control}
					name='From Session *'
					isMulti={false}
					field_name='from_session'
					getValues={getValues}
					errors={errors}
					options={sessionOptions}
					isRequired
				/>
			</div>
			<div className='col-md-6 col-12 mb-2'>
				<ReactSelectComponent
					control={control}
					name='To Session *'
					isMulti={false}
					field_name='to_session'
					getValues={getValues}
					errors={errors}
					options={sessionOptions}
					isRequired
				/>
			</div>
			<div className='col-12 mb-2'>
				<FormGroup label='Reason *'>
					<textarea className='form-control' rows={3} {...register('reason', { required: true })} />
					{errors?.reason?.type && <span style={{ color: 'red' }}>*This field is required</span>}
				</FormGroup>
			</div>
		</div>
	);
};

export default LeaveRequestField;

