import React from 'react'
import Button from '../../bootstrap/Button';
import { Tooltip } from '@mui/material';
import useDarkMode from '../../../hooks/useDarkMode';

const EditButton = ({modalShow,id}:any) => {
  const { darkModeStatus } = useDarkMode();
  return (
     <Tooltip
        arrow
        title='Edit'
        placement='top'>
      <Button
        color={darkModeStatus ? 'light' : 'dark'}
        isLight
        icon='BorderColor'
        size='sm'
        onClick={(e:any) => {
          modalShow(id);
          e.stopPropagation();
        }}
        > 
     </Button>
   </Tooltip>
  )
}

export default EditButton
