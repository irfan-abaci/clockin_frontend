import React from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import { CardTitle } from '../../components/bootstrap/Card';
import LeaveSettings from './LeaveSettings';

const Index = () => (
	<PageWrapper title='Settings'>
		<SubHeader>
			<SubHeaderLeft>
				<CardTitle tag='div' className='h5'>
					Settings
				</CardTitle>
			</SubHeaderLeft>
		</SubHeader>
		<div className='row mt-3'>
			<div className='col-12'>
				<LeaveSettings />
			</div>
		</div>
	</PageWrapper>
);

export default Index;
