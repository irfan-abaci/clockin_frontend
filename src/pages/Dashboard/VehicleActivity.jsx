import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import MaterialTable from '@material-table/core';
import FilterListIcon from '@mui/icons-material/FilterList';
import Card, { CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../components/bootstrap/Card';
import useTablestyle from '../../hooks/useTablestyles';
import { authAxios } from '../../axiosInstance';
import useToasterNotification from '../../hooks/useToasterNotification';
import { formatFilters } from '../../helpers/functions';
import DateRangeFilter from '../../components/CustomComponent/Filters/DateRangeFilter';
import TimeRangeFilter from '../../components/CustomComponent/Filters/TimeRangeFilter';
import Moments from '../../helpers/Moment';
import { lastActivity, userTypesToCapital } from '../../helpers/constants';
import IconWithTooltip from '../../components/CustomComponent/IconWithTooltip';
import FieldWithTooltip from '../../components/CustomComponent/FieldWithTooltip';
import ExportButton from '../../components/CustomComponent/Buttons/ExportButton';
import NavigationNameWithTooltip from '../../components/CustomComponent/NavigationNameWithTooltip';
import { fi } from 'date-fns/locale';
import ButtonFiltter from '../../components/CustomComponent/Filters/ButtonFiltter';
import AuthContext from '../../contexts/authContext';
import usePermissionHook from '../../hooks/userPermissionHook';

const VehicleActivity = () => {
    const { showErrorNotification } = useToasterNotification();
    const [pageSize, setPageSize] = useState(5);
    const tableRef = useRef();
    const { theme, rowStyles, headerStyles } = useTablestyle();
    const urlBackup = useRef('');
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [date, setDate] = useState(undefined);
    const dateRef = useRef(date);
    const { userData } = useContext(AuthContext)
    const tenant = userData?.active_relations?.[0]?.tenant_details || null;
    const [activeTab, setActiveTab] = useState('All')
    const FilterStatus = ['All', tenant ? tenant?.tenant_name : '','Registered']
    const canSeeTenantFilter=usePermissionHook('view_tenant_filter');



    const staticColumns = [
        {
            title: 'Activity time',
            field: 'time',
            render: (rowData) => rowData?.time ? Moments(rowData?.time, "datetime") : '----',
            filtering: false,

        },


        {
            title: 'Vehicle plate number',
            field: 'identified_number',
            render: (rowData) => <NavigationNameWithTooltip
                title='View vehicle details'
                navigateTo={`/vehicles-details/${rowData.vehicle}`}
                state=''
                content={rowData?.identified_number}
            />
        },
        {
            title: 'Vehicle brand',
            field: 'identified_brand',
            render: (rowData) => rowData?.identified_brand || '----',
        },
        {
            title: 'Color',
            field: 'identified_color',
            render: (rowData) => rowData?.identified_color || '----',
        },
        {
            title: 'Vehicle type',
            field: 'identified_type',
            render: (rowData) => rowData?.identified_type || '----',
        },
        // {
        //     title: 'Vehicle model',
        //     field: 'identified_model',
        //     render: (rowData) => rowData?.identified_model || '----',
        // },

        {
            title: 'Plate color',
            field: 'identified_plate_color',
            render: (rowData) => rowData?.identified_plate_color || '----',
        },
        {
            title: 'Comapny name',
            field: 'tenant__tenant_name',
            render: (rowData) => rowData?.tenant_details ? <div style={{ minWidth: "200px" }}>{`${rowData?.tenant_details?.tenant_name} (${rowData?.tenant_details?.tenant_id})`}</div> : '----',
        },
        {
            title: 'Employee ID',
            field: 'user__relationtotenant__employee_id',
            render: (rowData) => rowData?.user_details?.active_relations[0]?.employee_id || '----',
        },
        {
            title: 'Employee name',
            field: 'user__preferred_name',
            render: (rowData) => <NavigationNameWithTooltip
                title='View employee details'
                navigateTo={`/company-users-details/${rowData?.user}`}
                state=''
                content={rowData?.user_details?.preferred_name}
            />

        },
        {
            title: 'User type',
            field: 'user__user_type',
            render: (rowData) => userTypesToCapital[rowData?.user_details?.user_type] || '----',
        },
        {
            title: 'Gate name',
            field: 'gate__gate_name',
            render: (rowData) => <FieldWithTooltip title={rowData?.gate?.meta_data?.description || '----'} field_value={rowData?.gate?.gate_name || '----'} />,
        },
        {
            title: 'Gate location',
            field: 'gate__location',
            render: (rowData) => rowData?.gate?.location || '----',
        },
        {
            title: 'Activity',
            field: 'gate__gate_type',
            render: (rowData) => rowData?.gate?.gate_type ? <IconWithTooltip title={rowData?.gate?.gate_type} icon={lastActivity[rowData?.gate?.gate_type]} iconSize='2x' /> : '----',
        },
        {
            title: 'Access Status',
            field: 'is_allowed',
            render: (rowData) => {
                const statusText = rowData?.is_allowed ? 'Allowed' : 'Denied';
                const statusColor = rowData?.is_allowed ? 'green' : 'red';
                const statusElement = (
                    <p style={{ color: statusColor, fontWeight: 500, margin: 0 }}>
                        {statusText}
                    </p>
                );

                // Show tooltip only if decision_remarks exists
                if (rowData?.decision_remarks) {
                    return (
                        <FieldWithTooltip
                            title={rowData.decision_remarks}
                            field_value={statusElement}
                        />
                    );
                }

                return statusElement;
            },
            filtering: true,
            lookup: {
                true: 'Allowed',
                false: 'Denied',
            },
        },

        {
            title: 'Cam time',
            field: 'time_cam',
            render: (rowData) => rowData?.time_cam ? Moments(rowData?.time_cam, "datetime") : '----',

        },
    ];

    const columns = useMemo(() => {
        return staticColumns;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const onFilter = (selectedDate) => {
        // Preserve time only when date picker applied (new selection has no time keys). Do NOT preserve when time was explicitly cleared (startTime/endTime are null).
        const sel = selectedDate?.selection;
        const isTimeCleared = sel && (sel.startTime === null || sel.endTime === null);
        if (selectedDate && date && date?.selection?.startTime && !isTimeCleared) {
            if (sel?.startTime == null && sel?.endTime == null) {
                const prevSel = date?.selection;
                if (prevSel) {
                    selectedDate.selection = {
                        ...selectedDate.selection,
                        startTime: prevSel.startTime,
                        endTime: prevSel.endTime,
                    };
                }
            }
        }
        // Strip null time so API and UI don't see time when cleared
        if (sel && (sel.startTime === null || sel.endTime === null)) {
            const { startTime, endTime, ...rest } = sel;
            // @ts-ignore - setDate accepts filter state object
            setDate({ selection: rest });
        } else {
            setDate(selectedDate);
        }
    };

    // Keep ref in sync so data() callback always sees latest filter (avoids stale closure)
    useEffect(() => {
        dateRef.current = date;
    }, [date]);

    // Refetch table when date/time filter changes so API uses latest selection (not stale state)
    useEffect(() => {
        //@ts-ignore
        tableRef.current?.onQueryChange();
    }, [date]);

    useEffect(() => {
		//@ts-ignore
		tableRef.current.onQueryChange();
	}, [activeTab]);


    return (
        <Card stretch>
            <CardHeader borderSize={1}>
                <CardLabel icon='' iconColor='dark'>
                    <CardTitle tag='div' className='h5'>
                        Vehicle Activity
                    </CardTitle>
                </CardLabel>
                <CardActions>

                    <ExportButton url={urlBackup} hiddenColumnsKey='' name='Vehicle Activity List' />
                </CardActions>
            </CardHeader>
            <CardBody >

                <div className='material-table-wrapper'>
                    <div style={{ position: "absolute", top: "100px", left: "20px", zIndex: 100, display: "flex", gap: "10px", flexDirection: "row", alignItems: "center" }}>
                        <DateRangeFilter
                            onFilter={onFilter}
                            selectedDate={date}
                        />
                        <TimeRangeFilter
                            onFilter={onFilter}
                            selectedDate={date}
                        />
                        {tenant && canSeeTenantFilter && <ButtonFiltter
                            FilterStatus={FilterStatus}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            styles={{ position: "relative" }}
                        />}
                      
                    </div>
                    <ThemeProvider theme={theme}>
                        <MaterialTable
                            title=' '
                            //@ts-ignore
                            columns={columns}
                            tableRef={tableRef}
                            //@ts-ignore
                            onChangeRowsPerPage={setPageSize}
                            data={(query) => {
                                return new Promise((resolve, reject) => {
                                    let orderBy = '';
                                    let statusList = '';
                                    const otherFilters = formatFilters(query.filters);
                                    if (query.orderBy) {
                                        orderBy =
                                            query.orderDirection === 'asc'
                                                ? `&ordering=-${String(query.orderBy?.field)}`
                                                : `&ordering=${String(query.orderBy?.field)}`;
                                    }


                                    let url = `/api/parkings?limit=${query.pageSize}&offset=${query.pageSize * query.page}&search=${query.search}${orderBy}&${otherFilters}`;
                                    if(activeTab !== 'All' && activeTab !== 'Registered'){
                                        url += `&tenant_id=${tenant?.id}`;
                                    }
                                    if(activeTab === 'Registered'){
                                        url += `&registered_only=true`;
                                    }
                                    // Use ref so we always have latest filter (fixes stale closure when clearing time)
                                    const currentDate = dateRef.current;
                                    // Add date params only when date range is selected
                                    if (currentDate?.selection?.startDateFilter && currentDate?.selection?.endDateFilter) {
                                        url += `&start_date=${currentDate.selection.startDateFilter}`;
                                        url += `&end_date=${currentDate.selection.endDateFilter}`;
                                    }
                                    // Add time params only when time is set (not null/undefined - don't add after clear)
                                    if (currentDate?.selection?.startTime != null && currentDate?.selection?.startTime !== '') {
                                        url += `&start_time=${currentDate.selection.startTime}`;
                                    }
                                    if (currentDate?.selection?.endTime != null && currentDate?.selection?.endTime !== '') {
                                        url += `&end_time=${currentDate.selection.endTime}`;
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
            </CardBody>
        </Card>
    );
};
export default VehicleActivity;
