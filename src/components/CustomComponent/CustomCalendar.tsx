import React from 'react';
import dayjs from 'dayjs';
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = dayjsLocalizer(dayjs);

type CustomCalendarProps = {
	events: any[];
	date: Date;
	/** Merged with default month styles (e.g. pointerEvents). */
	eventPropGetter?: (event: any) => { className?: string; style?: React.CSSProperties };
	onNavigate?: (date: Date) => void;
	/**
	 * Fires when user clicks an empty day cell (month view slot) or an event.
	 * Used by parent screens to open date-specific actions.
	 */
	onDateClick?: (date: Date) => void;
	height?: string;
	startAccessor?: string;
	endAccessor?: string;
	toolbar?: boolean;
};

const CustomCalendar = ({
	events,
	date,
	eventPropGetter: eventPropGetterProp,
	onNavigate,
	onDateClick,
	height = '70vh',
	startAccessor = 'start',
	endAccessor = 'end',
	toolbar = false,
}: CustomCalendarProps) => {
	/** Normalize to the calendar day in local time (avoids UTC shift from RBC / ISO dates). */
	const emitDateClick = (rawDate: Date) => {
		if (!rawDate || Number.isNaN(rawDate.getTime())) return;
		const normalized = new Date(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate());
		onDateClick?.(normalized);
	};

	const DayCellWrapper = ({ children, value }: any) => {
		if (!React.isValidElement(children)) return children;

		const originalOnClick = (children.props as any)?.onClick;
		return React.cloneElement(children as React.ReactElement<any>, {
			onClick: (event: any) => {
				originalOnClick?.(event);
				if (value) emitDateClick(value);
			},
		});
	};

	const EventContent = ({ event }: any) => {
		const text = String(event?.title || '');
		if (event?.resource?.kind === 'shift') {
			return (
				<span
					className='rbc-shift-event-card'
					title={text.replace(/\n/g, ' ')}
					style={{
						display: 'block',
						whiteSpace: 'pre-line',
						wordBreak: 'break-word',
						lineHeight: 1.25,
						background: '#fff',
						color: '#212529',
						borderRadius: 4,
						padding: '2px 5px',
						border: '1px solid rgba(0, 0, 0, 0.12)',
						fontSize: '0.68rem',
						fontWeight: 600,
						boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)',
					}}>
					{text}
				</span>
			);
		}
		return (
			<span
				title={text.replace(/\n/g, ' ')}
				style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', lineHeight: 1.25 }}>
				{text}
			</span>
		);
	};

	return (
		<div style={{ height, width: '100%' }}>
			<Calendar
				localizer={localizer}
				toolbar={toolbar}
				events={events}
				startAccessor={startAccessor}
				endAccessor={endAccessor}
				views={[Views.MONTH]}
				defaultView={Views.MONTH}
				date={date}
				onNavigate={onNavigate}
				components={{
					dateCellWrapper: DayCellWrapper,
					event: EventContent,
				}}
				/**
				 * "ignoreEvents" allows selecting/clicking the day cell even when events exist.
				 * This keeps the default month grid structure/styles intact.
				 */
				selectable='ignoreEvents'
				onSelectSlot={(slotInfo: any) => {
					if (slotInfo?.start) {
						emitDateClick(slotInfo.start);
					}
				}}
				/**
				 * Keep events visible but let day-cell clicks pass through.
				 * This ensures dates stay clickable even when cells are filled by schedules.
				 */
				eventPropGetter={(event: any) => {
					const custom = eventPropGetterProp?.(event) || {};
					return {
						...custom,
						style: {
							pointerEvents: 'none',
							...(custom.style || {}),
						},
					};
				}}
				/**
				 * Date-number click in month cell triggers drilldown path.
				 * Capture it so modal opens for both day-cell and day-number clicks.
				 */
				onDrillDown={(drillDate: Date) => {
					if (drillDate) {
						emitDateClick(drillDate);
					}
				}}
			/>
		</div>
	);
};

CustomCalendar.defaultProps = {
	eventPropGetter: undefined,
	onNavigate: undefined,
	onDateClick: undefined,
	height: '70vh',
	startAccessor: 'start',
	endAccessor: 'end',
	toolbar: false,
};

export default CustomCalendar;
