import React, { useContext } from 'react';
import {  useNavigate } from 'react-router-dom';
import Header, { HeaderLeft } from './Header';
import AuthContext from '../../contexts/authContext';
import ProfilePic from "../../assets/img/Avatar.svg"
import urlMaker from '../../helpers/UrlMaker';
import MainHeaderRight from './HeaderRight';
import Avatar from '../../components/Avatar';
import {  userTypesToCapital } from '../../helpers/constants';
import useImageHandler from '../../hooks/useImageHandler';


const MainHeader = () => {
	const { userData } = useContext(AuthContext);
	const navigate = useNavigate()
	// const getAvatarSrc = () => {
	// 	if (userData?.thumbnail) {
	// 		return urlMaker(userData.thumbnail, "avatars/thumbnails");
	// 	}
	// 	return ProfilePic; // Fallback, in case none of the conditions are met
	// };

	// Use this function to get the source
	const avatarSrc = useImageHandler(userData?.user_data?.user_image, '')|| ProfilePic;


	return (
			<Header>
				<HeaderLeft>
					<div className='col d-flex align-items-center'>
					{/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
					<div
					className='me-3'
					style={{ cursor: "pointer" }}
					onClick={() => navigate('/profile')}
					>
					<Avatar
						srcSet={avatarSrc}
						src={avatarSrc}
						size={48}
						color='primary'
					/>
					</div>
					{/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}

						{/* <div className='prevent-userselect'>
							<div className='fw-bold fs-6 mb-0'>{userData?.preferred_name||'HiLITE'}</div>
							<div className='text-muted'>
								<small>{userTypesToCapital[userData?.user_type]}</small>
							</div>
						</div> */}
					</div>
				</HeaderLeft>
				<MainHeaderRight />

			</Header>
	);
};

export default MainHeader;
