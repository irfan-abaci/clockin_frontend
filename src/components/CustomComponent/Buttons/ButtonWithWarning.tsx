import React from 'react';
import Swal from 'sweetalert2'; // Adjust the import according to your setup
import classNames from 'classnames';
import { Tooltip } from '@mui/material';
import Button from '../../bootstrap/Button'; // Adjust the import according to your setup
import { authAxios } from '../../../axiosInstance';
import { buttonColor } from '../../../helpers/constants';
import useToasterNotification from '../../../hooks/useToasterNotification';
type AllowedButtonColors = 'primary' | 'danger' | 'success' | 'link' | 'warning' | 'brand-two' | 'storybook';

interface ButtonWithWarningProps {
  apiEndpoint: string;
  text:string;
  confirmBtnText:string;
  payload:any;
  OnSuccess: (response: any) => void; 
  Icon:string
  Buttoncolor: AllowedButtonColors;
  ButtonText:string;
  ButtonSize?: "sm" | "lg" | null;
    CancelButton:string;
    toolTip?:string|null;
}

const ButtonWithWarning: React.FC<ButtonWithWarningProps> = ({  apiEndpoint,text,confirmBtnText,payload,OnSuccess,Icon,Buttoncolor,ButtonText ,CancelButton ,ButtonSize ,toolTip}) => {
  const {showErrorNotification}=useToasterNotification()

  const onclickHandler = (e) => {
    e.stopPropagation();

    Swal.fire({
      title: 'Are you sure?',
      icon: 'info',
      text:text|| "You won't be able to revert this!",
      showCancelButton: true,
      iconColor: buttonColor[0],
      confirmButtonColor: buttonColor[0],
      cancelButtonColor: buttonColor[1],
      confirmButtonText: confirmBtnText,
      cancelButtonText: CancelButton||"Cancel",

    }).then((result:any) => {
      if (result.isConfirmed) {
        const url = `${apiEndpoint}`;
        authAxios
          .post(url,payload)
          .then((res) =>{
           OnSuccess(res)
          })
          .catch((err) => showErrorNotification(err));
      }
    });
  };

  return (
    <Tooltip arrow title={toolTip} placement='top'>
      <Button
        isOutline={false}
        color={Buttoncolor}
        isLight
        size={ButtonSize}
        className={classNames('text-nowrap', {'border-light': false,})}
        icon={Icon}
        onClick={onclickHandler}>
      {ButtonText}
      </Button>
    </Tooltip>
  );
};

export default ButtonWithWarning;
