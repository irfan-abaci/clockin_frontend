import React from 'react';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import { CardTitle } from '../../components/bootstrap/Card';
import ScheduleDetailsComponent from '../../components/MasterComponents/ScheduleComponent/ScheduleDetailsComponent';

const ScheduleComponentDemo = () => {
	return (
		<PageWrapper title='Schedule Component Demo'>
			<SubHeader>
				<SubHeaderLeft>
					<CardTitle tag='div' className='h5'>
						Schedule Component Demo (Dummy Data)
					</CardTitle>
				</SubHeaderLeft>
			</SubHeader>
			<ScheduleDetailsComponent handleComments={() => {}} />
		</PageWrapper>
	);
};

export default ScheduleComponentDemo;
