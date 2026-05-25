import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import Brand from '../Brand/Brand';
import Navigation, { NavigationLine } from '../Navigation/Navigation';
import User from '../User/User';
import ThemeContext from '../../contexts/themeContext';
import Aside, { AsideBody, AsideFoot, AsideHead } from './Aside';
import AuthContext from '../../contexts/authContext';
import { SelfRoutes, roleWiseRoutes } from '../../routes/RoutesMenu';

const MainSidebar = () => {
	const { userData } = useContext(AuthContext);
	const accountToggle = useSelector((state: any) => state.authSlice?.account_toggle_button);
	const { asideStatus, setAsideStatus } = useContext(ThemeContext);
	const mode = accountToggle || 'Admin';
	const rawType = userData?.user_type;
	const role =
		rawType == null
			? 'Admin'
			: typeof rawType === 'object'
				? String((rawType as { name?: string; role_name?: string }).name ?? (rawType as { role_name?: string }).role_name ?? 'user')
				: String(rawType);

	const navigationMenu =
		mode === 'Self' ? SelfRoutes : roleWiseRoutes[role] || roleWiseRoutes.Admin || {};

	return (
		<Aside >
			<AsideHead>
				<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} isDark={false} />
			</AsideHead>
			<AsideBody>					
		    <Navigation key={mode === 'Self' ? 'self' : role} menu={navigationMenu} id='aside-dashboard'  className='user-select-none' />
			<NavigationLine />
			
			</AsideBody>
			 {/* <div style={{paddingLeft:'20px',marginBottom:'10px'}}>click to support</div> */}
			<AsideFoot>
				
				<User />
			</AsideFoot>
		</Aside>
	);
};

export default MainSidebar;
