import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import OffCanvasComponent from '../../components/OffCanvasComponent';
import Card, { CardBody } from '../../components/bootstrap/Card';
import SaveButton from '../../components/CustomComponent/Buttons/SaveButton';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';
import ReactSelectComponent from '../../components/CustomComponent/Select/ReactSelectComponent';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import AuthContext from '../../contexts/authContext';
import { buildLocalIsoTimestamp } from '../../helpers/buildLocalIsoTimestamp';

const formatAccountLabel = (item: any): string => {
	if (!item) return '';
	const pref = String(item?.preferred_name || '').trim();
	if (pref) return pref;
	const first = String(item?.first_name || '').trim();
	const last = String(item?.last_name || '').trim();
	const full = [first, last].filter(Boolean).join(' ').trim();
	if (full) return full;
	const email = String(item?.email || '').trim();
	if (email) return email;
	return `User ${item?.id}`;
};

/** Same shape handling as `UserCalendarDetailModal` for GET `/api/hr/attendance/`. */
const attendanceRowsFromResponse = (res: any): any[] => {
	const d = res?.data;
	if (Array.isArray(d)) return d;
	if (d && Array.isArray(d.results)) return d.results;
	return [];
};

const attendanceRowUserId = (row: any): number | null => {
	const u = row?.user;
	if (u == null) return null;
	if (typeof u === 'object' && !Array.isArray(u)) {
		const id = u?.id ?? u?.pk;
		if (id == null || id === '') return null;
		const n = Number(id);
		return Number.isNaN(n) ? null : n;
	}
	const n = Number(u);
	return Number.isNaN(n) ? null : n;
};

const pickAttendanceRowForUser = (
	rows: any[],
	userId: string | number | null | undefined,
): any | null => {
	if (!rows?.length) return null;
	const n = userId != null && userId !== '' ? Number(userId) : Number.NaN;
	if (!Number.isNaN(n)) {
		const hit = rows.find((r) => attendanceRowUserId(r) === n);
		if (hit) return hit;
	}
	return rows[0] ?? null;
};

const normalizeClockStatusKey = (status: string | null | undefined) =>
	String(status || '')
		.trim()
		.toUpperCase()
		.replace(/\s+/g, '_');

const EVENT_TYPE_OPTIONS = [
	{ label: 'Clock in', value: 'CLOCK_IN' },
	{ label: 'Clock out', value: 'CLOCK_OUT' },
];

const getSuggestedEventTypeOption = (currentClockInStatus: string | null | undefined) => {
	const key = normalizeClockStatusKey(currentClockInStatus ?? undefined);
	if (key === 'CLOCK_IN') return { label: 'Clock out', value: 'CLOCK_OUT' };
	if (key === 'CLOCK_OUT') return { label: 'Clock in', value: 'CLOCK_IN' };
	return { label: 'Clock in', value: 'CLOCK_IN' };
};

const AddEventForm = ({ isOpen, setIsOpen, tableRef, title }: any) => {
	const { userData } = useContext(AuthContext);
	const accountToggle = useSelector((state: any) => state.authSlice?.account_toggle_button);
	const mode = accountToggle === 'Self' ? 'Self' : 'Admin';
	const isAdmin = userData?.user_type === 'Admin';
	const isAdminSelfMode = isAdmin && mode === 'Self';

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
			user: null,
			event_type: null,
			event_date: dayjs().format('YYYY-MM-DD'),
			event_time: dayjs().format('HH:mm'),
		},
	});

	const [waitingForAxios, setWaitingForAxios] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [userOptions, setUserOptions] = useState<any[]>([]);
	const [lastClockInStatus, setLastClockInStatus] = useState<string | null>(null);
	const [attendanceStatusLoading, setAttendanceStatusLoading] = useState(false);
	const { showErrorNotification, showSuccessNotification, showNotification } = useToasterNotification();

	const watchedUser = watch('user');
	const watchedDate = watch('event_date');

	useEffect(() => {
		if (!isOpen) return undefined;

		let cancelled = false;
		setIsLoading(true);

		authAxios
			.get('api/hr/accounts', { params: { paginate: 'off' } })
			.then((res) => {
				if (cancelled) return;
				const raw = res?.data;
				const list = Array.isArray(raw) ? raw : raw?.results || [];
				let mapped = list.map((item: any) => ({
					label: formatAccountLabel(item),
					value: item?.id,
					...item,
				}));
				if (isAdminSelfMode && userData?.id != null) {
					mapped = mapped.filter((opt: any) => Number(opt.value) === Number(userData.id));
				}
				setUserOptions(mapped);
				const defaultUser =
					isAdminSelfMode && mapped.length === 1 ? mapped[0] : null;
				reset({
					user: defaultUser,
					event_type: null,
					event_date: dayjs().format('YYYY-MM-DD'),
					event_time: dayjs().format('HH:mm'),
				});
			})
			.catch((err) => {
				if (!cancelled) showErrorNotification(err);
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (!isOpen) {
			setLastClockInStatus(null);
			setAttendanceStatusLoading(false);
			return;
		}
		const userId = watchedUser?.value;
		const dateStr = watchedDate;
		if (userId == null || userId === '' || !dateStr || String(dateStr).trim() === '') {
			setLastClockInStatus(null);
			setAttendanceStatusLoading(false);
			setValue('event_type', null, { shouldDirty: false, shouldValidate: false });
			return;
		}

		let cancelled = false;
		setAttendanceStatusLoading(true);

		authAxios
			.get(`/api/hr/attendance/?date=${encodeURIComponent(String(dateStr))}&user=${encodeURIComponent(String(userId))}&paginate=off`)
			.then((res: any) => {
				if (cancelled) return;
				const list = attendanceRowsFromResponse(res);
				const row = pickAttendanceRowForUser(list, userId);
				const raw = row?.current_clockin_status;
				const normalized =
					raw != null && String(raw).trim() !== '' ? String(raw) : null;
				setLastClockInStatus(normalized);
				const suggested = getSuggestedEventTypeOption(normalized);
				setValue('event_type', suggested, { shouldDirty: false, shouldValidate: false });
			})
			.catch((err) => {
				if (!cancelled) {
					showErrorNotification(err);
					setLastClockInStatus(null);
					setValue('event_type', null, { shouldDirty: false, shouldValidate: false });
				}
			})
			.finally(() => {
				if (!cancelled) setAttendanceStatusLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [ watchedUser]);

	const clockStatusLabel =
		lastClockInStatus != null && String(lastClockInStatus).trim() !== ''
			? String(lastClockInStatus).replace(/_/g, ' ')
			: 'Not available';

	const onSubmit = (data: any) => {
		const userId = data?.user?.value;
		if (userId == null || userId === '') {
			showNotification('Error', 'Please select a user.', 'danger');
			return;
		}
		setWaitingForAxios(true);
		const eventType = data?.event_type?.value;
		if (eventType == null || eventType === '') {
			showNotification('Error', 'Please select an event type.', 'danger');
			return;
		}
		const payload = {
			timestamp: buildLocalIsoTimestamp(data?.event_date || '', data?.event_time || ''),
			user: Number(userId),
			event_type: eventType,
		};
		authAxios
			.post('/api/hr/attendance-events/', payload)
			.then(() => {
				showSuccessNotification('Event recorded.');
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
								<div className='col-12'>
									<ReactSelectComponent
										control={control}
										name='User *'
										isMulti={false}
										field_name='user'
										getValues={getValues}
										errors={errors}
										options={userOptions}
										isRequired
										isDisable={isAdminSelfMode && userOptions.length <= 1}
									/>
								</div>
								{watchedUser?.value != null && watchedUser?.value !== '' ? (
									<>
										<div className='col-12 mb-2'>
											<div className='d-flex align-items-center justify-content-between flex-wrap gap-2'>
												<span className='form-label mb-0'>Current clock-in status</span>
												<div className='d-flex align-items-center'>
													{attendanceStatusLoading ? (
														<span
															className='spinner-border spinner-border-sm text-primary'
															role='status'
															aria-label='Loading'
														/>
													) : (
														<span className='fw-semibold text-body text-end'>{clockStatusLabel}</span>
													)}
												</div>
											</div>
										</div>
										<div className='col-12'>
											<ReactSelectComponent
												control={control}
												name='Event type *'
												isMulti={false}
												field_name='event_type'
												getValues={getValues}
												errors={errors}
												options={EVENT_TYPE_OPTIONS}
												isRequired
												isDisable={attendanceStatusLoading}
											/>
										</div>
									</>
								) : null}
								<div className='col-12'>
									<FormGroup label='Date *'>
										<input type='date' className='form-control' {...register('event_date', { required: true })} />
										{errors?.event_date?.type === 'required' ? (
											<span style={{ color: 'red' }}>*This field is required</span>
										) : (
											<p />
										)}
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup label='Time *'>
										<input
											type='time'
											step='60'
											className='form-control'
											{...register('event_time', { required: true })}
										/>
										{errors?.event_time?.type === 'required' ? (
											<span style={{ color: 'red' }}>*This field is required</span>
										) : (
											<p />
										)}
									</FormGroup>
								</div>
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
AddEventForm.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	tableRef: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
};
/* eslint-enable react/forbid-prop-types */

export default AddEventForm;
