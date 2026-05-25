import moment from 'moment';

function Moments($date, $type = '' ) {
	// Parse and show in the viewer's local timezone. APIs often store UTC (`…Z`); e.g.
	// `2026-05-15T07:08:00Z` is 12:38 in IST — same instant as `2026-05-15T12:38:00+05:30`.
	const parsedDate = moment($date);
	// Check if the date is valid after parsing.
	if (!parsedDate.isValid()) {
		console.warn('Invalid date format. Please provide an ISO 8601 or RFC2822 formatted date.');
		return ''; // Return an empty string or handle invalid date as needed.
	}

	switch ($type) {
		case 'datetime': // Format with date and 12-hour time
			return parsedDate.format('YYYY-MM-DD hh:mm A');
		case 'datetimeseconds': // Format with date and 12-hour time including seconds
			return parsedDate.format('YYYY-MM-DD hh:mm:ss A');
		case 'timeseconds': // Format as 24-hour time
			return parsedDate.format('hh:mm:ss A');
		case 'time': // Format as 12-hour time
			return parsedDate.format('hh:mm A');
		case 'time24': // Format as 24-hour time for <input type="time" />
			return parsedDate.format('HH:mm');
		default: // Default to date-only format
			return parsedDate.format('YYYY-MM-DD');
	}
}

export default Moments;
