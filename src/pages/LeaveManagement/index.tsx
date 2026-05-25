import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AuthContext from '../../contexts/authContext';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubheaderSeparator } from '../../layout/SubHeader/SubHeader';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import Button from '../../components/bootstrap/Button';
import BackButton from '../../components/CustomComponent/Buttons/BackButton';
import UserDetails from '../../components/MasterComponents/Usermanagement/Details/UserDetails';
import UserScheduleCalendarSection from '../../components/MasterComponents/Usermanagement/Details/UserScheduleCalendarSection';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';
import { setUserDetails } from '../../store/user';
import LeaveRequests from './LeaveRequest/LeaveRequests';
import LeaveType from './LeaveType/LeaveType';

const UserManagementPage = () => {
	const { userData } = useContext(AuthContext);
	const accountToggle = useSelector((state: any) => state.authSlice?.account_toggle_button);
	const mode = accountToggle === 'Self' ? 'Self' : 'Admin';
	const isAdminMode = userData?.user_type === 'Admin' && mode === 'Admin';
	const { id } = useParams();
	const dispatch = useDispatch();
	const { showErrorNotification } = useToasterNotification();
	const [isUserLoading, setIsUserLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<any>('Leave Requests');
	const tabsData = useMemo(
		() => (isAdminMode ? ['Leave Requests', 'Leave Types'] : ['Leave Requests']),
		[isAdminMode],
	);
	const tableRef = useRef(null);
	const urlBackup = useRef('');
	const editModalToggle = () => {
		console.log('editModalToggle');
	};
	const fetchUserDetails = () => {
		if (!id) return;
		setIsUserLoading(true);
		authAxios
			.get(`api/users?user=${id}`)
			.then((response) => {
				dispatch(setUserDetails(response.data));
			})
			.catch((error) => {
				showErrorNotification(error);
			})
			.finally(() => setIsUserLoading(false));
	};

	useEffect(() => {
		fetchUserDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	useEffect(() => {
		if (!tabsData.includes(activeTab)) {
			setActiveTab(tabsData[0]);
		}
	}, [tabsData, activeTab]);

	const tabComponents: any = {
		'Leave Requests': (
			<LeaveRequests tableRef={tableRef} urlBackup={urlBackup} editModalToggle={editModalToggle} />
		),
		'Leave Types': <LeaveType />,
	};

	return (
		<PageWrapper title='Leave Management'>
			<SubHeader>
				<SubHeaderLeft>
					<BackButton />
					<SubheaderSeparator />
					<CardTitle tag='div' className='h6'>
						Leave Management
					</CardTitle>
				</SubHeaderLeft>
			</SubHeader>
			<Page container='fluid'>
				<div className='row h-100'>
					<div className='col-xxl-2 col-xl-3 col-lg-4'>
						<Card stretch>
							<CardBody>
								<div className='row g-3'>
									{tabsData.map((tab) => (
										<div key={tab} className='col-12'>
											<Button
												color='secondary'
												className='w-100 p-3'
												isLight={tab !== activeTab}
												onClick={() => setActiveTab(tab)}>
												{tab}
											</Button>
										</div>
									))}
								</div>
							</CardBody>
						</Card>
					</div>
					<div className='col-xxl-10 col-xl-9 col-lg-8' style={{ height: '80vh' }}>
						{tabComponents[activeTab]}
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default UserManagementPage;
