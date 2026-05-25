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



const ExitAllRequestButton = ({ apiEndpoint, tableRef = null, rowData, ButtonText = '' }: any) => {
    const { showErrorNotification } = useToasterNotification()
    const { darkModeStatus } = useDarkMode();
    const dispatch = useDispatch();

    const onclickHandler = (e: any) => {
        e.stopPropagation();

        Swal.fire({
            title: 'Are you sure?',
            html: '<p>Do you want to mark exit for all?</p>',
            icon: 'info',
            text: '',
            showCancelButton: true,
            iconColor: 'info',
            confirmButtonColor: buttonColor[1],
            cancelButtonColor: buttonColor[0],
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            showLoaderOnConfirm: true,
            customClass: {
                popup: 'custom-swal-popup',
            },
            preConfirm: async () => {

                try {
                    const url = `${apiEndpoint}`;
                    const response = await authAxios.post(url);

                    tableRef.current.onQueryChange();

                    return response.data;
                } catch (error: any) {
                    Swal.showValidationMessage(`Request failed: ${error.message}`);
                }
            }

        });
    };

    return (<Tooltip arrow title='Mark All Exit' placement='left'>
        <Button
            isOutline
            color='danger'
            
            size='sm'
            className={classNames('text-nowrap', {
                'border-light': false,
            })}
            icon='ExitAllIcon'
            onClick={onclickHandler}>
            {ButtonText}
        </Button>
    </Tooltip>)

};

export default ExitAllRequestButton;
