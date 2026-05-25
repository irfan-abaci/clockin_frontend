import React from 'react';
import dayjs from 'dayjs';
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/bootstrap/Card';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HolidayYearCalendar = ({ holidays, year }: any) => {
	const holidayList = Array.isArray(holidays) ? holidays : [];
	const holidaysByDate = holidayList.reduce((acc: any, holiday: any) => {
		const key = dayjs(holiday?.date).format('YYYY-MM-DD');
		if (!acc[key]) acc[key] = [];
		acc[key].push(holiday);
		return acc;
	}, {});

	const getMonthGrid = (monthIndex: number) => {
		const monthStart = dayjs().year(year).month(monthIndex).startOf('month');
		const monthEnd = monthStart.endOf('month');
		const startDate = monthStart.startOf('week');
		const endDate = monthEnd.endOf('week');
		const days = [];
		let current = startDate;

		while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
			const dateKey = current.format('YYYY-MM-DD');
			days.push({
				date: current,
				dateKey,
				isCurrentMonth: current.month() === monthIndex,
				holidays: holidaysByDate[dateKey] || [],
			});
			current = current.add(1, 'day');
		}

		return days;
	};

	return (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
				gap: '8px',
				width: '100%',
				marginTop:'10px'
			}}>
			{Array.from({ length: 12 }, (_, monthIndex) => {
				const monthName = dayjs().month(monthIndex).format('MMMM');
				const monthDays = getMonthGrid(monthIndex);

				return (
					<div key={monthName} style={{ minWidth: 0, width: '100%' }}>
						<Card stretch>
							<CardHeader className='py-2 px-3'>
								<CardTitle tag='div' className='h6 mb-0' style={{ fontSize: '0.95rem' }}>
									{monthName} {year}
								</CardTitle>
							</CardHeader>
							<CardBody className='p-2'>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
										gap: '3px',
										paddingTop: '6px',
									}}>
									{weekDays.map((day) => (
										<div
											key={`${monthName}-${day}`}
											className='text-muted fw-bold text-center'
											style={{ fontSize: '0.68rem', marginBottom: '2px' }}>
											{day}
										</div>
									))}
									{monthDays.map((dayObj: any) => {
										// Avoid duplicate marking in adjacent month overflow cells
										const hasHoliday = dayObj.isCurrentMonth && dayObj.holidays.length > 0;
										const holidayNames = hasHoliday
											? dayObj.holidays.map((h: any) => h?.name).filter(Boolean).join(', ')
											: '';
										return (
											<div
												key={`${monthName}-${dayObj.dateKey}`}
												title={holidayNames}
												style={{
													minHeight: '22px',
													borderRadius: '6px',
													padding: '1px 2px',
													background: '#fff',
													color: dayObj.isCurrentMonth ? '#212529' : '#adb5bd',
													textAlign: 'center',
													cursor: hasHoliday ? 'pointer' : 'default',
												}}>
												<div
													title={holidayNames}
													style={{
														fontSize: '0.64rem',
														fontWeight: 600,
														width: '18px',
														height: '18px',
														margin: '0 auto',
														borderRadius: '50%',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														border: hasHoliday ? '1px solid #fac600' : '1px solid transparent',
														background: hasHoliday ? '#fac600' : 'transparent',
													}}>
													{dayObj.date.date()}
												</div>
											</div>
										);
									})}
								</div>
							</CardBody>
						</Card>
					</div>
				);
			})}
		</div>
	);
};

export default HolidayYearCalendar;
