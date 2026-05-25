import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import Card, {
	CardBody,
	CardTitle,
} from '../../components/bootstrap/Card';
import Profile from "../../assets/img/Avatar.svg"
import AuthContext from '../../contexts/authContext';
import ImageCropper from '../../helpers/imageCropper';
import Icon from '../../components/icon/Icon';
import { authAxios } from '../../axiosInstance';
import Avatar from '../../components/Avatar';
import useToasterNotification from '../../hooks/useToasterNotification';
import useImageHandler from '../../hooks/useImageHandler';


const ProfileAvatar = () => {
	const [image, setImage] = useState(null)
	const [waitingForAxios, setWaitingForAxios] = useState(false)
	const { userData, setUserData } = useContext(AuthContext);
	const { showErrorNotification } = useToasterNotification()
	const updateAvatar = (updateImage: any) => {
		setWaitingForAxios(true);
		const url = `api/users/${userData?.id}`;
		const payload = {
			user_data: { user_image: updateImage }
		}
		authAxios
			.patch(url, payload)
			.then((res) => {
				setWaitingForAxios(false);
				setUserData((prev: any) => ({ ...prev, user_data: { ...prev.user_data, user_image: res.data.user_data.user_image } }))
			})
			.catch((error) => {
				setWaitingForAxios(false);
				setImage(null)
				showErrorNotification(error)

			});


	}
	const handleButtonClick = () => {
		if (!waitingForAxios) {
			const input = document.getElementById("customFile");
			if (input !== null) {
				input.click();
			}
		}

	};
	const getAvatarSrc = () => {
		if (userData?.user_data?.user_image) {
			return useImageHandler(userData?.user_data?.user_image, '') || Profile
		}
		if (image) {
			return image;
		}
		return Profile;
	};

	// Use this function to get the source
	const avatarSrc = getAvatarSrc();



	return (
		<Card className='shadow-3d-info prevent-userselect'>
			<div style={{ display: "none" }} >
				<ImageCropper
					isProfile
					updateCompanyLogo={updateAvatar}
					isFromDasboard
				/>
			</div>
			<CardBody style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: "40px" }}>
				<div className='text-center position-relative mb-4' >
					{/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
					<div onClick={() => handleButtonClick()} className='circle-file-upload-button'>
						{
							waitingForAxios ?
								<Spinner size='sm' color='white' />
								:
								<Icon icon='Edit' color='light' size='lg' />
						}
					</div>

					<Avatar srcSet={avatarSrc} src={avatarSrc} size={200} />
				</div>
				{/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}

				<CardTitle tag='div' className='h2'>
					{userData?.preferred_name || '----'}
				</CardTitle>
				<h5>{userData?.email || '----'}</h5>


			</CardBody>

		</Card>
	);
};

export default ProfileAvatar;