import React, { useMemo, useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import MaterialTable from '@material-table/core';
import { useParams } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import Card, {  CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card';
import useTablestyle from '../../../../hooks/useTablestyles';
import { authAxios } from '../../../../axiosInstance';
import useToasterNotification from '../../../../hooks/useToasterNotification';
import { formatFilters } from '../../../../helpers/functions';
import DateRangeFilter from '../../../../components/CustomComponent/Filters/DateRangeFilter';
import Moments from '../../../../helpers/Moment';
import { lastActivity } from '../../../../helpers/constants';
import IconWithTooltip from '../../../../components/CustomComponent/IconWithTooltip';
import FieldWithTooltip from '../../../../components/CustomComponent/FieldWithTooltip';


const ActivityList = () => {
    const {showErrorNotification}=useToasterNotification();
    const [pageSize, setPageSize] = useState(5);
    const tableRef = useRef();
    const { theme, rowStyles, headerStyles } = useTablestyle();
    const urlBackup = useRef('');
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [date,setDate]=useState();
    const {id}=useParams();
    // @ts-ignore
  


    const staticColumns  = [
        
       
        {
            title: 'Vehicle plate number',
            field: 'identified_number',
            render: (rowData) => rowData?.identified_number|| '----',
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
        }, {
            title: 'Employee ID',
            field: 'active_relations__employee_id',
            render: (rowData) => rowData?.user_details?.active_relations[0]?.employee_id || '----',
        },       
        {
            title: 'Employee name',
            field: 'user_details__preferred_name',
            render: (rowData) => rowData?.user_details?.preferred_name|| '----',
        },
        {
            title: 'User type',
            field: 'user_details__user_type',
            render: (rowData) => rowData?.user_details?.user_type || '----',
        },
        {
            title: 'Gate name',
            field: 'gate__gate_name',
            render: (rowData) => <FieldWithTooltip title={rowData?.gate?.meta_data?.description || '----'} field_value={rowData?.gate?.gate_name || '----'}/>,
        },
        {
            title: 'Gate location',
            field: 'gate__location',
            render: (rowData) => rowData?.gate?.location || '----',
        },
        
        {
            title: 'Activity',
            field: 'gate__gate_type',
            render: (rowData) =>rowData?.gate?.gate_type?<IconWithTooltip title={rowData?.gate?.gate_type}icon={lastActivity[rowData?.gate?.gate_type]}iconSize='2x'/>:'----',
        },
       
       
        {
            title: 'Activity time',
            field: 'time_cam',
            render: (rowData) =>rowData?.time_cam?  Moments(rowData?.time_cam ,"datetime"):'----',
        },  
    ];

    const columns = useMemo(() => {
        return staticColumns ;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const onFilter=(selectedDate)=>{
        //@ts-ignore
        tableRef.current.onQueryChange();
        setDate(selectedDate)
    }
    

    return (
        <Card stretch>
            <CardHeader borderSize={1}>
                <CardLabel icon='' iconColor='dark'>
                    <CardTitle tag='div' className='h5'>
                      Vehicle Activity
                    </CardTitle>
                </CardLabel>
          
            </CardHeader>
            <CardBody isScrollable >
                
                 <div className='material-table-wrapper'>
                  <div style={{position:"absolute",top:"100px",left:"20px",zIndex:100}}>
                    <DateRangeFilter 
                        onFilter={onFilter} 
                        selectedDate={date}
                    />
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
                                        let statusList='';
                                        const otherFilters = formatFilters(query.filters);
                                        if (query.orderBy) {
                                            orderBy =
                                                query.orderDirection === 'asc'
                                                    ? `&ordering=-${String(query.orderBy?.field)}`
                                                    : `&ordering=${String(query.orderBy?.field)}`;
                                        }
                                      
                                        
                                        let url = `/api/parkings?vehicle=${id}&limit=${query.pageSize}&offset=${query.pageSize * query.page}&search=${query.search}${orderBy}&${otherFilters}`;
                                        //@ts-ignore
                                        if (date && date?.selection?.startDateFilter && date?.selection?.endDateFilter){
                                            //@ts-ignore
                                               url +=`&start_date=${date.selection.startDateFilter}&end_date=${date.selection.endDateFilter}`;                                      
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
export default ActivityList;
