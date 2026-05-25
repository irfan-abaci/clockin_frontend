const calendar = [
	{ day: 'Sunday' },
	{ day: 'Monday' },
	{ day: 'Tuesday' },
	{ day: 'Wednesday' },
	{ day: 'Thursday' },
	{ day: 'Friday' },
	{ day: 'Saturday' },
	{ day: 'Sunday' },
	{ day: 'Monday' },
	{ day: 'Tuesday' },
	{ day: 'Wednesday' },
	{ day: 'Thursday' },
	{ day: 'Friday' },
	{ day: 'Saturday' },
	{ day: 'Sunday' },
	{ day: 'Monday' },
	{ day: 'Tuesday' },
	{ day: 'Wednesday' },
	{ day: 'Thursday' },
	{ day: 'Friday' },
	{ day: 'Saturday' },
	{ day: 'Sunday' },
	{ day: 'Monday' },
	{ day: 'Tuesday' },
	{ day: 'Wednesday' },
	{ day: 'Thursday' },
	{ day: 'Friday' },
	{ day: 'Saturday' },
	{ day: 'Sunday' },
	{ day: 'Monday' },
	{ day: 'Tuesday' },
	{ day: 'Wednesday' },
	{ day: 'Thursday' },
	{ day: 'Friday' },
	{ day: 'Saturday' },
	{ day: 'Sunday' },
	{ day: 'Monday' },
	{ day: 'Tuesday' },
	{ day: 'Wednesday' },
	{ day: 'Thursday' },
	{ day: 'Friday' },
	{ day: 'Saturday' },
];

const addWeekKey = (calendar) => {
	return calendar.map((entry, index) => ({
		...entry,
		week: Math.floor(index / 7) + 1,
	}));
};

const updatedCalendar = addWeekKey(calendar);
// Function to group calendar days into rows of seven
const groupDaysIntoWeeks = (calendar) => {
	const weeks = [];
	for (let i = 0; i < calendar.length; i += 7) {
		weeks.push(calendar.slice(i, i + 7));
	}
	return weeks;
};

const Calendar = () => {
	const weeks = groupDaysIntoWeeks(updatedCalendar);

	return (
		<div>
			{weeks.map((week, weekIndex) => (
				<div
					key={weekIndex}
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						width: '50%',
					}}>
					{week.map((day, dayIndex) => (
						<div
							key={dayIndex}
							style={{
								border: '1px solid black',
								width: '100%',
								height: '60px',
								borderRadius: '5px',
							}}>
							{day.day}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default Calendar;
