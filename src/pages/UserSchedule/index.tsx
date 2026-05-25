import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AuthContext from '../../contexts/authContext';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import { CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import UserDetails from '../../components/MasterComponents/Usermanagement/Details/UserDetails';
import UserScheduleCalendarSection from '../../components/MasterComponents/Usermanagement/Details/UserScheduleCalendarSection';
import AbaciLoader from '../../components/AbaciLoader/AbaciLoader';
import UserTodayInfoCard from '../../components/MasterComponents/Usermanagement/Details/UserTodayInfoCard';

/**
 * Self-service view: same layout as admin user-details (`/user-details/:id`) but always
 * for the logged-in account (company user or admin with role toggle set to Self).
 */
const UserSchedulePage = () => {
	const { userData } = useContext(AuthContext);
	const selfId = useMemo(() => {
		const id = userData?.id;
		if (id == null || id === '') return '';
		return String(id);
	}, [userData?.id]);

	const [userReady, setUserReady] = useState(false);

	useEffect(() => {
		setUserReady(false);
	}, [selfId]);

	const onUserLoadComplete = useCallback(() => setUserReady(true), []);

	const showPageLoader = Boolean(selfId) && !userReady;

	if (!selfId) {
		return (
			<PageWrapper title='My schedule'>
				<Page container='fluid' className='d-flex justify-content-center align-items-center py-5'>
					<AbaciLoader />
				</Page>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper title='My schedule'>
			<SubHeader>
				<SubHeaderLeft>
					<CardTitle tag='div' className='h6'>
						My schedule
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
				<div className='row'>
					<div className='col-12 mb-4'>
						<UserDetails userId={selfId} onLoadComplete={onUserLoadComplete} />
					</div>
					<div className='col-12 mb-4'>
						<UserTodayInfoCard userId={selfId} />
					</div>
					{userReady ? (
						<div className='col-12'>
							<UserScheduleCalendarSection userId={selfId} />
						</div>
					) : null}
				</div>
			</Page>
		</PageWrapper>
	);
};

export default UserSchedulePage;
