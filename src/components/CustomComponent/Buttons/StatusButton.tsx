import React from 'react';
import { Tooltip } from '@mui/material';
import classNames from 'classnames';
import Swal from 'sweetalert2'; // adjust the import according to your setup
import { buttonColor } from '../../../helpers/constants';
import { authAxios } from '../../../axiosInstance';
import Button from '../../bootstrap/Button';
import useToasterNotification from '../../../hooks/useToasterNotification';

interface StatusButtonProps {
  status: string;
  fieldKey: string;
  tableRef: React.RefObject<any>; // Reference to the table
  api: string
}

const StatusButton: React.FC<StatusButtonProps> = ({ status, fieldKey, tableRef, api }) => {
  const isActivated = status === 'Active' || status === 'Assigned';
  const { showErrorNotification } = useToasterNotification()
  const statusCode: any = {
    Active: 'Deactivate',
    Assigned: 'Unassign',
    Disabled: "Activate",
    Unassigned: 'Assign',
    Inactive: 'Activate',
    Unknown: 'Activate',


  }
  const statusCodePayload: any = {
    Active: 'Inactive',
    Assigned: 'Unassigned',
    Disabled: "Active",
    Unassigned: 'Assigned',
    Inactive: 'Active',
    Unknown: 'Active',

  }
  const activateDeactivateHandler = () => {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'info',
      text: '',
      showCancelButton: true,
      iconColor: buttonColor[0],
      confirmButtonColor: buttonColor[isActivated ? 0 : 1],
      cancelButtonColor: buttonColor[isActivated ? 1 : 0],
      confirmButtonText: statusCode[status],
    }).then((result: any) => {
      if (result.isConfirmed) {
        const payload = {
          meta_data: {
            [fieldKey]: statusCodePayload[status],
          }
        };
        authAxios
          .patch(api, payload)
          .then(() => {
            tableRef.current.onQueryChange();
          })
          .catch((err) => showErrorNotification(err));

      }
    });
  };

  return (
    <Tooltip
      arrow
      title={statusCode[status]}
      placement='top'>
      <Button
        isOutline={false}
        size='sm'
        color={isActivated ? 'danger' : 'success'}
        isLight
        className={classNames('text-nowrap', {
          'border-light': false,
        })}

        icon={isActivated ? 'Block' : 'TaskAlt'}
        onClick={(e: any) => {
          e.stopPropagation();
          activateDeactivateHandler();
        }}
      />
    </Tooltip>
  );
};

export default StatusButton;
