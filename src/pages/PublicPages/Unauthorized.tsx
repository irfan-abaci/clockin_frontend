import React from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
// import HumansWebp from '../../../assets/img/scene8.webp';

const Unauthorized = () => {
	return (
		<PageWrapper title='Error'>
			<Page>
				<div className='row d-flex align-items-center h-100'>
					<div
						className='text-center '
						style={{ fontSize: 'calc(3rem + 3vw)' }}>
						<p style={{
						fontSize: 'calc(3rem + 3vw)',
						background: 'linear-gradient(45deg,rgb(19, 34, 60),rgb(126, 152, 195))',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent', // Ensures text fills with the gradient
						fontWeight: 'bold',
					}}>Unauthorized !</p>
						<p style={{
						fontSize: 'calc(3rem + 3vw)',
						background: 'linear-gradient(45deg,rgb(19, 34, 60),rgb(126, 152, 195))',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent', // Ensures text fills with the gradient
						fontWeight: 'bold',
					}}>You have no privilege to view this page</p>
					</div>
					<div className='col-12 d-flex align-items-baseline justify-content-center'>
						{/* <img
							srcSet={HumansWebp}
							src={Humans}
							alt='Humans'
							style={{ height: '70vh' }}
						/> */}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Unauthorized;
