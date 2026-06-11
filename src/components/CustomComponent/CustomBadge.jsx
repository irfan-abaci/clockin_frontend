import React from 'react';
import PropTypes from 'prop-types';

const LIGHT_BADGE_COLORS = new Set(['#E4E4E4', '#FFD600']);

const CustomBadge = ({ children, color }) => {
	const badgeColor = color || '#E4E4E4';

	return (
		<span
			style={{
				backgroundColor: badgeColor,
				color: LIGHT_BADGE_COLORS.has(badgeColor) ? 'black' : 'white',
				height: '20px',
				padding: '3px 7px 3px 7px',
				fontSize: '9px',
				fontWeight: 'bold',
				borderRadius: '10px',
				userSelect: 'none',
			}}
			// eslint-disable-next-line react/jsx-props-no-spreading
		>
			{children}
		</span>
	);
};
/* eslint-disable react/forbid-prop-types */
CustomBadge.propTypes = {
	children: PropTypes.any.isRequired,
	color: PropTypes.any.isRequired,
};
/* eslint-enable react/forbid-prop-types */
export default CustomBadge;
