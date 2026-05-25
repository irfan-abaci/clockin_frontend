import React, { useRef, useState } from 'react';
import dayjs from 'dayjs';
import ReusableScheduleCalendar from '../../components/MasterComponents/ScheduleComponent/ReusableScheduleCalendar';
import ScheduleCalendarDetailModal from '../Schedule/ScheduleCalendarDetailModal';

const dayKey = (d: Date) => dayjs(d).format('YYYY-MM-DD');

type Props = {
	groupId?: string | number;
	height?: string;
};

const GroupMonthlyCalendarSection = ({ groupId, height = '50vh' }: Props) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedDay, setSelectedDay] = useState<Date | null>(null);
	const [dayDetail, setDayDetail] = useState<any | null>(null);
	const [dayDetailLoading, setDayDetailLoading] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const activeKeyRef = useRef<string | null>(null);

	const handleOpenChange = (open: boolean) => {
		setModalOpen(open);
		if (!open) {
			activeKeyRef.current = null;
			setSelectedDay(null);
			setDayDetail(null);
			setDayDetailLoading(false);
		}
	};

	const handleDateClick = (date: Date, detail: any | null, meta: { loading: boolean }) => {
		if (groupId == null || groupId === '') return;
		const key = dayKey(date);
		if (meta.loading) {
			activeKeyRef.current = key;
			setSelectedDay(date);
			setDayDetail(null);
			setDayDetailLoading(true);
			setModalOpen(true);
			return;
		}
		if (activeKeyRef.current !== key) return;
		setDayDetail(detail);
		setDayDetailLoading(false);
	};

	return (
		<>
			<ReusableScheduleCalendar
				key={refreshKey}
				calendarType='group'
				entityId={groupId}
				height={height}
				onDateClick={handleDateClick}
			/>
			<ScheduleCalendarDetailModal
				isOpen={modalOpen}
				setIsOpen={handleOpenChange}
				selectedDate={selectedDay}
				calendarType='group'
				groupId={groupId}
				detail={dayDetail}
				loading={dayDetailLoading}
				onChanged={() => setRefreshKey((k) => k + 1)}
			/>
		</>
	);
};

export default GroupMonthlyCalendarSection;
