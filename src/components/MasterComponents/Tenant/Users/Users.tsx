import React, { useRef, useState } from 'react'
import Card, {  CardActions, CardBody, CardHeader, CardLabel, CardTitle } from '../../../bootstrap/Card'
import UserManagementTable from './UserManagement';
import AddUsers from './AddUser';
import AddButton from '../../../CustomComponent/Buttons/AddButton';
import EditUser from './EditUser';

const Users = () => {
    const tableRef = useRef();
    const urlBackup = useRef();
    const[isAddOffsetShow,setIsAddOffsetShow]=useState(false);
    const[isEditOffsetShow,setIsEditOffsetShow]=useState(false);
    const [userID,setUserID]=useState(null);


    const editModalToggle = (id:any) => {
        setUserID(id);
        setIsEditOffsetShow(true);
	  }

  return (
    <>
    {isAddOffsetShow && <AddUsers isOpen={isAddOffsetShow} setIsOpen={setIsAddOffsetShow} tableRef={tableRef} title='Add User' />}
    {isEditOffsetShow && <EditUser isOpen={isEditOffsetShow} setIsOpen={setIsEditOffsetShow} tableRef={tableRef} title='Edit User' userId={userID} />}

    <Card stretch>
    <CardHeader borderSize={1}>
        <CardLabel icon='' iconColor='info'>
            <CardTitle tag='div' className='h5' >Users List</CardTitle>
        </CardLabel>
        <CardActions>
         <AddButton modalShow={setIsAddOffsetShow} name='Add User' tableRef={tableRef} />
        </CardActions>
    </CardHeader>
    <CardBody className='table-responsive'>
        <UserManagementTable
            tableRef={tableRef}
            editModalToggle={editModalToggle}
            urlBackup={urlBackup}
            
        />
    </CardBody>
   </Card>
</>
  )
}

export default Users
