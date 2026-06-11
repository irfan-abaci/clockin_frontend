import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../layout/SubHeader/SubHeader';
import Card, { CardTitle } from '../../components/bootstrap/Card';
import Page from '../../layout/Page/Page';
import AddButton from '../../components/CustomComponent/Buttons/AddButton';
import { allRoutesObject } from '../../routes/RoutesMenu';
import AddLeaveType from './LeaveType/AddLeaveType';
import LeaveType from './LeaveType/LeaveType';

const LeaveTypesPage = () => {
	const navigate = useNavigate();
	const tableRef = useRef(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editId, setEditId] = useState<any>(null);

	const openAddModal = () => {
		setEditId(null);
		setIsFormOpen(true);
	};

	const editModalToggle = (id: any) => {
		setEditId(id);
		setIsFormOpen(true);
	};

	const handleLeaveTypeRowClick = (rowData: any) => {
		const rowId = rowData?.id;
		if (rowId == null) return;
		const name = String(rowData?.name || 'Leave type').trim() || 'Leave type';
		const params = new URLSearchParams({
			leave_type: String(rowId),
			leave_type_name: name,
		});
		navigate(`${allRoutesObject.LeaveRequests.path}?${params.toString()}`);
	};

	return (
		<>
			{isFormOpen && (
				<AddLeaveType
					isOpen={isFormOpen}
					setIsOpen={setIsFormOpen}
					tableRef={tableRef}
					title={editId ? 'Edit Leave Type' : 'Add Leave Type'}
					id={editId}
				/>
			)}
			<PageWrapper title='Leave Types'>
				<SubHeader>
					<SubHeaderLeft>
						<CardTitle tag='div' className='h5'>
							Leave Types
						</CardTitle>
					</SubHeaderLeft>
					<SubHeaderRight>
						<AddButton name='Add Leave Type' modalShow={openAddModal} />
					</SubHeaderRight>
				</SubHeader>
				<Page container='fluid'>
					<LeaveType
						tableRef={tableRef}
						editModalToggle={editModalToggle}
						onRowClick={handleLeaveTypeRowClick}
					/>
				</Page>
			</PageWrapper>
		</>
	);
};

export default LeaveTypesPage;
