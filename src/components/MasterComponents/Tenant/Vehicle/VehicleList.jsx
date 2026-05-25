import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MaterialTable from '@material-table/core';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../bootstrap/Card';
import useTablestyle from '../../../../hooks/useTablestyles';
import { authAxios } from '../../../../axiosInstance';
import DeleteButton from '../../../CustomComponent/Buttons/DeleteButton';
import usePermissionHook from '../../../../hooks/userPermissionHook';
import StatusButton from '../../../CustomComponent/Buttons/StatusButton';
import EditVehicle from './EditVehicle';
import useToasterNotification from '../../../../hooks/useToasterNotification';
import CustomBadgeWithIcon from '../../../CustomComponent/BadgeWithIcon';
import { userTypesToCapital } from '../../../../helpers/constants';
import EditButton from '../../../CustomComponent/Buttons/EditButton';

const VehicleList = () => {

	const canManageTenant=usePermissionHook('tenant_management');
	const [pageSize, setPageSize] = useState(5);
	const { id } = useParams();
	const tableRef = useRef();
	const { theme, rowStyles, headerStyles } = useTablestyle();
	const urlBackup = useRef('');
	const [editModalShow,setEditModalShow] = useState(false);
	const [dataToBeEdited,setDataToBeEdited] = useState(null);
    const {showErrorNotification}=useToasterNotification()
    const navigate=useNavigate();
	const editModalToggle = (selectedId) => {
		setEditModalShow(!editModalShow)
		setDataToBeEdited(selectedId)
	}

	const staticColumns  = [
		{
			title: 'Access Category',
			field: 'access_category__category',
			render: (rowData) => rowData?.access_category?.category || '----',
		},
		{
			title: 'Vehicle plate number',
			field: 'plate_number',
			render: (rowData) => rowData?.plate_number|| '----',
		},
		{
			title: 'Employee name',
			field: 'linked_user__preferred_name',
			render: (rowData) => rowData?.linked_user?.preferred_name || '----',
		},
		
		{
			title: 'Designation',
			field: 'designation',
			render: (rowData) => rowData?.designation || '----',
		},
		{
			title: 'Plate color',
			field: 'vehicle_plate_color',
			render: (rowData) => rowData?.vehicle_plate_color || '----',
		},
		{
			title: 'Vehicle color',
			field: 'vehicle_color',
			render: (rowData) => rowData?.vehicle_color || '----',
		},
		{
			title: 'User type',
			field: 'user_type',
			render: (rowData) => userTypesToCapital[rowData?.user_type] || '----',
		},
		
		{
			title: 'Contact number',
			field: 'contact_number',
			render: (rowData) => rowData?.contact_number || '----',
		},
		
		
		{
			title: 'Status',
			field: 'meta_data__status',
			render: (rowData) =>
				rowData?.meta_data?.status ? (
					<CustomBadgeWithIcon>{rowData?.meta_data?.status}</CustomBadgeWithIcon>
				) : (
					'----'
				),
		},
	];

	const actionButtons = canManageTenant?[
		{
			title: 'Actions',
			align: 'right',
			removable: false,
			sorting: false,
			grouping: false,
			filtering: false,
			render: (rowData) => (
				<div className='d-flex gap-1 justify-content-end'>
						    <EditButton modalShow={editModalToggle}id={rowData.id} />
						   <StatusButton
							status={rowData.meta_data.status}
							fieldKey='status'
							tableRef={tableRef}
							api={`api/vehicles/${rowData.id}`}
							/>
						    <DeleteButton
								tableRef={tableRef}
								apiEndpoint={`api/vehicles/${rowData.id}`}
								text=''
							/>
				</div>
			),
		},
	]:[];

	const columns=[...staticColumns ,...actionButtons]

	return (
		<>
			
			{editModalShow && (
				<EditVehicle
					isOpen={editModalShow}
					setIsOpen={setEditModalShow}
					tableRef={tableRef}
					vehicleId={dataToBeEdited}
					title='Edit Vehicle'
				/>
			)}
			<Card stretch>
				<CardHeader>
					<CardLabel icon='' iconColor='dark'>
						<CardTitle tag='div' className='h5'>
							Vehicle List
						</CardTitle>
					</CardLabel>
				
				</CardHeader>
				<CardBody isScrollable>
					<Card>
						<CardBody className='d-flex flex-column gap-3'>
						  <div className='material-table-wrapper'>
								<ThemeProvider theme={theme}>
									<MaterialTable
										title=' '
										//@ts-ignore
										columns={columns}
										tableRef={tableRef}
										onChangeRowsPerPage={setPageSize}
										onRowClick={(event, rowData)=>navigate(`/vehicles-details/${rowData.id}`)}

										data={(query) => {
											return new Promise((resolve, reject) => {
												let orderBy = '';
												if (query.orderBy) {
													orderBy =
														query.orderDirection === 'asc'
															? `&ordering=-${String(query.orderBy?.field)}`
															: `&ordering=${String(query.orderBy?.field)}`;
												}
												const url = `api/vehicles?tenant_id=${id}&limit=${query.pageSize}&offset=${query.pageSize * query.page}&search=${query.search}${orderBy}`;
												urlBackup.current = url;
												authAxios
													.get(url)
													.then((response) => {
														resolve({
															data: response.data?.results,
															page: query.page,
															totalCount: response.data?.count,
														});
													})
													.catch((error) => {
														showErrorNotification(error)
														// eslint-disable-next-line prefer-promise-reject-errors
														reject({
															data: [],
															page: query.page,
															totalCount: 0,
														});
													});
											});
										}}
										// data={[{}]}
										options={{
											headerStyle: headerStyles(),
											rowStyle: rowStyles(),
											actionsColumnIndex: -1,
											debounceInterval: 500,
											filtering: false,
											search: true,
											pageSize,
										}}
										// actions={[
										// 	{
										// 		icon: FilterListIcon,
										// 		tooltip: filterEnabled ? 'Disable Filter' : 'Enable Filter',
										// 		isFreeAction: true,
										// 		onClick: () => {
										// 			setFilterEnabled((state) => !state);
										// 		},
										// 	},
										// ]}
									/>
								</ThemeProvider>
							</div>
						</CardBody>
					</Card>
				</CardBody>
			</Card>
		</>
	);
};
export default VehicleList;
