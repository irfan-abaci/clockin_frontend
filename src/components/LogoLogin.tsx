import React, { FC } from 'react';
import PropTypes from 'prop-types';
import svgDark from '../assets/LoginLogo.svg';
import svgLight from '../assets/LoginLogo.svg'
import useDarkMode from '../hooks/useDarkMode';

interface ILogoProps {
	width?: number;
	height?: number;
	
}
const Logo: FC<ILogoProps> = ({ width = 150, height = 89 }) => {
	const { themeStatus } = useDarkMode();
	return (
		<img
			src={themeStatus !== 'dark' ? svgDark : svgLight}
			alt="Hilite"
			width={width}
			height={height}
		/>
		
	);
};
Logo.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
};
Logo.defaultProps = {
	width: 2155,
	height: 854,
};

export default Logo;
