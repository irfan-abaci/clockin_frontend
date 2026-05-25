import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '../../layout/SubHeader/SubHeader';
import { CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import BackButton from '../../components/CustomComponent/Buttons/BackButton';
import UserDetails from '../../components/MasterComponents/Usermanagement/Details/UserDetails';
import UserScheduleCalendarSection from '../../components/MasterComponents/Usermanagement/Details/UserScheduleCalendarSection';
import AbaciLoader from '../../components/AbaciLoader/AbaciLoader';
import UserTodayInfoCard from '../../components/MasterComponents/Usermanagement/Details/UserTodayInfoCard';
import UserDocumentsSection from '../../components/MasterComponents/Usermanagement/Details/UserDocumentsSection';

const UserManagementPage = () => {
	const { id } = useParams();
	const [userReady, setUserReady] = useState(false);

	useEffect(() => {
		setUserReady(false);
	}, [id]);

	const onUserLoadComplete = useCallback(() => setUserReady(true), []);

	/** Only block the page for user profile fetch; calendar shows its own spinner (including month changes). */
	const showPageLoader = Boolean(id) && !userReady;

	return (
		<PageWrapper title='User Details'>
			<SubHeader>
				<SubHeaderLeft>
					<BackButton />
					<SubheaderSeparator />
					<CardTitle tag='div' className='h6'>
						User Management
					</CardTitle>
				</SubHeaderLeft>
			</SubHeader>
			<Page container='fluid' className='position-relative'>
				{showPageLoader && (
					<div
						className='position-absolute top-0 start-0 w-100 d-flex justify-content-center align-items-center bg-body'
						style={{ zIndex: 10, minHeight: '55vh' }}>
						<AbaciLoader />
					</div>
				)}
				<div className='row g-4'>
					<div className='col-12 col-lg-6 mb-4'>
						<div className='mb-4'>
							<UserDetails userId={id} onLoadComplete={onUserLoadComplete} />
						</div>
						<UserTodayInfoCard userId={id} />
					</div>
					{userReady && (
						<div className='col-12 col-lg-6 mb-4'>
							<UserDocumentsSection userId={id} />
						</div>
					)}
					{userReady ? (
						<div className='col-12'>
							<UserScheduleCalendarSection userId={id} />
						</div>
					) : null}
				</div>
			</Page>
		</PageWrapper>
	);
};

export default UserManagementPage;
