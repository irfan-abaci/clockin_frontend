import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar as DatePicker } from 'react-date-range';

import Icon from '../../icon/Icon';
import Popovers from '../../bootstrap/customPopoverForDateRange';

const DateAndTimeComponent = () => {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	const dayOfMonth = currentTime.getDate();
	const year = currentTime.getFullYear();
	const monthAsString = currentTime.toLocaleString('default', { month: 'long' });
	const dayOfWeek = currentTime.getDay();
	const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
	const dayName = days[dayOfWeek];

	return (
		<div
			className='header-toolbar-pill'
			style={{
				width: dayName === 'WEDNESDAY' ? '240px' : '230px',
				backgroundColor: '#FAC600',
				userSelect: 'none',
			}}>
			<Icon size='lg' icon='AccessTime' className='clock_icon_style' color='dark' />
			<p style={{ margin: 0, color: 'black', fontSize: '11px', lineHeight: 1 }}>
				{moment(currentTime).format('LT')}
			</p>
			<div style={{ borderLeft: '1px solid black' }} />
			<p
				style={{
					margin: 0,
					color: 'black',
					fontSize: '11px',
					lineHeight: 1,
				}}>{`${dayOfMonth}  ${monthAsString}  ${year}  ${dayName} `}</p>
			{/* <div style={{ borderLeft: '1px solid black' }} /> */}
			{/* <Popovers
                    desc={
                        <DatePicker
                            date={currentTime}
                            color={process.env.REACT_APP_PRIMARY_COLOR}
                        />
                    }
                    placement='bottom-end'
                    className='mw-100'
                    trigger='click'>
                    <div style={{ cursor: 'pointer' }}>
                        <Icon size='lg' icon='Event' className='clock_icon_style' color='dark' />
                    </div>
                </Popovers> */}
		</div>
	);
};

export default DateAndTimeComponent;
