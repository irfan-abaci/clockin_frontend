import React, { useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft } from '../../layout/SubHeader/SubHeader';
import Card, { CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import LeaveRequests, { type LeaveTypeTableFilter } from './LeaveRequest/LeaveRequests';

const LeaveRequestsPage = () => {
	const tableRef = useRef(null);
	const urlBackup = useRef('');
	const [searchParams, setSearchParams] = useSearchParams();

	const leaveTypeFilter = useMemo((): LeaveTypeTableFilter | null => {
		const id = searchParams.get('leave_type');
		if (!id) return null;
		const parsedId = Number(id);
		if (Number.isNaN(parsedId)) return null;
		const name = searchParams.get('leave_type_name')?.trim();
		return {
			id: parsedId,
			name: name || 'Leave type',
		};
	}, [searchParams]);

	const clearLeaveTypeFilter = () => {
		setSearchParams({}, { replace: true });
	};

	return (
		<PageWrapper title='Leave Requests'>
			<SubHeader>
				<SubHeaderLeft>
					<CardTitle tag='div' className='h5'>
						Leave Requests
					</CardTitle>
				</SubHeaderLeft>
			</SubHeader>
			<Page container='fluid'>
				<LeaveRequests
					tableRef={tableRef}
					urlBackup={urlBackup}
					editModalToggle={() => {}}
					leaveTypeFilter={leaveTypeFilter}
					onClearLeaveTypeFilter={clearLeaveTypeFilter}
				/>
			</Page>
		</PageWrapper>
	);
};

export default LeaveRequestsPage;
