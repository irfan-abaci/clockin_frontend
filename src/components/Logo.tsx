import React, { FC } from 'react';
import PropTypes from 'prop-types';
import svgDark from '../assets/logo_light.png';
import svgLight from '../assets/logo_light.png'

interface ILogoProps {
	width?: number;
	height?: number;
	dark?: boolean;
}
const Logo: FC<ILogoProps> = ({ width = 150, height = 89, dark = true }) => {
	return (
		<img
			src={dark ? svgDark : svgLight}
			alt="HiLITE"
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
	dark:true
};

export default Logo;
