import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';
import { useForm } from 'react-hook-form';
import OffCanvasComponent from '../../components/OffCanvasComponent';
import Card, { CardBody } from '../../components/bootstrap/Card';
import SaveButton from '../../components/CustomComponent/Buttons/SaveButton';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';
import AttendanceFields from './AttendanceFields';
import Moments from '../../helpers/Moment';
import { buildLocalIsoTimestamp } from '../../helpers/buildLocalIsoTimestamp';

const getEventTimestamp = (record: any, eventType: string) => {
	const event = record?.events?.find((item: any) => item?.event_type === eventType);
	return event?.timestamp || '';
};

/** Combine form date (YYYY-MM-DD) + time (HH:mm) into local-offset ISO for the API. */
const combineDateAndTimeToIso = (dateStr: string, timeStr: string): string | null => {
	if (!dateStr || !timeStr?.trim()) return null;
	return buildLocalIsoTimestamp(dateStr, timeStr);
};

const todayLocalDateString = () => {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const emptyAddFormValues = () => ({
	date: todayLocalDateString(),
	clock_in: '',
	clock_out: '',
	break_out: '',
	break_in: '',
	remarks: '',
});

const AddAttendance = ({ isOpen, setIsOpen, tableRef, title, id, onSaved, url }: any) => {
	const { showErrorNotification, showSuccessNotification } = useToasterNotification();
	const isEdit = Boolean(id);
	const {
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors, isSubmitting, isSubmitted },
	} = useForm({
		defaultValues: emptyAddFormValues(),
		mode: 'onSubmit',
		reValidateMode: 'onChange',
		shouldFocusError: true,
	});

	useEffect(() => {
		if (!isOpen || isEdit) return;
		reset(emptyAddFormValues());
	}, [isEdit, isOpen, reset]);

	useEffect(() => {
		if (!isOpen || !isEdit) return;
		authAxios
			.get(`/api/hr/attendance/${id}/`)
			.then((response) => {
				const record = response?.data || {};
				const day = record?.date || '';
				const clockInRaw = getEventTimestamp(record, 'CLOCK_IN') || record?.clock_in;
				const clockOutRaw = getEventTimestamp(record, 'CLOCK_OUT') || record?.clock_out;
				const breakOutRaw = getEventTimestamp(record, 'BREAK_OUT') || record?.break_out;
				const breakInRaw = getEventTimestamp(record, 'BREAK_IN') || record?.break_in;
				reset({
					date: day,
					clock_in: Moments(clockInRaw, 'time24'),
					clock_out: Moments(clockOutRaw, 'time24'),
					break_out: Moments(breakOutRaw, 'time24'),
					break_in: Moments(breakInRaw, 'time24'),
					remarks: record?.remarks || '',
				});
			})
			.catch((error) => {
				showErrorNotification(error);
			});
	}, []);

	const onSubmit = async (data: any) => {
		const day = data?.date || '';
		const payload = {
			date: day,
			method: 'PORTAL',
			clock_in: combineDateAndTimeToIso(day, data?.clock_in),
			clock_out: combineDateAndTimeToIso(day, data?.clock_out),
			break_out: data?.break_out ? combineDateAndTimeToIso(day, data?.break_out) : null,
			break_in: data?.break_in ? combineDateAndTimeToIso(day, data?.break_in) : null,
			remarks: data?.remarks || '',
		};

		try {
			if (isEdit) {
				await authAxios.post(`${url}`, payload);
				showSuccessNotification('Attendance updated successfully.');
			} else {
				await authAxios.post(url, payload);
				showSuccessNotification('Attendance populated successfully.');
			}
			tableRef?.current?.onQueryChange?.();
			onSaved?.();
			setIsOpen(false);
		} catch (error) {
			showErrorNotification(error);
		}
	};

	return (
		<OffCanvasComponent isOpen={isOpen} placement='end' title={title} setOpen={setIsOpen}>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Card>
					<CardBody>
						<AttendanceFields
							register={register}
							errors={errors}
							getValues={getValues}
							isSubmitted={isSubmitted}
						/>
						<div className='row m-0'>
							<div className='col-12 p-3'>
								<SaveButton state={isSubmitting} />
							</div>
						</div>
					</CardBody>
				</Card>
			</Form>
		</OffCanvasComponent>
	);
};

AddAttendance.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	tableRef: PropTypes.object,
	title: PropTypes.string,
	id: PropTypes.any,
	onSaved: PropTypes.func,
	url: PropTypes.string,
};

AddAttendance.defaultProps = {
	tableRef: undefined,
	title: 'Add Attendance',
	id: null,
	onSaved: undefined,
	url: '/api/users/clock/portal/',
};

export default AddAttendance;
