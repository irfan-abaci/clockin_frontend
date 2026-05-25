import { Store } from 'react-notifications-component';

const showNotification = (
	title: string | JSX.Element,
	message: string | JSX.Element,
	type = 'default',
) => {
	Store.addNotification({
		title,
		message,
		// @ts-ignore
		type,
		insert: 'top',
		container: 'top-right',
		animationOut: ['animate__animated', 'animate__fadeOut'],
		dismiss: {
			duration: 2000,
			pauseOnHover: true,
			onScreen: true,
			showIcon: true,
			waitForAnimation: true,
		},
	});
};

export default showNotification;
