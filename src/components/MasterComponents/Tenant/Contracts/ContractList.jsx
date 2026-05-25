import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MaterialTable from '@material-table/core';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../bootstrap/Card';
import useTablestyle from '../../../../hooks/useTablestyles';
import AddButton from '../../../CustomComponent/Buttons/AddButton';
import DeleteButton from '../../../CustomComponent/Buttons/DeleteButton';
import usePermissionHook from '../../../../hooks/userPermissionHook';
import EditContract from './EditContract';
import AddContract from './AddContract';
import { authAxios } from '../../../../axiosInstance';
import useToasterNotification from '../../../../hooks/useToasterNotification';

const ContractList = () => {
	const canManageTenant=usePermissionHook('tenant_management');
	const [pageSize, setPageSize] = useState(5);
	const { id } = useParams();
	const tableRef = useRef();
	const { theme, rowStyles, headerStyles } = useTablestyle();
	const urlBackup = useRef('');
	const [modalShow, setModalShow] = useState(false);
	const [editModalShow,setEditModalShow] = useState(false);
	const [dataToBeEdited,setDataToBeEdited] = useState(null);
    const {showErrorNotification}=useToasterNotification();

	const editModalToggle = (selectedId) => {
		setEditModalShow(!editModalShow)
		setDataToBeEdited(selectedId)
	}

	const staticColumns = [
		{
		  title: 'Space ID',
		  field: 'space_id',
		  render: (rowData) => rowData?.business_space?.space_id || '----',
		},
		{
		  title: 'Space name',
		  field: 'business_space__preferred_name',
		  render: (rowData) => rowData?.business_space?.preferred_name || '----',
		},
		{
		  title: 'Validity from',
		  field: 'valid_from',
		  render: (rowData) => rowData?.valid_from || '----',
		  filtering: false,
		},
		{
		  title: 'Validity to',
		  field: 'valid_to',
		  render: (rowData) => rowData?.valid_to || '----',
		  filtering: false,
		},
		{
		  title: 'Area',
		  field: 'area',
		  render: (rowData) => rowData?.area || '----',
		},
		{
		  title: 'Building',
		  field: 'business_space__building__name',
		  render: (rowData) => rowData?.business_space?.building?.name|| '----',
		},
		{
		  title: 'Floor',
		  field: 'floor',
		  render: (rowData) => {
			
			
			const floorValue = rowData?.floor;
			// Debug: uncomment to see what value is being received
			// console.log('Floor value:', floorValue, 'Type:', typeof floorValue, 'Full rowData:', rowData);
			
			// Check if value exists (including 0)
			if (floorValue === null || floorValue === undefined || floorValue === '') return '----';
			
			const floor = Number(floorValue);
			if (isNaN(floor)) return '----';
			
			if (floor < 0) {
				return `Basement ${Math.abs(floor)}`;
			} else if (floor === 0) {
				return 'Ground floor';
			} else {
				return `Floor ${floor}`;
			}
		  },
		},
		{
		  title: 'Slots',
		  field: 'slot_count',
		  render: (rowData) => rowData?.slot_count || '----',
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
						<DeleteButton
							tableRef={tableRef}
							apiEndpoint={`/api/tenancies/${rowData.id}`}
							text=''
						/>
				</div>
			),
		},
	]:[];
	const columns=[...staticColumns ,...actionButtons]
	return (
		<>
			{modalShow && (
				<AddContract
					isOpen={modalShow}
					setIsOpen={setModalShow}
					tableRef={tableRef}
					title='Add New Contract'
				/>
			)}
			{editModalShow && (
				<EditContract
					isOpen={editModalShow}
					setIsOpen={setEditModalShow}
					tableRef={tableRef}
					contractID={dataToBeEdited}
					title='Edit Contract'
				/>
			)}
			<Card stretch>
				<CardHeader>
					<CardLabel icon='' iconColor='dark'>
						<CardTitle tag='div' className='h5'>
						  Contract List
						</CardTitle>
					</CardLabel>
					<CardActions>
						{canManageTenant&&<AddButton name='Add Contract' modalShow={setModalShow} />}
					</CardActions>
				</CardHeader>
				<CardBody isScrollable>
					<Card>
						<CardBody className='d-flex flex-column gap-3'>
							<div
								style={{
									overflowY: 'auto',
								}}>
								<ThemeProvider theme={theme}>
									<MaterialTable
										title=' '
										//@ts-ignore
										columns={columns}
										tableRef={tableRef}
										onChangeRowsPerPage={setPageSize}
										onRowClick={(event, rowData)=>canManageTenant&&editModalToggle(rowData.id)}
										data={(query) => {
											return new Promise((resolve, reject) => {
												let orderBy = '';
												if (query.orderBy) {
															orderBy =
															query.orderDirection === 'asc'
																? `&ordering=-${String(query.orderBy?.field)}`
																: `&ordering=${String(query.orderBy?.field)}`;
													}

												const url =`/api/tenancies?tenant_id=${id}&limit=${query.pageSize}&offset=${query.pageSize * query.page}&search=${query.search}${orderBy}`;

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
export default ContractList;
