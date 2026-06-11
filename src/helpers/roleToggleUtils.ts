const ROLE_TOGGLE_TYPES = new Set(['Admin', 'Manager', 'HR']);
const USER_HOME_PATH = '/leave-requests';

export const getUserHomePath = (): string => USER_HOME_PATH;

export const getHomePathForUserType = (userType: string | null | undefined): string =>
	String(userType ?? '').toLowerCase() === 'user' ? USER_HOME_PATH : '/';

export const canUseRoleToggle = (userType: string | null | undefined): boolean =>
	ROLE_TOGGLE_TYPES.has(String(userType ?? ''));

export const isPrivilegedToggleMode = (
	userType: string | null | undefined,
	mode: string,
): boolean => canUseRoleToggle(userType) && mode !== 'Self';

export const getPrivilegedToggleLabel = (userType: string | null | undefined): string => {
	const role = String(userType ?? '');
	return ROLE_TOGGLE_TYPES.has(role) ? role : 'Admin';
};

export const getEffectiveUserTypeForRoutes = (
	userType: string | null | undefined,
	mode: string,
): string | null | undefined => {
	if (canUseRoleToggle(userType) && mode === 'Self') {
		return 'user';
	}
	return userType;
};
