import React from 'react';
import Swal from 'sweetalert2'; // Adjust the import according to your setup
import classNames from 'classnames';
import { Tooltip } from '@mui/material';
import Button from '../../bootstrap/Button'; // Adjust the import according to your setup
import { authAxios } from '../../../axiosInstance';
import { buttonColor } from '../../../helpers/constants';
import useToasterNotification from '../../../hooks/useToasterNotification';

interface TriggerButtonProps {
  rowData:any;
  tableRef: React.RefObject<any>; // Reference to the table
  
 
}

const TriggerButton: React.FC<TriggerButtonProps> = ({  rowData,tableRef}) => {
  const {showErrorNotification}=useToasterNotification()

  const onclickHandler = (e) => {
    e.stopPropagation();

    Swal.fire({
      title: 'Are you sure?',
      icon: 'info',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      iconColor: buttonColor[0],
      confirmButtonColor: buttonColor[1],
      cancelButtonColor: buttonColor[0],
      confirmButtonText: 'Sent',
      cancelButtonText:"Abort",

    }).then((result:any) => {
      if (result.isConfirmed) {
        const url = '/api/test_mqtt_command/';
        authAxios
          .post(url)
          .then(() =>{
            tableRef.current.onQueryChange()

          })
          .catch((err) => showErrorNotification(err));
      }
    });
  };

  return (
    <Tooltip arrow title='Trigger' placement='top'>
      <Button
        isOutline={false}
        color='warning'
        isLight
        size='sm'
        className={classNames('text-nowrap', {'border-light': false,})}
        icon='Bolt'
        onClick={onclickHandler}>
      </Button>
    </Tooltip>
  );
};

export default TriggerButton;
