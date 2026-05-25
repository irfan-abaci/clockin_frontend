import React from 'react'
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../bootstrap/Dropdown'
import Button from '../bootstrap/Button'

const CustomDropDown = ({activeOption,options,onChange}:any) => {
  return (
    <Dropdown>
    <DropdownToggle>
        <Button color='dark' isLight>
         {activeOption||'Filter'}
        </Button>
    </DropdownToggle>
    <DropdownMenu>
        {options.map((item:any)=>(
            <DropdownItem onClick={()=>onChange(item)}>
             { item}
            </DropdownItem>
        ))}
       
       
    </DropdownMenu>
</Dropdown>
  )
}

export default CustomDropDown
