import React, { useMemo, useRef, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import MaterialTable from '@material-table/core';
import { useParams } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import Card, {   CardBody, CardHeader, CardLabel, CardTitle } from '../../../../components/bootstrap/Card';
import useTablestyle from '../../../../hooks/useTablestyles';
import { authAxios } from '../../../../axiosInstance';
import useToasterNotification from '../../../../hooks/useToasterNotification';
import { formatFilters } from '../../../../helpers/functions';
import Moments from '../../../../helpers/Moment';
import { lastActivity } from '../../../../helpers/constants';
import IconWithTooltip from '../../../../components/CustomComponent/IconWithTooltip';
import FieldWithTooltip from '../../../../components/CustomComponent/FieldWithTooltip';

const VehicleRelations = () => {
    const {showErrorNotification}=useToasterNotification();
    const [pageSize, setPageSize] = useState(5);
    const tableRef = useRef();
    const { theme, rowStyles, headerStyles } = useTablestyle();
    const urlBackup = useRef('');
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [date,setDate]=useState();
    const {id}=useParams();

  


    const staticColumns  = [
        
       
        {
            title: 'Company name',
            field: 'identified_number',
            render: (rowData) => rowData?.identified_number|| '----',
        },
        {
            title: 'Designation',
            field: 'identified_brand',
            render: (rowData) => rowData?.identified_brand || '----',
        },
        {
            title: 'Modified user',
            field: 'identified_color',
            render: (rowData) => rowData?.identified_color || '----',
        },
       
        {
            title: 'Modified date',
            field: 'modified_date',
            render: (rowData) => rowData?.modified_date || '----',
        },  
        {
            title: 'Created date',
            field: 'identified_color',
            render: (rowData) => rowData?.identified_color || '----',
        },
       
        {
            title: 'Status',
            field: 'status',
            // render: (rowData) =>rowData?.time?  Moments(rowData?.time ,"datetime"):'----',
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
                      Vehicle Relations
                    </CardTitle>
                </CardLabel>
                
            </CardHeader>
            <CardBody isScrollable >
                
                 <div className='material-table-wrapper'>
               
                        <ThemeProvider theme={theme}>
                            <MaterialTable
                                title=' '
                                //@ts-ignore
                                columns={columns}
                                tableRef={tableRef}
                                //@ts-ignore
                                onChangeRowsPerPage={setPageSize}
                                // data={(query) => {
                                //     return new Promise((resolve, reject) => {
                                //         let orderBy = '';
                                //         let statusList='';
                                //         const otherFilters = formatFilters(query.filters);
                                //         if (query.orderBy) {
                                //             orderBy =
                                //                 query.orderDirection === 'asc'
                                //                     ? `&ordering=-${String(query.orderBy?.field)}`
                                //                     : `&ordering=${String(query.orderBy?.field)}`;
                                //         }
                                      
                                        
                                //         let url = `/api/parkings?vehicle=${id}&limit=${query.pageSize}&offset=${query.pageSize * query.page}&search=${query.search}${orderBy}&${otherFilters}`;
                                //         //@ts-ignore
                                //         if (date && date?.selection?.startDateFilter && date?.selection?.endDateFilter){
                                //             //@ts-ignore
                                //                url +=`&start_date=${date.selection.startDateFilter}&end_date=${date.selection.endDateFilter}`;                                      
                                //              }
                                //         urlBackup.current = url;

                                //         authAxios
                                //             .get(url)
                                //             .then((response) => {
                                //                 resolve({
                                //                     data: response.data?.results,
                                //                     page: query.page,
                                //                     totalCount: response.data?.count,
                                //                 });
                                //             })
                                //             .catch((error) => {
                                //                 showErrorNotification(error)
                                //                 // eslint-disable-next-line prefer-promise-reject-errors
                                //                 reject({
                                //                     data: [],
                                //                     page: query.page,
                                //                     totalCount: 0,
                                //                 });
                                //             });
                                //     });
                                // }}
                                data={[]}
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
export default VehicleRelations;
