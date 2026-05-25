import React from 'react';
import PropTypes from 'prop-types';

const CustomBadgeWithIcon = ({ children }) => {
	const colors = {
		Active: { bgcolor: '#46BCAA', icon: '#46BCAA25' },
		In:{ bgcolor: '#B88F2D', icon: '#F1F0E9' },
		Out:{ bgcolor: '#B88F2D', icon: '#F1F0E9' },
		Unknown:{ bgcolor: '#B88F2D', icon: '#B88F2D20' },
		Inactive:{ bgcolor: '#F35421', icon: '#F3542520' },
		Blocked:{ bgcolor: '#F35421', icon: '#F3542520' },
		Deleted:{ bgcolor: '#d33', icon: '#d3320' },
	};
	return (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				backgroundColor: colors[children].icon,
				color: colors[children].bgcolor,
				height: '20px',
				padding: '0 10px',
				fontSize: '12px',
				fontWeight: 'bold',
				borderRadius: '12px',
				userSelect: 'none',
				whiteSpace: 'nowrap',
			}}>
			{/* Circular Icon */}
			<span
				style={{
					display: 'inline-block',
					width: '10px',
					height: '10px',
					borderRadius: '50%',
					border: `3px solid ${colors[children].bgcolor}`,
					marginRight: '8px',
				}}/>
			{/* Badge Text */}
			{children}
		</span>
	);
};
/* eslint-disable react/forbid-prop-types */

CustomBadgeWithIcon.propTypes = {
	children: PropTypes.any.isRequired,
};
/* eslint-enable react/forbid-prop-types */

export default CustomBadgeWithIcon;
