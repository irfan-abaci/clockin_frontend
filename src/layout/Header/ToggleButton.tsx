import React, { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/icon/Icon';
import AuthContext from '../../contexts/authContext';
import { updateToggleButton } from '../../store/auth';

const USER_SELF_HOME = '/dashboard';
const adminLandingByRole: Record<string, string> = {
	Admin: '/',
	user: '/',
};

const ToggleButton = () => {
	const { userData } = useContext(AuthContext);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const togglerButton = useSelector((state: any) => state.authSlice.account_toggle_button);
	const mode = togglerButton || 'Admin';
	const role = userData?.user_type || 'Admin';

	const isAdminUser = userData?.user_type === 'Admin';

	useEffect(() => {
		if (!isAdminUser) return;
		if (mode !== 'Self' && mode !== 'Admin') {
			dispatch(updateToggleButton('Admin'));
		}
	}, [dispatch, isAdminUser, mode]);

	if (!isAdminUser) {
		return null;
	}

	const handleSelectToggle = (button: 'Self' | 'Admin', route: string) => {
		dispatch(updateToggleButton(button));
		navigate(route);
	};

	const isSelf = mode === 'Self';

	return (
		<div className='role-switch' role='radiogroup' aria-label='Switch between self service and admin console'>
			<div className='role-switch-track header-toolbar-pill'>
				<div
					className={classNames('role-switch-thumb', { 'role-switch-thumb--admin': !isSelf })}
					aria-hidden
				/>
				<button
					type='button'
					className={classNames('role-switch-option', { 'is-active': isSelf })}
					aria-checked={isSelf}
					role='radio'
					onClick={() => handleSelectToggle('Self', USER_SELF_HOME)}>
					<span className={classNames('role-switch-option-icon', { 'is-active': isSelf })}>
						<Icon icon='AccountCircle' size='lg' />
					</span>
					<span className='role-switch-option-label'>Self</span>
				</button>
				<button
					type='button'
					className={classNames('role-switch-option', { 'is-active': !isSelf })}
					aria-checked={!isSelf}
					role='radio'
					onClick={() => handleSelectToggle('Admin', adminLandingByRole[role] || '/')}>
					<span className={classNames('role-switch-option-icon', { 'is-active': !isSelf })}>
						<Icon icon='AdminPanelSettings' size='lg' />
					</span>
					<span className='role-switch-option-label'>Admin</span>
				</button>
			</div>
		</div>
	);
};

export default ToggleButton;
