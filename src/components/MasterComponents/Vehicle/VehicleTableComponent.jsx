import React, { useEffect, useMemo, useState } from 'react';
import MaterialTable from '@material-table/core';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ThemeProvider } from '@mui/material/styles';
import { authAxios } from '../../../axiosInstance';
import DeleteButton from '../../CustomComponent/Buttons/DeleteButton';
import useTablestyle from '../../../hooks/useTablestyles';
import useToasterNotification from '../../../hooks/useToasterNotification';
import StatusButton from '../../CustomComponent/Buttons/StatusButton';
import { formatFilters } from '../../../helpers/functions';
import usePermissionHook from '../../../hooks/userPermissionHook';
import CustomBadgeWithIcon from '../../CustomComponent/BadgeWithIcon';
import Moments from '../../../helpers/Moment';
import ExitRequestButton from '../../CustomComponent/Buttons/ExitRequestButton';
import { lastActivity } from '../../../helpers/constants';
import IconWithTooltip from '../../CustomComponent/IconWithTooltip';
import MarkAsEntryButton from '../../CustomComponent/Buttons/MarkAsEntry';

const VehicleTableComponent = (props) => {
	const { tableRef,urlBackup,tenant,activeTab } = props;
	const navigate=useNavigate();
	const canManageVehicle=usePermissionHook('vehicle_management');
	const [pageSize, setPageSize] = useState(5);
	const { showErrorNotification } = useToasterNotification();
	const { theme, rowStyles, headerStyles } = useTablestyle();
	const [filterEnabled, setFilterEnabled] = useState(false);
	useEffect(() => {
		tableRef.current.onQueryChange();
	}, [activeTab]);

	const staticColumns  = [
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
			title: 'Company name',
			field: 'linked_user__relationtotenant__tenant__tenant_name',
			render: (rowData) => rowData?.linked_user?.active_relations[0]?.tenant_details?.tenant_name || '----',
		},
		{
			title: 'Designation',
			field: 'linked_user__relationtotenant__designation',
			render: (rowData) => rowData?.linked_user?.active_relations[0]?.designation || '----',
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
			title: 'Vehicle type',
			field: 'vehicle_type',
			render: (rowData) => rowData?.vehicle_type || '----',
		},
		
		{
			title: 'Vehicle brand',
			field: 'vehicle_brand',
			render: (rowData) => rowData?.vehicle_brand || '----',
		},
		
		// {
		// 	title: 'Vehicle model',
		// 	field: 'vehicle_model',
		// 	render: (rowData) => rowData?.vehicle_model || '----',
		// },
		{
			title: 'User type',
			field: 'linked_user__user_type',
			render: (rowData) => rowData?.linked_user?.user_type || '----',
		},
		
		{
			title: 'Contact number',
			field: 'linked_user__user_data__user_contact_phone',
			render: (rowData) => rowData?.linked_user?.user_data?.user_contact_phone || '----',
		},
		

		{
			title: 'Category',
			field: 'linked_user__access_category__category',
			render: (rowData) => rowData?.linked_user?.access_category?.category || '----',
		},
		{
			title: 'Activity count',
			field: 'activity_count',
			render: (rowData) => rowData?.activity_count||0
		},
		{
			title: 'Created date',
			field: 'meta_data__created_at',
			filter:false,
			render: (rowData) => Moments(rowData.meta_data.created_at,"datetime"),
		},
		{
			title: 'Modified Date',
			field: 'meta_data__modified_at',
			filter:false,
			render: (rowData) => Moments(rowData.meta_data.modified_at,"datetime"),
		},
		{
			title: 'Last activity',
			field: 'last_activity',
            render: (rowData) =>rowData?.last_activity?<IconWithTooltip title={rowData?.last_activity}icon={lastActivity[rowData.last_activity]}iconSize='2x'/>:'----',
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



	const actionButtons = canManageVehicle?[
		{
			title: 'Actions',
			align: 'right',
			removable: false,
			sorting: false,
			grouping: false,
			filtering: false,
			render: (rowData) => (
				<div className='d-flex gap-1 justify-content-end'>
                          
					   {(rowData?.last_activity==="Entry"||rowData?.last_activity==="ForceEntry")?
					     <ExitRequestButton
						 	apiEndpoint='api/exit_requests'
							tableRef={tableRef}
							rowData={rowData}
					     />
						 :<MarkAsEntryButton
							tableRef={tableRef}
							rowData={rowData}
						 />
					   }
					   
					   

						{rowData.meta_data.status!=="Unknown"&&
						   <StatusButton
								status={rowData.meta_data.status}
								fieldKey='status'
								tableRef={tableRef}
								api={`api/vehicles/${rowData.id}`}
							/>}
							<DeleteButton
								tableRef={tableRef}
								apiEndpoint={`api/vehicles/${rowData.id}`}
								text=''
							/>
					
				</div> 
			),
		},
	]:[];

	const columns = useMemo(() => {
        return [...staticColumns , ...actionButtons];
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
					onRowClick={(event, rowData)=>canManageVehicle&&navigate(`/vehicles-details/${rowData.id}`)}
					data={(query) => {
						return new Promise((resolve, reject) => {
							const otherFilters = formatFilters(query.filters);
							let orderBy = '';
							// let statusTypes = '&status__in=Active,Disabled';
							// if (checked) {
							// 	statusTypes = '&status__in=Deleted';
							// }
							if (query.orderBy) {
								orderBy =
									query.orderDirection === 'asc'
										? `&ordering=-${String(query.orderBy?.field)}`
										: `&ordering=${String(query.orderBy?.field)}`;
							}


							let url = `api/vehicles?limit=${query.pageSize}&offset=${query.pageSize * query.page}&search=${query.search}${orderBy}&${otherFilters}`;
							if(activeTab !== 'All'){
								url += `&tenant_id=${tenant?.id}`;
							}
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
VehicleTableComponent.propTypes = {
	tableRef: PropTypes.object.isRequired,
	urlBackup: PropTypes.object.isRequired,

};
/* eslint-enable react/forbid-prop-types */
export default VehicleTableComponent;
