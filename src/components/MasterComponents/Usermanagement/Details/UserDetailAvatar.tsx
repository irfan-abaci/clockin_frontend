import React, { useContext, useState } from 'react';
import { Spinner } from 'reactstrap';
import { useSelector } from 'react-redux';
import ImageCell from '../../../CustomComponent/Imagecell';
import ImageCropper from '../../../../helpers/imageCropper';
import Icon from '../../../icon/Icon';
import { authAxiosFileUpload } from '../../../../axiosInstance';
import base64toFile from '../../../../helpers/base64toFile';
import useToasterNotification from '../../../../hooks/useToasterNotification';
import usePermissionHook from '../../../../hooks/userPermissionHook';
import AuthContext from '../../../../contexts/authContext';
import { resolveTenantRouteRole } from '../../../../helpers/roleToggleUtils';

type Props = {
	userId: string | number;
	avatarSource: string | null;
	onUpdated?: () => void;
	size?: number;
};

const UserDetailAvatar = ({ userId, avatarSource, onUpdated, size = 96 }: Props) => {
	const { userData } = useContext(AuthContext);
	const accountToggle = useSelector((state: any) => state.authSlice?.account_toggle_button);
	const mode = accountToggle || 'Admin';
	const canManageUser = usePermissionHook('manage_user');
	const canEdit =
		canManageUser || (resolveTenantRouteRole(userData) === 'Admin' && mode === 'Admin');

	const [uploading, setUploading] = useState(false);
	const [preview, setPreview] = useState<string | null>(null);
	const { showErrorNotification, showSuccessNotification } = useToasterNotification();

	const displayImage = preview ?? avatarSource;

	const handleCropped = async (croppedBase64: string) => {
		setPreview(croppedBase64);
		setUploading(true);
		const formData = new FormData();
		const blob = base64toFile(croppedBase64);
		const file = new File([blob], 'avatar.png', { type: blob.type || 'image/png' });
		formData.append('avatar', file);

		authAxiosFileUpload
			.patch(`api/hr/accounts/${userId}/`, formData)
			.then(() => {
				showSuccessNotification('Profile image updated');
				setPreview(null);
				onUpdated?.();
			})
			.catch((err) => {
				setPreview(null);
				showErrorNotification(err);
			})
			.finally(() => setUploading(false));
	};

	const handleEditClick = () => {
		if (uploading) return;
		const input = document.getElementById('customFile') as HTMLInputElement | null;
		input?.click();
	};

	return (
		<div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
			<div style={{ display: 'none' }}>
				<ImageCropper isProfile updateCompanyLogo={handleCropped} isFromDasboard />
			</div>

			<ImageCell
				key={displayImage || 'no-avatar'}
				fullImage={displayImage}
				size={size}
			/>

			{canEdit && (
				<button
					type='button'
					className='border-0 p-0'
					aria-label='Change profile image'
					onClick={handleEditClick}
					style={{
						position: 'absolute',
						bottom: 0,
						right: 0,
						width: 34,
						height: 34,
						borderRadius: '50%',
						backgroundColor: '#BC922E',
						border: '2px solid #fff',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: uploading ? 'wait' : 'pointer',
						zIndex: 20,
						boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
					}}>
					{uploading ? (
						<Spinner size='sm' color='light' />
					) : (
						<Icon icon='Edit' color='light' size='lg' />
					)}
				</button>
			)}
		</div>
	);
};

export default UserDetailAvatar;
