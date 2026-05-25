import React, { useMemo, useState } from 'react';
import MaterialTable from '@material-table/core';
import PropTypes from 'prop-types';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ThemeProvider } from '@mui/material/styles';
import { authAxios } from '../../../axiosInstance';
import DeleteButton from '../../CustomComponent/Buttons/DeleteButton';
import useTablestyle from '../../../hooks/useTablestyles';
import CustomBadge from '../../CustomComponent/CustomBadge';
import { statusColorCodes } from '../../../helpers/constants';
import useToasterNotification from '../../../hooks/useToasterNotification';
import StatusButton from '../../CustomComponent/Buttons/StatusButton';
import { formatFilters } from '../../../helpers/functions';
import usePermissionHook from '../../../hooks/userPermissionHook';
import Moments from '../../../helpers/Moment';

const TenantTableComponent = (props) => {
	const { tableRef, editModalToggle, urlBackup } = props;
	const canManageTenant = usePermissionHook('tenant_management');
	const canViewTenantDetails = usePermissionHook('view_tenant_details');

	const [pageSize, setPageSize] = useState(5);
	const { showErrorNotification } = useToasterNotification();
	const { theme, rowStyles, headerStyles } = useTablestyle();
	const [filterEnabled, setFilterEnabled] = useState(false);
   const[selectedItems,setSelectedItems]=useState([])
	const staticColumns = [
		{
			title: 'Tenant ID',
			field: 'tenant_id',
			render: (rowData) => rowData?.tenant_id || '----',
		},
		{
			title: 'Tenant name',
			field: 'tenant_name',
			render: (rowData) => rowData?.tenant_name || '----',
		},
		{
			title: 'Tenant type',
			field: 'tenant_type',
			render: (rowData) => rowData?.tenant_type || '----',
		},
		{
			title: 'No of slots',
			field: 'parking_slots_total',
			render: (rowData) => rowData?.parking_slots_total,
		},
		{
			title: 'No of slots occupied',
			field: 'parking_slots_occupied',
			render: (rowData) => rowData?.parking_slots_occupied,
		},
		{
			title: 'Primary contact',
			field: 'tenant_contact_phone',
			render: (rowData) => rowData?.tenant_contact_phone || '----',
		},
		{
			title: 'Description',
			field: 'meta_data__description',
			render: (rowData) => rowData?.meta_data?.description || '----',
		},
		{
			title: 'Modified date',
			field: 'meta_data__modified_at',
			render: (rowData) => Moments(rowData?.meta_data?.modified_at, "datetime") || '----',
		},

		{
			title: 'Status',
			field: 'meta_data__status',
			render: (rowData) =>
				rowData?.meta_data?.status ? (
					<CustomBadge color={statusColorCodes[rowData?.meta_data?.status]}>
						{rowData?.meta_data?.status}
					</CustomBadge>
				) : (
					'----'
				),
		},
	];

	const actionButtons = canManageTenant ? [
		{
			title: 'Actions',
			align: 'right',
			removable: false,
			sorting: false,
			grouping: false,
			filtering: false,
			render: (rowData) => (
				<div className='d-flex gap-1 justify-content-end'>


					{rowData?.meta_data?.status !== "Deleted" &&
						<>
							<StatusButton
								status={rowData.meta_data.status}
								fieldKey='status'
								tableRef={tableRef}
								api={`api/tenants/${rowData.id}`}
							/>
							<DeleteButton
								tableRef={tableRef}
								apiEndpoint={`api/tenants/${rowData.id}`}
								text=''
							/>
						</>
					}
				</div>
			),
		},
	] : [];

;
	const columns = useMemo(() => {
		return [...staticColumns, ...actionButtons];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className='material-table-wrapper'>
			<ThemeProvider theme={theme}>
				<MaterialTable
					title=' '
					//@ts-ignore
					columns={columns}
					tableRef={tableRef}
					onChangeRowsPerPage={setPageSize}
					onRowClick={(event, rowData) => canViewTenantDetails && editModalToggle(rowData.id)}
					data={(query) => {
						return new Promise((resolve, reject) => {
							const otherFilters = formatFilters(query.filters);

							let orderBy = '';

							if (query.orderBy) {
								orderBy =
									query.orderDirection === 'asc'
										? `&ordering=-${String(query.orderBy?.field)}`
										: `&ordering=${String(query.orderBy?.field)}`;
							}


							const url = `api/tenants?&limit=${query.pageSize}&offset=${query.pageSize * query.page}&search=${query.search}${orderBy}&${otherFilters}`;

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
									showErrorNotification(error);
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
						filtering: filterEnabled,
						search: true,
						pageSize,
					}}

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
				/>
			</ThemeProvider>
		</div>
	);
};
/* eslint-disable react/forbid-prop-types */
TenantTableComponent.propTypes = {
	tableRef: PropTypes.object.isRequired,
	editModalToggle: PropTypes.func.isRequired,
	urlBackup: PropTypes.object.isRequired,

};
/* eslint-enable react/forbid-prop-types */
export default TenantTableComponent;
