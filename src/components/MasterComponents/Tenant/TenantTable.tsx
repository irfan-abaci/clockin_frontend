import React from 'react'
import MaterialTableComponent from '../../CustomComponent/MaterialTableComponent'
import CustomBadge from '../../CustomComponent/CustomBadge'
import { statusColorCodes } from '../../../helpers/constants'
import StatusButton from '../../CustomComponent/Buttons/StatusButton'
import DeleteButton from '../../CustomComponent/Buttons/DeleteButton'

const TenantTable = ({tableRef,editModalToggle,checked,urlBackup }:any) => {
  const api=''
  const permissions=false
  const staticColumns  = [
        {
            title: 'Tenant ID',
            field: 'tenant_id',
            render: (rowData) => rowData?.tenant_id|| '----',
        },
        {
            title: 'Tenant name',
            field: 'tenant_name',
            render: (rowData) => rowData?.tenant_name|| '----',
        },
        {
            title: 'Tenant type',
            field: 'tenant_type',
            render: (rowData) => rowData?.tenant_type || '----',
        },
        {
            title: 'No of slots',
            field: 'no_of_slots',
            render: (rowData) => rowData?.no_of_slots || '----',
        },
        {
            title: 'Primary contact',
            field: 'tenant_contact_phone',
            render: (rowData) => rowData?.tenant_contact_phone || '----',
        },
        {
            title: 'Description',
            field: 'description',
            render: (rowData) => rowData?.meta_data?.description || '----',
        },
  
        {
            title: 'Status',
            field: 'status',
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
  
    const actionButtons = [
        {
            title: 'Actions',
            align: 'right',
            removable: false,
            sorting: false,
            grouping: false,
            filtering: false,
            render: (rowData) => (
                <div className='d-flex gap-1 justify-content-end'>
  
                    
                    {rowData?.meta_data?.status!=="Deleted"&&
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
    ];
  return (
    <></>
    // <MaterialTableComponent tableRef={tableRef} api='' actionButtons={actionButtons} columns={staticColumns} permissions={permissions} editModalToggle={editModalToggle}  />
  )
}

export default TenantTable
