import React from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'; // Adjust the import according to your setup
import classNames from 'classnames';
import { Tooltip } from '@mui/material';
import Button from '../../bootstrap/Button'; // Adjust the import according to your setup
import { authAxios } from '../../../axiosInstance';
import { buttonColor } from '../../../helpers/constants';
import { setVehicleDetails } from '../../../store/vehicles';



const MarkAsEntryButton = ({  tableRef=null,rowData,ButtonText=''}:any) => {

  const dispatch=useDispatch();

  const onclickHandler = (e:any) => {
    e.stopPropagation();
    Swal.fire({
        title: 'Are you sure?',
      icon: 'info',
      text: "",
      showCancelButton: true,
      iconColor: "info",
      confirmButtonColor: buttonColor[1],
      cancelButtonColor: buttonColor[0],
      confirmButtonText:"Submit" ,
      cancelButtonText: "Cancel",
        input: "text",
        inputAttributes: {
          autocapitalize: "off",
        },

        showLoaderOnConfirm: true,
        preConfirm: async (value) => {
          try {
            const url = `api/vehicles/${rowData.id}`;
            const response = await authAxios.patch(url,{vehicle_id:Number(rowData.id),last_activity:'ForceEntry',meta_data:{description:value}}); // Using Axios
            if(ButtonText!==''){
            dispatch(setVehicleDetails(response.data.vehicle))

            }else{
              tableRef.current.onQueryChange();

            }
            return response.data;
          } catch (error) {
            Swal.showValidationMessage(`Request failed: ${error.message}`);
          }
        },
        
        });
  };
  return (  <Tooltip arrow title='Mark Entry'placement='left'>
    <Button
        isOutline={false}
        color='danger'
        isLight
        size='sm'
        className={classNames('text-nowrap', {
            'border-light': false,
        })}
        icon='Login'
        onClick={onclickHandler}
        >
     {ButtonText}
    </Button>
</Tooltip>)};

export default MarkAsEntryButton;
