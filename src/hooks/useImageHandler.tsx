// useImageHandler.ts
import { useEffect, useState } from 'react';
import { authAxios } from '../axiosInstance';
import { baseURL } from '../helpers/baseURL';
// import { baseURL } from './baseURL';

const useImageHandler = (image, type = 'default') => {
	const [imageUrl, setImageUrl] = useState(null);

	useEffect(() => {
		if (!image) return;

		let isMounted = true;
		let objectUrl = null;

		const fetchImage = async () => {
			try {
				let url = `${baseURL}/media/${image}`;

				const response = await authAxios.get(url, {
					responseType: 'blob',
				});

				objectUrl = URL.createObjectURL(response.data);

				if (isMounted) setImageUrl(objectUrl);
			} catch (error) {
				console.error('Error fetching image:', error);
			}
		};

		fetchImage();

		return () => {
			isMounted = false;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [image, type]);

	return imageUrl;
};

export default useImageHandler;