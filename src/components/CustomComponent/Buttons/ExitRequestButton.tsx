import React from 'react';
import Swal from 'sweetalert2'; // Adjust the import according to your setup
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

import { Tooltip } from '@mui/material';
import Button from '../../bootstrap/Button'; // Adjust the import according to your setup
import { authAxios } from '../../../axiosInstance';
import { buttonColor } from '../../../helpers/constants';
import useDarkMode from '../../../hooks/useDarkMode';
import useToasterNotification from '../../../hooks/useToasterNotification';
import { setVehicleDetails } from '../../../store/vehicles';



const ExitRequestButton = ({ apiEndpoint, tableRef = null, rowData, ButtonText = '' }: any) => {
  const { showErrorNotification } = useToasterNotification()
  const { darkModeStatus } = useDarkMode();
  const dispatch = useDispatch();

  // const onclickHandler = () => {

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     icon: 'info',
  //     text:text|| "Do you want to exit this vehicle ,You won't be able to revert this!",
  //     showCancelButton: true,
  //     iconColor: buttonColor[0],
  //     confirmButtonColor: buttonColor[0],
  //     cancelButtonColor: buttonColor[1],
  //     confirmButtonText: "Exit",
  //     cancelButtonText: "Cancel",

  //   }).then((result:any) => {
  //     if (result.isConfirmed) {
  //       const url = `${apiEndpoint}`;
  //       authAxios
  //         .post(url,{vehicle_id:Number(rowData.id)})
  //         .then(() =>{
  //           tableRef.current.onQueryChange()

  //         })
  //         .catch((err) => showErrorNotification(err));
  //     }
  //   });
  // };
  const onclickHandler = (e: any) => {
    e.stopPropagation();

    Swal.fire({
      title: 'Are you sure?',
      icon: 'info',
      text: '',
      showCancelButton: true,
      iconColor: 'info',
      confirmButtonColor: buttonColor[1],
      cancelButtonColor: buttonColor[0],
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      customClass: {
        popup: 'custom-swal-popup',
      },
      html: `
      <style>
        .custom-swal-popup {
          padding: 20px !important;
        }
        .custom-swal-input-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .custom-swal-input-wrapper .swal2-input {
          width: 260px;
          max-width: 100%;
          margin: 5px 0;
          box-sizing: border-box;
        }
      </style>
      <div class="custom-swal-input-wrapper">
        <input id="swal-description" class="swal2-input" placeholder="Enter description" />
        <input id="swal-datetime" type="datetime-local" class="swal2-input" placeholder="Select date and time" />
      </div>
    `,
      preConfirm: async () => {
        const request_text = (document.getElementById('swal-description') as HTMLInputElement).value.trim();
        const exit_time = (document.getElementById('swal-datetime') as HTMLInputElement).value;
        // added exit time for exit request 
        if (!exit_time) {
          Swal.showValidationMessage('Please select a date and time.');
          return;
        }

        try {
          const url = `${apiEndpoint}`;
          const payload = {
            vehicle_id: Number(rowData.id),
            
              request_text,
              exit_time,
            
          };

          const response = await authAxios.post(url, payload);

          if (ButtonText !== '') {
            dispatch(setVehicleDetails(response.data.vehicle));
          } else {
            tableRef.current.onQueryChange();
          }

          return response.data;
        } catch (error: any) {
          Swal.showValidationMessage(`Request failed: ${error.message}`);
        }
      }

    });
  };

  return (<Tooltip arrow title='Exit Request' placement='left'>
    <Button
      isOutline={false}
      color='success'
      isLight
      size='sm'
      className={classNames('text-nowrap', {
        'border-light': false,
      })}
      icon='Logout'
      onClick={onclickHandler}>
      {ButtonText}
    </Button>
  </Tooltip>)

};

export default ExitRequestButton;
