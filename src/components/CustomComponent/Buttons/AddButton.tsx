import React from 'react'
import Button from '../../bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';

const AddButton = ({modalShow,name,disabled=false}:any) => {
  const { darkModeStatus } = useDarkMode();
  return (
    <Button
        color={darkModeStatus ? 'light' : 'dark'}
        isLight
        icon='Add'
        isDisable={disabled}
        onClick={() => {
            modalShow(true);
        }}
        > 
      {name}
   </Button>
  )
}

export default AddButton
