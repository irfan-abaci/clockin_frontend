import { TColor } from '../../type/color-type';

export interface IColors {
	[key: string]: {
		name: TColor;
		code: string;
	};
}
const COLORS: IColors = {
	PRIMARY: {
		name: 'primary',
		code: String(import.meta.env.VITE_API_PRIMARY_COLOR),
	},
	SECONDARY: {
		name: 'secondary',
		code: String(import.meta.env.VITE_API_SECONDARY_COLOR),
	},
	SUCCESS: {
		name: 'success',
		code: String(import.meta.env.VITE_API_SUCCESS_COLOR),
	},
	INFO: {
		name: 'info',
		code: String(import.meta.env.VITE_API_INFO_COLOR),
	},
	WARNING: {
		name: 'warning',
		code: String(import.meta.env.VITE_API_WARNING_COLOR),
	},
	DANGER: {
		name: 'danger',
		code: String(import.meta.env.VITE_API_DANGER_COLOR),
	},
	DARK: {
		name: 'dark',
		code: String(import.meta.env.VITE_API_DARK_COLOR),
	},
	LIGHT: {
		name: 'light',
		code: String(import.meta.env.VITE_API_LIGHT_COLOR),
	},
};

export function getColorNameWithIndex(index: number) {
	/*
	 * The size has been reduced by one so that the LIGHT color does not come out.
	 */
	// @ts-ignore
	return COLORS[Object.keys(COLORS)[index % (Object.keys(COLORS).length - 1)]].name;
}

export default COLORS;
