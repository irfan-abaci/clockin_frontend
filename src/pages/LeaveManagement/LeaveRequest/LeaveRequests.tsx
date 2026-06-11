import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import MaterialTable from '@material-table/core';
import { ThemeProvider } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useSelector } from 'react-redux';
import { authAxios } from '../../../axiosInstance';
import useTablestyle from '../../../hooks/useTablestyles';
import { formatFilters } from '../../../helpers/functions';
import useToasterNotification from '../../../hooks/useToasterNotification';
import { statusColorCodes } from '../../../helpers/constants';
import AuthContext from '../../../contexts/authContext';
import AcceptandRejectBasedOnStatus from '../../../components/CustomComponent/Buttons/AcceptandRejectBasedOnStatus';
import CustomBadge from '../../../components/CustomComponent/CustomBadge';
import EditButton from '../../../components/CustomComponent/Buttons/EditButton';
import Card, { CardActions, CardBody, CardHeader, CardTitle } from '../../../components/bootstrap/Card';
import AddButton from '../../../components/CustomComponent/Buttons/AddButton';
import Button from '../../../components/bootstrap/Button';
import AddLeaveRequest from './AddLeaveRequest';
import LeaveApprovalTimelineModal, {
	type LeaveApprovalTimelineContext,
} from './LeaveApprovalTimelineModal';
import LeaveRequestUploadDocumentModal, {
	type LeaveRequestUploadContext,
} from './LeaveRequestUploadDocumentModal';
import LeaveRequestViewDocumentsModal, {
	type LeaveRequestViewDocumentsContext,
} from './LeaveRequestViewDocumentsModal';
import {
	hasLeaveDocuments,
	resolveLeaveDocumentsFromRow,
} from './leaveRequestDocuments';
import LeaveRequestsTodaySummary from './LeaveRequestsTodaySummary';
import { isPrivilegedToggleMode } from '../../../helpers/roleToggleUtils';

export type LeaveTypeTableFilter = {
	id: number;
	name: string;
};

function leaveRequestRowStatus(row: any): string | undefined {
	return (
		row?.status ??
		row?.approval_status ??
		row?.state ??
		row?.meta_data?.status ??
		undefined
	);
}

type LeaveRequestsProps = {
	tableRef: React.MutableRefObject<any>;
	urlBackup: React.MutableRefObject<string>;
	editModalToggle: (id: any) => void;
	leaveTypeFilter?: LeaveTypeTableFilter | null;
	onClearLeaveTypeFilter?: () => void;
};

const LeaveRequests = ({
	tableRef,
	urlBackup,
	editModalToggle,
	leaveTypeFilter = null,
	onClearLeaveTypeFilter,
}: LeaveRequestsProps) => {
	const { userData } = useContext(AuthContext);
	const accountToggle = useSelector((state: any) => state.authSlice?.account_toggle_button);
	const mode = accountToggle === 'Self' ? 'Self' : 'Admin';
	const isPrivilegedMode = isPrivilegedToggleMode(userData?.user_type, mode);
	const isAdminMode = userData?.user_type === 'Admin' && mode === 'Admin';
	const isSelfMode =
		userData?.user_type === 'user' ||
		(userData?.user_type === 'Admin' && mode === 'Self');
	const userIdFilter = isSelfMode && userData?.id ? `user=${userData.id}` : '';
	const leaveTypeFilterParam =
		leaveTypeFilter?.id != null ? `leave_type=${leaveTypeFilter.id}` : '';
	const scopeFilters = [userIdFilter, leaveTypeFilterParam].filter(Boolean).join('&');
	/** Accept/Reject for Admin, Manager, and HR in privileged mode (not Self / user view) */
	const showPrivilegedAcceptReject = isPrivilegedMode;

	const [filterEnabled, setFilterEnabled] = useState(false);
	const [pageSize, setPageSize] = useState(5);
	const [sortState, setSortState] = useState({ orderBy: null, orderDirection: 'asc' });
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editId, setEditId] = useState<any>(null);
	const [timelineOpen, setTimelineOpen] = useState(false);
	const [timelineContext, setTimelineContext] = useState<LeaveApprovalTimelineContext | null>(
		null,
	);
	const [uploadOpen, setUploadOpen] = useState(false);
	const [uploadContext, setUploadContext] = useState<LeaveRequestUploadContext | null>(null);
	const [viewDocsOpen, setViewDocsOpen] = useState(false);
	const [viewDocsContext, setViewDocsContext] = useState<LeaveRequestViewDocumentsContext | null>(
		null,
	);
	const [summaryRefreshKey, setSummaryRefreshKey] = useState(0);

	const openApprovalTimeline = useCallback((rowData: any) => {
		setTimelineContext({
			leaveRequestId: rowData?.id,
			employeeName: rowData?.user?.name,
			leaveTypeName: rowData?.leave_type?.name,
			fromDate: rowData?.from_date,
			toDate: rowData?.to_date,
			overallStatus: leaveRequestRowStatus(rowData),
		});
		setTimelineOpen(true);
	}, []);
	const { theme, rowStyles, headerStyles } = useTablestyle();
	const { showErrorNotification } = useToasterNotification();
	const openAddModal = () => {
		setEditId(null);
		setIsFormOpen(true);
	};
	const handleEditModalToggle = useCallback((id: any) => {
		setEditId(id);
		setIsFormOpen(true);
	}, []);

	const leaveRequestDocuments = useCallback(
		(rowData: any) => resolveLeaveDocumentsFromRow(rowData),
		[],
	);

	const openViewDocuments = useCallback((rowData: any) => {
		setViewDocsContext({
			leaveRequestId: rowData?.id,
			employeeName: rowData?.user?.name,
			leaveTypeName: rowData?.leave_type?.name,
			documents: leaveRequestDocuments(rowData),
		});
		setViewDocsOpen(true);
	}, [leaveRequestDocuments]);

	const openUploadDocument = useCallback((rowData: any) => {
		setUploadContext({
			id: rowData?.id,
			employeeName: rowData?.user?.name,
			leaveTypeName: rowData?.leave_type?.name,
		});
		setUploadOpen(true);
	}, []);

	const refreshTable = useCallback(() => {
		tableRef?.current?.onQueryChange?.();
		setSummaryRefreshKey((key) => key + 1);
	}, [tableRef]);

	useEffect(() => {
		tableRef?.current?.onQueryChange?.();
	}, [leaveTypeFilter, tableRef]);

	const staticColumns = useMemo(
		() => [
			{
				title: 'Employee Name',
				field: 'user__name',
				render: (rowData: any) => rowData?.user?.name || '----',
			},
			{
				title: 'Leave Type',
				field: 'leave_type__name',
				render: (rowData: any) =>
					rowData?.leave_type?.name || '----',
			},
			{
				title: 'From Date',
				field: 'from_date',
				render: (rowData: any) => rowData?.from_date || '----',
			},
			{
				title: 'To Date',
				field: 'to_date',
				render: (rowData: any) => rowData?.to_date || '----',
			},
			{
				title: 'From Session',
				field: 'from_session',
				render: (rowData: any) => rowData?.from_session || '----',
			},
			{
				title: 'To Session',
				field: 'to_session',
				render: (rowData: any) => rowData?.to_session || '----',
			},
			{
				title: 'Reason',
				field: 'reason',
				sorting: false,
				render: (rowData: any) => rowData?.reason || '----',
			},
			{
				title: 'Status',
				field: 'status',
				render: (rowData: any) => {
					const status = leaveRequestRowStatus(rowData);
					if (!status) return '----';
					return (
						<CustomBadge
							color={statusColorCodes?.[String(status).toUpperCase()] || '#E4E4E4'}>
							{status}
						</CustomBadge>
					);
				},
			},
		],
		[],
	);
	
	const columns = useMemo(() => {
		const actionColumn = {
			title: 'Actions',
			align: 'right',
			removable: false,
			sorting: false,
			grouping: false,
			filtering: false,
			render: (rowData: any) => (
				<div className='d-flex flex-row flex-nowrap gap-1 justify-content-end align-items-center'>
					{showPrivilegedAcceptReject && (
						<AcceptandRejectBasedOnStatus
							id={rowData.id}
							tableRef={tableRef}
							url='/api/hr/leave-requests'
							status={leaveRequestRowStatus(rowData) ?? ''}
						/>
					)}
					<Tooltip arrow title='View approval status' placement='top'>
						<Button
							type='button'
							color='warning'
							isLight
							size='sm'
							icon='Visibility'
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								openApprovalTimeline(rowData);
							}}
						/>
					</Tooltip>
					{hasLeaveDocuments(rowData) ? (
						<Tooltip arrow title='View documents' placement='top'>
							<Button
								type='button'
								color='success'
								isLight
								size='sm'
								icon='Description'
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									openViewDocuments(rowData);
								}}
							/>
						</Tooltip>
					) : null}
					<Tooltip arrow title='Upload document' placement='top'>
						<Button
							type='button'
							color='info'
							isLight
							size='sm'
							icon='Upload'
							onClick={(e: React.MouseEvent) => {
								e.stopPropagation();
								openUploadDocument(rowData);
							}}
						/>
					</Tooltip>
					<EditButton modalShow={handleEditModalToggle} id={rowData.id} />
				</div>
			),
		};
		return [...staticColumns, actionColumn];
	}, [
		staticColumns,
		showPrivilegedAcceptReject,
		tableRef,
		handleEditModalToggle,
		openUploadDocument,
		openApprovalTimeline,
		openViewDocuments,
	]);

	return (
		<>
			<LeaveApprovalTimelineModal
				isOpen={timelineOpen}
				setIsOpen={setTimelineOpen}
				context={timelineContext}
			/>
			<LeaveRequestViewDocumentsModal
				isOpen={viewDocsOpen}
				setIsOpen={setViewDocsOpen}
				context={viewDocsContext}
				onDocumentsChanged={refreshTable}
			/>
			<LeaveRequestUploadDocumentModal
				isOpen={uploadOpen}
				setIsOpen={setUploadOpen}
				context={uploadContext}
				onUploaded={refreshTable}
			/>
			{isFormOpen && (
				<AddLeaveRequest
					isOpen={isFormOpen}
					setIsOpen={setIsFormOpen}
					tableRef={tableRef}
					title={editId ? 'Edit Leave Request' : 'Add Leave Request'}
					id={editId}
				/>
			)}
			{isPrivilegedMode ? (
				<LeaveRequestsTodaySummary refreshKey={summaryRefreshKey} />
			) : null}
			<Card stretch>
				<CardHeader>
					<div className='d-flex flex-wrap align-items-center gap-2'>
						{/* <CardTitle tag='div' className='h6 mb-0'>
							Leave Requests
						</CardTitle> */}
						{leaveTypeFilter ? (
							<Chip
								size='small'
								label={`Leave type: ${leaveTypeFilter.name}`}
								onDelete={onClearLeaveTypeFilter}
								color='primary'
								variant='outlined'
							/>
						) : null}
					</div>
					<CardActions>
						{!isAdminMode && <AddButton name='Add Leave Request' modalShow={openAddModal} />}
					</CardActions>
				</CardHeader>
				<CardBody>
					<div className='material-table-wrapper'>
						<ThemeProvider theme={theme}>
							<MaterialTable
					key={`${sortState.orderBy ?? 'no-order'}-${sortState.orderDirection}`}
					title=' '
					columns={columns as any}
					tableRef={tableRef}
					// onChangeRowsPerPage={setPageSize}
					onOrderChange={(orderBy, orderDirection) => {
						setSortState({ orderBy, orderDirection });
					}}
					data={(query) =>
						new Promise((resolve, reject) => {
							let orderBy = '';
							const otherFilters = formatFilters(query.filters);
							if (query.orderBy) {
								orderBy =
									query.orderDirection === 'asc'
										? `&ordering=-${String(query.orderBy?.field)}`
										: `&ordering=${String(query.orderBy?.field)}`;
							}

							const url = `/api/hr/leave-requests?${scopeFilters ? `${scopeFilters}&` : ''}limit=${query.pageSize}&offset=${
								query.pageSize * query.page
							}&search=${query.search}${orderBy}&${otherFilters}`;

							urlBackup.current = url;
							authAxios
								.get(url)
								.then((response) => {
									const leaveRequests = response?.data?.results || [];
									resolve({
										data: leaveRequests,
										page: query.page,
										totalCount: response?.data?.count || 0,
									});
								})
								.catch((error) => {
									showErrorNotification(error);
									reject({
										data: [],
										page: query.page,
										totalCount: 0,
									});
								});
						})
					}
					actions={[
						{
							icon: FilterListIcon,
							tooltip: filterEnabled ? 'Disable Filter' : 'Enable Filter',
							isFreeAction: true,
							onClick: () => {
								setFilterEnabled((state) => !state);
							},
						},
					]}
					options={{
						headerStyle: headerStyles(),
						rowStyle: rowStyles(),
						debounceInterval: 500,
						filtering: filterEnabled,
						search: true,
						pageSize,
					}}
							/>
						</ThemeProvider>
					</div>
				</CardBody>
			</Card>
		</>
	);
};

/* eslint-disable react/forbid-prop-types */
LeaveRequests.propTypes = {
	tableRef: PropTypes.object.isRequired,
	urlBackup: PropTypes.object.isRequired,
	editModalToggle: PropTypes.func.isRequired,
	leaveTypeFilter: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	}),
	onClearLeaveTypeFilter: PropTypes.func,
};
/* eslint-enable react/forbid-prop-types */

export default LeaveRequests;
