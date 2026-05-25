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
import { Tooltip } from '@mui/material';
import AddButton from '../../../CustomComponent/Buttons/AddButton';
import OvernightRequestModal from './OvernightRequestModal';


const OvernightRequests = () => {
    const {showErrorNotification}=useToasterNotification();
    const [pageSize, setPageSize] = useState(5);
    const tableRef = useRef();
    const { theme, rowStyles, headerStyles } = useTablestyle();
    const urlBackup = useRef('');
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [date,setDate]=useState();
    const {id}=useParams();
    const [isOpen, setIsOpen] = useState(false);
    // @ts-ignore
  


    const staticColumns= [
        {
          title: 'Plate number',
          field: 'vehicle__plate_number',
          render: (rowData) => rowData?.vehicle?.plate_number || '----'
        },
        {
          title: 'Color',
          field: 'vehicle__vehicle_color',
          render: (rowData) => rowData?.vehicle?.vehicle_color || '----',
        },
        {
          title: 'Plate Color',
          field: 'vehicle__vehicle_plate_color',
          render: (rowData) => rowData?.vehicle?.vehicle_plate_color || '----',
        },
        {
          title: 'Request Text',
          field: 'request_text',
          render: (rowData) => {
            const text = rowData?.request_text || '----';
            const previewText =
              text !== '----' ? text.split(' ').slice(0, 2).join(' ') + '...' : text;
    
            return (
              <Tooltip title={text} arrow placement="top">
                <span>{previewText}</span>
              </Tooltip>
            );
          },
        },
        {
            title: 'Response Text',
            field: 'response_text',
            render: (rowData) => {
              const text = rowData?.response_text || '----';
              const previewText =
                text !== '----' ? text.split(' ').slice(0, 2).join(' ') + '...' : text;
      
              return (
                <Tooltip title={text} arrow placement="top">
                  <span>{previewText}</span>
                </Tooltip>
              );
            },
          },
          {
            title: 'Start Time',
            field: 'start_time',
            render: (rowData) => {
              return <span>{Moments(rowData?.start_time,'datetime')}</span>;
            },
          },
          {
            title: 'End Time',
            field: 'end_time',
            render: (rowData) => {
              return <span>{Moments(rowData?.end_time,'datetime')}</span>;
            },
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
                <CardLabel icon='' iconColor='dark' className='d-flex justify-content-between align-items-center'>
                    <CardTitle tag='div' className='h5'>
                      Overnight Requests
                    </CardTitle>
                </CardLabel>
                <CardActions>
                    <AddButton name='Add New Request' modalShow={setIsOpen} />
                    <OvernightRequestModal isOpen={isOpen} setIsOpen={setIsOpen} tableRef={tableRef} title='Add New Request' />
                    </CardActions>
            </CardHeader>
            <CardBody isScrollable >
                
                 <div className='material-table-wrapper'>
                  {/* <div style={{position:"absolute",top:"100px",left:"20px",zIndex:100}}>
                    <DateRangeFilter 
                        onFilter={onFilter} 
                        selectedDate={date}
                    />
                  </div> */}
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
                                      
                                        
                                        let url = `/api/overnight_parking_requests?vehicle=${id}&limit=${query.pageSize}&offset=${query.pageSize * query.page}&search=${query.search}${orderBy}&${otherFilters}`;
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
export default OvernightRequests;
