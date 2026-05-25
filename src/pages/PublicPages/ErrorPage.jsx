import React from 'react';
import { Link } from 'react-router-dom';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';

const ErrorPage = () => {
	return (
		<PageWrapper title='Error'>
			<div className='d-flex flex-column align-items-center justify-content-center vh-100 text-center'>
				<p
					style={{
						fontSize: 'calc(3rem + 3vw)',
						background: 'linear-gradient(45deg,rgb(19, 34, 60),rgb(126, 152, 195))',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent', // Ensures text fills with the gradient
						fontWeight: 'bold',
					}}
				>
					Internal Server Error
				</p>
				<Link to='/login' className='error_navigation mt-3'>
					Back to home
				</Link>
			</div>
		</PageWrapper>
	);
};

export default ErrorPage;
