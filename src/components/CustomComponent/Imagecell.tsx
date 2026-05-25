import React from 'react';
import no_image from '../../assets/img/Noimage.png';
import useImageHandler from '../../hooks/useImageHandler';
import { isBase64Image, normalizeMediaPath } from '../../helpers/functions';
import urlMaker from '../../helpers/UrlMaker';

type ImageCellProps = {
	fullImage?: string | null;
	size?: number;
};

const ImageCell = ({ fullImage, size = 50 }: ImageCellProps) => {
	const isDataUrl = Boolean(fullImage && isBase64Image(fullImage));
	const mediaPath = isDataUrl ? null : normalizeMediaPath(fullImage);
	const blobUrl = useImageHandler(mediaPath, 'avatars');

	const imageSrc = isDataUrl
		? String(fullImage)
		: blobUrl
			? blobUrl
			: !fullImage
				? no_image
				: /^https?:\/\//i.test(String(fullImage))
					? String(fullImage)
					: urlMaker(String(fullImage), 'avatars');

	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				overflow: 'hidden',
				border: '1px solid #e0e0e0',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#fafafa',
				boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
			}}>
			<img
				src={imageSrc}
				alt=''
				style={{
					width: '100%',
					height: '100%',
					objectFit: mediaPath ? 'cover' : 'contain',
					borderRadius: 6,
				}}
				onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
					const target = e.currentTarget;
					target.onerror = null;
					target.src = no_image;
				}}
			/>
		</div>
	);
};

export default ImageCell;
